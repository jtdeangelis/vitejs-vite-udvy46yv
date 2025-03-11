/*
  # Fix Shared Projects Policies

  1. Changes
    - Drop existing policies before recreating them
    - Add shared projects table and policies
    - Add share token generation function
  
  2. Security
    - Enable RLS on shared_projects table
    - Add policies for share link management
*/

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can create share links for their projects" ON shared_projects;
DROP POLICY IF EXISTS "Users can view their own share links" ON shared_projects;

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

-- Enable RLS on shared_projects
ALTER TABLE shared_projects ENABLE ROW LEVEL SECURITY;

-- Add constraint for share token length
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'share_token_length'
  ) THEN
    ALTER TABLE shared_projects
      ADD CONSTRAINT share_token_length CHECK (char_length(share_token) >= 10);
  END IF;
END $$;

-- Create policies for shared_projects
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