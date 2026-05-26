-- Run this in Supabase SQL Editor (safe if `leaders` already exists).
-- Use "Run and enable RLS" when prompted.

CREATE TABLE IF NOT EXISTS leaders (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  title         TEXT NOT NULL,
  bio           TEXT,
  photo_url     TEXT,
  facebook_url  TEXT,
  instagram_url TEXT,
  twitter_url   TEXT,
  order_index   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by    TEXT
);

CREATE INDEX IF NOT EXISTS idx_leaders_order_index ON leaders (order_index);

ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;

-- Public can read leaders (website visitors). Admin writes go through your API + service role.
DROP POLICY IF EXISTS "Public read leaders" ON leaders;
CREATE POLICY "Public read leaders"
  ON leaders FOR SELECT
  USING (true);
