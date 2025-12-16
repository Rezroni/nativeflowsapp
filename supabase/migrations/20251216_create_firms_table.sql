-- Create firms table for broker/firm comparisons
CREATE TABLE IF NOT EXISTS public.firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,

  -- Ratings (out of 5)
  overall_rating DECIMAL(2,1) CHECK (overall_rating >= 0 AND overall_rating <= 5),
  platform_rating DECIMAL(2,1) CHECK (platform_rating >= 0 AND platform_rating <= 5),
  execution_rating DECIMAL(2,1) CHECK (execution_rating >= 0 AND execution_rating <= 5),
  support_rating DECIMAL(2,1) CHECK (support_rating >= 0 AND support_rating <= 5),
  fees_rating DECIMAL(2,1) CHECK (fees_rating >= 0 AND fees_rating <= 5),

  -- Financial Details
  minimum_deposit DECIMAL(10,2),
  minimum_deposit_currency TEXT DEFAULT 'USD',
  maximum_leverage TEXT, -- e.g., "1:500", "1:30"
  spreads_from DECIMAL(4,2), -- e.g., 0.0 for zero spreads

  -- Features (stored as JSONB for flexibility)
  features JSONB DEFAULT '[]'::jsonb, -- Array of feature objects: [{name: "Feature", available: true, icon: "check"}]

  -- Trading Information
  trading_platforms TEXT[], -- e.g., ["MT4", "MT5", "cTrader", "Proprietary"]
  markets TEXT[], -- e.g., ["Forex", "Stocks", "Crypto", "Commodities"]
  regulation TEXT[], -- e.g., ["FCA", "ASIC", "CySEC"]
  account_types TEXT[], -- e.g., ["Standard", "ECN", "Islamic"]

  -- Badges and Highlights
  badges JSONB DEFAULT '[]'::jsonb, -- Array of badge objects: [{text: "Best for Beginners", variant: "success"}]
  is_featured BOOLEAN DEFAULT false,
  is_top_rated BOOLEAN DEFAULT false,

  -- Additional Information
  pros JSONB DEFAULT '[]'::jsonb, -- Array of strings
  cons JSONB DEFAULT '[]'::jsonb, -- Array of strings

  -- Social Proof
  review_count INTEGER DEFAULT 0,
  user_count TEXT, -- e.g., "2.5M+" for display purposes

  -- Status and Ordering
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INTEGER DEFAULT 0, -- For custom sorting

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_firms_status ON public.firms(status);
CREATE INDEX idx_firms_slug ON public.firms(slug);
CREATE INDEX idx_firms_display_order ON public.firms(display_order);
CREATE INDEX idx_firms_is_featured ON public.firms(is_featured) WHERE is_featured = true;
CREATE INDEX idx_firms_overall_rating ON public.firms(overall_rating DESC);
CREATE INDEX idx_firms_created_at ON public.firms(created_at DESC);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_firms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_firms_updated_at
  BEFORE UPDATE ON public.firms
  FOR EACH ROW
  EXECUTE FUNCTION update_firms_updated_at();

-- Enable Row Level Security
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public read access for published firms
CREATE POLICY "Public read access for published firms"
  ON public.firms
  FOR SELECT
  TO public
  USING (status = 'published');

-- Admins can view all firms (including drafts)
CREATE POLICY "Admins can view all firms"
  ON public.firms
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Admins can insert firms
CREATE POLICY "Admins can insert firms"
  ON public.firms
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Admins can update firms
CREATE POLICY "Admins can update firms"
  ON public.firms
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Admins can delete firms
CREATE POLICY "Admins can delete firms"
  ON public.firms
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Add some sample data for testing
INSERT INTO public.firms (
  name, slug, logo_url, description, website_url,
  overall_rating, platform_rating, execution_rating, support_rating, fees_rating,
  minimum_deposit, maximum_leverage, spreads_from,
  features, trading_platforms, markets, regulation, account_types,
  badges, is_featured, is_top_rated,
  pros, cons, review_count, user_count, status, display_order
) VALUES (
  'Example Broker',
  'example-broker',
  'https://via.placeholder.com/150',
  'A leading global broker offering forex, stocks, and crypto trading with competitive spreads.',
  'https://example.com',
  4.8, 4.9, 4.7, 4.8, 4.6,
  100.00, '1:500', 0.0,
  '[
    {"name": "Zero Spreads", "available": true},
    {"name": "MT4/MT5", "available": true},
    {"name": "Copy Trading", "available": true},
    {"name": "Islamic Accounts", "available": true},
    {"name": "Demo Account", "available": true},
    {"name": "24/7 Support", "available": false}
  ]'::jsonb,
  ARRAY['MT4', 'MT5', 'cTrader'],
  ARRAY['Forex', 'Stocks', 'Crypto', 'Commodities'],
  ARRAY['FCA', 'ASIC', 'CySEC'],
  ARRAY['Standard', 'ECN', 'VIP', 'Islamic'],
  '[
    {"text": "Best for Beginners", "variant": "secondary"},
    {"text": "Top Rated", "variant": "default"}
  ]'::jsonb,
  true, true,
  '["Low minimum deposit", "Excellent platform", "Multiple account types", "Fast execution"]'::jsonb,
  '["Limited cryptocurrencies", "No US clients"]'::jsonb,
  1247, '2.5M+', 'published', 1
);

-- Grant necessary permissions
GRANT SELECT ON public.firms TO anon, authenticated;
GRANT ALL ON public.firms TO authenticated;

COMMENT ON TABLE public.firms IS 'Stores broker/firm information for comparison feature';
COMMENT ON COLUMN public.firms.features IS 'JSONB array of feature objects with name and available status';
COMMENT ON COLUMN public.firms.badges IS 'JSONB array of badge objects with text and variant';
COMMENT ON COLUMN public.firms.pros IS 'JSONB array of strings listing advantages';
COMMENT ON COLUMN public.firms.cons IS 'JSONB array of strings listing disadvantages';
