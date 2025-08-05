"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, CheckCircle, AlertTriangle, Plus, TrendingUp, Users, Target, Zap, GitBranch } from "lucide-react"

interface AnalysisDashboardProps {
  data?: any
}

export function AnalysisDashboard({ data }: AnalysisDashboardProps) {
  // Mock data if no data is provided
  const mockData = {
    totalRequirements: 45,
    existingModules: 28,
    modulesToModify: 8,
    newModulesNeeded: 9,
    gapAnalysis: {
      technical: [
        "Advanced AI/ML capabilities",
        "Real-time data processing",
        "Blockchain integration",
        "IoT device management",
      ],
      functional: [
        "Advanced reporting engine",
        "Multi-tenant architecture",
        "Advanced search capabilities",
        "Workflow automation",
      ],
      skills: ["Machine Learning Engineer", "Blockchain Developer", "DevOps Specialist", "UI/UX Designer"],
    },
  }

  const analysisData = data || mockData

  if (!analysisData) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data</h3>
        <p className="text-gray-500">Upload and analyze an RFP to see the dashboard</p>
      </div>
    )
  }

  // Ensure all required properties exist with defaults
  const safeData = {
    totalRequirements: analysisData.totalRequirements || 0,
    existingModules: analysisData.existingModules || 0,
    modulesToModify: analysisData.modulesToModify || 0,
    newModulesNeeded: analysisData.newModulesNeeded || 0,
    gapAnalysis: {
      technical: analysisData.gapAnalysis?.technical || [],
      functional: analysisData.gapAnalysis?.functional || [],
      skills: analysisData.gapAnalysis?.skills || [],
    },
  }

  const completionRate =
    safeData.totalRequirements > 0 ? ((safeData.existingModules / safeData.totalRequirements) * 100).toFixed(1) : "0.0"

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requirements</p>
                <p className="text-2xl font-bold text-gray-900">{safeData.totalRequirements}</p>
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
                <p className="text-2xl font-bold text-green-600">{safeData.existingModules}</p>
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
                <p className="text-2xl font-bold text-orange-600">{safeData.modulesToModify}</p>
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
                <p className="text-2xl font-bold text-purple-600">{safeData.newModulesNeeded}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5" />
            <span>Pipeline Status</span>
          </CardTitle>
          <CardDescription>Current analysis pipeline execution status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">9/9</div>
              <div className="text-sm text-gray-600">Steps Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">15,420</div>
              <div className="text-sm text-gray-600">Tokens Processed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">AI Agents Used</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">23</div>
              <div className="text-sm text-gray-600">Patterns Found</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Project Completion Analysis</span>
          </CardTitle>
          <CardDescription>Current capability coverage based on existing modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-600">{completionRate}%</span>
            </div>
            <Progress value={Number.parseFloat(completionRate)} className="w-full" />
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                <div className="text-sm text-gray-600">Ready</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {safeData.totalRequirements > 0
                    ? ((safeData.modulesToModify / safeData.totalRequirements) * 100).toFixed(1)
                    : "0.0"}
                  %
                </div>
                <div className="text-sm text-gray-600">Needs Update</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {safeData.totalRequirements > 0
                    ? ((safeData.newModulesNeeded / safeData.totalRequirements) * 100).toFixed(1)
                    : "0.0"}
                  %
                </div>
                <div className="text-sm text-gray-600">To Create</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Technical Gaps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safeData.gapAnalysis.technical.length > 0 ? (
                safeData.gapAnalysis.technical.map((gap: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{gap}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No technical gaps identified</div>
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
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safeData.gapAnalysis.functional.length > 0 ? (
                safeData.gapAnalysis.functional.map((gap: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{gap}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No functional gaps identified</div>
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
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safeData.gapAnalysis.skills.length > 0 ? (
                safeData.gapAnalysis.skills.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{skill}</span>
                    <Badge variant="outline" className="text-xs">
                      Hire
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No additional skills required</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Win/Lose Patterns Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Pattern Analysis Summary</span>
          </CardTitle>
          <CardDescription>Historical win/lose patterns identified in current RFP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">Win Patterns Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">Risk Patterns Detected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">84%</div>
              <div className="text-sm text-gray-600">Predicted Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">127</div>
              <div className="text-sm text-gray-600">Historical RFPs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
