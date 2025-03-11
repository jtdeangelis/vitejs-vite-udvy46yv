/*
  # Fix projects table policies

  1. Changes
    - Drop all existing policies to avoid conflicts
    - Create new non-recursive policies for projects table
    - Simplify shared projects access logic
    - Add proper user access controls

  2. Security
    - Maintain RLS
    - Add clear policies for CRUD operations
    - Fix shared projects access without recursion
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
DROP POLICY IF EXISTS "Users can read public projects" ON projects;
DROP POLICY IF EXISTS "Users can read shared projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Create new non-recursive policies
CREATE POLICY "allow_read_own_projects"
ON projects FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

CREATE POLICY "allow_read_public_projects"
ON projects FOR SELECT
TO public
USING (
  is_public = true
);

CREATE POLICY "allow_read_shared_projects"
ON projects FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 
    FROM shared_projects sp 
    WHERE sp.project_id = projects.id 
    AND (sp.expires_at IS NULL OR sp.expires_at > now())
  )
);

CREATE POLICY "allow_insert_own_projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "allow_update_own_projects"
ON projects FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "allow_delete_own_projects"
ON projects FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
);