/*
  # Fix photo_albums table and policies

  1. Changes
     - Add IF NOT EXISTS checks for policies to prevent errors
     - Ensure photo_albums table exists with proper structure
     - Create policies only if they don't already exist
*/

-- Create photo_albums table if it doesn't exist
CREATE TABLE IF NOT EXISTS photo_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_url text NOT NULL,
  photos jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Create index on album_url for faster lookups
CREATE INDEX IF NOT EXISTS photo_albums_album_url_idx ON photo_albums(album_url);

-- Enable Row Level Security
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users with IF NOT EXISTS checks
DO $$ 
BEGIN
  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can read all photo albums' 
    AND tablename = 'photo_albums'
  ) THEN
    CREATE POLICY "Users can read all photo albums"
      ON photo_albums
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can insert own photo albums' 
    AND tablename = 'photo_albums'
  ) THEN
    CREATE POLICY "Users can insert own photo albums"
      ON photo_albums
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can update own photo albums' 
    AND tablename = 'photo_albums'
  ) THEN
    CREATE POLICY "Users can update own photo albums"
      ON photo_albums
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can delete own photo albums' 
    AND tablename = 'photo_albums'
  ) THEN
    CREATE POLICY "Users can delete own photo albums"
      ON photo_albums
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;