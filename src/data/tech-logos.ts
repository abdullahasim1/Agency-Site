/**
 * Maps a technology name to a first-party brand logo in `/public/logos`.
 *
 * The SVGs are the official marks, vendored into the repo so the strip renders
 * with no external request and no new dependency. A name with no entry here —
 * a proprietary tool with no published mark, or a newly added one — simply falls
 * back to the accent dot, so editing the technology list in the panel can never
 * break the marquee.
 *
 * Keyed by the exact `name` in `src/content/technologies.json`, plus a few
 * aliases. `techLogo()` normalises before matching: versions are stripped
 * ("Next.js 16" → "Next.js"), parenthesised suffixes ignored ("n8n
 * (self-hosted)" → "n8n"), and unknown names fall through to the dot.
 */

export const techLogos: Record<string, string> = {
  React: "/logos/react.svg",
  "React Native": "/logos/react.svg",
  "React Context API": "/logos/react.svg",
  "React Markdown": "/logos/react.svg",
  "React Syntax HIghlighter": "/logos/react.svg",
  "Lucid React": "/logos/lucid.svg",
  Whisper: "/logos/openai.svg",
  "Next.js": "/logos/nextjs.svg",
  TypeScript: "/logos/typescript.svg",
  "Tailwind CSS": "/logos/tailwindcss.svg",
  "Node.js": "/logos/nodejs.svg",
  Express: "/logos/express.svg",
  Python: "/logos/python.svg",
  FastAPI: "/logos/fastapi.svg",
  Celery: "/logos/celery.svg",
  PostgreSQL: "/logos/postgresql.svg",
  pgvector: "/logos/postgresql.svg",
  MongoDB: "/logos/mongodb.svg",
  MySQL: "/logos/mysql.svg",
  SQLite: "/logos/sqlite.svg",
  Redis: "/logos/redis.svg",
  Firebase: "/logos/firebase.svg",
  "Firebase Cloud Messaging": "/logos/firebase.svg",
  GraphQL: "/logos/graphql.svg",
  OpenAI: "/logos/openai.svg",
  Gemini: "/logos/gemini.svg",
  "Google Gemini": "/logos/gemini.svg",
  "Google Gemini API": "/logos/gemini.svg",
  Claude: "/logos/claude.svg",
  "Amazon Bedrock": "/logos/aws.svg",
  "Hugging Face": "/logos/huggingface.svg",
  n8n: "/logos/n8n.svg",
  Make: "/logos/make.svg",
  Zapier: "/logos/zapier.svg",
  Twilio: "/logos/twilio.svg",
  "Twilio Programmable Voice": "/logos/twilio.svg",
  ElevenLabs: "/logos/elevenlabs.svg",
  Vercel: "/logos/vercel.svg",
  Docker: "/logos/docker.svg",
  "GitHub Actions": "/logos/githubactions.svg",
  Lucid: "/logos/lucid.svg",
  AWS: "/logos/aws.svg",
  "Amazon EC2": "/logos/aws.svg",
  EC2: "/logos/aws.svg",
  "Amazon S3": "/logos/aws.svg",
  S3: "/logos/aws.svg",
  "AWS Lambda": "/logos/aws.svg",
  Lambda: "/logos/aws.svg",
  "Amazon RDS": "/logos/aws.svg",
  RDS: "/logos/aws.svg",
  "Amazon ECS": "/logos/aws.svg",
  ECS: "/logos/aws.svg",
  "Amazon CloudFront": "/logos/aws.svg",
  CloudFront: "/logos/aws.svg",
  "Amazon CloudWatch": "/logos/aws.svg",
  CloudWatch: "/logos/aws.svg",
  "AWS IAM": "/logos/aws.svg",
  IAM: "/logos/aws.svg",
};

/** Version prefix to strip before matching: "Next.js 16" → "Next.js". */
const VERSION_PREFIX = /^(.+?)\s+\d+(\.\d+)*$/;

/**
 * The logo path for a technology, or `undefined` when there is no mark for it.
 *
 * Matching is exact first, then tolerant: parenthesised suffixes ("n8n
 * (self-hosted)") and trailing versions ("Next.js 16") are tried before giving
 * up, so a freshly edited name still finds its logo.
 */
export function techLogo(name: string): string | undefined {
  const direct = techLogos[name];
  if (direct) return direct;

  const withoutParens = name.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  const trimmed = techLogos[withoutParens];
  if (trimmed) return trimmed;

  const versionless = withoutParens.match(VERSION_PREFIX)?.[1]?.trim() ?? "";
  if (versionless) {
    const base = techLogos[versionless];
    if (base) return base;
  }

  return undefined;
}
