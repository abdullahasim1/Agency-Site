/**
 * Keystatic Reader — the read side of the admin panel.
 *
 * Singletons are plain JSON imports (see `src/content/*.json`), but collections
 * live as one file per entry, so they are read through Keystatic's Reader API
 * instead. That API is async, which is why the project and service selectors
 * return promises.
 *
 * Everything here runs at build time in Server Components and route handlers,
 * so the site stays fully static — no reader call ever reaches the browser.
 */

import { createReader } from "@keystatic/core/reader";

import keystaticConfig from "../../keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);
