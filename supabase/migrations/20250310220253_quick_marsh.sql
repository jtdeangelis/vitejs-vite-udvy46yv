/*
  # Fix Project Policies

  1. Changes
    - Drop all existing policies to start fresh
    - Create new non-recursive policies for projects table
    - Implement proper access control for CRUD operations
    - Fix shared projects access logic

  2. Security
    - Maintain RLS enabled
    - Ensure proper user authentication checks
    - Prevent infinite recursion in policies
*/

-- First ensure RLS is enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
DROP POLICY IF EXISTS "Users can read public projects" ON projects;
DROP POLICY IF EXISTS "Users can read shared projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "allow_read_own_projects" ON projects;
DROP POLICY IF EXISTS "allow_read_public_projects" ON projects;
DROP POLICY IF EXISTS "allow_read_shared_projects" ON projects;
DROP POLICY IF EXISTS "allow_insert_own_projects" ON projects;
DROP POLICY IF EXISTS "allow_update_own_projects" ON projects;
DROP POLICY IF EXISTS "allow_delete_own_projects" ON projects;

-- Create new SELECT policies
CREATE POLICY "select_own_projects"
ON projects FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

CREATE POLICY "select_public_projects"
ON projects FOR SELECT
TO public
USING (
  is_public = true
);

CREATE POLICY "select_shared_projects"
ON projects FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 
    FROM shared_projects sp 
    WHERE sp.project_id = id 
    AND (sp.expires_at IS NULL OR sp.expires_at > now())
  )
);

-- Create INSERT policy
CREATE POLICY "insert_own_projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- Create UPDATE policy
CREATE POLICY "update_own_projects"
ON projects FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
)
WITH CHECK (
  user_id = auth.uid()
);

-- Create DELETE policy
CREATE POLICY "delete_own_projects"
ON projects FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
);