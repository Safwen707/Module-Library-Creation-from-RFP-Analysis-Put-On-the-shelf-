-- Seed data for recruitment optimization

-- Insert skills requirements
INSERT INTO skills_requirements (rfp_analysis_id, skill_name, skill_level, urgency, project_duration, workload, business_impact, modules) VALUES
(1, 'AI/ML Engineer', 'Senior', 'Immediate', 16, 100, 'Critical', '["AI/ML Processing Engine", "Predictive Analytics", "Model Training"]'),
(1, 'Blockchain Developer', 'Expert', 'Short-term', 18, 80, 'High', '["Blockchain Integration", "Smart Contracts", "Crypto Wallet"]'),
(1, 'IoT Specialist', 'Senior', 'Immediate', 12, 100, 'Critical', '["IoT Device Gateway", "Protocol Handlers", "Device Management"]'),
(1, 'DevOps Engineer', 'Senior', 'Immediate', 24, 75, 'High', '["Cloud Infrastructure", "CI/CD Pipeline", "Monitoring"]'),
(1, 'Security Architect', 'Expert', 'Short-term', 15, 60, 'Critical', '["Advanced Security", "Compliance Module", "Threat Detection"]'),
(1, 'Mobile Developer', 'Mid-level', 'Long-term', 8, 100, 'Medium', '["Mobile App Backend", "Push Notifications", "Offline Sync"]');

-- Insert module details for existing modules
INSERT INTO module_details (module_id, current_version, required_version, priority, business_impact, technical_details, dependencies) VALUES
(1, '2.1.0', '2.1.0', 'High', 'Critical for user security and access control', 'Supports OAuth 2.0, JWT tokens, MFA, LDAP integration', '["Database Module", "Encryption Module"]'),
(2, '1.8.2', '1.8.2', 'High', 'Essential for transaction processing and revenue', 'PCI DSS compliant, supports Stripe, PayPal, bank transfers', '["Security Module", "Audit Module"]'),
(3, '1.5.0', '2.0.0', 'High', 'Critical for real-time user engagement', 'WebSocket connections, push notifications, message queuing', '["WebSocket Server", "Push Service"]'),
(4, '1.2.0', '2.5.0', 'Medium', 'Essential for business intelligence and decision making', 'Chart.js integration, data export, real-time updates', '["Data Pipeline", "Visualization Engine"]'),
(5, '2.0.1', '2.0.1', 'Medium', 'Enables document management and file sharing', 'Supports AWS S3, Azure Blob, virus scanning, compression', '["Cloud Storage", "Security Module"]');

-- Update module details with update/creation reasons
UPDATE module_details SET 
    update_reason = 'Need to add mobile push notifications and improve scalability',
    estimated_effort = '3-4 weeks'
WHERE module_id = 3;

UPDATE module_details SET 
    update_reason = 'Requires modern visualization library and real-time data streaming',
    estimated_effort = '6-8 weeks'
WHERE module_id = 4;

-- Insert contract options for AI/ML Engineer
INSERT INTO contract_options (skill_requirement_id, contract_type, monthly_cost, setup_cost, benefits, social_charges, total_monthly_cost, total_project_cost, is_optimal, advantages, disadvantages, best_for) VALUES
(1, 'CDI', 6667, 5000, 1000, 3000, 10667, 175672, false, 
 '["Long-term commitment", "Knowledge retention", "Team integration", "Lower hourly cost for long projects", "Loyalty and dedication"]',
 '["High social charges (45%)", "Difficult to terminate", "Benefits and vacation costs", "Training investment risk", "Fixed cost regardless of workload"]',
 '["Long-term projects (>18 months)", "Core team positions", "Knowledge-critical roles"]'),

(1, 'CDD', 6667, 2000, 667, 2800, 10134, 164144, false,
 '["Fixed duration contract", "Lower social charges than CDI", "Easier to end contract", "Good for specific projects", "Less long-term commitment"]',
 '["Still significant social charges", "Limited contract duration", "Potential conversion to CDI", "Benefits still required", "May leave before project end"]',
 '["Medium-term projects (6-18 months)", "Specific expertise needs", "Project-based work"]'),

(1, 'Consultant', 20900, 500, 0, 0, 20900, 135400, true,
 '["No social charges (0%)", "No benefits required", "Immediate availability", "Specialized expertise", "Easy to terminate", "Pay only for work done"]',
 '["Higher daily rate", "No long-term commitment", "Knowledge leaves with consultant", "Less team integration", "Potential availability issues"]',
 '["Short-term projects (<12 months)", "Specialized expertise", "Urgent needs", "Part-time work"]');

-- Insert recruitment plan
INSERT INTO recruitment_plans (rfp_analysis_id, plan_name, total_cost, total_duration, skills_breakdown, contract_mix, optimization_notes) VALUES
(1, 'Optimized RFP Recruitment Plan', 890000, 24, 
 '{"ai_ml_engineer": {"type": "Consultant", "cost": 135400}, "blockchain_developer": {"type": "CDD", "cost": 145000}, "iot_specialist": {"type": "Consultant", "cost": 120000}, "devops_engineer": {"type": "CDI", "cost": 280000}, "security_architect": {"type": "Consultant", "cost": 110000}, "mobile_developer": {"type": "CDD", "cost": 99600}}',
 '{"CDI": 1, "CDD": 2, "Consultant": 3}',
 'Optimized for cost-effectiveness while considering project duration and urgency. Consultants recommended for specialized short-term needs, CDI for long-term DevOps role, CDD for medium-term development work.');

-- Insert extended contract options for Blockchain Developer (Expert level, 18 months)
INSERT INTO contract_options (skill_requirement_id, contract_type, monthly_cost, setup_cost, benefits, social_charges, total_monthly_cost, total_project_cost, is_optimal, advantages, disadvantages, best_for) VALUES
-- Expert Mission for Blockchain Developer
(2, 'Expert_Mission', 31350, 200, 0, 0, 31350, 188300, false,
 '["Immediate availability", "World-class expertise", "No long-term commitment", "Rapid problem solving", "Knowledge transfer focused", "Premium quality delivery"]',
 '["Very high daily rate", "Limited availability window", "Minimal team integration", "Knowledge transfer required", "May not understand company context"]',
 '["Critical urgent issues", "Very specialized problems", "Knowledge transfer missions", "Architecture reviews"]'),

-- Internal Transfer for Blockchain Developer  
(2, 'Internal_Transfer', 8333, 1000, 1250, 3750, 13333, 241994, false,
 '["Already knows company culture", "Fast integration", "Existing security clearances", "Known performance history", "Internal knowledge retention"]',
 '["May lack specific expertise", "Creates gap in original team", "Potential internal conflicts", "Limited external perspective"]',
 '["When internal talent is available", "Company-specific knowledge needed", "Fast team integration required"]'),

-- Exchange Program for Blockchain Developer
(2, 'Exchange_Program', 6667, 3000, 833, 2083, 9583, 175494, true,
 '["Cost-effective through partnerships", "Fresh external perspective", "Cross-industry knowledge", "Reduced social charges", "Cultural exchange benefits"]',
 '["Limited availability", "Program coordination overhead", "Potential cultural differences", "Fixed program duration", "May require reciprocal exchange"]',
 '["Innovation projects", "Cross-industry expertise needed", "Cultural transformation", "Partnership strengthening"]'),

-- Freelancer for Mobile Developer
(6, 'Freelancer', 9680, 100, 0, 0, 9680, 77540, true,
 '["Very flexible engagement", "Lower cost than consultants", "Immediate availability", "Task-specific expertise", "No long-term commitment"]',
 '["Variable quality", "Limited availability guarantee", "Minimal team integration", "Communication challenges", "Time zone differences possible"]',
 '["Small specific tasks", "Prototype development", "Design work", "Content creation", "Testing and QA"]'),

-- Interim Manager for DevOps Engineer (leadership role)
(4, 'Interim_Manager', 29700, 2000, 0, 0, 29700, 536800, false,
 '["Immediate leadership", "Change management expertise", "No long-term commitment", "Crisis management skills", "Objective perspective"]',
 '["Very high cost", "Temporary solution only", "May not align with culture", "Team acceptance challenges", "Limited long-term vision"]',
 '["Leadership gaps", "Crisis management", "Transformation projects", "Interim positions", "Change management"]');

-- Update recruitment plan with extended options
UPDATE recruitment_plans SET 
    skills_breakdown = '{"ai_ml_engineer": {"type": "Consultant", "cost": 135400}, "blockchain_developer": {"type": "Exchange_Program", "cost": 175494}, "iot_specialist": {"type": "Expert_Mission", "cost": 95000}, "devops_engineer": {"type": "CDI", "cost": 280000}, "security_architect": {"type": "Internal_Transfer", "cost": 165000}, "mobile_developer": {"type": "Freelancer", "cost": 77540}}',
    contract_mix = '{"CDI": 1, "CDD": 0, "Consultant": 1, "Expert_Mission": 1, "Internal_Transfer": 1, "Exchange_Program": 1, "Freelancer": 1}',
    total_cost = 928434,
    optimization_notes = 'Optimized mix using extended recruitment options: Exchange Program for blockchain (cost-effective), Expert Mission for IoT (urgent specialized need), Internal Transfer for security (fast integration), Freelancer for mobile (flexible task-based work). 15% cost reduction vs traditional approach.'
WHERE id = 1;

-- Insert additional skill requirements to demonstrate variety
INSERT INTO skills_requirements (rfp_analysis_id, skill_name, skill_level, urgency, project_duration, workload, business_impact, modules) VALUES
(1, 'UX/UI Designer', 'Mid-level', 'Short-term', 6, 80, 'Medium', '["User Interface", "Design System", "User Experience"]'),
(1, 'Data Scientist', 'Senior', 'Immediate', 10, 90, 'High', '["Data Analytics", "Machine Learning", "Statistical Analysis"]'),
(1, 'Project Manager', 'Senior', 'Immediate', 18, 60, 'High', '["Project Coordination", "Team Management", "Stakeholder Communication"]');
