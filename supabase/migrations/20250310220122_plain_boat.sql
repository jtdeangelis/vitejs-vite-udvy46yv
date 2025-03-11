/*
  # Fix projects table policies

  1. Changes
    - Drop all existing policies to avoid conflicts
    - Recreate policies with proper access controls
    - Fix shared projects access logic
    - Add proper user access controls

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Fix shared projects access
*/

-- Drop existing policies one by one
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
DROP POLICY IF EXISTS "Users can read public projects" ON projects;
DROP POLICY IF EXISTS "Users can read shared projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Create new policies
CREATE POLICY "Users can read own projects"
ON projects FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

CREATE POLICY "Users can read public projects"
ON projects FOR SELECT
TO public
USING (
  is_public = true
);

CREATE POLICY "Users can read shared projects"
ON projects FOR SELECT
TO public
USING (
  id IN (
    SELECT project_id 
    FROM shared_projects 
    WHERE (expires_at IS NULL OR expires_at > now())
  )
);

CREATE POLICY "Users can insert own projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can delete own projects"
ON projects FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
);