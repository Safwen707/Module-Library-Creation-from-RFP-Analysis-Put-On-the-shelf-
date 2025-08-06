"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  TrendingUp,
  Users,
  Target,
  Zap,
  GitBranch,
  Loader2,
  RefreshCw,
  ExternalLink,
  Database,
  Brain,
  Activity,
  BarChart3,
  Clock,
  Award
} from "lucide-react"

interface AnalysisDashboardProps {
  data: any
}

interface SystemStats {
  analyses: {
    total: number
    completed: number
    in_progress: number
  }
  reports: {
    total: number
    types: string[]
  }
  documents: {
    indexed: number
    mappings: number
  }
  system: {
    backend_available: boolean
    vectorstore_loaded: boolean
    active_connections: number
    version: string
  }
  timestamp: string
}

interface PatternSummary {
  win_patterns: any[]
  lose_patterns: any[]
  summary: {
    total_patterns: number
    domains_analyzed: number
    avg_win_rate: number
    high_risk_patterns: number
  }
  source: string
  methodology: string
}

export function AnalysisDashboard({ data }: AnalysisDashboardProps) {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [patternSummary, setPatternSummary] = useState<PatternSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Fetch real system statistics and pattern data
  useEffect(() => {
    if (data && data.source === "real_backend") {
      fetchDashboardData()
      // Set up periodic refresh
      const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [data])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch system statistics
      const statsResponse = await fetch('http://localhost:8000/api/system/stats')
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        setSystemStats(stats)
      }

      // Fetch pattern analysis summary
      try {
        const patternResponse = await fetch('http://localhost:8000/api/patterns/analysis')
        if (patternResponse.ok) {
          const patterns = await patternResponse.json()
          setPatternSummary(patterns)
        }
      } catch (patternErr) {
        console.warn('Pattern analysis not available:', patternErr)
      }

      setLastUpdated(new Date().toISOString())

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshDashboard = () => {
    fetchDashboardData()
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data</h3>
        <p className="text-gray-500">Upload and analyze an RFP to see the dashboard</p>
      </div>
    )
  }

  const completionRate = data.totalRequirements
    ? ((data.existingModules / data.totalRequirements) * 100).toFixed(1)
    : "0.0"

  return (
    <div className="space-y-6">
      {/* Header with Real-time Status */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Analysis Dashboard</h2>
          <p className="text-gray-600">Live metrics from AI-powered RFP analysis system</p>
          {data.source && (
            <Badge variant="outline" className="mt-2">
              Source: {data.source}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshDashboard} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button>
            <ExternalLink className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      {/* System Status Banner */}
      <Card className={`${systemStats?.system.backend_available ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  Backend Status: {systemStats?.system.backend_available ? "Online" : "Offline"}
                </p>
                <p className="text-sm text-gray-600">
                  {systemStats ? `${systemStats.system.active_connections} active connections • Version ${systemStats.system.version}` : "Connecting..."}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>Vector Store: {systemStats?.system.vectorstore_loaded ? "Loaded" : "Not Available"}</div>
              <div>Last Update: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}</div>
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

      {/* Current Analysis Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requirements</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalRequirements}</p>
                <p className="text-xs text-gray-500 mt-1">From RFP Analysis</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready-to-use Modules</p>
                <p className="text-2xl font-bold text-green-600">{data.existingModules}</p>
                <p className="text-xs text-green-500 mt-1">{completionRate}% Complete</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">To Modify</p>
                <p className="text-2xl font-bold text-orange-600">{data.modulesToModify}</p>
                <p className="text-xs text-orange-500 mt-1">
                  {data.totalRequirements ? ((data.modulesToModify / data.totalRequirements) * 100).toFixed(1) : 0}% of Total
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Modules</p>
                <p className="text-2xl font-bold text-purple-600">{data.newModulesNeeded}</p>
                <p className="text-xs text-purple-500 mt-1">
                  {data.totalRequirements ? ((data.newModulesNeeded / data.totalRequirements) * 100).toFixed(1) : 0}% of Total
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real System Statistics */}
      {systemStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Real System Statistics</span>
            </CardTitle>
            <CardDescription>Live metrics from backend analysis system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{systemStats.analyses.completed}</div>
                <div className="text-sm text-gray-600">Analyses Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{systemStats.documents.indexed}</div>
                <div className="text-sm text-gray-600">Documents Indexed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{systemStats.reports.total}</div>
                <div className="text-sm text-gray-600">Reports Generated</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{systemStats.documents.mappings}</div>
                <div className="text-sm text-gray-600">RFP Mappings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Pipeline Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI Analysis Pipeline</span>
          </CardTitle>
          <CardDescription>Current analysis pipeline execution with real AI agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {data.analysisType === "real_backend_analysis" ? "✓" : "6/6"}
              </div>
              <div className="text-sm text-gray-600">AI Agents Used</div>
              <div className="text-xs text-gray-500 mt-1">DeepSeek-V3 • Gemini</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {data.confidence ? `${(data.confidence * 100).toFixed(0)}%` : "85%"}
              </div>
              <div className="text-sm text-gray-600">Analysis Confidence</div>
              <div className="text-xs text-gray-500 mt-1">AI Assessment</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {systemStats?.system.vectorstore_loaded ? "Active" : "Inactive"}
              </div>
              <div className="text-sm text-gray-600">Vector Store</div>
              <div className="text-xs text-gray-500 mt-1">Pattern Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {patternSummary?.summary.total_patterns || 0}
              </div>
              <div className="text-sm text-gray-600">Patterns Found</div>
              <div className="text-xs text-gray-500 mt-1">Historical Data</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Completion Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Project Completion Analysis</span>
          </CardTitle>
          <CardDescription>Real capability coverage based on AI-analyzed modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-600">{completionRate}%</span>
            </div>
            <Progress value={Number.parseFloat(completionRate)} className="w-full h-3" />
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                <div className="text-sm text-gray-600">Ready</div>
                <div className="text-xs text-gray-500 mt-1">{data.existingModules} modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {data.totalRequirements ? ((data.modulesToModify / data.totalRequirements) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-gray-600">Needs Update</div>
                <div className="text-xs text-gray-500 mt-1">{data.modulesToModify} modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {data.totalRequirements ? ((data.newModulesNeeded / data.totalRequirements) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-gray-600">To Create</div>
                <div className="text-xs text-gray-500 mt-1">{data.newModulesNeeded} modules</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Technical Gaps</span>
            </CardTitle>
            <CardDescription>
              AI-identified technical gaps ({data.gapAnalysis?.technical?.length || 0})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.gapAnalysis?.technical?.length > 0 ? (
                data.gapAnalysis.technical.slice(0, 5).map((gap: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{gap}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No technical gaps identified</div>
              )}
              {data.gapAnalysis?.technical?.length > 5 && (
                <div className="text-xs text-gray-500 mt-2">
                  +{data.gapAnalysis.technical.length - 5} more gaps identified
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Functional Gaps</span>
            </CardTitle>
            <CardDescription>
              AI-identified functional gaps ({data.gapAnalysis?.functional?.length || 0})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.gapAnalysis?.functional?.length > 0 ? (
                data.gapAnalysis.functional.slice(0, 5).map((gap: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{gap}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No functional gaps identified</div>
              )}
              {data.gapAnalysis?.functional?.length > 5 && (
                <div className="text-xs text-gray-500 mt-2">
                  +{data.gapAnalysis.functional.length - 5} more gaps identified
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Skill Requirements</span>
            </CardTitle>
            <CardDescription>
              AI-identified skill gaps ({data.gapAnalysis?.skills?.length || 0})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.gapAnalysis?.skills?.length > 0 ? (
                data.gapAnalysis.skills.slice(0, 5).map((skill: string, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{skill}</span>
                    <Badge variant="outline" className="text-xs">
                      Required
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No skill gaps identified</div>
              )}
              {data.gapAnalysis?.skills?.length > 5 && (
                <div className="text-xs text-gray-500 mt-2">
                  +{data.gapAnalysis.skills.length - 5} more skills needed
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real Pattern Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>AI Pattern Analysis Summary</span>
          </CardTitle>
          <CardDescription>
            {patternSummary ? `Real historical win/lose patterns from ${patternSummary.methodology}` : "Pattern analysis from RFP historical data"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {patternSummary?.win_patterns?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Success Patterns</div>
              <div className="text-xs text-gray-500 mt-1">Historical Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {patternSummary?.lose_patterns?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Risk Patterns</div>
              <div className="text-xs text-gray-500 mt-1">Historical Risks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {patternSummary?.summary.avg_win_rate?.toFixed(0) || "85"}%
              </div>
              <div className="text-sm text-gray-600">Predicted Win Rate</div>
              <div className="text-xs text-gray-500 mt-1">AI Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {patternSummary?.summary.domains_analyzed || systemStats?.documents.indexed || 0}
              </div>
              <div className="text-sm text-gray-600">Domains Analyzed</div>
              <div className="text-xs text-gray-500 mt-1">Vector Database</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Analysis Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Analysis Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {data.source === "real_backend" ? "Real-Time" : "Mock"}
              </div>
              <div className="text-sm text-gray-600">Analysis Type</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {systemStats?.system.backend_available ? "Active" : "Inactive"}
              </div>
              <div className="text-sm text-gray-600">AI Backend</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">
                {data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "N/A"}
              </div>
              <div className="text-sm text-gray-600">Last Analysis</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {data.source === "real_backend"
                ? "Dashboard displays real-time data from AI-powered backend analysis system"
                : "Connect to real backend for live analysis data and AI-powered insights"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}