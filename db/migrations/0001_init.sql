-- Migration: 0001_init
-- Objetivo:
-- - Criar schema `selection`
-- - Criar tabelas base do projeto (incluindo área administrativa)

CREATE SCHEMA IF NOT EXISTS selection;

-- Tabela de controle de migrations
CREATE TABLE IF NOT EXISTS selection.schema_migrations (
  id          bigserial PRIMARY KEY,
  filename    text NOT NULL UNIQUE,
  applied_at  timestamptz NOT NULL DEFAULT now()
);

-- Função/trigger para updated_at
CREATE OR REPLACE FUNCTION selection.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Admins
CREATE TABLE IF NOT EXISTS selection.admin_users (
  id              bigserial PRIMARY KEY,
  email           text NOT NULL,
  password_hash   text NOT NULL,
  name            text,
  role            text NOT NULL DEFAULT 'admin',
  is_active       boolean NOT NULL DEFAULT true,
  last_login_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_users_role_check CHECK (role IN ('superadmin', 'admin', 'editor'))
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_lower_uq
  ON selection.admin_users (lower(email));

CREATE TRIGGER admin_users_set_updated_at
BEFORE UPDATE ON selection.admin_users
FOR EACH ROW EXECUTE FUNCTION selection.set_updated_at();

-- Veículos
CREATE TABLE IF NOT EXISTS selection.vehicles (
  id              bigserial PRIMARY KEY,
  slug            text NOT NULL,
  title           text NOT NULL,
  brand           text,
  model           text,
  year            int,
  price_cents     int,
  mileage_km      int,
  fuel            text,
  transmission    text,
  color           text,
  description     text,
  status          text NOT NULL DEFAULT 'published',
  featured        boolean NOT NULL DEFAULT false,
  created_by_admin_id bigint,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT vehicles_status_check CHECK (status IN ('draft', 'published', 'sold', 'archived')),
  CONSTRAINT vehicles_created_by_fk FOREIGN KEY (created_by_admin_id) REFERENCES selection.admin_users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS vehicles_slug_uq
  ON selection.vehicles (slug);

CREATE INDEX IF NOT EXISTS vehicles_status_idx
  ON selection.vehicles (status);

CREATE INDEX IF NOT EXISTS vehicles_featured_idx
  ON selection.vehicles (featured);

CREATE TRIGGER vehicles_set_updated_at
BEFORE UPDATE ON selection.vehicles
FOR EACH ROW EXECUTE FUNCTION selection.set_updated_at();

-- Imagens dos veículos (armazenadas no Cloudinary)
CREATE TABLE IF NOT EXISTS selection.vehicle_images (
  id                    bigserial PRIMARY KEY,
  vehicle_id            bigint NOT NULL,
  cloudinary_public_id  text,
  url                   text NOT NULL,
  width                 int,
  height                int,
  bytes                 int,
  format                text,
  is_cover              boolean NOT NULL DEFAULT false,
  sort_order            int NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT vehicle_images_vehicle_fk FOREIGN KEY (vehicle_id) REFERENCES selection.vehicles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS vehicle_images_vehicle_id_idx
  ON selection.vehicle_images (vehicle_id);

CREATE TRIGGER vehicle_images_set_updated_at
BEFORE UPDATE ON selection.vehicle_images
FOR EACH ROW EXECUTE FUNCTION selection.set_updated_at();

-- Leads/interesses (formulários do site)
CREATE TABLE IF NOT EXISTS selection.leads (
  id              bigserial PRIMARY KEY,
  vehicle_id      bigint,
  name            text NOT NULL,
  phone           text,
  email           text,
  message         text,
  source          text,
  status          text NOT NULL DEFAULT 'new',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_status_check CHECK (status IN ('new', 'contacted', 'converted', 'archived')),
  CONSTRAINT leads_vehicle_fk FOREIGN KEY (vehicle_id) REFERENCES selection.vehicles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS leads_status_idx
  ON selection.leads (status);

CREATE INDEX IF NOT EXISTS leads_vehicle_id_idx
  ON selection.leads (vehicle_id);

CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON selection.leads
FOR EACH ROW EXECUTE FUNCTION selection.set_updated_at();

-- Depoimentos (opcional)
CREATE TABLE IF NOT EXISTS selection.testimonials (
  id              bigserial PRIMARY KEY,
  name            text NOT NULL,
  title           text,
  rating          int,
  content         text NOT NULL,
  is_published    boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT testimonials_rating_check CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
);

CREATE INDEX IF NOT EXISTS testimonials_is_published_idx
  ON selection.testimonials (is_published);

CREATE TRIGGER testimonials_set_updated_at
BEFORE UPDATE ON selection.testimonials
FOR EACH ROW EXECUTE FUNCTION selection.set_updated_at();

-- Configurações do site (chave/valor)
CREATE TABLE IF NOT EXISTS selection.site_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Uploads genéricos (imagens/arquivos do projeto)
CREATE TABLE IF NOT EXISTS selection.uploads (
  id                    bigserial PRIMARY KEY,
  kind                  text NOT NULL DEFAULT 'image',
  original_filename     text,
  mime_type             text,
  size_bytes            int,
  cloudinary_public_id  text,
  url                   text NOT NULL,
  created_by_admin_id   bigint,
  created_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uploads_kind_check CHECK (kind IN ('image', 'file')),
  CONSTRAINT uploads_created_by_fk FOREIGN KEY (created_by_admin_id) REFERENCES selection.admin_users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS uploads_created_by_admin_id_idx
  ON selection.uploads (created_by_admin_id);

-- Audit log (ações administrativas)
CREATE TABLE IF NOT EXISTS selection.audit_logs (
  id              bigserial PRIMARY KEY,
  admin_user_id   bigint,
  action          text NOT NULL,
  entity_type     text,
  entity_id       text,
  meta            jsonb,
  ip              text,
  user_agent      text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT audit_logs_admin_fk FOREIGN KEY (admin_user_id) REFERENCES selection.admin_users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS audit_logs_admin_user_id_idx
  ON selection.audit_logs (admin_user_id);

CREATE INDEX IF NOT EXISTS audit_logs_action_idx
  ON selection.audit_logs (action);
