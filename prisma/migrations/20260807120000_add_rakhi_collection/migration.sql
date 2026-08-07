-- Data migration: add the "Rakhi" collection so it shows on /collections.
--
-- Non-destructive by design: this only ever INSERTs. If a collection with slug
-- 'rakhi' already exists in the target database, ON CONFLICT DO NOTHING leaves
-- the existing row completely untouched (name, description, image, isActive,
-- sortOrder and any linked products are preserved). Safe to re-run.
INSERT INTO "collections" (
    "id",
    "name",
    "slug",
    "description",
    "image",
    "isActive",
    "sortOrder",
    "createdAt",
    "updatedAt"
)
VALUES (
    'clxrakhi00000000000000000',
    'Rakhi',
    'rakhi',
    'Rakhi thalis, sibling hampers, and personalized keepsakes for Raksha Bandhan.',
    '/images/collections/rakhi.jpg',
    true,
    7,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;
