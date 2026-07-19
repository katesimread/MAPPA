-- Adds the new category set while keeping the old values valid, since
-- existing rows may already use 'food' or 'fun' and this constraint
-- validates all existing rows when added.
ALTER TABLE public.moments
  DROP CONSTRAINT moments_category_check,
  ADD CONSTRAINT moments_category_check CHECK (
    category = ANY (
      ARRAY[
        'food'::text,
        'fun'::text,
        'other'::text,
        'housing'::text,
        'english-lessons'::text,
        'supplies'::text,
        'skills'::text,
        'legal-support'::text
      ]
    )
  );
