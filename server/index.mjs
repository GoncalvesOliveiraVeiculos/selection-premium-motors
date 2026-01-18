import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import multer from "multer";
import pg from "pg";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

import { loadEnv } from "../scripts/load-env.mjs";
import { getDatabaseConfig } from "../scripts/db.mjs";

loadEnv();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const cfg = getDatabaseConfig();
const pool = new pg.Pool({
  ...(cfg.connectionString ? { connectionString: cfg.connectionString } : cfg),
  ssl: cfg.ssl,
});

const schema = cfg.schema || "selection";

function requireAdminKey(req, res, next) {
  const required = process.env.ADMIN_API_KEY;
  if (!required) return next();
  const got = req.header("x-admin-key");
  if (!got || got !== required) return res.status(401).json({ error: "Não autorizado" });
  return next();
}

function centsToBrlString(priceCents) {
  if (priceCents === null || priceCents === undefined) return null;
  const v = Number(priceCents) / 100;
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1 as ok");
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

// ----------------------------
// Público - Veículos
// ----------------------------
app.get("/api/vehicles", async (req, res) => {
  const status = String(req.query.status || "published");
  const category = req.query.category ? String(req.query.category) : null;
  const featured = req.query.featured ? ["1", "true", "yes", "on"].includes(String(req.query.featured).toLowerCase()) : null;
  const limit = Math.min(Number(req.query.limit || 60), 200);

  const params = [];
  let where = `WHERE v.status = $${params.length + 1}`;
  params.push(status);

  if (category) {
    where += ` AND v.category = $${params.length + 1}`;
    params.push(category);
  }

  if (featured !== null) {
    where += ` AND v.featured = $${params.length + 1}`;
    params.push(featured);
  }

  params.push(limit);

  const q = `
    SELECT
      v.id,
      v.slug,
      v.title,
      v.category,
      v.year,
      v.price_cents,
      v.mileage_km,
      v.fuel,
      v.status,
      v.featured,
      (
        SELECT vi.url
        FROM ${schema}.vehicle_images vi
        WHERE vi.vehicle_id = v.id
        ORDER BY vi.is_cover DESC, vi.sort_order ASC, vi.id ASC
        LIMIT 1
      ) AS cover_image_url
    FROM ${schema}.vehicles v
    ${where}
    ORDER BY v.featured DESC, v.updated_at DESC
    LIMIT $${params.length};
  `;

  const rows = await pool.query(q, params);
  const vehicles = rows.rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    year: r.year,
    priceCents: r.price_cents,
    price: centsToBrlString(r.price_cents),
    mileageKm: r.mileage_km,
    fuel: r.fuel,
    status: r.status,
    featured: r.featured,
    coverImageUrl: r.cover_image_url,
  }));
  res.json({ ok: true, vehicles });
});

app.get("/api/vehicles/:slug", async (req, res) => {
  const slug = String(req.params.slug || "");
  if (!slug) return res.status(400).json({ error: "Slug inválido" });

  const v = await pool.query(
    `
      SELECT *
      FROM ${schema}.vehicles
      WHERE slug = $1
      LIMIT 1;
    `,
    [slug],
  );
  if (v.rowCount === 0) return res.status(404).json({ error: "Veículo não encontrado" });

  const vehicle = v.rows[0];
  const images = await pool.query(
    `
      SELECT id, url, is_cover, sort_order
      FROM ${schema}.vehicle_images
      WHERE vehicle_id = $1
      ORDER BY is_cover DESC, sort_order ASC, id ASC;
    `,
    [vehicle.id],
  );

  res.json({
    ok: true,
    vehicle: {
      id: vehicle.id,
      slug: vehicle.slug,
      title: vehicle.title,
      category: vehicle.category,
      year: vehicle.year,
      priceCents: vehicle.price_cents,
      price: centsToBrlString(vehicle.price_cents),
      mileageKm: vehicle.mileage_km,
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      color: vehicle.color,
      description: vehicle.description,
      status: vehicle.status,
      featured: vehicle.featured,
      specs: {
        motor: vehicle.motor,
        potencia: vehicle.power,
        transmissao: vehicle.transmission,
        tracao: vehicle.traction,
        cor: vehicle.color,
        portas: vehicle.doors,
        lugares: vehicle.seats,
        final_placa: vehicle.plate_final,
      },
      features: Array.isArray(vehicle.features) ? vehicle.features : vehicle.features?.items || vehicle.features || [],
      images: images.rows.map((i) => ({ id: i.id, url: i.url, isCover: i.is_cover, sortOrder: i.sort_order })),
    },
  });
});

// ----------------------------
// Público - Depoimentos
// ----------------------------
app.get("/api/testimonials", async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const rows = await pool.query(
    `
      SELECT id, name, title, rating, content, location
      FROM ${schema}.testimonials
      WHERE is_published = true
      ORDER BY updated_at DESC, id DESC
      LIMIT $1;
    `,
    [limit],
  );
  res.json({
    ok: true,
    testimonials: rows.rows.map((t) => ({
      id: t.id,
      name: t.name,
      title: t.title,
      rating: t.rating,
      text: t.content,
      location: t.location,
    })),
  });
});

// Lead público (formulários)
const LeadSchema = z.object({
  vehicleId: z.number().int().positive().optional(),
  name: z.string().min(2),
  phone: z.string().min(5).optional(),
  email: z.string().email().optional(),
  message: z.string().max(4000).optional(),
  source: z.string().max(100).optional(),
});

app.post("/api/leads", async (req, res) => {
  const parsed = LeadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Payload inválido", details: parsed.error.flatten() });

  const { vehicleId, name, phone, email, message, source } = parsed.data;
  const result = await pool.query(
    `
      INSERT INTO ${schema}.leads (vehicle_id, name, phone, email, message, source)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at;
    `,
    [vehicleId ?? null, name, phone ?? null, email ?? null, message ?? null, source ?? null],
  );

  return res.status(201).json({ ok: true, lead: result.rows[0] });
});

// Upload (admin) -> Cloudinary + registra em uploads
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

app.post("/api/admin/uploads", requireAdminKey, upload.single("file"), async (req, res) => {
  if (!process.env.CLOUDINARY_URL) return res.status(400).json({ error: "CLOUDINARY_URL não configurado" });
  if (!req.file) return res.status(400).json({ error: "Arquivo ausente (campo: file)" });

  const originalFilename = req.file.originalname;
  const mimeType = req.file.mimetype;
  const sizeBytes = req.file.size;

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "selection/uploads" },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      },
    );
    stream.end(req.file.buffer);
  });

  const publicId = uploadResult.public_id || null;
  const url = uploadResult.secure_url || uploadResult.url;

  const db = await pool.query(
    `
      INSERT INTO ${schema}.uploads (kind, original_filename, mime_type, size_bytes, cloudinary_public_id, url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, url, cloudinary_public_id, created_at;
    `,
    ["image", originalFilename, mimeType, sizeBytes, publicId, url],
  );

  return res.status(201).json({ ok: true, upload: db.rows[0], cloudinary: { public_id: publicId, url } });
});

// ----------------------------
// Admin - Veículos (CRUD)
// ----------------------------
const AdminVehicleUpsertSchema = z.object({
  slug: z.string().min(2).max(200),
  title: z.string().min(2).max(300),
  brand: z.string().max(120).optional().nullable(),
  model: z.string().max(120).optional().nullable(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  priceCents: z.number().int().min(0).optional().nullable(),
  mileageKm: z.number().int().min(0).optional().nullable(),
  fuel: z.string().max(60).optional().nullable(),
  transmission: z.string().max(80).optional().nullable(),
  color: z.string().max(80).optional().nullable(),
  description: z.string().max(10000).optional().nullable(),
  status: z.enum(["draft", "published", "sold", "archived"]).optional(),
  featured: z.boolean().optional(),
  category: z.enum(["novos", "seminovos", "luxo"]).optional().nullable(),
  motor: z.string().max(200).optional().nullable(),
  power: z.string().max(120).optional().nullable(),
  traction: z.string().max(80).optional().nullable(),
  doors: z.number().int().min(1).max(10).optional().nullable(),
  seats: z.number().int().min(1).max(20).optional().nullable(),
  plateFinal: z.string().max(10).optional().nullable(),
  features: z.array(z.string().max(200)).optional().nullable(),
});

app.get("/api/admin/vehicles", requireAdminKey, async (req, res) => {
  const status = req.query.status ? String(req.query.status) : null;
  const limit = Math.min(Number(req.query.limit || 100), 300);
  const params = [];
  let where = "WHERE 1=1";
  if (status) {
    where += ` AND v.status = $${params.length + 1}`;
    params.push(status);
  }
  params.push(limit);

  const rows = await pool.query(
    `
      SELECT
        v.*,
        (
          SELECT vi.url
          FROM ${schema}.vehicle_images vi
          WHERE vi.vehicle_id = v.id
          ORDER BY vi.is_cover DESC, vi.sort_order ASC, vi.id ASC
          LIMIT 1
        ) AS cover_image_url
      FROM ${schema}.vehicles v
      ${where}
      ORDER BY v.updated_at DESC
      LIMIT $${params.length};
    `,
    params,
  );
  res.json({
    ok: true,
    vehicles: rows.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category,
      year: r.year,
      priceCents: r.price_cents,
      mileageKm: r.mileage_km,
      fuel: r.fuel,
      status: r.status,
      featured: r.featured,
      coverImageUrl: r.cover_image_url,
      updatedAt: r.updated_at,
    })),
  });
});

app.post("/api/admin/vehicles", requireAdminKey, async (req, res) => {
  const parsed = AdminVehicleUpsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Payload inválido", details: parsed.error.flatten() });
  const v = parsed.data;

  const result = await pool.query(
    `
      INSERT INTO ${schema}.vehicles
      (slug, title, brand, model, year, price_cents, mileage_km, fuel, transmission, color, description, status, featured, category, motor, power, traction, doors, seats, plate_final, features)
      VALUES
      ($1,  $2,    $3,    $4,    $5,   $6,         $7,         $8,   $9,           $10,   $11,         $12,   $13,      $14,      $15,   $16,  $17,      $18,  $19,  $20,        $21)
      RETURNING id, slug, created_at;
    `,
    [
      v.slug,
      v.title,
      v.brand ?? null,
      v.model ?? null,
      v.year ?? null,
      v.priceCents ?? null,
      v.mileageKm ?? null,
      v.fuel ?? null,
      v.transmission ?? null,
      v.color ?? null,
      v.description ?? null,
      v.status ?? "draft",
      v.featured ?? false,
      v.category ?? null,
      v.motor ?? null,
      v.power ?? null,
      v.traction ?? null,
      v.doors ?? null,
      v.seats ?? null,
      v.plateFinal ?? null,
      v.features ?? null,
    ],
  );
  res.status(201).json({ ok: true, vehicle: result.rows[0] });
});

app.put("/api/admin/vehicles/:id", requireAdminKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
  const parsed = AdminVehicleUpsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Payload inválido", details: parsed.error.flatten() });
  const v = parsed.data;

  const result = await pool.query(
    `
      UPDATE ${schema}.vehicles
      SET
        slug = $2,
        title = $3,
        brand = $4,
        model = $5,
        year = $6,
        price_cents = $7,
        mileage_km = $8,
        fuel = $9,
        transmission = $10,
        color = $11,
        description = $12,
        status = $13,
        featured = $14,
        category = $15,
        motor = $16,
        power = $17,
        traction = $18,
        doors = $19,
        seats = $20,
        plate_final = $21,
        features = $22
      WHERE id = $1
      RETURNING id, slug, updated_at;
    `,
    [
      id,
      v.slug,
      v.title,
      v.brand ?? null,
      v.model ?? null,
      v.year ?? null,
      v.priceCents ?? null,
      v.mileageKm ?? null,
      v.fuel ?? null,
      v.transmission ?? null,
      v.color ?? null,
      v.description ?? null,
      v.status ?? "draft",
      v.featured ?? false,
      v.category ?? null,
      v.motor ?? null,
      v.power ?? null,
      v.traction ?? null,
      v.doors ?? null,
      v.seats ?? null,
      v.plateFinal ?? null,
      v.features ?? null,
    ],
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "Veículo não encontrado" });
  res.json({ ok: true, vehicle: result.rows[0] });
});

app.delete("/api/admin/vehicles/:id", requireAdminKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
  const result = await pool.query(
    `UPDATE ${schema}.vehicles SET status = 'archived' WHERE id = $1 RETURNING id;`,
    [id],
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "Veículo não encontrado" });
  res.json({ ok: true });
});

const AdminVehicleImageCreateSchema = z.object({
  url: z.string().url(),
  cloudinaryPublicId: z.string().max(400).optional().nullable(),
  isCover: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  bytes: z.number().int().optional().nullable(),
  format: z.string().max(40).optional().nullable(),
});

app.get("/api/admin/vehicles/:id", requireAdminKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
  const v = await pool.query(`SELECT * FROM ${schema}.vehicles WHERE id = $1 LIMIT 1;`, [id]);
  if (v.rowCount === 0) return res.status(404).json({ error: "Veículo não encontrado" });
  const imgs = await pool.query(
    `SELECT id, url, is_cover, sort_order FROM ${schema}.vehicle_images WHERE vehicle_id = $1 ORDER BY is_cover DESC, sort_order ASC, id ASC;`,
    [id],
  );
  res.json({
    ok: true,
    vehicle: v.rows[0],
    images: imgs.rows.map((i) => ({ id: i.id, url: i.url, isCover: i.is_cover, sortOrder: i.sort_order })),
  });
});

app.post("/api/admin/vehicles/:id/images", requireAdminKey, async (req, res) => {
  const vehicleId = Number(req.params.id);
  if (!Number.isFinite(vehicleId)) return res.status(400).json({ error: "ID inválido" });
  const parsed = AdminVehicleImageCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Payload inválido", details: parsed.error.flatten() });
  const img = parsed.data;

  await pool.query("BEGIN");
  try {
    if (img.isCover) {
      await pool.query(`UPDATE ${schema}.vehicle_images SET is_cover = false WHERE vehicle_id = $1;`, [vehicleId]);
    }
    const inserted = await pool.query(
      `
        INSERT INTO ${schema}.vehicle_images
          (vehicle_id, cloudinary_public_id, url, width, height, bytes, format, is_cover, sort_order)
        VALUES
          ($1,        $2,                 $3,  $4,    $5,     $6,    $7,     $8,      $9)
        RETURNING id, url, is_cover, sort_order, created_at;
      `,
      [
        vehicleId,
        img.cloudinaryPublicId ?? null,
        img.url,
        img.width ?? null,
        img.height ?? null,
        img.bytes ?? null,
        img.format ?? null,
        img.isCover ?? false,
        img.sortOrder ?? 0,
      ],
    );
    await pool.query("COMMIT");
    res.status(201).json({ ok: true, image: inserted.rows[0] });
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  }
});

app.delete("/api/admin/vehicle-images/:id", requireAdminKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
  const result = await pool.query(`DELETE FROM ${schema}.vehicle_images WHERE id = $1 RETURNING id;`, [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "Imagem não encontrada" });
  res.json({ ok: true });
});

app.patch("/api/admin/vehicle-images/:id", requireAdminKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
  const PatchSchema = z.object({ isCover: z.boolean().optional(), sortOrder: z.number().int().min(0).max(9999).optional() });
  const parsed = PatchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Payload inválido", details: parsed.error.flatten() });

  const current = await pool.query(`SELECT id, vehicle_id FROM ${schema}.vehicle_images WHERE id = $1;`, [id]);
  if (current.rowCount === 0) return res.status(404).json({ error: "Imagem não encontrada" });
  const vehicleId = current.rows[0].vehicle_id;

  await pool.query("BEGIN");
  try {
    if (parsed.data.isCover === true) {
      await pool.query(`UPDATE ${schema}.vehicle_images SET is_cover = false WHERE vehicle_id = $1;`, [vehicleId]);
    }
    const result = await pool.query(
      `
        UPDATE ${schema}.vehicle_images
        SET
          is_cover = COALESCE($2, is_cover),
          sort_order = COALESCE($3, sort_order)
        WHERE id = $1
        RETURNING id, vehicle_id, is_cover, sort_order;
      `,
      [id, parsed.data.isCover ?? null, parsed.data.sortOrder ?? null],
    );
    await pool.query("COMMIT");
    res.json({ ok: true, image: result.rows[0] });
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  }
});

// Admin - listar leads
app.get("/api/admin/leads", requireAdminKey, async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const rows = await pool.query(
    `SELECT * FROM ${schema}.leads ORDER BY created_at DESC LIMIT $1;`,
    [limit],
  );
  res.json({ ok: true, leads: rows.rows });
});

app.patch("/api/admin/leads/:id", requireAdminKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
  const LeadUpdateSchema = z.object({ status: z.enum(["new", "contacted", "converted", "archived"]) });
  const parsed = LeadUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Payload inválido", details: parsed.error.flatten() });
  const result = await pool.query(
    `UPDATE ${schema}.leads SET status = $2 WHERE id = $1 RETURNING id, status, updated_at;`,
    [id, parsed.data.status],
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "Lead não encontrado" });
  res.json({ ok: true, lead: result.rows[0] });
});

// Admin - depoimentos
const AdminTestimonialUpsertSchema = z.object({
  name: z.string().min(2).max(200),
  title: z.string().max(200).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  content: z.string().min(5).max(4000),
  isPublished: z.boolean().optional(),
});

app.get("/api/admin/testimonials", requireAdminKey, async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 100), 300);
  const rows = await pool.query(
    `SELECT * FROM ${schema}.testimonials ORDER BY updated_at DESC, id DESC LIMIT $1;`,
    [limit],
  );
  res.json({ ok: true, testimonials: rows.rows });
});

app.get("/api/admin/testimonials/:id", requireAdminKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
  const row = await pool.query(`SELECT * FROM ${schema}.testimonials WHERE id = $1 LIMIT 1;`, [id]);
  if (row.rowCount === 0) return res.status(404).json({ error: "Depoimento não encontrado" });
  res.json({ ok: true, testimonial: row.rows[0] });
});

app.post("/api/admin/testimonials", requireAdminKey, async (req, res) => {
  const parsed = AdminTestimonialUpsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Payload inválido", details: parsed.error.flatten() });
  const t = parsed.data;
  const result = await pool.query(
    `
      INSERT INTO ${schema}.testimonials (name, title, rating, content, is_published, location)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at;
    `,
    [t.name, t.title ?? null, t.rating ?? null, t.content, t.isPublished ?? true, t.location ?? null],
  );
  res.status(201).json({ ok: true, testimonial: result.rows[0] });
});

app.put("/api/admin/testimonials/:id", requireAdminKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
  const parsed = AdminTestimonialUpsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Payload inválido", details: parsed.error.flatten() });
  const t = parsed.data;
  const result = await pool.query(
    `
      UPDATE ${schema}.testimonials
      SET name = $2, title = $3, rating = $4, content = $5, is_published = $6, location = $7
      WHERE id = $1
      RETURNING id, updated_at;
    `,
    [id, t.name, t.title ?? null, t.rating ?? null, t.content, t.isPublished ?? true, t.location ?? null],
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "Depoimento não encontrado" });
  res.json({ ok: true, testimonial: result.rows[0] });
});

app.delete("/api/admin/testimonials/:id", requireAdminKey, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
  const result = await pool.query(`DELETE FROM ${schema}.testimonials WHERE id = $1 RETURNING id;`, [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "Depoimento não encontrado" });
  res.json({ ok: true });
});

// Servir frontend (SPA)
const distDir = path.join(process.cwd(), "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
}

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`);
});

