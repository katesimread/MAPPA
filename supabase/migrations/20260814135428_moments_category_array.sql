-- Allow a moment to belong to more than one category. Existing single
-- category values are wrapped into a one-element array so no data is lost.
ALTER TABLE public.moments
  DROP CONSTRAINT moments_category_check;

ALTER TABLE public.moments
  ALTER COLUMN category TYPE text[] USING (
    CASE WHEN category IS NULL THEN NULL ELSE ARRAY[category] END
  );

ALTER TABLE public.moments
  ADD CONSTRAINT moments_category_check CHECK (
    category <@ ARRAY[
      'food'::text,
      'fun'::text,
      'other'::text,
      'housing'::text,
      'english-lessons'::text,
      'supplies'::text,
      'skills'::text,
      'legal-support'::text
    ]
  );
