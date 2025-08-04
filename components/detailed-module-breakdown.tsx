"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertTriangle, Plus, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DetailedModuleBreakdownProps {
  data: any
}

interface ModuleDetail {
  id: string
  name: string
  description: string
  category: string
  status: "ready" | "needs_update" | "to_create"
  currentVersion?: string
  requiredVersion?: string
  complexity: "Low" | "Medium" | "High"
  estimatedEffort?: string
  dependencies: string[]
  priority: "High" | "Medium" | "Low"
  businessImpact: string
  technicalDetails: string
  updateReason?: string
  creationReason?: string
}

export function DetailedModuleBreakdown({ data }: DetailedModuleBreakdownProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")

  const moduleDetails: ModuleDetail[] = [
    // READY MODULES (62.2%)
    {
      id: "auth_module",
      name: "User Authentication Module",
      description: "Complete authentication system with OAuth, JWT, and multi-factor authentication",
      category: "Security",
      status: "ready",
      currentVersion: "2.1.0",
      requiredVersion: "2.1.0",
      complexity: "Medium",
      dependencies: ["Database Module", "Encryption Module"],
      priority: "High",
      businessImpact: "Critical for user security and access control",
      technicalDetails: "Supports OAuth 2.0, JWT tokens, MFA, LDAP integration",
    },
    {
      id: "payment_gateway",
      name: "Payment Processing Gateway",
      description: "Secure payment processing with multiple payment providers",
      category: "Finance",
      status: "ready",
      currentVersion: "1.8.2",
      requiredVersion: "1.8.2",
      complexity: "High",
      dependencies: ["Security Module", "Audit Module"],
      priority: "High",
      businessImpact: "Essential for transaction processing and revenue",
      technicalDetails: "PCI DSS compliant, supports Stripe, PayPal, bank transfers",
    },
    {
      id: "file_upload",
      name: "File Upload & Management",
      description: "Secure file upload with cloud storage integration",
      category: "Storage",
      status: "ready",
      currentVersion: "2.0.1",
      requiredVersion: "2.0.1",
      complexity: "Low",
      dependencies: ["Cloud Storage", "Security Module"],
      priority: "Medium",
      businessImpact: "Enables document management and file sharing",
      technicalDetails: "Supports AWS S3, Azure Blob, virus scanning, compression",
    },
    {
      id: "email_service",
      name: "Email Service Module",
      description: "Email sending service with templates and tracking",
      category: "Communication",
      status: "ready",
      currentVersion: "1.6.3",
      requiredVersion: "1.6.3",
      complexity: "Low",
      dependencies: ["Template Engine", "Queue System"],
      priority: "Medium",
      businessImpact: "Critical for user communication and notifications",
      technicalDetails: "SMTP/API support, template engine, delivery tracking, bounce handling",
    },
    {
      id: "database_pool",
      name: "Database Connection Pool",
      description: "Optimized database connection management",
      category: "Database",
      status: "ready",
      currentVersion: "2.2.0",
      requiredVersion: "2.2.0",
      complexity: "Medium",
      dependencies: ["Database Drivers"],
      priority: "High",
      businessImpact: "Ensures optimal database performance and reliability",
      technicalDetails: "Connection pooling, failover support, monitoring, auto-scaling",
    },
    {
      id: "api_gateway",
      name: "API Gateway Module",
      description: "Centralized API management with rate limiting",
      category: "Infrastructure",
      status: "ready",
      currentVersion: "1.9.0",
      requiredVersion: "1.9.0",
      complexity: "High",
      dependencies: ["Load Balancer", "Security Module"],
      priority: "High",
      businessImpact: "Enables secure and scalable API ecosystem",
      technicalDetails: "Rate limiting, API versioning, authentication, monitoring",
    },
    {
      id: "search_engine",
      name: "Search Engine Module",
      description: "Full-text search with indexing and filtering",
      category: "Search",
      status: "ready",
      currentVersion: "1.4.0",
      requiredVersion: "1.4.0",
      complexity: "High",
      dependencies: ["Elasticsearch", "Data Pipeline"],
      priority: "Medium",
      businessImpact: "Improves user experience with fast search capabilities",
      technicalDetails: "Elasticsearch integration, faceted search, auto-complete, analytics",
    },
    {
      id: "cache_layer",
      name: "Caching Layer Module",
      description: "Distributed caching for improved performance",
      category: "Performance",
      status: "ready",
      currentVersion: "1.7.2",
      requiredVersion: "1.7.2",
      complexity: "Medium",
      dependencies: ["Redis", "Monitoring"],
      priority: "Medium",
      businessImpact: "Significantly improves application performance",
      technicalDetails: "Redis clustering, cache invalidation, TTL management, metrics",
    },

    // NEEDS UPDATE MODULES (17.8%)
    {
      id: "notification_system",
      name: "Real-time Notification System",
      description: "WebSocket-based notification system with push notifications",
      category: "Communication",
      status: "needs_update",
      currentVersion: "1.5.0",
      requiredVersion: "2.0.0",
      complexity: "Medium",
      estimatedEffort: "3-4 weeks",
      dependencies: ["WebSocket Server", "Push Service"],
      priority: "High",
      businessImpact: "Critical for real-time user engagement",
      technicalDetails: "WebSocket connections, push notifications, message queuing",
      updateReason: "Need to add mobile push notifications and improve scalability",
    },
    {
      id: "analytics_dashboard",
      name: "Data Analytics Dashboard",
      description: "Interactive dashboard with charts and export capabilities",
      category: "Analytics",
      status: "needs_update",
      currentVersion: "1.2.0",
      requiredVersion: "2.5.0",
      complexity: "High",
      estimatedEffort: "6-8 weeks",
      dependencies: ["Data Pipeline", "Visualization Engine"],
      priority: "Medium",
      businessImpact: "Essential for business intelligence and decision making",
      technicalDetails: "Chart.js integration, data export, real-time updates",
      updateReason: "Requires modern visualization library and real-time data streaming",
    },
    {
      id: "logging_monitoring",
      name: "Logging & Monitoring",
      description: "Comprehensive logging and application monitoring",
      category: "Infrastructure",
      status: "needs_update",
      currentVersion: "1.7.1",
      requiredVersion: "2.2.0",
      complexity: "Medium",
      estimatedEffort: "4-5 weeks",
      dependencies: ["Log Aggregation", "Metrics Collection"],
      priority: "High",
      businessImpact: "Critical for system reliability and troubleshooting",
      technicalDetails: "ELK stack integration, metrics collection, alerting",
      updateReason: "Need to add distributed tracing and advanced alerting capabilities",
    },
    {
      id: "user_management",
      name: "User Management System",
      description: "User profile and role management",
      category: "Security",
      status: "needs_update",
      currentVersion: "1.8.0",
      requiredVersion: "2.1.0",
      complexity: "Medium",
      estimatedEffort: "3-4 weeks",
      dependencies: ["Authentication", "Database"],
      priority: "Medium",
      businessImpact: "Important for user experience and administration",
      technicalDetails: "Role-based access control, user profiles, audit trails",
      updateReason: "Add advanced role management and user activity tracking",
    },

    // TO CREATE MODULES (20.0%)
    {
      id: "ai_ml_engine",
      name: "AI/ML Processing Engine",
      description: "Machine learning model training and inference engine",
      category: "AI/ML",
      status: "to_create",
      complexity: "High",
      estimatedEffort: "12-16 weeks",
      dependencies: ["Data Pipeline", "Model Registry", "GPU Infrastructure"],
      priority: "High",
      businessImpact: "Enables advanced analytics and predictive capabilities",
      technicalDetails: "TensorFlow/PyTorch integration, model serving, A/B testing",
      creationReason: "Required for predictive analytics and intelligent recommendations",
    },
    {
      id: "blockchain_integration",
      name: "Blockchain Integration Module",
      description: "Smart contract integration and cryptocurrency support",
      category: "Blockchain",
      status: "to_create",
      complexity: "High",
      estimatedEffort: "14-18 weeks",
      dependencies: ["Crypto Wallet", "Smart Contract Engine"],
      priority: "Medium",
      businessImpact: "Enables decentralized features and crypto payments",
      technicalDetails: "Ethereum/Polygon integration, smart contracts, wallet management",
      creationReason: "Client requires blockchain-based payment and verification system",
    },
    {
      id: "iot_gateway",
      name: "IoT Device Gateway",
      description: "IoT device management and data collection",
      category: "IoT",
      status: "to_create",
      complexity: "High",
      estimatedEffort: "10-12 weeks",
      dependencies: ["Device Registry", "Protocol Handlers", "Data Pipeline"],
      priority: "High",
      businessImpact: "Critical for IoT ecosystem and device management",
      technicalDetails: "MQTT/CoAP protocols, device provisioning, data aggregation",
      creationReason: "RFP requires comprehensive IoT device management capabilities",
    },
    {
      id: "advanced_reporting",
      name: "Advanced Reporting Engine",
      description: "Customizable report generation with scheduling",
      category: "Reporting",
      status: "to_create",
      complexity: "Medium",
      estimatedEffort: "8-10 weeks",
      dependencies: ["Template Engine", "Data Export", "Scheduler"],
      priority: "Medium",
      businessImpact: "Important for business reporting and compliance",
      technicalDetails: "Report templates, PDF/Excel export, scheduled delivery",
      creationReason: "Client needs automated reporting with custom templates",
    },
    {
      id: "mobile_app_backend",
      name: "Mobile App Backend",
      description: "Backend services optimized for mobile applications",
      category: "Mobile",
      status: "to_create",
      complexity: "Medium",
      estimatedEffort: "6-8 weeks",
      dependencies: ["API Gateway", "Push Notifications", "Offline Sync"],
      priority: "High",
      businessImpact: "Essential for mobile user experience",
      technicalDetails: "REST/GraphQL APIs, offline sync, push notifications",
      creationReason: "RFP requires native mobile application support",
    },
    {
      id: "compliance_module",
      name: "Regulatory Compliance Module",
      description: "GDPR, HIPAA, and industry compliance management",
      category: "Compliance",
      status: "to_create",
      complexity: "High",
      estimatedEffort: "10-14 weeks",
      dependencies: ["Audit Trail", "Data Governance", "Privacy Controls"],
      priority: "High",
      businessImpact: "Critical for regulatory compliance and risk management",
      technicalDetails: "Data classification, consent management, audit trails",
      creationReason: "Client operates in regulated industry requiring strict compliance",
    },
  ]

  const categories = [
    "all",
    "Security",
    "Finance",
    "Storage",
    "Communication",
    "Database",
    "Infrastructure",
    "Search",
    "Performance",
    "Analytics",
    "AI/ML",
    "Blockchain",
    "IoT",
    "Reporting",
    "Mobile",
    "Compliance",
  ]
  const priorities = ["all", "High", "Medium", "Low"]

  const filteredModules = moduleDetails.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory
    const matchesPriority = selectedPriority === "all" || module.priority === selectedPriority
    return matchesSearch && matchesCategory && matchesPriority
  })

  const readyModules = filteredModules.filter((m) => m.status === "ready")
  const updateModules = filteredModules.filter((m) => m.status === "needs_update")
  const createModules = filteredModules.filter((m) => m.status === "to_create")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "needs_update":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case "to_create":
        return <Plus className="w-5 h-5 text-purple-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "border-green-200 bg-green-50"
      case "needs_update":
        return "border-orange-200 bg-orange-50"
      case "to_create":
        return "border-purple-200 bg-purple-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Module Breakdown Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to see detailed module breakdown</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detailed Module Breakdown</h2>
          <p className="text-gray-600">Exact modules in each category with detailed analysis</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready Modules</p>
                <p className="text-2xl font-bold text-green-600">{readyModules.length}</p>
                <p className="text-sm text-gray-500">62.2% of requirements</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Update</p>
                <p className="text-2xl font-bold text-orange-600">{updateModules.length}</p>
                <p className="text-sm text-gray-500">17.8% of requirements</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">To Create</p>
                <p className="text-2xl font-bold text-purple-600">{createModules.length}</p>
                <p className="text-sm text-gray-500">20.0% of requirements</p>
              </div>
              <Plus className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority === "all" ? "All Priorities" : priority}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Tabs */}
      <Tabs defaultValue="ready" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ready" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Ready ({readyModules.length})</span>
          </TabsTrigger>
          <TabsTrigger value="update" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Needs Update ({updateModules.length})</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>To Create ({createModules.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ready" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {readyModules.map((module) => (
              <Card key={module.id} className={`transition-all duration-300 ${getStatusColor(module.status)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(module.status)}
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <CardDescription className="mt-1">{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getComplexityColor(module.complexity)}>{module.complexity}</Badge>
                      <Badge className={getPriorityColor(module.priority)}>{module.priority}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium">{module.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Version:</span>
                        <span className="ml-2 font-medium">{module.currentVersion}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Business Impact:</h4>
                      <p className="text-sm text-gray-700">{module.businessImpact}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Technical Details:</h4>
                      <p className="text-sm text-gray-700">{module.technicalDetails}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Dependencies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="update" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {updateModules.map((module) => (
              <Card key={module.id} className={`transition-all duration-300 ${getStatusColor(module.status)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(module.status)}
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <CardDescription className="mt-1">{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getComplexityColor(module.complexity)}>{module.complexity}</Badge>
                      <Badge className={getPriorityColor(module.priority)}>{module.priority}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current:</span>
                        <span className="ml-2 font-medium">{module.currentVersion}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Required:</span>
                        <span className="ml-2 font-medium">{module.requiredVersion}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Effort:</span>
                        <span className="ml-2 font-medium">{module.estimatedEffort}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium">{module.category}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Update Reason:</h4>
                      <p className="text-sm text-gray-700">{module.updateReason}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Business Impact:</h4>
                      <p className="text-sm text-gray-700">{module.businessImpact}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Dependencies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {createModules.map((module) => (
              <Card key={module.id} className={`transition-all duration-300 ${getStatusColor(module.status)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(module.status)}
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <CardDescription className="mt-1">{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getComplexityColor(module.complexity)}>{module.complexity}</Badge>
                      <Badge className={getPriorityColor(module.priority)}>{module.priority}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium">{module.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Effort:</span>
                        <span className="ml-2 font-medium">{module.estimatedEffort}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Creation Reason:</h4>
                      <p className="text-sm text-gray-700">{module.creationReason}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Business Impact:</h4>
                      <p className="text-sm text-gray-700">{module.businessImpact}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Technical Details:</h4>
                      <p className="text-sm text-gray-700">{module.technicalDetails}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Dependencies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
