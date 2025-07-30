-- Seed data for RFP Analysis Platform

-- Insert sample modules
INSERT INTO modules (name, description, category, version, status, complexity, reusability_score, created_by) VALUES
('User Authentication Module', 'Complete authentication system with OAuth, JWT, and multi-factor authentication', 'Security', '2.1.0', 'active', 'Medium', 95, 'system'),
('Payment Processing Gateway', 'Secure payment processing with multiple payment providers integration', 'Finance', '1.8.2', 'active', 'High', 88, 'system'),
('Real-time Notification System', 'WebSocket-based notification system with push notifications', 'Communication', '1.5.0', 'needs_update', 'Medium', 92, 'system'),
('Data Analytics Dashboard', 'Interactive dashboard with charts, filters, and export capabilities', 'Analytics', '1.2.0', 'deprecated', 'High', 75, 'system'),
('File Upload & Management', 'Secure file upload with cloud storage integration and file processing', 'Storage', '2.0.1', 'active', 'Low', 98, 'system'),
('API Gateway Module', 'Centralized API management with rate limiting and authentication', 'Infrastructure', '1.9.0', 'active', 'High', 85, 'system'),
('Email Service Module', 'Email sending service with templates and tracking', 'Communication', '1.6.3', 'active', 'Low', 90, 'system'),
('Database Connection Pool', 'Optimized database connection management', 'Database', '2.2.0', 'active', 'Medium', 94, 'system'),
('Logging & Monitoring', 'Comprehensive logging and application monitoring', 'Infrastructure', '1.7.1', 'needs_update', 'Medium', 87, 'system'),
('Search Engine Module', 'Full-text search with indexing and filtering', 'Search', '1.4.0', 'active', 'High', 82, 'system');

-- Insert sample RFP document
INSERT INTO rfp_documents (title, file_name, file_path, file_size, created_by) VALUES
('Enterprise CRM System RFP', 'enterprise-crm-rfp.pdf', '/uploads/enterprise-crm-rfp.pdf', 2048576, 'admin');

-- Insert sample analysis result
INSERT INTO rfp_analysis (rfp_document_id, total_requirements, existing_modules, modules_to_modify, new_modules_needed, completion_percentage, analysis_data) VALUES
(1, 45, 28, 8, 9, 62.22, '{"technical_requirements": ["Cloud Architecture", "AI/ML Integration", "Microservices"], "functional_requirements": ["Advanced Analytics", "Real-time Processing"], "compliance_requirements": ["GDPR", "SOX", "HIPAA"]}');

-- Insert gap analysis data
INSERT INTO gap_analysis (rfp_analysis_id, gap_type, gap_name, priority, description) VALUES
(1, 'technical', 'Cloud Architecture', 'high', 'Need cloud-native architecture for scalability'),
(1, 'technical', 'AI/ML Integration', 'high', 'Machine learning capabilities for predictive analytics'),
(1, 'technical', 'Microservices', 'medium', 'Microservices architecture for better modularity'),
(1, 'functional', 'Advanced Analytics', 'high', 'Advanced reporting and analytics capabilities'),
(1, 'functional', 'Real-time Processing', 'medium', 'Real-time data processing and notifications'),
(1, 'skills', 'DevOps Engineer', 'high', 'Need DevOps expertise for cloud deployment'),
(1, 'skills', 'Data Scientist', 'high', 'Machine learning and data analysis expertise'),
(1, 'skills', 'Solution Architect', 'medium', 'System architecture and design expertise');

-- Insert recommendations
INSERT INTO recommendations (rfp_analysis_id, type, title, description, priority, impact, effort, timeline, status) VALUES
(1, 'module_creation', 'Create Cloud Infrastructure Module', 'Develop a comprehensive cloud deployment and scaling module', 'high', 'High', 'Medium', '4-6 weeks', 'pending'),
(1, 'skill_acquisition', 'Hire AI/ML Specialist', 'Recruit a machine learning specialist for AI-driven features', 'high', 'High', 'High', '8-12 weeks', 'pending'),
(1, 'module_update', 'Upgrade Authentication Module', 'Update existing authentication module for advanced security', 'medium', 'Medium', 'Low', '2-3 weeks', 'pending'),
(1, 'process_improvement', 'Implement Automated Testing', 'Set up comprehensive automated testing pipeline', 'medium', 'Medium', 'Medium', '3-4 weeks', 'pending'),
(1, 'training', 'Team Training on New Technologies', 'Provide training on emerging technologies', 'low', 'Medium', 'Low', '2-4 weeks', 'pending');

-- Insert skills required for recommendations
INSERT INTO skills_required (recommendation_id, skill_name, skill_level, is_available) VALUES
(1, 'DevOps Engineer', 'Senior', FALSE),
(1, 'Cloud Architect', 'Senior', FALSE),
(2, 'Machine Learning Engineer', 'Senior', FALSE),
(2, 'Data Scientist', 'Mid-level', FALSE),
(3, 'Security Engineer', 'Senior', TRUE),
(3, 'Backend Developer', 'Mid-level', TRUE),
(4, 'QA Engineer', 'Senior', TRUE),
(4, 'DevOps Engineer', 'Mid-level', FALSE),
(5, 'All team members', 'Various', TRUE);

-- Insert module dependencies
INSERT INTO module_dependencies (module_id, depends_on_module_id, dependency_type) VALUES
(2, 1, 'authentication'), -- Payment Gateway depends on Authentication
(3, 1, 'user_management'), -- Notification System depends on Authentication
(4, 8, 'data_access'), -- Analytics Dashboard depends on Database Connection Pool
(5, 1, 'access_control'), -- File Upload depends on Authentication
(6, 1, 'security'), -- API Gateway depends on Authentication
(7, 1, 'user_identification'); -- Email Service depends on Authentication
