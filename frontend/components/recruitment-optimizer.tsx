"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calculator,
  Loader2,
  RefreshCw,
  ExternalLink,
  Briefcase,
  Clock,
  Target
} from "lucide-react"

interface RecruitmentOptimizerProps {
  data: any
}

interface BackendRecommendation {
  skill_name: string
  level: "Junior" | "Mid-level" | "Senior" | "Expert"
  urgency: "Immediate" | "Short-term" | "Long-term"
  contract_type: string
  estimated_cost: number
  duration_months: number
  business_impact: "Critical" | "High" | "Medium" | "Low"
  justification: string
  source: string
}

interface ContractOption {
  type: string
  monthlyCost: number
  setupCost: number
  benefits: number
  socialCharges: number
  totalMonthlyCost: number
  advantages: string[]
  disadvantages: string[]
  bestFor: string[]
  availability: string
  minDuration: number
  maxDuration: number
  knowledgeRetention: string
  teamIntegration: string
  specialization: string
}

export function RecruitmentOptimizer({ data }: RecruitmentOptimizerProps) {
  const [backendRecommendations, setBackendRecommendations] = useState<BackendRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Fetch real recruitment recommendations from backend
  useEffect(() => {
    if (data && data.source === "real_backend") {
      fetchRecruitmentRecommendations()
    }
  }, [data])

  const fetchRecruitmentRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/recruitment/recommendations')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to fetch recruitment recommendations')
      }

      const result = await response.json()
      setBackendRecommendations(result.recommendations || [])
      setLastUpdated(result.analysis_date || new Date().toISOString())

    } catch (err) {
      console.error('Failed to fetch recruitment recommendations:', err)
      setError(err instanceof Error ? err.message : 'Failed to load recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshRecommendations = () => {
    fetchRecruitmentRecommendations()
  }

  // Enhanced contract options based on real backend data
  const getContractOptions = (recommendation: BackendRecommendation): ContractOption[] => {
    const baseSalary = {
      Junior: 45000,
      "Mid-level": 60000,
      Senior: 80000,
      Expert: 100000,
    }[recommendation.level]

    const consultantRate = {
      Junior: 400,
      "Mid-level": 550,
      Senior: 750,
      Expert: 950,
    }[recommendation.level]

    return [
      {
        type: "CDI",
        monthlyCost: baseSalary / 12,
        setupCost: 5000,
        benefits: (baseSalary / 12) * 0.15,
        socialCharges: (baseSalary / 12) * 0.45,
        totalMonthlyCost: (baseSalary / 12) * 1.6,
        availability: "2-3 months",
        minDuration: 52,
        maxDuration: 999,
        knowledgeRetention: "High",
        teamIntegration: "High",
        specialization: "General",
        advantages: [
          "Long-term commitment and loyalty",
          "Deep knowledge retention",
          "Strong team integration",
          "Lower hourly cost for long projects"
        ],
        disadvantages: [
          "High social charges (45%)",
          "Difficult to terminate",
          "Fixed cost regardless of workload"
        ],
        bestFor: [
          "Long-term projects (>18 months)",
          "Core team positions",
          "Knowledge-critical roles"
        ]
      },
      {
        type: "CDD",
        monthlyCost: baseSalary / 12,
        setupCost: 2000,
        benefits: (baseSalary / 12) * 0.1,
        socialCharges: (baseSalary / 12) * 0.42,
        totalMonthlyCost: (baseSalary / 12) * 1.52,
        availability: "1 month",
        minDuration: 4,
        maxDuration: 78,
        knowledgeRetention: "Medium",
        teamIntegration: "Medium",
        specialization: "General",
        advantages: [
          "Fixed duration contract",
          "Lower social charges than CDI",
          "Good for specific projects"
        ],
        disadvantages: [
          "Still significant social charges (42%)",
          "Limited contract duration",
          "May require conversion to CDI"
        ],
        bestFor: [
          "Medium-term projects (6-18 months)",
          "Specific expertise needs",
          "Project-based work"
        ]
      },
      {
        type: "Consultant",
        monthlyCost: consultantRate * 22,
        setupCost: 500,
        benefits: 0,
        socialCharges: 0,
        totalMonthlyCost: consultantRate * 22,
        availability: "1-2 weeks",
        minDuration: 2,
        maxDuration: 52,
        knowledgeRetention: "Low",
        teamIntegration: "Medium",
        specialization: "Specialized",
        advantages: [
          "No social charges",
          "Quick availability",
          "Specialized expertise",
          "Easy to terminate"
        ],
        disadvantages: [
          "Higher daily rate",
          "No long-term commitment",
          "Knowledge leaves with consultant"
        ],
        bestFor: [
          "Short-term projects (<12 months)",
          "Specialized expertise",
          "Urgent needs"
        ]
      }
    ]
  }

  const calculateOptimalChoice = (recommendation: BackendRecommendation) => {
    const options = getContractOptions(recommendation)
    const duration = recommendation.duration_months

    const calculations = options.map((option) => {
      const totalCost = option.setupCost + option.totalMonthlyCost * duration

      // Apply urgency and impact factors
      let adjustmentFactor = 1
      if (recommendation.urgency === "Immediate" && option.type === "Consultant") {
        adjustmentFactor = 0.9 // Favor consultants for immediate needs
      }
      if (recommendation.business_impact === "Critical" && option.knowledgeRetention === "High") {
        adjustmentFactor = 0.95 // Favor high retention for critical roles
      }

      return {
        ...option,
        totalProjectCost: totalCost * adjustmentFactor,
        costPerMonth: totalCost / duration
      }
    })

    return calculations.sort((a, b) => a.totalProjectCost - b.totalProjectCost)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Immediate": return "bg-red-100 text-red-800"
      case "Short-term": return "bg-yellow-100 text-yellow-800"
      case "Long-term": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical": return "bg-red-100 text-red-800"
      case "High": return "bg-orange-100 text-orange-800"
      case "Medium": return "bg-yellow-100 text-yellow-800"
      case "Low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getContractColor = (type: string) => {
    switch (type) {
      case "CDI": return "bg-blue-100 text-blue-800"
      case "CDD": return "bg-purple-100 text-purple-800"
      case "Consultant": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recruitment Analysis Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to see recruitment recommendations</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recruitment Cost Optimizer</h2>
          <p className="text-gray-600">AI-powered hiring recommendations based on real RFP analysis</p>
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
            <Calculator className="w-4 h-4 mr-2" />
            Cost Calculator
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
                  {data.source === "real_backend" ? "Real Backend Analysis" : "Limited Data Available"}
                </p>
                <p className="text-sm text-gray-600">
                  {lastUpdated && `Last updated: ${new Date(lastUpdated).toLocaleString()}`}
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
              <p className="text-gray-600">Loading recruitment recommendations from AI backend...</p>
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
                  <p className="text-sm font-medium text-gray-600">Skills Needed</p>
                  <p className="text-2xl font-bold text-blue-600">{backendRecommendations.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Immediate Needs</p>
                  <p className="text-2xl font-bold text-red-600">
                    {backendRecommendations.filter(r => r.urgency === "Immediate").length}
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
                  <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(
                      backendRecommendations.reduce((sum, r) => sum + r.duration_months, 0) / backendRecommendations.length
                    )}
                  </p>
                  <p className="text-xs text-gray-500">months</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Est. Total Cost</p>
                  <p className="text-2xl font-bold text-purple-600">
                    €{Math.round(
                      backendRecommendations.reduce((sum, rec) => sum + rec.estimated_cost, 0) / 1000
                    )}K
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Real Skills Requirements from Backend */}
      {!isLoading && backendRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Real Skills Requirements</CardTitle>
                <CardDescription>Based on AI analysis of RFP document and gap identification</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                AI-Generated
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {backendRecommendations.map((recommendation, index) => {
                const optimal = calculateOptimalChoice(recommendation)[0]
                const isSelected = selectedSkill === recommendation.skill_name

                return (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedSkill(recommendation.skill_name)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{recommendation.skill_name}</CardTitle>
                          <CardDescription className="mt-1">{recommendation.level} level</CardDescription>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getUrgencyColor(recommendation.urgency)}>
                            {recommendation.urgency}
                          </Badge>
                          <Badge className={getImpactColor(recommendation.business_impact)}>
                            {recommendation.business_impact}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Duration:</span>
                            <span className="ml-2 font-medium">{recommendation.duration_months} months</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Contract:</span>
                            <span className="ml-2 font-medium">{recommendation.contract_type}</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">Optimal Choice:</div>
                          <div className="flex items-center justify-between">
                            <Badge className={getContractColor(optimal.type)}>{optimal.type}</Badge>
                            <span className="font-bold text-green-600">
                              €{Math.round(optimal.totalProjectCost / 1000)}K
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">Justification:</div>
                          <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                            {recommendation.justification}
                          </p>
                        </div>

                        <div className="text-xs text-gray-500">
                          Source: {recommendation.source}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis for Selected Skill */}
      {selectedSkill && backendRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Cost Analysis: {selectedSkill}</CardTitle>
            <CardDescription>AI-powered contract type optimization</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const recommendation = backendRecommendations.find(r => r.skill_name === selectedSkill)
              if (!recommendation) return null

              const options = calculateOptimalChoice(recommendation)

              return (
                <div className="space-y-6">
                  {/* Real Recommendation Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-bold">{recommendation.duration_months} months</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Level</div>
                      <div className="font-bold">{recommendation.level}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Urgency</div>
                      <Badge className={getUrgencyColor(recommendation.urgency)}>
                        {recommendation.urgency}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Impact</div>
                      <Badge className={getImpactColor(recommendation.business_impact)}>
                        {recommendation.business_impact}
                      </Badge>
                    </div>
                  </div>

                  {/* AI Justification */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-800 flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        AI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-700 text-sm">
                        {recommendation.justification}
                      </p>
                      <div className="mt-2 text-xs text-blue-600">
                        Recommended contract type: <strong>{recommendation.contract_type}</strong>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contract Options Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {options.map((option, index) => (
                      <Card key={option.type} className={`${index === 0 ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Badge className={getContractColor(option.type)}>{option.type}</Badge>
                            {index === 0 && (
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                                <Badge className="bg-green-100 text-green-800 text-xs">OPTIMAL</Badge>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>📅 Available: {option.availability}</div>
                            <div>⏱️ Duration: {option.minDuration}-{option.maxDuration}w</div>
                            <div>🎯 Specialization: {option.specialization}</div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Cost Breakdown */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Monthly Base:</span>
                                <span>€{Math.round(option.monthlyCost)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Social Charges:</span>
                                <span>€{Math.round(option.socialCharges)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Setup Cost:</span>
                                <span>€{option.setupCost}</span>
                              </div>
                              <hr />
                              <div className="flex justify-between font-bold">
                                <span>Monthly Total:</span>
                                <span>€{Math.round(option.totalMonthlyCost)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-lg">
                                <span>Project Total:</span>
                                <span className="text-green-600">€{Math.round(option.totalProjectCost / 1000)}K</span>
                              </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-medium">Retention</div>
                                <Badge variant="outline" className={`text-xs ${
                                  option.knowledgeRetention === "High" ? "bg-green-100 text-green-800" :
                                  option.knowledgeRetention === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
                                  {option.knowledgeRetention}
                                </Badge>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">Integration</div>
                                <Badge variant="outline" className={`text-xs ${
                                  option.teamIntegration === "High" ? "bg-green-100 text-green-800" :
                                  option.teamIntegration === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
                                  {option.teamIntegration}
                                </Badge>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">Expertise</div>
                                <Badge variant="outline" className={`text-xs ${
                                  option.specialization === "Expert" ? "bg-purple-100 text-purple-800" :
                                  option.specialization === "Specialized" ? "bg-blue-100 text-blue-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {option.specialization}
                                </Badge>
                              </div>
                            </div>

                            {/* Best For */}
                            <div>
                              <h4 className="font-medium text-sm mb-2">Best For:</h4>
                              <ul className="space-y-1">
                                {option.bestFor.slice(0, 2).map((use, idx) => (
                                  <li key={idx} className="text-xs text-gray-700">
                                    • {use}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* AI Recommendation */}
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-800">💡 AI Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-800">
                        <strong>Best choice: {options[0].type}</strong> for this {recommendation.skill_name} position.
                      </p>
                      <p className="text-sm text-green-700 mt-2">
                        Based on {recommendation.duration_months}-month duration, {recommendation.urgency.toLowerCase()} urgency,
                        and {recommendation.business_impact.toLowerCase()} business impact, this option provides optimal
                        cost-effectiveness at €{Math.round(options[0].totalProjectCost / 1000)}K total cost.
                      </p>
                      <p className="text-sm text-green-700 mt-2">
                        <strong>Backend Analysis:</strong> {recommendation.justification}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Overall Strategy based on Real Data */}
      {!isLoading && backendRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Optimized Recruitment Strategy</CardTitle>
            <CardDescription>Complete hiring plan based on real RFP gap analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-800 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                  Real Backend Recommendations
                </h4>
                {backendRecommendations.map((recommendation, index) => {
                  const optimal = calculateOptimalChoice(recommendation)[0]
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{recommendation.skill_name}</div>
                        <div className="text-sm text-gray-600">
                          {recommendation.level} • {recommendation.duration_months} months • {recommendation.urgency}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {recommendation.justification.substring(0, 100)}...
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getContractColor(optimal.type)}>
                          {optimal.type}
                        </Badge>
                        <div className="text-right">
                          <div className="font-bold">€{Math.round(optimal.totalProjectCost / 1000)}K</div>
                          <div className="text-sm text-gray-600">€{Math.round(optimal.totalMonthlyCost)}/month</div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between font-bold text-lg">
                    <span>Total AI-Optimized Cost:</span>
                    <span className="text-green-600">
                      €{Math.round(
                        backendRecommendations.reduce((sum, rec) => {
                          const optimal = calculateOptimalChoice(rec)[0]
                          return sum + optimal.totalProjectCost
                        }, 0) / 1000
                      )}K
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    AI-optimized mix based on real gap analysis and project requirements
                  </div>
                </div>
              </div>

              {/* Backend Insights */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    AI Backend Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {backendRecommendations.filter(r => r.urgency === "Immediate").length}
                        </div>
                        <div className="text-sm text-blue-700">Immediate Hires Needed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {backendRecommendations.filter(r => r.business_impact === "Critical").length}
                        </div>
                        <div className="text-sm text-blue-700">Critical Impact Roles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(
                            backendRecommendations.reduce((sum, r) => sum + r.estimated_cost, 0) /
                            backendRecommendations.length / 1000
                          )}K
                        </div>
                        <div className="text-sm text-blue-700">Avg Cost per Position</div>
                      </div>
                    </div>

                    <div className="text-sm text-blue-700">
                      <strong>Key Insights from AI Analysis:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Most positions identified as {backendRecommendations.filter(r => r.urgency === "Immediate").length > 0 ? "immediate needs" : "medium-term requirements"}</li>
                        <li>Average project duration: {Math.round(backendRecommendations.reduce((sum, r) => sum + r.duration_months, 0) / backendRecommendations.length)} months</li>
                        <li>Optimal contract mix based on project timeline and expertise requirements</li>
                        <li>Cost optimization considers social charges, setup costs, and knowledge retention</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sourcing Strategy */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Recommended Sourcing Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {backendRecommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2 mb-2">
                          <Briefcase className="w-4 h-4 text-green-600" />
                          <div className="font-medium text-sm">{rec.skill_name}</div>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span>Level:</span>
                            <Badge variant="outline">{rec.level}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Contract:</span>
                            <Badge className={getContractColor(rec.contract_type)}>{rec.contract_type}</Badge>
                          </div>
                          <div className="text-gray-600">
                            <strong>Sourcing Channels:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {rec.level === "Senior" || rec.level === "Expert" ? (
                                <>
                                  <li>LinkedIn Premium</li>
                                  <li>Industry Networks</li>
                                  <li>Executive Search</li>
                                </>
                              ) : (
                                <>
                                  <li>Job Boards</li>
                                  <li>University Networks</li>
                                  <li>Internal Referrals</li>
                                </>
                              )}
                            </ul>
                          </div>
                          <div className="text-gray-600">
                            <strong>Timeline:</strong> {rec.urgency === "Immediate" ? "1-2 weeks" : rec.urgency === "Short-term" ? "2-6 weeks" : "1-3 months"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-white rounded-lg border-l-4 border-green-500">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm text-green-800">AI-Powered Sourcing Tips</div>
                        <div className="text-xs text-green-700 mt-1">
                          Based on successful RFP patterns, prioritize candidates with proven track records in similar projects.
                          Use technical assessments aligned with identified skill gaps. Consider cultural fit for long-term positions
                          and expertise depth for consultant roles.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Implementation Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Implementation Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <h4 className="font-medium text-red-800 mb-2">Phase 1: Immediate (0-4 weeks)</h4>
                        <div className="space-y-2">
                          {backendRecommendations
                            .filter(r => r.urgency === "Immediate")
                            .map((rec, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium">{rec.skill_name}</div>
                                <div className="text-xs text-red-700">
                                  {rec.level} • {rec.contract_type} • €{Math.round(rec.estimated_cost / 1000)}K
                                </div>
                              </div>
                            ))
                          }
                          {backendRecommendations.filter(r => r.urgency === "Immediate").length === 0 && (
                            <div className="text-sm text-red-700">No immediate hires required</div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                        <h4 className="font-medium text-yellow-800 mb-2">Phase 2: Short-term (1-3 months)</h4>
                        <div className="space-y-2">
                          {backendRecommendations
                            .filter(r => r.urgency === "Short-term")
                            .map((rec, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium">{rec.skill_name}</div>
                                <div className="text-xs text-yellow-700">
                                  {rec.level} • {rec.contract_type} • €{Math.round(rec.estimated_cost / 1000)}K
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-medium text-green-800 mb-2">Phase 3: Long-term (3+ months)</h4>
                        <div className="space-y-2">
                          {backendRecommendations
                            .filter(r => r.urgency === "Long-term")
                            .map((rec, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium">{rec.skill_name}</div>
                                <div className="text-xs text-green-700">
                                  {rec.level} • {rec.contract_type} • €{Math.round(rec.estimated_cost / 1000)}K
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <strong>Implementation Notes:</strong> This timeline is based on AI analysis of project requirements,
                      skill complexity, and historical hiring data. Adjust based on market conditions and internal priorities.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {!isLoading && backendRecommendations.length === 0 && data.source !== "real_backend" && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Limited Recruitment Data
            </h3>
            <p className="text-gray-600 mb-4">
              Complete a real RFP analysis with backend processing to get AI-powered recruitment recommendations
            </p>
            <Button onClick={refreshRecommendations} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Loading Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}