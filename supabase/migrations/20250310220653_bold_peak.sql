/*
  # Remove Project Sharing Features
  
  1. Changes
    - Drop all existing policies first
    - Drop shared_projects table with CASCADE
    - Remove sharing-related columns
    - Create new simplified policies
    
  2. Security
    - Maintain RLS enabled
    - Basic CRUD policies for authenticated users
*/

-- Drop all existing policies first
DROP POLICY IF EXISTS "allow_select" ON projects;
DROP POLICY IF EXISTS "allow_insert" ON projects;
DROP POLICY IF EXISTS "allow_update" ON projects;
DROP POLICY IF EXISTS "allow_delete" ON projects;
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
DROP POLICY IF EXISTS "Users can read public projects" ON projects;
DROP POLICY IF EXISTS "Users can read shared projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Drop shared_projects table with CASCADE to remove dependencies
DROP TABLE IF EXISTS shared_projects CASCADE;

-- Remove sharing-related columns from projects
ALTER TABLE projects 
DROP COLUMN IF EXISTS is_public CASCADE,
DROP COLUMN IF EXISTS shared_by_user_id CASCADE;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create simple CRUD policies
CREATE POLICY "allow_select_own"
ON projects FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

CREATE POLICY "allow_insert_own"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

CREATE POLICY "allow_update_own"
ON projects FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
)
WITH CHECK (
  user_id = auth.uid()
);

CREATE POLICY "allow_delete_own"
ON projects FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
);