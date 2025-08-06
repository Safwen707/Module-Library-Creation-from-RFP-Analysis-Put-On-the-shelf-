"use client"

import { useState, useEffect } from "react"
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
  Loader2,
  RefreshCw,
  ExternalLink,
  Database,
  Brain,
} from "lucide-react"

interface PatternAnalysisProps {
  data: any
}

interface BackendPattern {
  id: string
  name: string
  description: string
  domain: string
  frequency: number
  success_rate?: number
  failure_rate?: number
  examples: string[]
  prevention_steps?: string[]
  source: string
}

interface BackendPatternData {
  win_patterns: BackendPattern[]
  lose_patterns: BackendPattern[]
  summary: {
    total_patterns: number
    domains_analyzed: number
    avg_win_rate: number
    high_risk_patterns: number
  }
  source: string
  methodology: string
}

export function PatternAnalysis({ data }: PatternAnalysisProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [backendPatterns, setBackendPatterns] = useState<BackendPatternData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)

  // Fetch real pattern analysis from backend
  useEffect(() => {
    if (data && data.source === "real_backend") {
      fetchPatternAnalysis()
    }
  }, [data])

  const fetchPatternAnalysis = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/patterns/analysis')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to fetch pattern analysis')
      }

      const result = await response.json()
      setBackendPatterns(result)
      setLastUpdated(new Date().toISOString())

    } catch (err) {
      console.error('Failed to fetch pattern analysis:', err)
      setError(err instanceof Error ? err.message : 'Failed to load pattern analysis')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPatterns = () => {
    fetchPatternAnalysis()
  }

  // Extract unique domains from backend patterns for filtering
  const getDomainsFromPatterns = (): string[] => {
    if (!backendPatterns) return []

    const domains = new Set<string>()
    backendPatterns.win_patterns.forEach(p => domains.add(p.domain))
    backendPatterns.lose_patterns.forEach(p => domains.add(p.domain))

    return ['all', ...Array.from(domains).sort()]
  }

  const domains = getDomainsFromPatterns()

  const filteredWinPatterns = backendPatterns?.win_patterns.filter(
    (pattern) => selectedCategory === "all" || pattern.domain === selectedCategory
  ) || []

  const filteredLosePatterns = backendPatterns?.lose_patterns.filter(
    (pattern) => selectedCategory === "all" || pattern.domain === selectedCategory
  ) || []

  const getDomainColor = (domain: string) => {
    const colors = {
      'security': 'bg-red-100 text-red-800',
      'cloud': 'bg-blue-100 text-blue-800',
      'ai': 'bg-purple-100 text-purple-800',
      'mobile': 'bg-green-100 text-green-800',
      'integration': 'bg-orange-100 text-orange-800',
      'database': 'bg-indigo-100 text-indigo-800',
      'all': 'bg-gray-100 text-gray-800'
    }
    return colors[domain.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getDomainIcon = (domain: string) => {
    const icons = {
      'security': <Target className="w-4 h-4" />,
      'cloud': <Settings className="w-4 h-4" />,
      'ai': <Brain className="w-4 h-4" />,
      'mobile': <Users className="w-4 h-4" />,
      'integration': <Database className="w-4 h-4" />,
      'database': <BarChart3 className="w-4 h-4" />,
      'all': <AlertTriangle className="w-4 h-4" />
    }
    return icons[domain.toLowerCase() as keyof typeof icons] || <AlertTriangle className="w-4 h-4" />
  }

  const getPreventionPlan = (pattern: BackendPattern) => {
    return {
      actions: pattern.prevention_steps || [
        "Review pattern details with technical team",
        "Implement preventive measures",
        "Monitor for pattern indicators",
        "Regular assessment and improvement"
      ],
      timeline: "2-6 weeks",
      roles: ["Solution Architect", "Technical Lead", "Project Manager"],
    }
  }

  const avgWinRate = backendPatterns?.summary.avg_win_rate || 0

  const BackendPatternCard = ({ pattern, isWin }: { pattern: BackendPattern; isWin: boolean }) => {
    return (
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer ${
          isWin ? "border-green-200" : "border-red-200"
        } ${selectedPattern === pattern.id ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
        onClick={() => setSelectedPattern(selectedPattern === pattern.id ? null : pattern.id)}
      >
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
            <div className="flex flex-col gap-1">
              <Badge className={getDomainColor(pattern.domain)}>{pattern.domain}</Badge>
              <Badge variant="outline" className="text-xs">Real Data</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Frequency</span>
                  <span>{pattern.frequency}</span>
                </div>
                <Progress value={Math.min(pattern.frequency * 10, 100)} className="h-2" />
              </div>
              {isWin && pattern.success_rate && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Success Rate</span>
                    <span>{pattern.success_rate}%</span>
                  </div>
                  <Progress value={pattern.success_rate} className="h-2" />
                </div>
              )}
              {!isWin && pattern.failure_rate && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Failure Rate</span>
                    <span>{pattern.failure_rate}%</span>
                  </div>
                  <Progress value={pattern.failure_rate} className="h-2 [&>div]:bg-red-500" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg">{pattern.frequency}</div>
                <div className="text-gray-600">Occurrences</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">
                  {isWin ? `${pattern.success_rate || 0}%` : `${pattern.failure_rate || 0}%`}
                </div>
                <div className="text-gray-600">{isWin ? 'Success' : 'Failure'} Rate</div>
              </div>
            </div>

            {/* Examples from real data */}
            <div>
              <h4 className="font-medium text-sm mb-2">
                {isWin ? "Success Examples:" : "Failure Examples:"}
              </h4>
              <ul className="space-y-1">
                {pattern.examples.slice(0, 2).map((example, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isWin ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expanded details when selected */}
            {selectedPattern === pattern.id && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border-t">
                <h4 className="font-medium text-sm mb-2">Detailed Analysis</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div><strong>Domain:</strong> {pattern.domain}</div>
                  <div><strong>Source:</strong> {pattern.source}</div>
                  <div><strong>Pattern ID:</strong> {pattern.id}</div>
                  <div><strong>All Examples:</strong></div>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    {pattern.examples.map((example, idx) => (
                      <li key={idx}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              {isWin ? (
                <Button size="sm" className="flex-1 bg-green-600">
                  Apply Pattern
                </Button>
              ) : (
                <Button size="sm" className="flex-1 bg-red-600">
                  Prevent Pattern
                </Button>
              )}
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
        <p className="text-gray-500">Complete an RFP analysis to see historical patterns</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Pattern & Success Analysis</h2>
          <p className="text-gray-600">Historical patterns from real RFP data and vector store analysis</p>
          {data.source && (
            <Badge variant="outline" className="mt-2">
              Source: {data.source}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshPatterns} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button>
            <Award className="w-4 h-4 mr-2" />
            Best Practices
          </Button>
        </div>
      </div>

      {/* Backend Status */}
      <Card className={`${data.source === "real_backend" ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {data.source === "real_backend" ? "Real Vector Store Analysis" : "Limited Pattern Data"}
                </p>
                <p className="text-sm text-gray-600">
                  {backendPatterns ? `${backendPatterns.methodology} - ${backendPatterns.summary.domains_analyzed} domains analyzed` : "Waiting for analysis"}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>Patterns: {backendPatterns?.summary.total_patterns || 0}</div>
              <div>Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <p className="text-gray-600">Analyzing patterns from vector store and historical data...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards - Real Data */}
      {!isLoading && backendPatterns && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <p className="text-sm font-medium text-gray-600">Risk Patterns</p>
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
                  <p className="text-2xl font-bold text-blue-600">{avgWinRate.toFixed(1)}%</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Domains</p>
                  <p className="text-2xl font-bold text-purple-600">{backendPatterns.summary.domains_analyzed}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Domain Filter */}
      {!isLoading && backendPatterns && domains.length > 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <Button
                  key={domain}
                  variant={selectedCategory === domain ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(domain)}
                  className="flex items-center space-x-2"
                >
                  {getDomainIcon(domain)}
                  <span>{domain === "all" ? "All Domains" : domain.charAt(0).toUpperCase() + domain.slice(1)}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pattern Tabs */}
      {!isLoading && backendPatterns && (
        <Tabs defaultValue="win" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="win" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Success Patterns ({filteredWinPatterns.length})</span>
            </TabsTrigger>
            <TabsTrigger value="lose" className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4" />
              <span>Risk Patterns ({filteredLosePatterns.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="win" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Proven Success Patterns</h3>
              <Badge variant="outline" className="text-xs">
                From Real Historical Data
              </Badge>
            </div>

            {filteredWinPatterns.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredWinPatterns.map((pattern) => (
                  <BackendPatternCard key={pattern.id} pattern={pattern} isWin={true} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No success patterns found for selected domain</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="lose" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Risk Patterns to Avoid</h3>
              <Badge variant="outline" className="text-xs">
                From Real Failure Analysis
              </Badge>
            </div>

            {filteredLosePatterns.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredLosePatterns.map((pattern) => (
                  <div key={pattern.id} className="space-y-4">
                    <BackendPatternCard pattern={pattern} isWin={false} />
                    <Card className="border-red-200">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-red-800">
                          <Zap className="w-5 h-5" />
                          <span>AI-Generated Prevention Plan</span>
                        </CardTitle>
                        <CardDescription>Actionable steps to avoid this failure pattern</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm text-red-600 mb-2">Prevention Steps</h4>
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
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No risk patterns found for selected domain</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Current RFP Insights */}
      {!isLoading && backendPatterns && (filteredWinPatterns.length > 0 || filteredLosePatterns.length > 0) && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>AI Insights for Current RFP</span>
            </CardTitle>
            <CardDescription>Real pattern analysis based on vector store and historical data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-600 mb-3">Recommended Success Patterns</h4>
                <div className="space-y-2">
                  {filteredWinPatterns.slice(0, 3).map((pattern) => (
                    <div key={pattern.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">{pattern.name}</span>
                      <div className="flex space-x-2">
                        <Badge className={getDomainColor(pattern.domain)} variant="outline">
                          {pattern.domain}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                          {pattern.success_rate || pattern.frequency}% success
                        </Badge>
                      </div>
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
                      <div className="flex space-x-2">
                        <Badge className={getDomainColor(pattern.domain)} variant="outline">
                          {pattern.domain}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-red-100 text-red-800">
                          {pattern.failure_rate || 100 - (pattern.frequency * 10)}% failure
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Analysis based on {backendPatterns.summary.total_patterns} patterns across {backendPatterns.summary.domains_analyzed} domains
                using {backendPatterns.methodology}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {!isLoading && !backendPatterns && data.source !== "real_backend" && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Limited Pattern Analysis Available
            </h3>
            <p className="text-gray-600 mb-4">
              Complete a real RFP analysis with backend processing to get AI-powered pattern insights from historical data
            </p>
            <Button onClick={refreshPatterns} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Loading Pattern Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}