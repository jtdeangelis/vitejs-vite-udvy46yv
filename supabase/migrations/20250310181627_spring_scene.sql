/*
  # Fix Project Policies

  1. Changes
    - Fix infinite recursion in project policies
    - Simplify project access policies
    - Add proper RLS policies for project sharing
  
  2. Security
    - Enable RLS on projects table
    - Add policies for authenticated users
    - Add policies for public access to shared projects
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Anyone can view shared projects" ON projects;
DROP POLICY IF EXISTS "Users can delete any project" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can read all projects" ON projects;
DROP POLICY IF EXISTS "Users can update any project" ON projects;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read shared projects"
  ON projects
  FOR SELECT
  TO public
  USING (
    is_public = true OR
    EXISTS (
      SELECT 1 FROM shared_projects
      WHERE shared_projects.project_id = projects.id
      AND (shared_projects.expires_at IS NULL OR shared_projects.expires_at > now())
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