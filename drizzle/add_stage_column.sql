-- Add stage column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS stage VARCHAR(50) DEFAULT 'new';

-- Set initial stage value based on existing status
UPDATE leads SET stage = CASE 
  WHEN status = 'new' THEN 'new'
  WHEN status = 'contacted' THEN 'contacted'
  WHEN status = 'qualified' THEN 'qualified'
  WHEN status = 'converted' THEN 'won'
  ELSE 'new'
END WHERE stage IS NULL OR stage = '';

COMMENT ON COLUMN leads.stage IS 'Pipeline stage: new, contacted, qualified, proposal, won, lost';
