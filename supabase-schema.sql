-- Run this in Supabase SQL Editor to create all tables (matches Prisma schema).
-- If tables already exist, run the DROP block below first, then this script.

-- Optional: uncomment to reset and recreate (removes all data)
/*
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS update_links CASCADE;
DROP TABLE IF EXISTS leaders CASCADE;
DROP TABLE IF EXISTS sermons CASCADE;
DROP TABLE IF EXISTS sermon_sources CASCADE;
DROP TABLE IF EXISTS live_streams CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
*/

-- 1. site_settings
CREATE TABLE site_settings (
  id            TEXT PRIMARY KEY,
  church_name   TEXT NOT NULL,
  tagline       TEXT,
  location_text TEXT NOT NULL,
  map_link      TEXT,
  logo_url      TEXT,
  facebook_url  TEXT,
  instagram_url TEXT,
  youtube_url   TEXT,
  twitter_url   TEXT,
  phone_numbers TEXT[] DEFAULT '{}',
  email         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL
);

-- 2. programs
CREATE TABLE programs (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  day              TEXT NOT NULL,
  start_time       TEXT NOT NULL,
  end_time         TEXT NOT NULL,
  venue            TEXT NOT NULL,
  contacts         TEXT[] DEFAULT '{}',
  poster_image_url TEXT,
  description      TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  order_index      INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL,
  updated_by       TEXT
);
CREATE INDEX idx_programs_day_is_active ON programs (day, is_active);

-- 3. events
CREATE TABLE events (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  date             TIMESTAMPTZ NOT NULL,
  time             TEXT NOT NULL,
  venue            TEXT NOT NULL,
  entry_fee        TEXT,
  description      TEXT,
  speakers         TEXT[] DEFAULT '{}',
  poster_image_url TEXT,
  is_upcoming      BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL,
  updated_by       TEXT
);
CREATE INDEX idx_events_date_is_upcoming ON events (date, is_upcoming);

-- 4. live_streams
CREATE TABLE live_streams (
  id                TEXT PRIMARY KEY,
  is_live           BOOLEAN NOT NULL DEFAULT false,
  platform          TEXT,
  youtube_live_url  TEXT,
  facebook_live_url TEXT,
  google_meet_url   TEXT,
  title             TEXT,
  schedule_time     TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ NOT NULL,
  updated_by        TEXT
);

-- 5. sermon_sources
CREATE TABLE sermon_sources (
  id                   TEXT PRIMARY KEY,
  youtube_playlist_url TEXT,
  latest_sermon_url    TEXT,
  updated_at           TIMESTAMPTZ NOT NULL,
  updated_by           TEXT
);

-- 6. sermons
CREATE TABLE sermons (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  speaker       TEXT,
  date          TIMESTAMPTZ NOT NULL,
  video_url     TEXT,
  audio_url     TEXT,
  thumbnail_url TEXT,
  duration      INTEGER,
  views         INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL,
  updated_by    TEXT
);
CREATE INDEX idx_sermons_date ON sermons (date);

-- 7. leaders
CREATE TABLE leaders (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  title        TEXT NOT NULL,
  bio          TEXT,
  photo_url    TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url  TEXT,
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL,
  updated_by   TEXT
);
CREATE INDEX idx_leaders_order_index ON leaders (order_index);

-- 8. update_links
CREATE TABLE update_links (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  url          TEXT NOT NULL,
  description  TEXT DEFAULT '',
  category     TEXT NOT NULL DEFAULT 'General',
  is_active    BOOLEAN NOT NULL DEFAULT true,
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL,
  updated_by   TEXT
);

-- 9. admins
CREATE TABLE admins (
  id            TEXT PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT,
  role          TEXT NOT NULL DEFAULT 'admin',
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL
);

-- 10. photos
CREATE TABLE photos (
  id             TEXT PRIMARY KEY,
  filename       TEXT NOT NULL,
  original_name  TEXT NOT NULL,
  url            TEXT NOT NULL,
  size           INTEGER DEFAULT 0,
  category       TEXT DEFAULT 'general',
  upload_date    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by     TEXT
);
-- Enable Realtime for photos table
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
