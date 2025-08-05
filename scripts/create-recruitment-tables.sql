-- Create tables for recruitment optimization

-- Skills Requirements table
CREATE TABLE IF NOT EXISTS skills_requirements (
    id SERIAL PRIMARY KEY,
    rfp_analysis_id INTEGER REFERENCES rfp_analysis(id),
    skill_name VARCHAR(255) NOT NULL,
    skill_level VARCHAR(50), -- Junior, Mid-level, Senior, Expert
    urgency VARCHAR(50), -- Immediate, Short-term, Long-term
    project_duration INTEGER, -- in months
    workload INTEGER, -- percentage of full-time
    business_impact VARCHAR(50), -- Critical, High, Medium, Low
    modules JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contract Options table
CREATE TABLE IF NOT EXISTS contract_options (
    id SERIAL PRIMARY KEY,
    skill_requirement_id INTEGER REFERENCES skills_requirements(id),
    contract_type VARCHAR(20), -- CDI, CDD, Consultant
    monthly_cost INTEGER,
    setup_cost INTEGER,
    benefits INTEGER,
    social_charges INTEGER,
    total_monthly_cost INTEGER,
    total_project_cost INTEGER,
    advantages JSONB,
    disadvantages JSONB,
    best_for JSONB,
    is_optimal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module Details table (for detailed breakdown)
CREATE TABLE IF NOT EXISTS module_details (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id),
    current_version VARCHAR(50),
    required_version VARCHAR(50),
    estimated_effort VARCHAR(50),
    priority VARCHAR(20), -- High, Medium, Low
    business_impact TEXT,
    technical_details TEXT,
    update_reason TEXT,
    creation_reason TEXT,
    dependencies JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recruitment Plans table
CREATE TABLE IF NOT EXISTS recruitment_plans (
    id SERIAL PRIMARY KEY,
    rfp_analysis_id INTEGER REFERENCES rfp_analysis(id),
    plan_name VARCHAR(255),
    total_cost INTEGER,
    total_duration INTEGER, -- in months
    skills_breakdown JSONB,
    contract_mix JSONB, -- CDI, CDD, Consultant counts
    optimization_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_skills_requirements_urgency ON skills_requirements(urgency);
CREATE INDEX IF NOT EXISTS idx_skills_requirements_level ON skills_requirements(skill_level);
CREATE INDEX IF NOT EXISTS idx_contract_options_type ON contract_options(contract_type);
CREATE INDEX IF NOT EXISTS idx_contract_options_optimal ON contract_options(is_optimal);
CREATE INDEX IF NOT EXISTS idx_module_details_priority ON module_details(priority);
