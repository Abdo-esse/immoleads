-- ═══════════════════════════════════════════
-- Migration 012: Agency Performance Settings
-- Adds commission rates, agent share, and monthly goals
-- ═══════════════════════════════════════════

-- Commission settings
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5,2) DEFAULT 2.5;
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS agent_share NUMERIC(5,2) DEFAULT 40.0;

-- Monthly goals
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS monthly_lead_goal INTEGER DEFAULT 0;
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS monthly_won_goal INTEGER DEFAULT 0;
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS monthly_revenue_goal NUMERIC(15,2) DEFAULT 0;

COMMENT ON COLUMN agencies.commission_rate IS 'Agency commission rate in % (e.g. 2.5 = 2.5% of sale price)';
COMMENT ON COLUMN agencies.agent_share IS 'Agent share of agency commission in % (e.g. 40 = agent gets 40% of agency commission)';
COMMENT ON COLUMN agencies.monthly_lead_goal IS 'Monthly target: number of qualified leads';
COMMENT ON COLUMN agencies.monthly_won_goal IS 'Monthly target: number of won deals';
COMMENT ON COLUMN agencies.monthly_revenue_goal IS 'Monthly target: total revenue in MAD';
