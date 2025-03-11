/*
  # Fix Project Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new policies with optimized conditions to prevent recursion
    - Simplify shared project access policy
  
  2. Security
    - Maintain RLS security model
    - Ensure proper access control for projects
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
DROP POLICY IF EXISTS "Users can read shared projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create new project policies
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read public and shared projects"
  ON projects
  FOR SELECT
  TO public
  USING (
    is_public = true OR
    id IN (
      SELECT project_id 
      FROM shared_projects 
      WHERE (expires_at IS NULL OR expires_at > now())
    )
  );

CREATE POLICY "Users can insert own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);