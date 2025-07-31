"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Calendar,
  Award,
  Zap,
  Settings,
  Users,
  AlertTriangle,
  DollarSignIcon,
} from "lucide-react"

interface PatternAnalysisProps {
  data: any
}

interface Pattern {
  id: string
  name: string
  description: string
  frequency: number
  impact: "high" | "medium" | "low" | "technical" | "functional" | "process" | "commercial"
  category: string
  // examples: string[]
  recommendations: string[]
  historicalData: {
    totalOccurrences: number
    successRate: number
    avgProjectValue: number
  }
  isWin: boolean
}

export function PatternAnalysis({ data }: PatternAnalysisProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const patterns: Pattern[] = [
    // Win Patterns
    {
      id: "cloud_first",
      name: "Cloud-First Architecture",
      description: "Proposing cloud-native solutions from the start",
      frequency: 85,
      impact: "high",
      category: "Technical",
      // examples: ["Microservices architecture on AWS/Azure", "Serverless computing approach", "Container orchestration with Kubernetes"],
      recommendations: ["Always propose cloud-native solutions", "Highlight scalability benefits", "Include cost optimization strategies"],
      historicalData: { totalOccurrences: 23, successRate: 87, avgProjectValue: 2500000 },
      isWin: true,
    },
    {
      id: "agile_methodology",
      name: "Agile Development Methodology",
      description: "Emphasizing iterative development and client collaboration",
      frequency: 92,
      impact: "high",
      category: "Process",
      //examples: ["Sprint-based delivery cycles", "Continuous integration/deployment", "Regular client feedback loops"],
      recommendations: ["Propose 2-week sprint cycles", "Include client in sprint reviews", "Demonstrate CI/CD capabilities"],
      historicalData: { totalOccurrences: 31, successRate: 94, avgProjectValue: 1800000 },
      isWin: true,
    },
    {
      id: "security_first",
      name: "Security-First Approach",
      description: "Prioritizing security considerations in all aspects",
      frequency: 78,
      impact: "high",
      category: "Security",
      //examples: ["Zero-trust security model", "End-to-end encryption", "Regular security audits"],
      recommendations: ["Include security architect in team", "Propose regular penetration testing", "Highlight compliance certifications"],
      historicalData: { totalOccurrences: 19, successRate: 89, avgProjectValue: 3200000 },
      isWin: true,
    },
    {
      id: "user_centric_design",
      name: "User-Centric Design",
      description: "Focusing on user experience and accessibility",
      frequency: 71,
      impact: "medium",
      category: "Design",
      //examples: ["User journey mapping", "Accessibility compliance (WCAG)", "Mobile-first responsive design"],
      recommendations: ["Include UX research phase", "Propose user testing sessions", "Demonstrate accessibility features"],
      historicalData: { totalOccurrences: 16, successRate: 81, avgProjectValue: 1200000 },
      isWin: true,
    },
    {
      id: "data_analytics",
      name: "Advanced Data Analytics",
      description: "Incorporating AI/ML and advanced analytics capabilities",
      frequency: 65,
      impact: "high",
      category: "Analytics",
      //examples: ["Real-time dashboards", "Predictive analytics", "Machine learning integration"],
      recommendations: ["Include data scientist in team", "Propose ML model development", "Highlight ROI from analytics"],
      historicalData: { totalOccurrences: 14, successRate: 76, avgProjectValue: 2800000 },
      isWin: true,
    },
    // Lose Patterns
    {
      id: "missing_ai_ml",
      name: "Missing AI/ML Capabilities",
      description: "Lack of artificial intelligence and machine learning components",
      frequency: 78,
      impact: "technical",
      category: "Technical",
      //examples: ["No fraud detection AI", "Missing recommendation engine", "Lack of predictive maintenance"],
      recommendations: ["Invest in AI/ML expertise", "Include predictive analytics", "Partner with AI specialists"],
      historicalData: { totalOccurrences: 15, successRate: 19, avgProjectValue: 3200000 },
      isWin: false,
    },
    {
      id: "poor_integration",
      name: "Poor System Integration",
      description: "Inadequate integration capabilities with existing systems",
      frequency: 65,
      impact: "technical",
      category: "Technical",
      //examples: ["No ERP integration", "Missing API management", "Data silos"],
      recommendations: ["Develop robust API gateways", "Plan for legacy system integration", "Implement ETL pipelines"],
      historicalData: { totalOccurrences: 12, successRate: 25, avgProjectValue: 2100000 },
      isWin: false,
    },
    {
      id: "security_gaps",
      name: "Security Vulnerabilities",
      description: "Insufficient security measures and compliance gaps",
      frequency: 72,
      impact: "technical",
      category: "Security",
      //examples: ["Weak authentication", "No threat monitoring", "Compliance failures"],
      recommendations: ["Implement zero-trust security", "Conduct regular security audits", "Ensure compliance monitoring"],
      historicalData: { totalOccurrences: 15, successRate: 19, avgProjectValue: 2800000 },
      isWin: false,
    },
    {
      id: "user_experience",
      name: "Poor User Experience",
      description: "Inadequate user interface and experience design",
      frequency: 58,
      impact: "functional",
      category: "Design",
      // examples: ["Non-responsive design", "Poor accessibility", "No mobile support"],
      recommendations: ["Invest in UX research", "Ensure WCAG compliance", "Develop mobile-first designs"],
      historicalData: { totalOccurrences: 12, successRate: 25, avgProjectValue: 1800000 },
      isWin: false,
    },
    {
      id: "cost_overruns",
      name: "Cost Estimation Errors",
      description: "Unrealistic pricing and budget planning",
      frequency: 67,
      impact: "commercial",
      category: "Commercial",
      //examples: ["Underestimated complexity", "Hidden costs", "Poor resource planning"],
      recommendations: ["Use cost estimation tools", "Include contingency budgets", "Optimize resource allocation"],
      historicalData: { totalOccurrences: 12, successRate: 25, avgProjectValue: 2200000 },
      isWin: false,
    },
  ]

  const categories = ["all", "Technical", "Process", "Security", "Design", "Analytics", "Commercial"]

  const filteredWinPatterns = patterns.filter(
    (pattern) => pattern.isWin && (selectedCategory === "all" || pattern.category === selectedCategory),
  )
  const filteredLosePatterns = patterns.filter(
    (pattern) => !pattern.isWin && (selectedCategory === "all" || pattern.category === selectedCategory),
  )

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
      case "technical":
        return "bg-red-100 text-red-800"
      case "medium":
      case "functional":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      case "process":
        return "bg-blue-100 text-blue-800"
      case "commercial":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "technical":
        return <Settings className="w-4 h-4" />
      case "process":
        return <Users className="w-4 h-4" />
      case "security":
        return <Target className="w-4 h-4" />
      case "design":
        return <Target className="w-4 h-4" />
      case "analytics":
        return <BarChart3 className="w-4 h-4" />
      case "commercial":
        return <DollarSignIcon className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getPreventionPlan = (pattern: Pattern) => {
    switch (pattern.id) {
      case "missing_ai_ml":
        return {
          actions: [
            "Hire a Senior AI/ML specialist to lead model development",
            "Develop predictive analytics models using TensorFlow or PyTorch",
            "Integrate AI frameworks into existing systems",
            "Partner with AI research firms for cutting-edge solutions",
          ],
          timeline: "2-4 months",
          roles: ["Data Scientist", "AI/ML Engineer"],
        }
      case "poor_integration":
        return {
          actions: [
            "Implement robust API gateways using tools like AWS API Gateway",
            "Design ETL pipelines for seamless data flow",
            "Test compatibility with legacy systems",
            "Train team on integration best practices",
          ],
          timeline: "3-6 months",
          roles: ["Integration Architect", "DevOps Engineer"],
        }
      case "security_gaps":
        return {
          actions: [
            "Adopt a zero-trust security model across all systems",
            "Schedule quarterly penetration testing",
            "Implement compliance monitoring for GDPR/CCPA",
            "Train staff on security best practices",
          ],
          timeline: "1-3 months",
          roles: ["Security Architect", "Compliance Officer"],
        }
      case "user_experience":
        return {
          actions: [
            "Conduct user research with focus groups and surveys",
            "Ensure WCAG 2.1 compliance for accessibility",
            "Develop mobile-first, responsive UI designs",
            "Perform usability testing with real users",
          ],
          timeline: "2-4 months",
          roles: ["UI/UX Designer", "Frontend Developer"],
        }
      case "cost_overruns":
        return {
          actions: [
            "Implement cost estimation software like COCOMO",
            "Include a 15% contingency budget in proposals",
            "Optimize resource allocation with project management tools",
            "Conduct regular budget reviews",
          ],
          timeline: "1-2 months",
          roles: ["Project Manager", "Financial Analyst"],
        }
      default:
        return {
          actions: ["Review pattern details", "Assign responsible team", "Monitor progress"],
          timeline: "1-3 months",
          roles: ["Project Manager"],
        }
    }
  }

  const avgWinRate = filteredWinPatterns.length
    ? Math.round(
        filteredWinPatterns.reduce((acc, p) => acc + p.historicalData.successRate, 0) / filteredWinPatterns.length,
      )
    : 0

  const PatternCard = ({ pattern }: { pattern: Pattern }) => {
    const isWin = pattern.isWin
    return (
      <Card className={`hover:shadow-md transition-shadow ${isWin ? "border-green-200" : "border-red-200"}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              {isWin ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <CardTitle className="text-lg">{pattern.name}</CardTitle>
                <CardDescription className="mt-1">{pattern.description}</CardDescription>
              </div>
            </div>
            <Badge className={getImpactColor(pattern.impact)}>{pattern.impact.toUpperCase()}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Frequency</span>
                  <span>{pattern.frequency}%</span>
                </div>
                <Progress value={pattern.frequency} className="h-2" />
              </div>
              {isWin && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Success Rate</span>
                    <span>{pattern.historicalData.successRate}%</span>
                  </div>
                  <Progress value={pattern.historicalData.successRate} className="h-2 text-green-600" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg">{pattern.historicalData.totalOccurrences}</div>
                <div className="text-gray-600">Occurrences</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{pattern.historicalData.successRate}%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              {isWin && (
                <div className="text-center">
                  <div className="font-bold text-lg">
                    ${(pattern.historicalData.avgProjectValue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-gray-600">Avg Value</div>
                </div>
              )}
            </div>
            {/*<div>
              <h4 className="font-medium text-sm mb-2">Examples:</h4>
              <ul className="space-y-1">
                {pattern.examples.slice(0, 2).map((example, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>*/}
            <div>
              <h4 className="font-medium text-sm mb-2">{isWin ? "Best Practices:" : "How to Avoid:"}</h4>
              <ul className="space-y-1">
                {pattern.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isWin ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View Details
              </Button>
              <Button size="sm" className={`flex-1 ${isWin ? "bg-green-600" : "bg-red-600"}`}>
                {isWin ? "Apply Pattern" : "Generate Prevention Plan"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pattern Analysis Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to see patterns</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pattern & Failure Analysis</h2>
          <p className="text-gray-600">Historical patterns and failure analysis for RFP responses</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Historical Data
          </Button>
          <Button>
            <Award className="w-4 h-4 mr-2" />
            Best Practices
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Patterns</p>
                <p className="text-2xl font-bold text-green-600">{filteredWinPatterns.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lose Patterns</p>
                <p className="text-2xl font-bold text-red-600">{filteredLosePatterns.length}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Win Rate</p>
                <p className="text-2xl font-bold text-blue-600">{avgWinRate}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center space-x-2"
              >
                {category !== "all" && getCategoryIcon(category)}
                <span>{category === "all" ? "All Categories" : category}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="win" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="win" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Win Patterns ({filteredWinPatterns.length})</span>
          </TabsTrigger>
          <TabsTrigger value="lose" className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4" />
            <span>Lose Patterns ({filteredLosePatterns.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="win" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWinPatterns.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lose" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLosePatterns.map((pattern) => (
              <div key={pattern.id} className="space-y-4">
                <PatternCard pattern={pattern} />
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-800">
                      <Zap className="w-5 h-5" />
                      <span>Prevention Plan for {pattern.name}</span>
                    </CardTitle>
                    <CardDescription>Actionable steps to mitigate this failure pattern</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-red-600 mb-2">Actionable Steps</h4>
                        <ul className="space-y-1">
                          {getPreventionPlan(pattern).actions.map((action, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm text-red-600 mb-2">Timeline</h4>
                          <Badge className="bg-red-100 text-red-800">
                            {getPreventionPlan(pattern).timeline}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-red-600 mb-2">Responsible Roles</h4>
                          <div className="flex flex-wrap gap-1">
                            {getPreventionPlan(pattern).roles.map((role, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Download Prevention Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>Pattern Insights for Current RFP</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-600 mb-3">Recommended Win Patterns</h4>
              <div className="space-y-2">
                {filteredWinPatterns.slice(0, 3).map((pattern) => (
                  <div key={pattern.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">{pattern.name}</span>
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                      {pattern.historicalData.successRate}% success
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-3">Patterns to Avoid</h4>
              <div className="space-y-2">
                {filteredLosePatterns.slice(0, 3).map((pattern) => (
                  <div key={pattern.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm font-medium">{pattern.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}