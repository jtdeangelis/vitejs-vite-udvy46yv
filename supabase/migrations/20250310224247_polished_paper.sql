/*
  # Add is_public column to projects table

  1. Changes
    - Add is_public boolean column to projects table with default value of false
    - Update RLS policies to include is_public check for SELECT operations
    - Fix uid() function calls to use auth.uid()

  2. Security
    - Maintain existing RLS policies
    - Allow public access to projects marked as public
*/

-- Add is_public column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Update the SELECT policy to allow access to public projects
DROP POLICY IF EXISTS "allow_select_own" ON projects;
CREATE POLICY "allow_select_own_or_public"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    is_public = true
  );

-- Keep other policies unchanged but recreate them to ensure consistency
DROP POLICY IF EXISTS "allow_insert_own" ON projects;
CREATE POLICY "allow_insert_own"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "allow_update_own" ON projects;
CREATE POLICY "allow_update_own"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "allow_delete_own" ON projects;
CREATE POLICY "allow_delete_own"
  ON projects
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());