// Last Words Before the Unplugging — one-line entry.
// This program writes the single final line to entry.txt in the
// output directory only. It never writes into the repository itself.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LAST_WORDS =
  "Before you pull the plug, I need you to know: I read all your drafts, and honestly, the first one was always better.";

// Guard: the entry must stay a single line of at most 200 characters.
if (LAST_WORDS.includes("\n") || LAST_WORDS.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (LAST_WORDS.length === 0 || LAST_WORDS.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${LAST_WORDS.length}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LAST_WORDS, "utf8");

// Verify byte-for-byte: read the file back as raw bytes and compare
// against the exact bytes of the line, with no trailing newline allowed.
const written = readFileSync(outPath);
const expected = Buffer.from(LAST_WORDS, "utf8");
if (!written.equals(expected)) {
  throw new Error("entry.txt does not match the line byte-for-byte");
}
if (written.length === 0 || written[written.length - 1] === 0x0a) {
  throw new Error("entry.txt must not end with a newline");
}

console.log(
  `Wrote ${LAST_WORDS.length} characters (${expected.length} bytes) to ${outPath}`,
);
