import { loadEnv } from "./load-env.mjs";

loadEnv();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Variável obrigatória ausente: ${name}`);
  return v;
}

function bool(name, fallback) {
  const v = process.env[name];
  if (v === undefined || v === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(v).toLowerCase());
}

export function getDatabaseConfig() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const DATABASE_SCHEMA = process.env.DATABASE_SCHEMA || "selection";

  // Preferir DATABASE_URL se estiver definido.
  if (DATABASE_URL) {
    return {
      connectionString: DATABASE_URL,
      schema: DATABASE_SCHEMA,
      ssl: bool("DATABASE_SSL", true) ? { rejectUnauthorized: false } : false,
    };
  }

  const host = required("DATABASE_HOST");
  const user = required("DATABASE_USER");
  const password = required("DATABASE_PASSWORD");
  const database = required("DATABASE_NAME");
  const port = Number(process.env.DATABASE_PORT || "5432");

  return {
    host,
    user,
    password,
    database,
    port,
    schema: DATABASE_SCHEMA,
    ssl: bool("DATABASE_SSL", true) ? { rejectUnauthorized: false } : false,
  };
}

