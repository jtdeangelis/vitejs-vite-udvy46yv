/*
  # Update property_media table schema

  1. Changes
    - Add project_id column
    - Make property_id nullable
    - Add foreign key constraint for project_id
    - Add index on project_id
    - Add order and is_cover columns for photo organization

  2. Security
    - Update RLS policies to use project_id
*/

-- Add new columns
ALTER TABLE property_media 
  ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_cover boolean DEFAULT false;

-- Make property_id nullable
ALTER TABLE property_media 
  ALTER COLUMN property_id DROP NOT NULL;

-- Add index for project_id
CREATE INDEX IF NOT EXISTS property_media_project_id_idx ON property_media(project_id);

-- Add index for order
CREATE INDEX IF NOT EXISTS property_media_order_idx ON property_media("order");

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view media for their projects or public projects" ON property_media;
CREATE POLICY "Users can view media for their projects or public projects"
  ON property_media
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = property_media.project_id
      AND (p.user_id = auth.uid() OR p.is_public = true)
    )
  );

DROP POLICY IF EXISTS "Users can insert media for their projects" ON property_media;
CREATE POLICY "Users can insert media for their projects"
  ON property_media
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = property_media.project_id
      AND p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update media for their projects" ON property_media;
CREATE POLICY "Users can update media for their projects"
  ON property_media
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = property_media.project_id
      AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = property_media.project_id
      AND p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete media from their projects" ON property_media;
CREATE POLICY "Users can delete media from their projects"
  ON property_media
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = property_media.project_id
      AND p.user_id = auth.uid()
    )
  );