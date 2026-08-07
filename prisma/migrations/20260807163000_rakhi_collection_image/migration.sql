-- Point the Rakhi collection at the real artwork (rakhi.png) instead of the
-- placeholder path seeded by 20260807120000_add_rakhi_collection.
--
-- Deliberately narrow: matches only the rakhi row AND only while it still
-- holds the exact placeholder value. If someone has since set a different
-- image from the admin panel, that value is left alone. Safe to re-run.
UPDATE "collections"
SET "image" = '/images/collections/rakhi.png'
WHERE "slug" = 'rakhi'
  AND "image" = '/images/collections/rakhi.jpg';
