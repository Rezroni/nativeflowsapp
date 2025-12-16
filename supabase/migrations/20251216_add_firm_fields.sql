-- Add new fields to firms table
ALTER TABLE public.firms
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS years_in_operation INTEGER,
ADD COLUMN IF NOT EXISTS max_allocations TEXT,
ADD COLUMN IF NOT EXISTS promo TEXT;
