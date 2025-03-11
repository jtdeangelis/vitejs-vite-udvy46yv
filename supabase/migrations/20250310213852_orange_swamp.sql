-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users DEFAULT auth.uid(),
  is_public boolean DEFAULT true,
  shared_by_user_id uuid REFERENCES auth.users
);

-- Create shared projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.shared_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects ON DELETE CASCADE,
  share_token text NOT NULL UNIQUE CHECK (char_length(share_token) >= 10),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  views integer DEFAULT 0,
  last_viewed_at timestamptz
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'projects' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'shared_projects' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.shared_projects ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Projects policies
  DROP POLICY IF EXISTS "Users can read own projects" ON public.projects;
  DROP POLICY IF EXISTS "Users can read public projects" ON public.projects;
  DROP POLICY IF EXISTS "Users can read shared projects" ON public.projects;
  DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
  DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
  DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
  
  -- Shared projects policies
  DROP POLICY IF EXISTS "Users can create share links for their projects" ON public.shared_projects;
  DROP POLICY IF EXISTS "Users can view their own share links" ON public.shared_projects;
END $$;

-- Create project policies
CREATE POLICY "Users can read own projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read public projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Users can read shared projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (
    id IN (
      SELECT project_id 
      FROM shared_projects 
      WHERE (expires_at IS NULL OR expires_at > now())
    )
  );

CREATE POLICY "Users can insert own projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create shared projects policies
CREATE POLICY "Users can create share links for their projects"
  ON public.shared_projects
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
  ON public.shared_projects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id 
      AND user_id = auth.uid()
    )
  );

-- Create function to generate share token if it doesn't exist
CREATE OR REPLACE FUNCTION create_share_link(
  project_id uuid,
  days_valid int DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token text;
  expires timestamptz;
BEGIN
  -- Generate a random token
  token := encode(gen_random_bytes(20), 'hex');
  
  -- Calculate expiry if days provided
  IF days_valid IS NOT NULL THEN
    expires := now() + (days_valid || ' days')::interval;
  END IF;
  
  -- Insert share record
  INSERT INTO shared_projects (project_id, share_token, expires_at)
  VALUES (project_id, token, expires);
  
  RETURN token;
END;
$$;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS projects_user_id_idx;
DROP INDEX IF EXISTS projects_created_at_idx;
DROP INDEX IF EXISTS shared_projects_project_id_idx;
DROP INDEX IF EXISTS shared_projects_share_token_idx;

-- Create indexes
CREATE INDEX projects_user_id_idx ON public.projects(user_id);
CREATE INDEX projects_created_at_idx ON public.projects(created_at);
CREATE INDEX shared_projects_project_id_idx ON public.shared_projects(project_id);
CREATE INDEX shared_projects_share_token_idx ON public.shared_projects(share_token);