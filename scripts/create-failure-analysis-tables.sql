-- Create additional tables for failure analysis and cost estimation

-- Failed RFPs table
CREATE TABLE IF NOT EXISTS failed_rfps (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    value BIGINT NOT NULL,
    lost_date DATE NOT NULL,
    failure_reasons JSONB,
    missing_modules JSONB,
    competitor_advantages JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Failure Patterns table
CREATE TABLE IF NOT EXISTS failure_patterns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sector VARCHAR(50), -- technical, functional, process, commercial
    frequency INTEGER DEFAULT 0,
    avg_loss_value BIGINT DEFAULT 0,
    prevention_cost INTEGER DEFAULT 0,
    missing_modules JSONB,
    examples JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module Costs table
CREATE TABLE IF NOT EXISTS module_costs (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id),
    base_cost INTEGER NOT NULL,
    complexity VARCHAR(20), -- Low, Medium, High
    development_time INTEGER, -- in weeks
    team_size INTEGER,
    risk_factor DECIMAL(3,2),
    dependencies JSONB,
    estimated_cost INTEGER,
    confidence_level INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cost Estimation History table
CREATE TABLE IF NOT EXISTS cost_estimations (
    id SERIAL PRIMARY KEY,
    rfp_analysis_id INTEGER REFERENCES rfp_analysis(id),
    selected_modules JSONB,
    total_base_cost INTEGER,
    total_estimated_cost INTEGER,
    adjustment_factors JSONB,
    final_cost INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- Pattern Occurrences table (to track when patterns appear in RFPs)
CREATE TABLE IF NOT EXISTS pattern_occurrences (
    id SERIAL PRIMARY KEY,
    rfp_analysis_id INTEGER REFERENCES rfp_analysis(id),
    pattern_id INTEGER REFERENCES failure_patterns(id),
    pattern_type VARCHAR(20), -- win, lose
    confidence_score DECIMAL(3,2),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_failed_rfps_sector ON failed_rfps(sector);
CREATE INDEX IF NOT EXISTS idx_failed_rfps_lost_date ON failed_rfps(lost_date);
CREATE INDEX IF NOT EXISTS idx_failure_patterns_sector ON failure_patterns(sector);
CREATE INDEX IF NOT EXISTS idx_failure_patterns_frequency ON failure_patterns(frequency);
CREATE INDEX IF NOT EXISTS idx_module_costs_complexity ON module_costs(complexity);
CREATE INDEX IF NOT EXISTS idx_pattern_occurrences_type ON pattern_occurrences(pattern_type);
