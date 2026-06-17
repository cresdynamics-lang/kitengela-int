-- VOSH Kitengela - Full Supabase Schema (single-run)
-- This script drops old tables and recreates the full current schema.
-- Run once in Supabase SQL Editor.

BEGIN;

-- Drop existing app tables (safe order)
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS generation_groups CASCADE;
DROP TABLE IF EXISTS scripture_library CASCADE;
DROP TABLE IF EXISTS carousel_slides CASCADE;
DROP TABLE IF EXISTS give_settings CASCADE;
DROP TABLE IF EXISTS visitor_requests CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS update_links CASCADE;
DROP TABLE IF EXISTS leaders CASCADE;
DROP TABLE IF EXISTS sermons CASCADE;
DROP TABLE IF EXISTS sermon_sources CASCADE;
DROP TABLE IF EXISTS live_streams CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- 1) Site settings
CREATE TABLE site_settings (
  id             TEXT PRIMARY KEY,
  church_name    TEXT NOT NULL,
  tagline        TEXT,
  location_text  TEXT NOT NULL,
  map_link       TEXT,
  logo_url       TEXT,
  facebook_url   TEXT,
  instagram_url  TEXT,
  youtube_url    TEXT,
  twitter_url    TEXT,
  phone_numbers  TEXT[] DEFAULT '{}',
  email          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Programs
CREATE TABLE programs (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  day               TEXT NOT NULL,
  start_time        TEXT NOT NULL,
  end_time          TEXT NOT NULL,
  venue             TEXT NOT NULL,
  contacts          TEXT[] DEFAULT '{}',
  poster_image_url  TEXT,
  link_url          TEXT,
  description       TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  order_index       INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by        TEXT
);
CREATE INDEX idx_programs_day_is_active ON programs (day, is_active);

-- 3) Events
CREATE TABLE events (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  date              TIMESTAMPTZ NOT NULL,
  time              TEXT NOT NULL,
  venue             TEXT NOT NULL,
  entry_fee         TEXT,
  description       TEXT,
  speakers          TEXT[] DEFAULT '{}',
  poster_image_url  TEXT,
  is_upcoming       BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by        TEXT
);
CREATE INDEX idx_events_date_is_upcoming ON events (date, is_upcoming);

-- 4) Live streams
CREATE TABLE live_streams (
  id                 TEXT PRIMARY KEY,
  is_live            BOOLEAN NOT NULL DEFAULT false,
  platform           TEXT,
  youtube_live_url   TEXT,
  facebook_live_url  TEXT,
  google_meet_url    TEXT,
  title              TEXT,
  schedule_time      TIMESTAMPTZ,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by         TEXT
);

-- 5) Sermon sources
CREATE TABLE sermon_sources (
  id                    TEXT PRIMARY KEY,
  youtube_playlist_url  TEXT,
  latest_sermon_url     TEXT,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by            TEXT
);

-- 6) Sermons
CREATE TABLE sermons (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  description    TEXT,
  speaker        TEXT,
  date           TIMESTAMPTZ NOT NULL,
  video_url      TEXT,
  audio_url      TEXT,
  thumbnail_url  TEXT,
  duration       INTEGER,
  views          INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by     TEXT
);
CREATE INDEX idx_sermons_date ON sermons (date DESC);

-- 7) Leaders
CREATE TABLE leaders (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  title          TEXT NOT NULL,
  bio            TEXT,
  photo_url      TEXT,
  facebook_url   TEXT,
  instagram_url  TEXT,
  twitter_url    TEXT,
  order_index    INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by     TEXT
);
CREATE INDEX idx_leaders_order_index ON leaders (order_index);

-- 8) Update links
CREATE TABLE update_links (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  url           TEXT NOT NULL,
  description   TEXT DEFAULT '',
  category      TEXT NOT NULL DEFAULT 'General',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  order_index   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by    TEXT
);
CREATE INDEX idx_update_links_active_order ON update_links (is_active, order_index);

-- 9) Admins
CREATE TABLE admins (
  id              TEXT PRIMARY KEY,
  username        TEXT NOT NULL UNIQUE,
  email           TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  full_name       TEXT,
  role            TEXT NOT NULL DEFAULT 'admin',
  is_super_admin  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10) Photos
CREATE TABLE photos (
  id             TEXT PRIMARY KEY,
  filename       TEXT NOT NULL,
  original_name  TEXT NOT NULL,
  url            TEXT NOT NULL,
  size           INTEGER NOT NULL DEFAULT 0,
  category       TEXT DEFAULT 'general',
  upload_date    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by     TEXT
);
CREATE INDEX idx_photos_category_upload_date ON photos (category, upload_date DESC);

-- 11) Visitor requests
CREATE TABLE visitor_requests (
  id                TEXT PRIMARY KEY,
  full_name         TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT,
  service           TEXT NOT NULL,
  how_did_you_hear  TEXT,
  prayer_request    TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_visitor_requests_created_at ON visitor_requests (created_at DESC);

-- 12) Give settings
CREATE TABLE give_settings (
  id                   TEXT PRIMARY KEY,
  paybill_number       TEXT NOT NULL DEFAULT '400222',
  account_number       TEXT NOT NULL DEFAULT '1756443',
  account_suffixes     TEXT[] DEFAULT ARRAY['#offering/tithe', '#missions', '#building'],
  bank_name            TEXT,
  bank_account_name    TEXT,
  bank_account_number  TEXT,
  bank_branch          TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13) Carousel slides
CREATE TABLE carousel_slides (
  id              TEXT PRIMARY KEY,
  page            TEXT NOT NULL DEFAULT 'home',
  image_url       TEXT NOT NULL,
  label           TEXT,
  headline        TEXT NOT NULL,
  scripture_text  TEXT,
  scripture_ref   TEXT,
  cta_text        TEXT,
  cta_link        TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_carousel_page_active_order ON carousel_slides (page, is_active, display_order);

-- 14) Scripture library
CREATE TABLE scripture_library (
  id          TEXT PRIMARY KEY,
  theme       TEXT NOT NULL,
  verse_text  TEXT NOT NULL,
  reference   TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15) Generation groups
CREATE TABLE generation_groups (
  id              TEXT PRIMARY KEY,
  group_name      TEXT NOT NULL,
  image_url       TEXT NOT NULL,
  scripture_text  TEXT,
  scripture_ref   TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_generation_groups_order ON generation_groups (display_order);

-- 16) Testimonials
CREATE TABLE testimonials (
  id            TEXT PRIMARY KEY,
  author_name   TEXT NOT NULL,
  title         TEXT,
  message       TEXT NOT NULL,
  image_url     TEXT,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  order_index   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_testimonials_published_order ON testimonials (is_published, order_index);

-- 17) Optional seed data (leaders)
-- Keep this in the full schema so one script can initialize everything.
INSERT INTO leaders (
  id,
  name,
  title,
  bio,
  photo_url,
  order_index,
  updated_at
) VALUES
  (
    'erastus-kwaka',
    'Bishop Erastus Kwaka',
    'Bishop · FCPA',
    'Bishop Erastus Kwaka is regarded across VOSH Church International Kitengela as a gift to this generation — a life model of faith, integrity, and excellence, and a blessing to the community.',
    '/bishop-erastus-kwaka.png',
    0,
    now()
  ),
  (
    'evans-kochoo',
    'Rev. Evans O. Kochoo',
    'Senior Pastor',
    'I am Evans O. Kochoo, fondly known as The Eagle, a passionate servant of God driven by a dynamic apostolic mandate to disseminate the pure and unadulterated Gospel of Jesus Christ.',
    '/Rev.Evans1.jpeg',
    1,
    now()
  ),
  (
    'pastor-nancy-sai',
    'Pastor Nancy Sai',
    'Assistant Pastor',
    'Pastor Nancy Sai serves as the Assistant Pastor at Kitengela VOSH International Church. She is passionate about advancing God''s Kingdom through sound teaching, servant leadership, and community impact.',
    '/PastorNancySai.jpeg',
    2,
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  photo_url = EXCLUDED.photo_url,
  order_index = EXCLUDED.order_index,
  updated_at = now();

-- 18) RLS policies aligned with app functionality
-- Public pages need read-only access on content tables.
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermon_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE give_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripture_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read site_settings" ON site_settings;
CREATE POLICY "public read site_settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read programs" ON programs;
CREATE POLICY "public read programs" ON programs FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read events" ON events;
CREATE POLICY "public read events" ON events FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read live_streams" ON live_streams;
CREATE POLICY "public read live_streams" ON live_streams FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read sermon_sources" ON sermon_sources;
CREATE POLICY "public read sermon_sources" ON sermon_sources FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read sermons" ON sermons;
CREATE POLICY "public read sermons" ON sermons FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read leaders" ON leaders;
CREATE POLICY "public read leaders" ON leaders FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read update_links" ON update_links;
CREATE POLICY "public read update_links" ON update_links FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read photos" ON photos;
CREATE POLICY "public read photos" ON photos FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read give_settings" ON give_settings;
CREATE POLICY "public read give_settings" ON give_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read carousel_slides" ON carousel_slides;
CREATE POLICY "public read carousel_slides" ON carousel_slides FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read scripture_library" ON scripture_library;
CREATE POLICY "public read scripture_library" ON scripture_library FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read generation_groups" ON generation_groups;
CREATE POLICY "public read generation_groups" ON generation_groups FOR SELECT USING (true);
DROP POLICY IF EXISTS "public read testimonials" ON testimonials;
CREATE POLICY "public read testimonials" ON testimonials FOR SELECT USING (true);

-- Admin and visitor tables are API/service-role managed only.
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_requests ENABLE ROW LEVEL SECURITY;

-- Realtime publication for photos table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_publication
    WHERE pubname = 'supabase_realtime'
  ) THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE photos;
    EXCEPTION
      WHEN duplicate_object THEN
        NULL;
    END;
  END IF;
END $$;

COMMIT;
