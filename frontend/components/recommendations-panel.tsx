"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  Users,
  Code,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
  RefreshCw,
  ExternalLink,
  Target,
  Zap,
  Settings,
  BookOpen
} from "lucide-react"

interface RecommendationsPanelProps {
  data: any
}

interface BackendRecommendation {
  id: string
  type: string
  priority: string
  title: string
  description: string
  impact: string
  effort: string
  timeline?: string
  skills?: string[]
  benefits?: string[]
  source: string
}

export function RecommendationsPanel({ data }: RecommendationsPanelProps) {
  const [backendRecommendations, setBackendRecommendations] = useState<BackendRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null)

  // Fetch recommendations from multiple backend sources
  useEffect(() => {
    if (data && data.source === "real_backend") {
      fetchAllRecommendations()
    }
  }, [data])

  const fetchAllRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const recommendations: BackendRecommendation[] = []

      // 1. Fetch analysis recommendations from completed analysis
      if (data.recommendations) {
        data.recommendations.forEach((rec: any, index: number) => {
          recommendations.push({
            id: `analysis_${index}`,
            type: rec.type || "strategic",
            priority: rec.priority || "medium",
            title: rec.title || `Recommendation ${index + 1}`,
            description: rec.description || "Strategic recommendation based on analysis",
            impact: rec.impact || "Medium",
            effort: rec.effort || "Medium",
            timeline: "4-8 weeks",
            skills: ["Solution Architect", "Project Manager"],
            benefits: ["Improved capabilities", "Better alignment"],
            source: "rfp_analysis"
          })
        })
      }

      // 2. Fetch pattern-based recommendations
      try {
        const patternResponse = await fetch('http://localhost:8000/api/patterns/analysis')
        if (patternResponse.ok) {
          const patternData = await patternResponse.json()

          // Add win pattern recommendations
          patternData.win_patterns?.forEach((pattern: any, index: number) => {
            recommendations.push({
              id: `pattern_win_${index}`,
              type: "pattern_application",
              priority: "high",
              title: `Apply ${pattern.name}`,
              description: `Implement this proven pattern with ${pattern.success_rate}% historical success rate in ${pattern.domain} projects`,
              impact: "High",
              effort: "Medium",
              timeline: "3-6 weeks",
              skills: ["Solution Architect", "Technical Lead"],
              benefits: [
                `${pattern.success_rate}% success rate`,
                "Proven approach",
                "Reduced risk"
              ],
              source: "pattern_analysis"
            })
          })

          // Add lose pattern avoidance recommendations
          patternData.lose_patterns?.forEach((pattern: any, index: number) => {
            recommendations.push({
              id: `pattern_avoid_${index}`,
              type: "pattern_avoidance",
              priority: "high",
              title: `Avoid ${pattern.name}`,
              description: `Prevent this risky pattern that has ${pattern.failure_rate}% failure rate in ${pattern.domain} projects`,
              impact: "High",
              effort: "Low",
              timeline: "1-2 weeks",
              skills: ["Solution Architect", "Technical Lead"],
              benefits: pattern.prevention_steps || [
                "Risk mitigation",
                "Better architecture",
                "Avoid common pitfalls"
              ],
              source: "pattern_analysis"
            })
          })
        }
      } catch (err) {
        console.warn('Pattern analysis not available:', err)
      }

      // 3. Fetch module-based recommendations
      try {
        const moduleResponse = await fetch('http://localhost:8000/api/modules/breakdown')
        if (moduleResponse.ok) {
          const moduleData = await moduleResponse.json()

          // Recommendations for modules needing updates
          moduleData.breakdown?.needs_update?.forEach((module: any, index: number) => {
            recommendations.push({
              id: `module_update_${index}`,
              type: "module_update",
              priority: "medium",
              title: `Update ${module.name}`,
              description: module.update_reason || `Modernize ${module.name} to meet current requirements`,
              impact: "Medium",
              effort: module.complexity?.toLowerCase() || "medium",
              timeline: "2-4 weeks",
              skills: ["Backend Developer", "DevOps Engineer"],
              benefits: [
                "Improved performance",
                "Better security",
                "Enhanced features"
              ],
              source: "module_analysis"
            })
          })

          // Recommendations for new module creation
          moduleData.breakdown?.to_create?.slice(0, 3).forEach((module: any, index: number) => {
            recommendations.push({
              id: `module_create_${index}`,
              type: "module_creation",
              priority: "high",
              title: `Create ${module.name}`,
              description: `Develop new ${module.name} to address identified gaps`,
              impact: "High",
              effort: module.complexity?.toLowerCase() || "high",
              timeline: `${module.estimated_weeks || 8}-${(module.estimated_weeks || 8) + 4} weeks`,
              skills: ["Full-Stack Developer", "Solution Architect"],
              benefits: [
                "Fill capability gap",
                "Meet RFP requirements",
                "Competitive advantage"
              ],
              source: "module_analysis"
            })
          })
        }
      } catch (err) {
        console.warn('Module analysis not available:', err)
      }

      // 4. Fetch recruitment-based recommendations
      try {
        const recruitmentResponse = await fetch('http://localhost:8000/api/recruitment/recommendations')
        if (recruitmentResponse.ok) {
          const recruitmentData = await recruitmentResponse.json()

          recruitmentData.recommendations?.slice(0, 3).forEach((rec: any, index: number) => {
            recommendations.push({
              id: `recruitment_${index}`,
              type: "skill_acquisition",
              priority: rec.urgency === "Immediate" ? "high" : "medium",
              title: `Hire ${rec.skill_name}`,
              description: rec.justification || `Recruit ${rec.level} ${rec.skill_name} for ${rec.duration_months} months`,
              impact: rec.business_impact || "High",
              effort: "High",
              timeline: `${rec.duration_months || 12} months`,
              skills: [rec.skill_name],
              benefits: [
                "Fill skill gap",
                "Accelerate development",
                "Improve capabilities"
              ],
              source: "recruitment_analysis"
            })
          })
        }
      } catch (err) {
        console.warn('Recruitment recommendations not available:', err)
      }

      // 5. Add process improvement recommendations based on analysis
      if (data.gapAnalysis) {
        const hasMultipleGaps = Object.values(data.gapAnalysis).some((gaps: any) => Array.isArray(gaps) && gaps.length > 3)

        if (hasMultipleGaps) {
          recommendations.push({
            id: "process_improvement_1",
            type: "process_improvement",
            priority: "medium",
            title: "Implement Automated Testing Pipeline",
            description: "Set up comprehensive CI/CD pipeline to handle complex requirements and reduce gaps",
            impact: "Medium",
            effort: "Medium",
            timeline: "3-5 weeks",
            skills: ["DevOps Engineer", "QA Engineer"],
            benefits: [
              "Faster delivery",
              "Higher quality",
              "Reduced manual errors"
            ],
            source: "gap_analysis"
          })

          recommendations.push({
            id: "process_improvement_2",
            type: "training",
            priority: "low",
            title: "Team Skill Enhancement Program",
            description: "Provide training to existing team on identified technology gaps",
            impact: "Medium",
            effort: "Low",
            timeline: "4-6 weeks",
            skills: ["All team members"],
            benefits: [
              "Reduce skill gaps",
              "Improve productivity",
              "Knowledge sharing"
            ],
            source: "gap_analysis"
          })
        }
      }

      setBackendRecommendations(recommendations)
      setLastUpdated(new Date().toISOString())

    } catch (err) {
      console.error('Failed to fetch recommendations:', err)
      setError(err instanceof Error ? err.message : 'Failed to load recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshRecommendations = () => {
    fetchAllRecommendations()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "module_creation":
        return <Code className="w-5 h-5 text-blue-600" />
      case "skill_acquisition":
        return <Users className="w-5 h-5 text-green-600" />
      case "module_update":
        return <Settings className="w-5 h-5 text-orange-600" />
      case "process_improvement":
        return <CheckCircle className="w-5 h-5 text-purple-600" />
      case "training":
        return <BookOpen className="w-5 h-5 text-yellow-600" />
      case "pattern_application":
        return <TrendingUp className="w-5 h-5 text-blue-600" />
      case "pattern_avoidance":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "strategic":
        return <Target className="w-5 h-5 text-purple-600" />
      default:
        return <Lightbulb className="w-5 h-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "rfp_analysis":
        return "bg-blue-100 text-blue-800"
      case "pattern_analysis":
        return "bg-purple-100 text-purple-800"
      case "module_analysis":
        return "bg-green-100 text-green-800"
      case "recruitment_analysis":
        return "bg-orange-100 text-orange-800"
      case "gap_analysis":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to see personalized recommendations</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Recommendations</h2>
          <p className="text-gray-600">Actionable insights based on real RFP analysis and historical patterns</p>
          {data.source && (
            <Badge variant="outline" className="mt-2">
              Source: {data.source}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshRecommendations} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Create Action Plan
          </Button>
        </div>
      </div>

      {/* Backend Status */}
      <Card className={`${data.source === "real_backend" ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {data.source === "real_backend" ? "Real AI Analysis" : "Limited Recommendations"}
                </p>
                <p className="text-sm text-gray-600">
                  {lastUpdated && `Generated: ${new Date(lastUpdated).toLocaleString()}`}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>Recommendations: {backendRecommendations.length}</div>
              <div>Analysis ID: {data.analysis_id || 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
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
              <p className="text-gray-600">Loading AI-powered recommendations...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards - Real Data */}
      {!isLoading && backendRecommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">
                    {backendRecommendations.filter((r) => r.priority === "high").length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Medium Priority</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {backendRecommendations.filter((r) => r.priority === "medium").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pattern-Based</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {backendRecommendations.filter((r) => r.source === "pattern_analysis").length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Actions</p>
                  <p className="text-2xl font-bold text-blue-600">{backendRecommendations.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Real Recommendations List */}
      {!isLoading && backendRecommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI-Generated Recommendations</h3>
            <Badge variant="outline" className="text-xs">
              Real Backend Analysis
            </Badge>
          </div>

          {backendRecommendations.map((recommendation) => (
            <Card
              key={recommendation.id}
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                selectedRecommendation === recommendation.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setSelectedRecommendation(
                selectedRecommendation === recommendation.id ? null : recommendation.id
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(recommendation.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                        <Badge className={getSourceBadgeColor(recommendation.source)} variant="outline">
                          {recommendation.source.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">{recommendation.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(recommendation.priority)}>
                    {recommendation.priority.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Metrics */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Impact:</span>
                        <span className={`font-medium ${getImpactColor(recommendation.impact)}`}>
                          {recommendation.impact}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Effort:</span>
                        <span className="font-medium">{recommendation.effort}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timeline:</span>
                        <span className="font-medium">{recommendation.timeline || "TBD"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Skills Required</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.skills && recommendation.skills.length > 0 ? (
                        recommendation.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          To be determined
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Expected Benefits</h4>
                    <ul className="space-y-1">
                      {recommendation.benefits && recommendation.benefits.length > 0 ? (
                        recommendation.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>{benefit}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-600 flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>Strategic improvement</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Source and Analysis Details */}
                {selectedRecommendation === recommendation.id && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">AI Analysis Details</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div><strong>Source:</strong> {recommendation.source.replace('_', ' ')}</div>
                        <div><strong>Generated:</strong> {new Date().toLocaleString()}</div>
                        <div><strong>Confidence:</strong> High (based on real analysis data)</div>
                        <div><strong>Type:</strong> {recommendation.type.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    Start Implementation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Data State */}
      {!isLoading && backendRecommendations.length === 0 && data.source !== "real_backend" && (
        <Card className="text-center py-12">
          <CardContent>
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Limited Recommendations Available
            </h3>
            <p className="text-gray-600 mb-4">
              Complete a real RFP analysis with backend processing to get comprehensive AI-powered recommendations
            </p>
            <Button onClick={refreshRecommendations} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Loading Recommendations
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Action Summary */}
      {!isLoading && backendRecommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Implementation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {backendRecommendations.filter(r => r.priority === "high").length}
                </div>
                <div className="text-sm text-gray-600">Immediate Actions</div>
                <div className="text-xs text-gray-500 mt-1">Start within 1-2 weeks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {backendRecommendations.filter(r => r.priority === "medium").length}
                </div>
                <div className="text-sm text-gray-600">Medium-term Actions</div>
                <div className="text-xs text-gray-500 mt-1">Plan for next month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {backendRecommendations.filter(r => r.priority === "low").length}
                </div>
                <div className="text-sm text-gray-600">Long-term Actions</div>
                <div className="text-xs text-gray-500 mt-1">Strategic initiatives</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                These recommendations are generated by AI analysis of your RFP requirements,
                historical success patterns, and identified capability gaps.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}