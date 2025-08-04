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
} from "lucide-react"

interface WinLosePatternsProps {
  data: any
}

interface Pattern {
  id: string
  name: string
  description: string
  frequency: number
  impact: "high" | "medium" | "low"
  category: string
  examples: string[]
  recommendations: string[]
  historicalData: {
    totalOccurrences: number
    successRate: number
    avgProjectValue: number
  }
}

export function WinLosePatterns({ data }: WinLosePatternsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const winPatterns: Pattern[] = [
    {
      id: "cloud_first",
      name: "Cloud-First Architecture",
      description: "Proposing cloud-native solutions from the start",
      frequency: 85,
      impact: "high",
      category: "Technical",
      examples: [
        "Microservices architecture on AWS/Azure",
        "Serverless computing approach",
        "Container orchestration with Kubernetes",
      ],
      recommendations: [
        "Always propose cloud-native solutions",
        "Highlight scalability benefits",
        "Include cost optimization strategies",
      ],
      historicalData: {
        totalOccurrences: 23,
        successRate: 87,
        avgProjectValue: 2500000,
      },
    },
    {
      id: "agile_methodology",
      name: "Agile Development Methodology",
      description: "Emphasizing iterative development and client collaboration",
      frequency: 92,
      impact: "high",
      category: "Process",
      examples: ["Sprint-based delivery cycles", "Continuous integration/deployment", "Regular client feedback loops"],
      recommendations: [
        "Propose 2-week sprint cycles",
        "Include client in sprint reviews",
        "Demonstrate CI/CD capabilities",
      ],
      historicalData: {
        totalOccurrences: 31,
        successRate: 94,
        avgProjectValue: 1800000,
      },
    },
    {
      id: "security_first",
      name: "Security-First Approach",
      description: "Prioritizing security considerations in all aspects",
      frequency: 78,
      impact: "high",
      category: "Security",
      examples: ["Zero-trust security model", "End-to-end encryption", "Regular security audits"],
      recommendations: [
        "Include security architect in team",
        "Propose regular penetration testing",
        "Highlight compliance certifications",
      ],
      historicalData: {
        totalOccurrences: 19,
        successRate: 89,
        avgProjectValue: 3200000,
      },
    },
    {
      id: "user_centric_design",
      name: "User-Centric Design",
      description: "Focusing on user experience and accessibility",
      frequency: 71,
      impact: "medium",
      category: "Design",
      examples: ["User journey mapping", "Accessibility compliance (WCAG)", "Mobile-first responsive design"],
      recommendations: [
        "Include UX research phase",
        "Propose user testing sessions",
        "Demonstrate accessibility features",
      ],
      historicalData: {
        totalOccurrences: 16,
        successRate: 81,
        avgProjectValue: 1200000,
      },
    },
    {
      id: "data_analytics",
      name: "Advanced Data Analytics",
      description: "Incorporating AI/ML and advanced analytics capabilities",
      frequency: 65,
      impact: "high",
      category: "Analytics",
      examples: ["Real-time dashboards", "Predictive analytics", "Machine learning integration"],
      recommendations: [
        "Include data scientist in team",
        "Propose ML model development",
        "Highlight ROI from analytics",
      ],
      historicalData: {
        totalOccurrences: 14,
        successRate: 76,
        avgProjectValue: 2800000,
      },
    },
  ]

  const losePatterns: Pattern[] = [
    {
      id: "monolithic_architecture",
      name: "Monolithic Architecture",
      description: "Proposing traditional monolithic system designs",
      frequency: 67,
      impact: "high",
      category: "Technical",
      examples: ["Single large application deployment", "Tightly coupled components", "Limited scalability options"],
      recommendations: [
        "Avoid monolithic proposals",
        "Always consider microservices",
        "Highlight scalability limitations",
      ],
      historicalData: {
        totalOccurrences: 18,
        successRate: 23,
        avgProjectValue: 800000,
      },
    },
    {
      id: "waterfall_methodology",
      name: "Waterfall Development",
      description: "Using traditional waterfall project management",
      frequency: 73,
      impact: "high",
      category: "Process",
      examples: ["Sequential development phases", "Limited client involvement", "Late testing and feedback"],
      recommendations: ["Avoid waterfall methodology", "Propose agile alternatives", "Emphasize iterative delivery"],
      historicalData: {
        totalOccurrences: 22,
        successRate: 31,
        avgProjectValue: 600000,
      },
    },
    {
      id: "security_afterthought",
      name: "Security as Afterthought",
      description: "Not prioritizing security in initial design",
      frequency: 58,
      impact: "high",
      category: "Security",
      examples: ["Basic authentication only", "No encryption strategy", "Limited security testing"],
      recommendations: [
        "Always lead with security",
        "Include security in all phases",
        "Propose comprehensive security audit",
      ],
      historicalData: {
        totalOccurrences: 15,
        successRate: 19,
        avgProjectValue: 450000,
      },
    },
    {
      id: "generic_solution",
      name: "Generic One-Size-Fits-All",
      description: "Proposing generic solutions without customization",
      frequency: 82,
      impact: "medium",
      category: "Strategy",
      examples: ["Standard template responses", "No client-specific considerations", "Generic technology stack"],
      recommendations: [
        "Always customize proposals",
        "Research client's specific needs",
        "Highlight unique value proposition",
      ],
      historicalData: {
        totalOccurrences: 28,
        successRate: 15,
        avgProjectValue: 300000,
      },
    },
    {
      id: "poor_team_composition",
      name: "Inadequate Team Composition",
      description: "Not including key roles or expertise",
      frequency: 45,
      impact: "medium",
      category: "Team",
      examples: ["Missing security expertise", "No UX/UI designers", "Insufficient senior developers"],
      recommendations: ["Include all necessary roles", "Highlight team expertise", "Show relevant experience"],
      historicalData: {
        totalOccurrences: 12,
        successRate: 25,
        avgProjectValue: 400000,
      },
    },
  ]

  const categories = ["all", "Technical", "Process", "Security", "Design", "Analytics", "Strategy", "Team"]

  const filteredWinPatterns = winPatterns.filter(
    (pattern) => selectedCategory === "all" || pattern.category === selectedCategory,
  )
  const filteredLosePatterns = losePatterns.filter(
    (pattern) => selectedCategory === "all" || pattern.category === selectedCategory,
  )

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const PatternCard = ({ pattern, type }: { pattern: Pattern; type: "win" | "lose" }) => {
    const isWin = type === "win"
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
            {/* Frequency and Success Rate */}
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
                  <span>Success Rate</span>
                  <span>{pattern.historicalData.successRate}%</span>
                </div>
                <Progress
                  value={pattern.historicalData.successRate}
                  className={`h-2 ${isWin ? "text-green-600" : "text-red-600"}`}
                />
              </div>
            </div>

            {/* Historical Data */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg">{pattern.historicalData.totalOccurrences}</div>
                <div className="text-gray-600">Occurrences</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{pattern.historicalData.successRate}%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">
                  ${(pattern.historicalData.avgProjectValue / 1000000).toFixed(1)}M
                </div>
                <div className="text-gray-600">Avg Value</div>
              </div>
            </div>

            {/* Examples */}
            <div>
              <h4 className="font-medium text-sm mb-2">Examples:</h4>
              <ul className="space-y-1">
                {pattern.examples.slice(0, 2).map((example, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
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
                {isWin ? "Apply Pattern" : "Avoid Pattern"}
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
        <p className="text-gray-500">Complete an RFP analysis to see win/lose patterns</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Win/Lose Pattern Analysis</h2>
          <p className="text-gray-600">Historical patterns that lead to success or failure in RFP responses</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Patterns</p>
                <p className="text-2xl font-bold text-green-600">{winPatterns.length}</p>
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
                <p className="text-2xl font-bold text-red-600">{losePatterns.length}</p>
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
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    winPatterns.reduce((acc, p) => acc + p.historicalData.successRate, 0) / winPatterns.length,
                  )}
                  %
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Historical RFPs</p>
                <p className="text-2xl font-bold text-purple-600">127</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All Categories" : category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patterns Tabs */}
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
              <PatternCard key={pattern.id} pattern={pattern} type="win" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lose" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLosePatterns.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} type="lose" />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pattern Insights */}
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
                {winPatterns.slice(0, 3).map((pattern) => (
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
                {losePatterns.slice(0, 3).map((pattern) => (
                  <div key={pattern.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm font-medium">{pattern.name}</span>
                    <Badge variant="outline" className="text-xs bg-red-100 text-red-800">
                      {pattern.historicalData.successRate}% success
                    </Badge>
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
