-- Migration: 0002_vehicle_fields_and_testimonials_location
-- Objetivo:
-- - Completar campos do veículo usados no frontend (categoria/specs/features)
-- - Adicionar location em testimonials para exibição no site

-- Veículos: categoria + specs extras + features (lista)
ALTER TABLE selection.vehicles
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS motor text,
  ADD COLUMN IF NOT EXISTS power text,
  ADD COLUMN IF NOT EXISTS traction text,
  ADD COLUMN IF NOT EXISTS doors int,
  ADD COLUMN IF NOT EXISTS seats int,
  ADD COLUMN IF NOT EXISTS plate_final text,
  ADD COLUMN IF NOT EXISTS features jsonb;

-- Normalizar features como array JSON
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'selection'
      AND table_name = 'vehicles'
      AND column_name = 'features'
      AND data_type = 'jsonb'
  ) THEN
    -- ok
  END IF;
END $$;

-- Constraints simples
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vehicles_category_check'
  ) THEN
    ALTER TABLE selection.vehicles
      ADD CONSTRAINT vehicles_category_check
      CHECK (category IS NULL OR category IN ('novos', 'seminovos', 'luxo'));
  END IF;
END $$;

-- Depoimentos: location
ALTER TABLE selection.testimonials
  ADD COLUMN IF NOT EXISTS location text;

