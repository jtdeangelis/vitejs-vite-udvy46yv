/*
  # Storage Schema Setup
  
  1. New Tables
    - `storage_buckets` - Configuration for storage buckets
    - `storage_objects` - Metadata for stored files
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create storage buckets table
CREATE TABLE IF NOT EXISTS storage.buckets (
  id text PRIMARY KEY,
  name text NOT NULL,
  owner uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  public boolean DEFAULT false
);

-- Create storage objects table
CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text REFERENCES storage.buckets(id),
  name text NOT NULL,
  owner uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED
);

-- Create property media table
CREATE TABLE IF NOT EXISTS public.property_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id text NOT NULL,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  thumbnail text,
  name text NOT NULL,
  size bigint NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users DEFAULT auth.uid()
);

-- Create property media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-media', 'property-media', true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;

-- Bucket policies
CREATE POLICY "Allow public read access"
  ON storage.buckets
  FOR SELECT
  TO public
  USING (public = true);

CREATE POLICY "Allow authenticated users to create buckets"
  ON storage.buckets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update own buckets"
  ON storage.buckets
  FOR UPDATE
  TO authenticated
  USING (owner = auth.uid());

-- Object policies
CREATE POLICY "Allow public read access on public buckets"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id IN (
    SELECT id FROM storage.buckets WHERE public = true
  ));

CREATE POLICY "Allow authenticated users to upload files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN (
    SELECT id FROM storage.buckets WHERE owner = auth.uid() OR public = true
  ));

CREATE POLICY "Allow authenticated users to update own files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (owner = auth.uid());

-- Property media policies
CREATE POLICY "Allow authenticated users to upload media"
  ON public.property_media
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to view their own media"
  ON public.property_media
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow users to delete their own media"
  ON public.property_media
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS property_media_property_id_idx ON public.property_media(property_id);
CREATE INDEX IF NOT EXISTS property_media_user_id_idx ON public.property_media(user_id);
CREATE INDEX IF NOT EXISTS property_media_created_at_idx ON public.property_media(created_at);