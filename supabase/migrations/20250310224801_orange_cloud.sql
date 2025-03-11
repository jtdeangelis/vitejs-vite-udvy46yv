/*
  # Add project association to property media

  1. New Columns
    - `project_id` (uuid, references projects.id)
    - `order` (integer, for sorting photos)
    - `is_cover` (boolean, for cover photo)
    
  2. Security
    - Enable RLS on property_media table
    - Add policies for authenticated users
    - Add foreign key constraint to projects table
*/

-- Add new columns
ALTER TABLE property_media 
ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_cover boolean DEFAULT false;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS property_media_project_id_idx ON property_media(project_id);
CREATE INDEX IF NOT EXISTS property_media_order_idx ON property_media("order");

-- Update RLS policies
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