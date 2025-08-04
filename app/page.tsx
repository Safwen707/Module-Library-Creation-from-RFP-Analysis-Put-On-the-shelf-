"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Upload,
  FileText,
  Brain,
  Users,
  TrendingUp,
  AlertCircle,
  FileOutput,
  Calculator,
  DockIcon,
} from "lucide-react"
import { AnalysisDashboard } from "@/components/analysis-dashboard"
import { ModuleLibrary } from "@/components/module-library"
import { RecommendationsPanel } from "@/components/recommendations-panel"
import { ReportsPanel } from "@/components/reports-panel"
import { ModuleCostEstimator } from "@/components/module-cost-estimator"
import { DetailedModuleBreakdown } from "@/components/detailed-module-breakdown"
import { RecruitmentOptimizer } from "@/components/recruitment-optimizer"
import { PatternAnalysis } from "@/components/patternAnalysis"
import { RFPAnalysis } from "@/components/rfp_analysis"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("rfp-analysis")
  const [analysisData, setAnalysisData] = useState(null)

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data)
    setActiveTab("reports")
  }

  const tabs = [
    { id: "rfp-analysis", label: "RFP Analysis", icon: Upload },
    { id: "reports", label: "RFP Response and Reports", icon: FileOutput },
    { id: "dashboard", label: "Results Dashboard", icon: Brain },
    { id: "breakdown", label: "Module Breakdown", icon: FileText },
    { id: "modules", label: "Module Library", icon: FileText },
    // { id: "recommendations", label: "AI Recommendations", icon: AlertCircle },
    { id: "pattern-analysis", label: "Pattern Analysis", icon: TrendingUp },
    { id: "recruitment", label: "Recruitment Optimizer", icon: Users },
    { id: "costs", label: "Cost Estimator", icon: Calculator },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <DockIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Aura</h1>
                <p className="text-sm text-gray-500">Module Library Creation & Analysis Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Team
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "rfp-analysis" && <RFPAnalysis onAnalysisComplete={handleAnalysisComplete} />}
        {activeTab === "reports" && <ReportsPanel data={analysisData} />}
        {activeTab === "dashboard" && <AnalysisDashboard data={analysisData} />}
        {activeTab === "breakdown" && <DetailedModuleBreakdown data={analysisData} />}
        {activeTab === "modules" && <ModuleLibrary />}
        {/* {activeTab === "recommendations" && <RecommendationsPanel data={analysisData} />} */}
        {activeTab === "pattern-analysis" && <PatternAnalysis data={analysisData} />}
        {activeTab === "recruitment" && <RecruitmentOptimizer data={analysisData} />}
        {activeTab === "costs" && <ModuleCostEstimator data={analysisData} />}
      </main>
    </div>
  )
}