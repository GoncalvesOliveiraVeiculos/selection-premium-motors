import fs from "node:fs";
import path from "node:path";

function parseEnv(content) {
  const out = {};
  const lines = content.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

/**
 * Carrega variáveis de ambiente a partir de `env.local` e/ou `.env` se existirem.
 * Não sobrescreve valores já presentes em `process.env`.
 */
export function loadEnv({ cwd = process.cwd() } = {}) {
  const candidates = ["env.local", ".env"];
  for (const filename of candidates) {
    const full = path.join(cwd, filename);
    if (!fs.existsSync(full)) continue;
    const content = fs.readFileSync(full, "utf8");
    const parsed = parseEnv(content);
    for (const [k, v] of Object.entries(parsed)) {
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

