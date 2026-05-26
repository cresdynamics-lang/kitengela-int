-- Optional: copy the original website leaders into Supabase so admin can edit them.
-- Safe to run multiple times (skips if the same IDs already exist).

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
ON CONFLICT (id) DO NOTHING;
