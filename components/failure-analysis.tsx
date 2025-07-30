"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { XCircle, AlertTriangle, DollarSign, TrendingDown, Target, Zap, Users, Settings, BarChart3 } from "lucide-react"

interface FailureAnalysisProps {
  data: any
}

interface FailedRFP {
  id: string
  title: string
  sector: string
  value: number
  lostDate: string
  missingModules: string[]
  failureReasons: string[]
  competitorAdvantages: string[]
}

interface FailurePattern {
  id: string
  name: string
  description: string
  sector: "technical" | "functional" | "process" | "commercial"
  frequency: number
  avgLossValue: number
  missingModules: string[]
  preventionCost: number
  examples: string[]
}

export function FailureAnalysis({ data }: FailureAnalysisProps) {
  const [selectedSector, setSelectedSector] = useState("all")

  const failedRFPs: FailedRFP[] = [
    {
      id: "rfp_001",
      title: "Banking Digital Transformation",
      sector: "Finance",
      value: 3500000,
      lostDate: "2024-01-15",
      missingModules: ["Real-time Fraud Detection", "Blockchain Integration", "Advanced Analytics"],
      failureReasons: ["Lack of AI/ML capabilities", "No blockchain expertise", "Insufficient security measures"],
      competitorAdvantages: ["AI-powered fraud detection", "Blockchain payment system", "Real-time analytics"],
    },
    {
      id: "rfp_002",
      title: "Healthcare Management System",
      sector: "Healthcare",
      value: 2800000,
      lostDate: "2024-02-03",
      missingModules: ["FHIR Integration", "Telemedicine Platform", "Medical IoT Gateway"],
      failureReasons: ["No healthcare standards compliance", "Missing telemedicine features", "IoT integration gaps"],
      competitorAdvantages: ["Full FHIR compliance", "Integrated telemedicine", "IoT device management"],
    },
    {
      id: "rfp_003",
      title: "Smart City Infrastructure",
      sector: "Government",
      value: 5200000,
      lostDate: "2024-01-28",
      missingModules: ["IoT Sensor Network", "Traffic Management AI", "Citizen Portal"],
      failureReasons: ["Limited IoT experience", "No AI traffic optimization", "Poor citizen engagement"],
      competitorAdvantages: ["Comprehensive IoT platform", "AI-driven traffic control", "Mobile citizen app"],
    },
  ]

  const failurePatterns: FailurePattern[] = [
    {
      id: "missing_ai_ml",
      name: "Missing AI/ML Capabilities",
      description: "Lack of artificial intelligence and machine learning components",
      sector: "technical",
      frequency: 78,
      avgLossValue: 3200000,
      missingModules: [
        "ML Model Training",
        "AI Decision Engine",
        "Predictive Analytics",
        "Natural Language Processing",
      ],
      preventionCost: 450000,
      examples: ["No fraud detection AI", "Missing recommendation engine", "Lack of predictive maintenance"],
    },
    {
      id: "poor_integration",
      name: "Poor System Integration",
      description: "Inadequate integration capabilities with existing systems",
      sector: "technical",
      frequency: 65,
      avgLossValue: 2100000,
      missingModules: ["API Gateway", "Data Synchronization", "Legacy System Connectors", "ETL Pipeline"],
      preventionCost: 280000,
      examples: ["No ERP integration", "Missing API management", "Data silos"],
    },
    {
      id: "security_gaps",
      name: "Security Vulnerabilities",
      description: "Insufficient security measures and compliance gaps",
      sector: "technical",
      frequency: 72,
      avgLossValue: 2800000,
      missingModules: ["Advanced Encryption", "Identity Management", "Threat Detection", "Compliance Monitoring"],
      preventionCost: 320000,
      examples: ["Weak authentication", "No threat monitoring", "Compliance failures"],
    },
    {
      id: "user_experience",
      name: "Poor User Experience",
      description: "Inadequate user interface and experience design",
      sector: "functional",
      frequency: 58,
      avgLossValue: 1800000,
      missingModules: ["Responsive UI Framework", "User Analytics", "Accessibility Tools", "Mobile App"],
      preventionCost: 180000,
      examples: ["Non-responsive design", "Poor accessibility", "No mobile support"],
    },
    {
      id: "scalability_issues",
      name: "Scalability Limitations",
      description: "Architecture cannot handle growth and high loads",
      sector: "technical",
      frequency: 61,
      avgLossValue: 2400000,
      missingModules: ["Load Balancer", "Auto-scaling", "Caching Layer", "Database Sharding"],
      preventionCost: 350000,
      examples: ["Single point of failure", "No horizontal scaling", "Performance bottlenecks"],
    },
    {
      id: "compliance_gaps",
      name: "Regulatory Compliance Gaps",
      description: "Missing industry-specific compliance requirements",
      sector: "functional",
      frequency: 45,
      avgLossValue: 3100000,
      missingModules: ["Audit Trail", "Data Governance", "Compliance Reporting", "Privacy Controls"],
      preventionCost: 220000,
      examples: ["GDPR non-compliance", "Missing audit logs", "Data privacy issues"],
    },
    {
      id: "project_management",
      name: "Poor Project Management",
      description: "Inadequate project planning and execution methodology",
      sector: "process",
      frequency: 52,
      avgLossValue: 1500000,
      missingModules: ["Project Tracking", "Resource Management", "Risk Assessment", "Quality Assurance"],
      preventionCost: 120000,
      examples: ["No agile methodology", "Poor timeline estimation", "Lack of risk management"],
    },
    {
      id: "cost_overruns",
      name: "Cost Estimation Errors",
      description: "Unrealistic pricing and budget planning",
      sector: "commercial",
      frequency: 67,
      avgLossValue: 2200000,
      missingModules: ["Cost Estimation Tool", "Budget Tracking", "Resource Optimization", "ROI Calculator"],
      preventionCost: 95000,
      examples: ["Underestimated complexity", "Hidden costs", "Poor resource planning"],
    },
  ]

  const sectors = ["all", "technical", "functional", "process", "commercial"]

  const filteredPatterns = failurePatterns.filter(
    (pattern) => selectedSector === "all" || pattern.sector === selectedSector,
  )

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case "technical":
        return "bg-red-100 text-red-800"
      case "functional":
        return "bg-orange-100 text-orange-800"
      case "process":
        return "bg-yellow-100 text-yellow-800"
      case "commercial":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case "technical":
        return <Settings className="w-4 h-4" />
      case "functional":
        return <Target className="w-4 h-4" />
      case "process":
        return <Users className="w-4 h-4" />
      case "commercial":
        return <DollarSign className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const totalLostValue = failedRFPs.reduce((sum, rfp) => sum + rfp.value, 0)
  const avgLossPerRFP = totalLostValue / failedRFPs.length
  const totalPreventionCost = failurePatterns.reduce((sum, pattern) => sum + pattern.preventionCost, 0)

  if (!data) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Failure Analysis Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to see failure patterns</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Failure Analysis & Missing Modules</h2>
          <p className="text-gray-600">Analysis of lost RFPs and patterns that lead to failure</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Historical Data
          </Button>
          <Button>
            <TrendingDown className="w-4 h-4 mr-2" />
            Prevention Plan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lost RFPs</p>
                <p className="text-2xl font-bold text-red-600">{failedRFPs.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lost Value</p>
                <p className="text-2xl font-bold text-red-600">${(totalLostValue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Loss per RFP</p>
                <p className="text-2xl font-bold text-orange-600">${(avgLossPerRFP / 1000000).toFixed(1)}M</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prevention Cost</p>
                <p className="text-2xl font-bold text-blue-600">${(totalPreventionCost / 1000).toFixed(0)}K</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different analyses */}
      <Tabs defaultValue="failed-rfps" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="failed-rfps">Failed RFPs</TabsTrigger>
          <TabsTrigger value="failure-patterns">Failure Patterns</TabsTrigger>
          <TabsTrigger value="cost-analysis">Cost Analysis</TabsTrigger>
        </TabsList>

        {/* Failed RFPs Tab */}
        <TabsContent value="failed-rfps" className="space-y-4">
          <div className="space-y-4">
            {failedRFPs.map((rfp) => (
              <Card key={rfp.id} className="border-red-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span>{rfp.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {rfp.sector} • Lost on {rfp.lostDate} • Value: ${(rfp.value / 1000000).toFixed(1)}M
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      LOST
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Missing Modules */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Missing Modules</h4>
                      <div className="space-y-2">
                        {rfp.missingModules.map((module, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-gray-700">{module}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Failure Reasons */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Failure Reasons</h4>
                      <div className="space-y-2">
                        {rfp.failureReasons.map((reason, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Competitor Advantages */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Competitor Advantages</h4>
                      <div className="space-y-2">
                        {rfp.competitorAdvantages.map((advantage, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{advantage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Failure Patterns Tab */}
        <TabsContent value="failure-patterns" className="space-y-4">
          {/* Sector Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {sectors.map((sector) => (
                  <Button
                    key={sector}
                    variant={selectedSector === sector ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSector(sector)}
                    className="flex items-center space-x-2"
                  >
                    {sector !== "all" && getSectorIcon(sector)}
                    <span>{sector === "all" ? "All Sectors" : sector.charAt(0).toUpperCase() + sector.slice(1)}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Failure Patterns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPatterns.map((pattern) => (
              <Card key={pattern.id} className="hover:shadow-md transition-shadow border-red-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <CardTitle className="text-lg">{pattern.name}</CardTitle>
                        <CardDescription className="mt-1">{pattern.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getSectorColor(pattern.sector)}>{pattern.sector.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Frequency</span>
                          <span>{pattern.frequency}%</span>
                        </div>
                        <Progress value={pattern.frequency} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Avg Loss</span>
                          <span>${(pattern.avgLossValue / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Prevention: ${(pattern.preventionCost / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>

                    {/* Missing Modules */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Missing Modules:</h4>
                      <div className="flex flex-wrap gap-1">
                        {pattern.missingModules.slice(0, 3).map((module, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {module}
                          </Badge>
                        ))}
                        {pattern.missingModules.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{pattern.missingModules.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Common Examples:</h4>
                      <ul className="space-y-1">
                        {pattern.examples.slice(0, 2).map((example, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 bg-red-600">
                        Create Prevention Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cost Analysis Tab */}
        <TabsContent value="cost-analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Prevention Cost Analysis</CardTitle>
                <CardDescription>Investment needed to prevent common failure patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {failurePatterns.slice(0, 5).map((pattern) => (
                    <div key={pattern.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{pattern.name}</div>
                        <div className="text-xs text-gray-600">
                          Prevents avg loss of ${(pattern.avgLossValue / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">${(pattern.preventionCost / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-green-600">
                          ROI: {((pattern.avgLossValue / pattern.preventionCost) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ROI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>Return on investment for prevention measures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-red-50 p-4 rounded">
                      <div className="text-2xl font-bold text-red-600">${(totalLostValue / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-600">Total Lost Value</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        ${(totalPreventionCost / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-gray-600">Prevention Investment</div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {((totalLostValue / totalPreventionCost) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Potential ROI</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Investment Priorities:</h4>
                    {failurePatterns
                      .sort((a, b) => b.avgLossValue / b.preventionCost - a.avgLossValue / a.preventionCost)
                      .slice(0, 3)
                      .map((pattern, index) => (
                        <div key={pattern.id} className="flex items-center justify-between text-sm">
                          <span>
                            {index + 1}. {pattern.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {((pattern.avgLossValue / pattern.preventionCost) * 100).toFixed(0)}% ROI
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Cost Estimation */}
          <Card>
            <CardHeader>
              <CardTitle>Module Development Cost Estimation</CardTitle>
              <CardDescription>Estimated costs for developing missing modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Real-time Fraud Detection", cost: 180000, complexity: "High", timeline: "12-16 weeks" },
                  { name: "Blockchain Integration", cost: 220000, complexity: "High", timeline: "14-18 weeks" },
                  { name: "Advanced Analytics", cost: 150000, complexity: "Medium", timeline: "10-12 weeks" },
                  { name: "FHIR Integration", cost: 120000, complexity: "Medium", timeline: "8-10 weeks" },
                  { name: "Telemedicine Platform", cost: 200000, complexity: "High", timeline: "12-14 weeks" },
                  { name: "IoT Sensor Network", cost: 160000, complexity: "Medium", timeline: "10-12 weeks" },
                ].map((module, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">{module.name}</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost:</span>
                        <span className="font-medium">${(module.cost / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Complexity:</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            module.complexity === "High"
                              ? "bg-red-100 text-red-800"
                              : module.complexity === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {module.complexity}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timeline:</span>
                        <span className="font-medium">{module.timeline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
