/*
  # Fix Project Policies with Simplified Approach

  1. Changes
    - Drop existing policies
    - Create simplified non-recursive policies
    - Implement basic CRUD operations
    - Fix shared projects access

  2. Security
    - Maintain RLS enabled
    - Ensure proper authentication checks
    - Prevent infinite recursion
*/

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
DROP POLICY IF EXISTS "Users can read public projects" ON projects;
DROP POLICY IF EXISTS "Users can read shared projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "select_own_projects" ON projects;
DROP POLICY IF EXISTS "select_public_projects" ON projects;
DROP POLICY IF EXISTS "select_shared_projects" ON projects;
DROP POLICY IF EXISTS "insert_own_projects" ON projects;
DROP POLICY IF EXISTS "update_own_projects" ON projects;
DROP POLICY IF EXISTS "delete_own_projects" ON projects;

-- Create basic SELECT policy for authenticated users
CREATE POLICY "allow_select"
ON projects FOR SELECT
USING (
  user_id = auth.uid() OR
  is_public = true OR
  id IN (
    SELECT project_id 
    FROM shared_projects 
    WHERE share_token IS NOT NULL
    AND (expires_at IS NULL OR expires_at > now())
  )
);

-- Create INSERT policy
CREATE POLICY "allow_insert"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- Create UPDATE policy
CREATE POLICY "allow_update"
ON projects FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
)
WITH CHECK (
  user_id = auth.uid()
);

-- Create DELETE policy
CREATE POLICY "allow_delete"
ON projects FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
);