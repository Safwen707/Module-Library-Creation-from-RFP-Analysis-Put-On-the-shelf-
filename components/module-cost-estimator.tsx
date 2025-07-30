"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DollarSign, Calculator, TrendingUp } from "lucide-react"

interface ModuleCostEstimatorProps {
  data: any
}

interface ModuleCost {
  id: string
  name: string
  category: string
  baseCost: number
  complexity: "Low" | "Medium" | "High"
  developmentTime: number // in weeks
  teamSize: number
  riskFactor: number
  dependencies: string[]
  estimatedCost: number
  confidenceLevel: number
}

export function ModuleCostEstimator({ data }: ModuleCostEstimatorProps) {
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [customFactors, setCustomFactors] = useState({
    urgencyMultiplier: 1,
    qualityMultiplier: 1,
    riskBuffer: 0.2,
  })

  const moduleCosts: ModuleCost[] = [
    {
      id: "cloud_infrastructure",
      name: "Cloud Infrastructure Module",
      category: "Infrastructure",
      baseCost: 180000,
      complexity: "High",
      developmentTime: 12,
      teamSize: 4,
      riskFactor: 0.25,
      dependencies: ["Security Module", "Monitoring Module"],
      estimatedCost: 225000,
      confidenceLevel: 85,
    },
    {
      id: "ai_ml_engine",
      name: "AI/ML Processing Engine",
      category: "AI/ML",
      baseCost: 220000,
      complexity: "High",
      developmentTime: 16,
      teamSize: 3,
      riskFactor: 0.35,
      dependencies: ["Data Pipeline", "Model Training"],
      estimatedCost: 297000,
      confidenceLevel: 70,
    },
    {
      id: "real_time_analytics",
      name: "Real-time Analytics Dashboard",
      category: "Analytics",
      baseCost: 150000,
      complexity: "Medium",
      developmentTime: 10,
      teamSize: 3,
      riskFactor: 0.15,
      dependencies: ["Data Visualization", "API Gateway"],
      estimatedCost: 172500,
      confidenceLevel: 90,
    },
    {
      id: "blockchain_integration",
      name: "Blockchain Integration",
      category: "Blockchain",
      baseCost: 200000,
      complexity: "High",
      developmentTime: 14,
      teamSize: 2,
      riskFactor: 0.4,
      dependencies: ["Crypto Wallet", "Smart Contracts"],
      estimatedCost: 280000,
      confidenceLevel: 65,
    },
    {
      id: "iot_gateway",
      name: "IoT Device Gateway",
      category: "IoT",
      baseCost: 160000,
      complexity: "Medium",
      developmentTime: 12,
      teamSize: 3,
      riskFactor: 0.2,
      dependencies: ["Device Management", "Protocol Handlers"],
      estimatedCost: 192000,
      confidenceLevel: 80,
    },
    {
      id: "advanced_security",
      name: "Advanced Security Module",
      category: "Security",
      baseCost: 140000,
      complexity: "High",
      developmentTime: 10,
      teamSize: 2,
      riskFactor: 0.3,
      dependencies: ["Encryption", "Identity Management"],
      estimatedCost: 182000,
      confidenceLevel: 85,
    },
  ]

  const toggleModuleSelection = (moduleId: string) => {
    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const selectedModuleData = moduleCosts.filter((module) => selectedModules.includes(module.id))
  const totalBaseCost = selectedModuleData.reduce((sum, module) => sum + module.baseCost, 0)
  const totalEstimatedCost = selectedModuleData.reduce((sum, module) => sum + module.estimatedCost, 0)
  const totalDevelopmentTime = Math.max(...selectedModuleData.map((module) => module.developmentTime), 0)
  const avgConfidence = selectedModuleData.length
    ? selectedModuleData.reduce((sum, module) => sum + module.confidenceLevel, 0) / selectedModuleData.length
    : 0

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
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
          <h2 className="text-2xl font-bold text-gray-900">Module Cost Estimator</h2>
          <p className="text-gray-600">Estimate development costs for required modules</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Historical Data
          </Button>
          <Button>
            <Calculator className="w-4 h-4 mr-2" />
            Generate Quote
          </Button>
        </div>
      </div>

      {/* Cost Summary */}
      {selectedModules.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Cost Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">${(totalBaseCost / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600">Base Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${(totalEstimatedCost / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600">Estimated Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalDevelopmentTime}</div>
                <div className="text-sm text-gray-600">Weeks</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getConfidenceColor(avgConfidence)}`}>
                  {avgConfidence.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {moduleCosts.map((module) => {
          const isSelected = selectedModules.includes(module.id)
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
                  <div>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <CardDescription className="mt-1">{module.category}</CardDescription>
                  </div>
                  <Badge className={getComplexityColor(module.complexity)}>{module.complexity}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Cost Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Base Cost</div>
                      <div className="font-bold text-lg">${(module.baseCost / 1000).toFixed(0)}K</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Estimated</div>
                      <div className="font-bold text-lg text-green-600">
                        ${(module.estimatedCost / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Development Time:</span>
                      <span className="font-medium">{module.developmentTime} weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Size:</span>
                      <span className="font-medium">{module.teamSize} developers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Factor:</span>
                      <span className="font-medium">{(module.riskFactor * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className={`font-medium ${getConfidenceColor(module.confidenceLevel)}`}>
                        {module.confidenceLevel}%
                      </span>
                    </div>
                  </div>

                  {/* Dependencies */}
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Dependencies:</div>
                    <div className="flex flex-wrap gap-1">
                      {module.dependencies.map((dep, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className="pt-2">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleModuleSelection(module.id)
                      }}
                    >
                      {isSelected ? "Selected" : "Select Module"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Cost Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Adjustment Factors</CardTitle>
          <CardDescription>Adjust estimates based on project requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Multiplier</label>
              <Input
                type="number"
                step="0.1"
                min="0.5"
                max="3"
                value={customFactors.urgencyMultiplier}
                onChange={(e) =>
                  setCustomFactors((prev) => ({ ...prev, urgencyMultiplier: Number.parseFloat(e.target.value) }))
                }
              />
              <div className="text-xs text-gray-500 mt-1">1.0 = Normal, 1.5 = Urgent, 2.0 = Critical</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality Multiplier</label>
              <Input
                type="number"
                step="0.1"
                min="0.8"
                max="2"
                value={customFactors.qualityMultiplier}
                onChange={(e) =>
                  setCustomFactors((prev) => ({ ...prev, qualityMultiplier: Number.parseFloat(e.target.value) }))
                }
              />
              <div className="text-xs text-gray-500 mt-1">1.0 = Standard, 1.3 = High, 1.6 = Enterprise</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Buffer</label>
              <Input
                type="number"
                step="0.05"
                min="0"
                max="0.5"
                value={customFactors.riskBuffer}
                onChange={(e) =>
                  setCustomFactors((prev) => ({ ...prev, riskBuffer: Number.parseFloat(e.target.value) }))
                }
              />
              <div className="text-xs text-gray-500 mt-1">0.2 = 20% buffer, 0.3 = 30% buffer</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      {selectedModules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedModuleData.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{module.name}</div>
                    <div className="text-sm text-gray-600">
                      {module.developmentTime} weeks • {module.teamSize} developers • {module.complexity} complexity
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">${(module.estimatedCost / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-600">
                      Base: ${(module.baseCost / 1000).toFixed(0)}K + Risk: {(module.riskFactor * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>Total Estimated Cost:</span>
                  <span className="text-green-600">${(totalEstimatedCost / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                  <span>With adjustments:</span>
                  <span>
                    $
                    {(
                      (totalEstimatedCost *
                        customFactors.urgencyMultiplier *
                        customFactors.qualityMultiplier *
                        (1 + customFactors.riskBuffer)) /
                      1000
                    ).toFixed(0)}
                    K
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
