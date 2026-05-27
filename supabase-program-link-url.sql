-- Add a custom service link to programs.
-- Run this once in the Supabase SQL Editor if your programs table already exists.

ALTER TABLE programs
ADD COLUMN IF NOT EXISTS link_url TEXT;
