"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  Clock,
  Award,
} from "lucide-react"
import { useState } from "react"

interface TeamOptimizerProps {
  selectedProfiles: string[]
  availableProfiles: any[]
  rfpData: any
}

export function TeamOptimizer({ selectedProfiles, availableProfiles, rfpData }: TeamOptimizerProps) {
  const [optimizationMode, setOptimizationMode] = useState<"cost" | "speed" | "quality">("cost")

  // Calculate team metrics
  const selectedTeam = selectedProfiles
    .map((id) => availableProfiles.find((profile) => profile.id === id))
    .filter(Boolean)

  const totalCost = selectedTeam.reduce(
    (sum, profile) => sum + profile.monthlyCost * profile.minDuration + profile.setupCost,
    0,
  )

  const maxDuration = Math.max(...selectedTeam.map((profile) => profile.minDuration))
  const avgMonthlyCost = selectedTeam.reduce((sum, profile) => sum + profile.monthlyCost, 0)

  // Risk assessment
  const riskFactors = [
    {
      factor: "Team Size",
      level: selectedTeam.length > 5 ? "High" : selectedTeam.length > 3 ? "Medium" : "Low",
      description: selectedTeam.length > 5 ? "Large team may have coordination challenges" : "Manageable team size",
    },
    {
      factor: "Cost Variance",
      level: "Medium",
      description: "Mixed contract types provide flexibility but require management",
    },
    {
      factor: "Skill Coverage",
      level: "High",
      description: "Good coverage of required technical skills",
    },
  ]

  const optimizationSuggestions = {
    cost: [
      "Consider replacing Senior profiles with Mid-level where possible",
      "Evaluate if Consultant roles can be converted to CDD",
      "Look for internal transfers to reduce setup costs",
    ],
    speed: [
      "Prioritize Consultant and Freelancer profiles for faster onboarding",
      "Consider Expert Missions for critical path activities",
      "Parallel onboarding to reduce overall timeline",
    ],
    quality: [
      "Ensure Senior+ level for all critical roles",
      "Add QA specialist to the team",
      "Consider longer engagement periods for knowledge retention",
    ],
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-green-600 bg-green-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "Low":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <Target className="w-6 h-6" />
            <span>Team Optimization Analysis</span>
          </CardTitle>
          <CardDescription className="text-purple-700">
            AI-powered analysis of your selected team configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{selectedTeam.length}</div>
              <div className="text-sm text-gray-600">Team Members</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">€{Math.round(totalCost / 1000)}K</div>
              <div className="text-sm text-gray-600">Total Investment</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{maxDuration}</div>
              <div className="text-sm text-gray-600">Max Duration (months)</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">€{Math.round(avgMonthlyCost / 1000)}K</div>
              <div className="text-sm text-gray-600">Monthly Burn Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={optimizationMode} onValueChange={(value) => setOptimizationMode(value as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cost" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Cost Optimization</span>
          </TabsTrigger>
          <TabsTrigger value="speed" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Speed Optimization</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Quality Optimization</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cost" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Cost Optimization Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Potential Savings</h4>
                    <div className="text-2xl font-bold text-green-600">€45K</div>
                    <div className="text-sm text-green-700">15% reduction possible</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">ROI Timeline</h4>
                    <div className="text-2xl font-bold text-blue-600">8 months</div>
                    <div className="text-sm text-blue-700">Break-even point</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Cost Optimization Suggestions:</h4>
                  <ul className="space-y-2">
                    {optimizationSuggestions.cost.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="speed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Speed Optimization Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Time Savings</h4>
                    <div className="text-2xl font-bold text-blue-600">6 weeks</div>
                    <div className="text-sm text-blue-700">Faster delivery possible</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Onboarding</h4>
                    <div className="text-2xl font-bold text-purple-600">2 weeks</div>
                    <div className="text-sm text-purple-700">Average setup time</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Speed Optimization Suggestions:</h4>
                  <ul className="space-y-2">
                    {optimizationSuggestions.speed.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Zap className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>Quality Optimization Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Quality Score</h4>
                    <div className="text-2xl font-bold text-purple-600">8.5/10</div>
                    <div className="text-sm text-purple-700">Excellent team quality</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Experience Level</h4>
                    <div className="text-2xl font-bold text-orange-600">Senior+</div>
                    <div className="text-sm text-orange-700">Average team level</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Quality Optimization Suggestions:</h4>
                  <ul className="space-y-2">
                    {optimizationSuggestions.quality.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Award className="w-4 h-4 text-purple-500 mt-0.5" />
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Risk Assessment</span>
          </CardTitle>
          <CardDescription>Potential risks and mitigation strategies for your team configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{risk.factor}</div>
                  <div className="text-sm text-gray-600">{risk.description}</div>
                </div>
                <Badge className={getRiskColor(risk.level)}>{risk.level} Risk</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Composition Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Team Composition Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedTeam.map((profile, index) => (
              <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{profile.name}</div>
                    <div className="text-sm text-gray-600">
                      {profile.level} • {profile.type}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    €{(profile.monthlyCost * profile.minDuration + profile.setupCost).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">{profile.minDuration} months</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" size="lg">
          <Clock className="w-4 h-4 mr-2" />
          Schedule Review
        </Button>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve Team Configuration
        </Button>
      </div>
    </div>
  )
}
