/*
  # Add Project Sharing Features

  1. New Tables
    - `shared_projects`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `share_token` (text, unique)
      - `created_at` (timestamp)
      - `expires_at` (timestamp, nullable)
      - `views` (integer)
      - `last_viewed_at` (timestamp)

  2. Changes
    - Add `is_public` column to `projects` table
    - Add `shared_by_user_id` column to `projects` table

  3. Security
    - Enable RLS on shared_projects table
    - Add policies for shared project access
    - Update project policies to allow public access
*/

-- Create shared_projects table
CREATE TABLE IF NOT EXISTS shared_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  share_token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  views integer DEFAULT 0,
  last_viewed_at timestamptz,
  CONSTRAINT share_token_length CHECK (char_length(share_token) >= 10)
);

-- Add sharing-related columns to projects table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_public boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'shared_by_user_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN shared_by_user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Enable RLS on shared_projects
ALTER TABLE shared_projects ENABLE ROW LEVEL SECURITY;

-- Policies for shared_projects
CREATE POLICY "Users can create share links for their projects"
  ON shared_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id 
      AND (user_id = auth.uid() OR is_public = true)
    )
  );

CREATE POLICY "Users can view their own share links"
  ON shared_projects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view shared projects"
  ON projects
  FOR SELECT
  TO public
  USING (
    is_public = true 
    OR 
    EXISTS (
      SELECT 1 FROM shared_projects 
      WHERE project_id = id 
      AND (expires_at IS NULL OR expires_at > now())
    )
  );

-- Function to generate share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer := 0;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Function to create a share link
CREATE OR REPLACE FUNCTION create_share_link(project_id uuid, days_valid integer DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token text;
  exp_date timestamptz;
BEGIN
  -- Generate unique token
  token := generate_share_token();
  
  -- Calculate expiration date if days_valid is provided
  IF days_valid IS NOT NULL THEN
    exp_date := now() + (days_valid || ' days')::interval;
  END IF;
  
  -- Create share record
  INSERT INTO shared_projects (project_id, share_token, expires_at)
  VALUES (project_id, token, exp_date);
  
  RETURN token;
END;
$$;