ALTER TABLE public.moments
  ADD COLUMN category text null,
  ADD CONSTRAINT moments_category_check CHECK (
    category = ANY (ARRAY['food'::text, 'fun'::text, 'other'::text])
  );
