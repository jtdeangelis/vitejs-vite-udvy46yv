/*
  # Create property media table

  1. New Tables
    - `property_media`
      - `id` (uuid, primary key)
      - `property_id` (text, not null)
      - `url` (text, not null)
      - `type` (text, not null)
      - `thumbnail` (text)
      - `name` (text, not null)
      - `size` (bigint, not null)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on property_media table
    - Add policies for CRUD operations
    - Only authenticated users can access their own media

  3. Changes
    - Add foreign key constraint to users table
    - Add indexes for performance
*/

-- Create the property_media table
CREATE TABLE IF NOT EXISTS public.property_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id text NOT NULL,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  thumbnail text,
  name text NOT NULL,
  size bigint NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS property_media_property_id_idx ON public.property_media(property_id);
CREATE INDEX IF NOT EXISTS property_media_user_id_idx ON public.property_media(user_id);
CREATE INDEX IF NOT EXISTS property_media_created_at_idx ON public.property_media(created_at);

-- Enable Row Level Security
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own media"
  ON public.property_media
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own media"
  ON public.property_media
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media"
  ON public.property_media
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media"
  ON public.property_media
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);