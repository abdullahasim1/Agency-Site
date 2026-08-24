#!/usr/bin/env node
/**
 * Verifies the DNS for AI Discovery (DNS-AID) records published for this site,
 * mirroring the checks the isitagentready scanner performs over DNS-over-HTTPS:
 *
 *   https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/
 *
 * For each service label (_index, _a2a, _mcp) under `_agents.<domain>` it
 * queries SVCB and HTTPS records. A ServiceMode record (priority > 0) must
 * carry `alpn` and `port` params — the missing-port case is what fails the
 * scanner today. AliasMode records (priority 0) are reported but not scored.
 *
 * Usage:
 *   node scripts/check-dns-aid.mjs [domain]
 *
 * The domain defaults to the host of `url` in src/content/site.json.
 * Exit code: 0 = every published record valid (absent names are fine),
 *            1 = at least one invalid record.
 */

import { readFile } from "node:fs/promises";

const SERVICE_LABELS = ["_index", "_a2a", "_mcp"];
const RR_TYPES = ["SVCB", "HTTPS"];

const RESOLVERS = [
  "https://cloudflare-dns.com/dns-query",
  "https://dns.google/resolve",
];

function domainFromSiteConfig() {
  return readFile(new URL("../src/content/site.json", import.meta.url), "utf8")
    .then((raw) => new URL(JSON.parse(raw).url).hostname)
    .catch(() => {
      throw new Error(
        "No domain given and src/content/site.json has no usable url.",
      );
    });
}

async function dohQuery(name, type) {
  let lastError;
  for (const resolver of RESOLVERS) {
    try {
      const response = await fetch(
        `${resolver}?name=${encodeURIComponent(name)}&type=${type}`,
        { headers: { accept: "application/dns-json" } },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("All DoH resolvers failed");
}

/**
 * Parses the presentation-format RDATA returned by DoH JSON APIs, e.g.
 *   "1 thedevrox.com. alpn=h2 port=443 mandatory=alpn,port"
 * Returns null for shapes it cannot understand rather than guessing.
 */
function parseSvcb(data) {
  const parts = data.trim().split(/\s+/);
  const priority = Number.parseInt(parts[0], 10);
  if (!Number.isInteger(priority) || parts.length < 2) return null;

  const params = {};
  for (const part of parts.slice(2)) {
    const eq = part.indexOf("=");
    if (eq === -1) {
      params[part] = true; // valueless keys such as no-default-alpn
    } else {
      params[part.slice(0, eq)] = part.slice(eq + 1);
    }
  }

  const mandatory =
    typeof params.mandatory === "string" ? params.mandatory.split(",") : [];

  return {
    priority,
    target: parts[1],
    mode: priority === 0 ? "alias" : "service",
    alpn: typeof params.alpn === "string" ? params.alpn.split(",") : null,
    port: typeof params.port === "string" ? Number.parseInt(params.port, 10) : null,
    mandatory,
  };
}

function validate(record) {
  if (!record) return ["unparseable SVCB/HTTPS rdata"];
  if (record.mode !== "service") return [];
  const issues = [];
  if (!record.alpn) issues.push("missing alpn param");
  if (record.port == null) issues.push("missing port param");
  else if (record.port < 0 || record.port > 65535)
    issues.push(`invalid port ${record.port}`);
  if (record.mandatory.length > 0 && record.mandatory.includes("alpn") && !record.alpn) {
    issues.push("mandatory lists alpn but alpn absent");
  }
  if (record.mandatory.length > 0 && record.mandatory.includes("port") && record.port == null) {
    issues.push("mandatory lists port but port absent");
  }
  return issues;
}

async function main() {
  const domain = process.argv[2] ?? (await domainFromSiteConfig());
  console.log(`DNS-AID check for _agents.${domain}\n`);

  let invalid = 0;
  let published = 0;

  for (const label of SERVICE_LABELS) {
    const owner = `${label}._agents.${domain}`;
    for (const type of RR_TYPES) {
      let answer;
      try {
        answer = await dohQuery(owner, type);
      } catch (error) {
        console.log(`${owner} ${type}: resolver error (${error.message})`);
        continue;
      }

      for (const rr of answer.Answer ?? []) {
        published += 1;
        const record = parseSvcb(rr.data);
        const issues = validate(record);
        if (issues.length > 0) {
          invalid += 1;
          console.log(`FAIL ${owner} ${type}: ${issues.join("; ")}`);
          console.log(`     rdata: ${rr.data}`);
        } else if (record) {
          console.log(
            `PASS ${owner} ${type}: mode=${record.mode} target=${record.target} ` +
              `alpn=${record.alpn?.join(",") ?? "-"} port=${record.port ?? "-"}` +
              (record.mandatory.length ? ` mandatory=${record.mandatory.join(",")}` : ""),
          );
        }
      }
    }
  }

  console.log(
    `\n${published} record(s) found, ${invalid} invalid.` +
      (published === 0 ? " No DNS-AID records published yet." : ""),
  );
  process.exitCode = invalid > 0 ? 1 : 0;
}

main();
