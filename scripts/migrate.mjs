import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { getDatabaseConfig } from "./db.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function listMigrationFiles(migrationsDir) {
  return fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));
}

async function main() {
  const migrationsDir = path.join(__dirname, "..", "db", "migrations");
  const files = listMigrationFiles(migrationsDir);
  if (files.length === 0) {
    console.log("Sem migrations em db/migrations.");
    return;
  }

  const cfg = getDatabaseConfig();
  const schema = cfg.schema || "selection";
  const pool = new pg.Pool({
    ...(cfg.connectionString ? { connectionString: cfg.connectionString } : cfg),
    ssl: cfg.ssl,
  });

  const client = await pool.connect();
  try {
    // Garantir tabela de controle (no schema desejado)
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${schema}.schema_migrations (
        id          bigserial PRIMARY KEY,
        filename    text NOT NULL UNIQUE,
        applied_at  timestamptz NOT NULL DEFAULT now()
      );
    `);

    const appliedRows = await client.query(`SELECT filename FROM ${schema}.schema_migrations ORDER BY filename ASC;`);
    const applied = new Set(appliedRows.rows.map((r) => r.filename));

    const pending = files.filter((f) => !applied.has(f));
    if (pending.length === 0) {
      console.log("Migrations já estão em dia.");
      return;
    }

    for (const filename of pending) {
      const full = path.join(migrationsDir, filename);
      let sql = fs.readFileSync(full, "utf8");
      // Permite reaproveitar migrations que usam o schema default `selection`,
      // aplicando-as em outro schema via DATABASE_SCHEMA.
      if (schema !== "selection") {
        sql = sql
          .replace(/CREATE\s+SCHEMA\s+IF\s+NOT\s+EXISTS\s+selection\s*;/gi, `CREATE SCHEMA IF NOT EXISTS ${schema};`)
          .replace(/\bselection\./g, `${schema}.`);
      }
      console.log(`Aplicando migration: ${filename}`);

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(`INSERT INTO ${schema}.schema_migrations (filename) VALUES ($1);`, [filename]);
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
    }

    console.log("Migrations aplicadas com sucesso.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Falha ao aplicar migrations.");
  console.error(err?.message || err);
  process.exitCode = 1;
});

