-- Seed data for failure analysis and cost estimation

-- Insert failed RFPs
INSERT INTO failed_rfps (title, sector, value, lost_date, failure_reasons, missing_modules, competitor_advantages) VALUES
('Banking Digital Transformation', 'Finance', 3500000, '2024-01-15', 
 '["Lack of AI/ML capabilities", "No blockchain expertise", "Insufficient security measures"]',
 '["Real-time Fraud Detection", "Blockchain Integration", "Advanced Analytics"]',
 '["AI-powered fraud detection", "Blockchain payment system", "Real-time analytics"]'),

('Healthcare Management System', 'Healthcare', 2800000, '2024-02-03',
 '["No healthcare standards compliance", "Missing telemedicine features", "IoT integration gaps"]',
 '["FHIR Integration", "Telemedicine Platform", "Medical IoT Gateway"]',
 '["Full FHIR compliance", "Integrated telemedicine", "IoT device management"]'),

('Smart City Infrastructure', 'Government', 5200000, '2024-01-28',
 '["Limited IoT experience", "No AI traffic optimization", "Poor citizen engagement"]',
 '["IoT Sensor Network", "Traffic Management AI", "Citizen Portal"]',
 '["Comprehensive IoT platform", "AI-driven traffic control", "Mobile citizen app"]'),

('E-commerce Platform Modernization', 'Retail', 1800000, '2024-03-10',
 '["No real-time inventory", "Poor mobile experience", "Limited analytics"]',
 '["Real-time Inventory Management", "Mobile Commerce", "Customer Analytics"]',
 '["Real-time stock updates", "Native mobile apps", "Advanced customer insights"]'),

('Manufacturing ERP System', 'Manufacturing', 4200000, '2024-02-20',
 '["No IoT integration", "Limited supply chain visibility", "Poor reporting"]',
 '["Industrial IoT Gateway", "Supply Chain Analytics", "Executive Dashboard"]',
 '["Complete IoT integration", "End-to-end visibility", "Real-time reporting"]');

-- Insert failure patterns
INSERT INTO failure_patterns (name, description, sector, frequency, avg_loss_value, prevention_cost, missing_modules, examples) VALUES
('Missing AI/ML Capabilities', 'Lack of artificial intelligence and machine learning components', 'technical', 78, 3200000, 450000,
 '["ML Model Training", "AI Decision Engine", "Predictive Analytics", "Natural Language Processing"]',
 '["No fraud detection AI", "Missing recommendation engine", "Lack of predictive maintenance"]'),

('Poor System Integration', 'Inadequate integration capabilities with existing systems', 'technical', 65, 2100000, 280000,
 '["API Gateway", "Data Synchronization", "Legacy System Connectors", "ETL Pipeline"]',
 '["No ERP integration", "Missing API management", "Data silos"]'),

('Security Vulnerabilities', 'Insufficient security measures and compliance gaps', 'technical', 72, 2800000, 320000,
 '["Advanced Encryption", "Identity Management", "Threat Detection", "Compliance Monitoring"]',
 '["Weak authentication", "No threat monitoring", "Compliance failures"]'),

('Poor User Experience', 'Inadequate user interface and experience design', 'functional', 58, 1800000, 180000,
 '["Responsive UI Framework", "User Analytics", "Accessibility Tools", "Mobile App"]',
 '["Non-responsive design", "Poor accessibility", "No mobile support"]'),

('Scalability Limitations', 'Architecture cannot handle growth and high loads', 'technical', 61, 2400000, 350000,
 '["Load Balancer", "Auto-scaling", "Caching Layer", "Database Sharding"]',
 '["Single point of failure", "No horizontal scaling", "Performance bottlenecks"]'),

('Regulatory Compliance Gaps', 'Missing industry-specific compliance requirements', 'functional', 45, 3100000, 220000,
 '["Audit Trail", "Data Governance", "Compliance Reporting", "Privacy Controls"]',
 '["GDPR non-compliance", "Missing audit logs", "Data privacy issues"]'),

('Poor Project Management', 'Inadequate project planning and execution methodology', 'process', 52, 1500000, 120000,
 '["Project Tracking", "Resource Management", "Risk Assessment", "Quality Assurance"]',
 '["No agile methodology", "Poor timeline estimation", "Lack of risk management"]'),

('Cost Estimation Errors', 'Unrealistic pricing and budget planning', 'commercial', 67, 2200000, 95000,
 '["Cost Estimation Tool", "Budget Tracking", "Resource Optimization", "ROI Calculator"]',
 '["Underestimated complexity", "Hidden costs", "Poor resource planning"]');

-- Insert module costs for existing modules
INSERT INTO module_costs (module_id, base_cost, complexity, development_time, team_size, risk_factor, dependencies, estimated_cost, confidence_level) VALUES
(1, 140000, 'Medium', 10, 2, 0.15, '["Security Framework", "Database Layer"]', 161000, 85),
(2, 200000, 'High', 14, 3, 0.25, '["Payment Gateway", "Fraud Detection"]', 250000, 80),
(3, 160000, 'Medium', 12, 3, 0.20, '["WebSocket Server", "Push Service"]', 192000, 90),
(4, 180000, 'High', 16, 4, 0.30, '["Data Pipeline", "Visualization Engine"]', 234000, 75),
(5, 120000, 'Low', 8, 2, 0.10, '["Cloud Storage", "File Processing"]', 132000, 95);

-- Insert additional module costs for missing modules
INSERT INTO module_costs (module_id, base_cost, complexity, development_time, team_size, risk_factor, dependencies, estimated_cost, confidence_level) 
SELECT 
    (SELECT MAX(id) FROM modules) + row_number() OVER (),
    cost_data.base_cost,
    cost_data.complexity,
    cost_data.development_time,
    cost_data.team_size,
    cost_data.risk_factor,
    cost_data.dependencies,
    cost_data.estimated_cost,
    cost_data.confidence_level
FROM (VALUES
    (180000, 'High', 12, 4, 0.25, '["Security Module", "Monitoring Module"]', 225000, 85),
    (220000, 'High', 16, 3, 0.35, '["Data Pipeline", "Model Training"]', 297000, 70),
    (150000, 'Medium', 10, 3, 0.15, '["Data Visualization", "API Gateway"]', 172500, 90),
    (200000, 'High', 14, 2, 0.40, '["Crypto Wallet", "Smart Contracts"]', 280000, 65),
    (160000, 'Medium', 12, 3, 0.20, '["Device Management", "Protocol Handlers"]', 192000, 80),
    (140000, 'High', 10, 2, 0.30, '["Encryption", "Identity Management"]', 182000, 85)
) AS cost_data(base_cost, complexity, development_time, team_size, risk_factor, dependencies, estimated_cost, confidence_level);
