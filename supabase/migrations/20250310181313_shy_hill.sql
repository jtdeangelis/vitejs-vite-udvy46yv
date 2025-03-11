/*
  # Create shared projects table and functions

  1. New Tables
    - `shared_projects`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `share_token` (text, unique)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `views` (integer)
      - `last_viewed_at` (timestamptz)

  2. Security
    - Enable RLS on `shared_projects` table
    - Add policies for:
      - Users can create share links for their projects
      - Users can view their own share links
      - Public can view shared projects with valid tokens

  3. Functions
    - `create_share_link`: Creates a new share token for a project
*/

-- Create shared_projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS shared_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  share_token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  views integer DEFAULT 0,
  last_viewed_at timestamptz
);

-- Add share token length constraint if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'share_token_length'
  ) THEN
    ALTER TABLE shared_projects
      ADD CONSTRAINT share_token_length CHECK (char_length(share_token) >= 10);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE shared_projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create share links for their projects" ON shared_projects;
DROP POLICY IF EXISTS "Users can view their own share links" ON shared_projects;

-- Create policies
CREATE POLICY "Users can create share links for their projects"
  ON shared_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = shared_projects.project_id
      AND (projects.user_id = auth.uid() OR projects.is_public = true)
    )
  );

CREATE POLICY "Users can view their own share links"
  ON shared_projects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = shared_projects.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_share_link(uuid, integer);

-- Create function to generate share token
CREATE OR REPLACE FUNCTION create_share_link(project_id uuid, days_valid integer)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token text;
  expires timestamptz;
BEGIN
  -- Generate random token
  token := encode(gen_random_bytes(20), 'hex');
  
  -- Calculate expiry date if days_valid > 0
  IF days_valid > 0 THEN
    expires := now() + (days_valid || ' days')::interval;
  ELSE
    expires := NULL;
  END IF;

  -- Insert new share record
  INSERT INTO shared_projects (project_id, share_token, expires_at)
  VALUES (project_id, token, expires);

  RETURN token;
END;
$$;