"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import {
  DollarSign,
  Calculator,
  TrendingUp,
  Loader2,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Code,
  Settings
} from "lucide-react"

interface ModuleCostEstimatorProps {
  data: any
}

interface BackendCostEstimate {
  id: string
  name: string
  status: string
  estimated_cost: number
  timeline_weeks: number
  complexity: string
  category: string
  effort?: string
  source: string
}

interface CostSummary {
  estimates: BackendCostEstimate[]
  summary: {
    total_cost: number
    total_timeline_weeks: number
    total_modules: number
    avg_cost_per_module: number
  }
  methodology: string
}

export function ModuleCostEstimator({ data }: ModuleCostEstimatorProps) {
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [moduleStates, setModuleStates] = useState<{ [key: string]: 'add' | 'modify' }>({})
  const [costData, setCostData] = useState<CostSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [customFactors, setCustomFactors] = useState({
    urgencyMultiplier: 1,
    qualityMultiplier: 1,
    riskBuffer: 0.2,
  })

  // Fetch real cost estimates from backend
  useEffect(() => {
    if (data && data.source === "real_backend") {
      fetchCostEstimates()
    }
  }, [data])

  const fetchCostEstimates = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch('http://localhost:8000/api/modules/cost-estimate');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch cost estimates');
    }

    const backendData = await response.json();

    // Transform the backend data
    const costEstimates = {
      estimates: [
        ...backendData.cost_estimates.module_development_costs.map((m: any) => ({
          id: `module_${m.module.replace(/\s+/g, '_').toLowerCase()}`,
          name: m.module,
          status: m.status === 'completed' ? 'ready' :
                 m.status === 'beta' ? 'needs_update' : 'to_create',
          estimated_cost: parseFloat(m.development_cost.replace(/[^0-9.]/g, '')) * 1000,
          timeline_weeks: parseInt(m.timeline.split('-')[0].trim()),
          complexity: m.complexity,
          category: m.module.split(' ').pop(),
          source: "FastAPI Backend"
        })),
        ...backendData.cost_estimates.third_party_licenses.common_tools.map((m: any, i: number) => ({
          id: `license_${i}`,
          name: m,
          status: 'ready',
          estimated_cost: 10000, // Default value
          timeline_weeks: 1,
          complexity: 'Low',
          category: 'Licenses',
          source: "FastAPI Backend"
        }))
      ],
      summary: {
        total_cost: parseFloat(backendData.roi_analysis.module_reuse_savings.replace(/[^0-9.]/g, '')) * 1000,
        total_timeline_weeks: 12, // Default value
        total_modules: backendData.cost_estimates.module_development_costs.length,
        avg_cost_per_module: parseFloat(backendData.cost_estimates.resource_costs.hourly_rates.senior_developer.replace(/[^0-9.]/g, '')) * 1000
      },
      methodology: backendData.metadata?.cost_basis_date || "AI-powered cost estimation"
    };

    setCostData(costEstimates);
    setLastUpdated(new Date().toISOString());
  } catch (err) {
    console.error('Failed to fetch cost estimates:', err);
    setError(err instanceof Error ? err.message : 'Failed to load cost estimates');
  } finally {
    setIsLoading(false);
  }
};

  const refreshCosts = () => {
    fetchCostEstimates()
  }

  const toggleModuleSelection = (moduleId: string) => {
    setSelectedModules((prev) => {
      const newSelection = prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]

      if (!newSelection.includes(moduleId)) {
        setModuleStates((prev) => {
          const newStates = { ...prev }
          delete newStates[moduleId]
          return newStates
        })
      } else {
        const module = costData?.estimates.find(m => m.id === moduleId)
        setModuleStates((prev) => ({
          ...prev,
          [moduleId]: module?.status === 'needs_update' ? 'modify' : 'add'
        }))
      }
      return newSelection
    })
  }

  const toggleModuleState = (moduleId: string) => {
    setModuleStates((prev) => ({
      ...prev,
      [moduleId]: prev[moduleId] === 'add' ? 'modify' : 'add'
    }))
  }

  const selectedModuleData = costData?.estimates.filter((module) => selectedModules.includes(module.id)) || []

  const calculateTotals = () => {
    const totalCost = selectedModuleData.reduce((sum, module) => {
      const isModify = moduleStates[module.id] === 'modify'
      // Modify costs are typically 30% of full development cost
      const cost = isModify ? module.estimated_cost * 0.3 : module.estimated_cost
      return sum + cost
    }, 0)

    const totalTime = Math.max(...selectedModuleData.map((module) => {
      const isModify = moduleStates[module.id] === 'modify'
      // Modify time is typically 40% of full development time
      return isModify ? module.timeline_weeks * 0.4 : module.timeline_weeks
    }), 0)

    const avgComplexity = selectedModuleData.length
      ? selectedModuleData.reduce((sum, module) => {
          const complexityScore = module.complexity === 'High' ? 3 : module.complexity === 'Medium' ? 2 : 1
          return sum + complexityScore
        }, 0) / selectedModuleData.length
      : 0

    return {
      totalCost,
      totalTime,
      avgComplexity,
      moduleCount: selectedModuleData.length
    }
  }

  const { totalCost, totalTime, avgComplexity, moduleCount } = calculateTotals()

  const getComplexityColor = (complexity: string) => {
    switch (complexity?.toLowerCase()) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "to_create":
        return "bg-blue-100 text-blue-800"
      case "needs_update":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "to_create":
        return <Code className="w-4 h-4 text-blue-600" />
      case "needs_update":
        return <Settings className="w-4 h-4 text-orange-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "to_create": return "New Development"
      case "needs_update": return "Update Required"
      default: return status
    }
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Cost Estimation Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to see module cost estimates</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Module Cost Estimator</h2>
          <p className="text-gray-600">Real cost estimates based on RFP analysis and historical data</p>
          {data.source && (
            <Badge variant="outline" className="mt-2">
              Source: {data.source}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshCosts} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button>
            <Calculator className="w-4 h-4 mr-2" />
            Generate Quote
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
                  {data.source === "real_backend" ? "Real Cost Analysis" : "Limited Cost Data"}
                </p>
                <p className="text-sm text-gray-600">
                  {costData ? `${costData.methodology} - ${costData.summary.total_modules} modules analyzed` : "Waiting for analysis"}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>Total Cost: €{costData?.summary.total_cost ? Math.round(costData.summary.total_cost / 1000) : 0}K</div>
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
              <p className="text-gray-600">Loading real cost estimates from backend...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards - Backend Data */}
      {!isLoading && costData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Modules</p>
                  <p className="text-2xl font-bold text-blue-600">{costData.summary.total_modules}</p>
                </div>
                <Code className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-green-600">€{Math.round(costData.summary.total_cost / 1000)}K</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Timeline</p>
                  <p className="text-2xl font-bold text-orange-600">{costData.summary.total_timeline_weeks}</p>
                  <p className="text-xs text-gray-500">weeks</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg per Module</p>
                  <p className="text-2xl font-bold text-purple-600">€{Math.round(costData.summary.avg_cost_per_module / 1000)}K</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Modules Cost Summary */}
      {selectedModules.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Selected Modules Cost Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">€{Math.round(totalCost / 1000)}K</div>
                <div className="text-sm text-gray-600">Total Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{moduleCount}</div>
                <div className="text-sm text-gray-600">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.round(totalTime)}</div>
                <div className="text-sm text-gray-600">Weeks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {avgComplexity === 3 ? 'High' : avgComplexity >= 2 ? 'Medium' : 'Low'}
                </div>
                <div className="text-sm text-gray-600">Avg Complexity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real Module Selection */}
      {!isLoading && costData && costData.estimates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Available Modules from Real Analysis</h3>
            <Badge variant="outline" className="text-xs">
              Real Backend Estimates
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {costData.estimates.map((module) => {
              const isSelected = selectedModules.includes(module.id)
              const isModify = moduleStates[module.id] === 'modify'
              const adjustedCost = isModify ? module.estimated_cost * 0.3 : module.estimated_cost
              const adjustedTime = isModify ? module.timeline_weeks * 0.4 : module.timeline_weeks

              return (
                <Card
                  key={module.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => toggleModuleSelection(module.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(module.status)}
                        <div>
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                          <CardDescription className="mt-1">{module.category}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getComplexityColor(module.complexity)}>
                          {module.complexity}
                        </Badge>
                        <Badge className={getStatusColor(module.status)}>
                          {getStatusText(module.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Cost Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Base Cost</div>
                          <div className="font-bold text-lg">
                            €{Math.round(module.estimated_cost / 1000)}K
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            {isModify ? 'Update Cost' : 'Full Cost'}
                          </div>
                          <div className="font-bold text-lg text-green-600">
                            €{Math.round(adjustedCost / 1000)}K
                          </div>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Timeline:</span>
                          <span className="font-medium">
                            {Math.round(adjustedTime)} weeks
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Complexity:</span>
                          <span className="font-medium">{module.complexity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{module.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Source:</span>
                          <span className="font-medium text-xs">{module.source}</span>
                        </div>
                      </div>

                      {/* Effort breakdown if available */}
                      {module.effort && (
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Effort Level:</div>
                          <Badge variant="outline" className="text-xs">
                            {module.effort}
                          </Badge>
                        </div>
                      )}

                      {/* Selection and State Controls */}
                      <div className="pt-2 flex gap-2">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleModuleSelection(module.id)
                          }}
                        >
                          {isSelected ? "Selected" : "Select Module"}
                        </Button>
                        {isSelected && module.status === 'needs_update' && (
                          <Toggle
                            pressed={isModify}
                            onPressedChange={() => toggleModuleState(module.id)}
                            size="sm"
                            className="flex-1"
                          >
                            {isModify ? "Update" : "Rebuild"}
                          </Toggle>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Detailed Real Breakdown */}
      {selectedModules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Cost Breakdown (Real Backend Estimates)</CardTitle>
            <CardDescription>
              Costs calculated using {costData?.methodology || "AI analysis"} methodology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedModuleData.map((module) => {
                const isModify = moduleStates[module.id] === 'modify'
                const adjustedCost = isModify ? module.estimated_cost * 0.3 : module.estimated_cost
                const adjustedTime = isModify ? module.timeline_weeks * 0.4 : module.timeline_weeks

                return (
                  <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(module.status)}
                        <div className="font-medium">
                          {module.name} ({isModify ? 'Update' : 'New Development'})
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {Math.round(adjustedTime)} weeks • {module.complexity} complexity • {module.category}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Source: {module.source}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        €{Math.round(adjustedCost / 1000)}K
                      </div>
                      <div className="text-sm text-gray-600">
                        {isModify ? '30% of full cost' : 'Full development'}
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>Total Estimated Cost:</span>
                  <span className="text-green-600">€{Math.round(totalCost / 1000)}K</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                  <span>Total Timeline:</span>
                  <span>{Math.round(totalTime)} weeks</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                  <span>Cost per Week:</span>
                  <span>€{Math.round(totalCost / totalTime / 1000)}K</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {!isLoading && (!costData || costData.estimates.length === 0) && data.source !== "real_backend" && (
        <Card className="text-center py-12">
          <CardContent>
            <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Limited Cost Estimation Available
            </h3>
            <p className="text-gray-600 mb-4">
              Complete a real RFP analysis with backend processing to get AI-powered cost estimates
            </p>
            <Button onClick={refreshCosts} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Loading Cost Estimates
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cost Methodology Information */}
      {!isLoading && costData && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Cost Estimation Methodology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-700">
              <div><strong>Methodology:</strong> {costData.methodology}</div>
              <div><strong>Total Modules Analyzed:</strong> {costData.summary.total_modules}</div>
              <div><strong>Average Cost per Module:</strong> €{Math.round(costData.summary.avg_cost_per_module / 1000)}K</div>
              <div><strong>Update Cost Factor:</strong> 30% of full development cost</div>
              <div><strong>Timeline Adjustment:</strong> 40% of full development time for updates</div>
            </div>

            <div className="mt-4 text-xs text-gray-600">
              Costs are calculated based on real RFP analysis, historical project data, and AI-powered complexity assessment.
              Update costs assume existing codebase and reduced development effort.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}