/*
  # Create photo_albums table

  1. New Tables
    - `photo_albums`
      - `id` (uuid, primary key)
      - `album_url` (text, unique)
      - `photos` (jsonb array)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
  2. Security
    - Enable RLS on `photo_albums` table
    - Add policies for authenticated users to read/write their own data
    - Add policies for authenticated users to read public data
*/

-- Create photo_albums table
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

-- Create policies for authenticated users
CREATE POLICY "Users can read all photo albums"
  ON photo_albums
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own photo albums"
  ON photo_albums
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photo albums"
  ON photo_albums
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photo albums"
  ON photo_albums
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);