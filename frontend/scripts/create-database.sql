-- Create database schema for RFP Analysis Platform

-- RFP Documents table
CREATE TABLE IF NOT EXISTS rfp_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analysis_status VARCHAR(50) DEFAULT 'pending',
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    complexity VARCHAR(20),
    reusability_score INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- RFP Analysis Results table
CREATE TABLE IF NOT EXISTS rfp_analysis (
    id SERIAL PRIMARY KEY,
    rfp_document_id INTEGER REFERENCES rfp_documents(id),
    total_requirements INTEGER DEFAULT 0,
    existing_modules INTEGER DEFAULT 0,
    modules_to_modify INTEGER DEFAULT 0,
    new_modules_needed INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analysis_data JSONB
);

-- Gap Analysis table
CREATE TABLE IF NOT EXISTS gap_analysis (
    id SERIAL PRIMARY KEY,
    rfp_analysis_id INTEGER REFERENCES rfp_analysis(id),
    gap_type VARCHAR(50), -- 'technical', 'functional', 'skills'
    gap_name VARCHAR(255),
    priority VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    rfp_analysis_id INTEGER REFERENCES rfp_analysis(id),
    type VARCHAR(50), -- 'module_creation', 'skill_acquisition', 'module_update', etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20),
    impact VARCHAR(20),
    effort VARCHAR(20),
    timeline VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills Required table
CREATE TABLE IF NOT EXISTS skills_required (
    id SERIAL PRIMARY KEY,
    recommendation_id INTEGER REFERENCES recommendations(id),
    skill_name VARCHAR(255),
    skill_level VARCHAR(50),
    is_available BOOLEAN DEFAULT FALSE
);

-- Module Dependencies table
CREATE TABLE IF NOT EXISTS module_dependencies (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id),
    depends_on_module_id INTEGER REFERENCES modules(id),
    dependency_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rfp_documents_status ON rfp_documents(analysis_status);
CREATE INDEX IF NOT EXISTS idx_modules_category ON modules(category);
CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);
CREATE INDEX IF NOT EXISTS idx_gap_analysis_type ON gap_analysis(gap_type);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_recommendations_type ON recommendations(type);
