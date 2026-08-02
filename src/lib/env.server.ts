// Server-only env resolution.
//
// Why this exists: `vite dev` reads .env once at startup, so editing MONGODB_URI
// while the dev server is running left the old (localhost) value in process.env
// and donations kept landing in the local database. Here we re-read the dotenv
// files on every call (dev/Node only) so the file is always the source of truth,
// and we honour Vite's precedence: .env.local overrides .env.
//
// On the edge/Worker runtime there is no dotenv file to read; the fs import
// simply fails and we fall back to process.env.

let cache: { at: number; vals: Record<string, string> } | null = null;

function parse(text: string, out: Record<string, string>) {
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && m[1] && !m[1].startsWith("#")) out[m[1]] = (m[2] ?? "").replace(/^["']|["']$/g, "");
  }
}

function fileEnv(): Record<string, string> {
  if (cache && Date.now() - cache.at < 1000) return cache.vals;
  const vals: Record<string, string> = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("node:fs") as typeof import("node:fs");
    // .env first, then .env.local so the latter wins (same as Vite).
    for (const f of [".env", ".env.local"]) {
      if (fs.existsSync(f)) parse(fs.readFileSync(f, "utf8"), vals);
    }
  } catch {
    /* edge runtime: no filesystem dotenv */
  }
  cache = { at: Date.now(), vals };
  return vals;
}

export function env(name: string): string | undefined {
  const v = fileEnv()[name];
  if (v !== undefined && v !== "") return v;
  const p = process.env[name];
  return p && p !== "" ? p : undefined;
}
