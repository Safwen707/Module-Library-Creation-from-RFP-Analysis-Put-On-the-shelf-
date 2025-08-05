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
  X,
  Sparkles,
} from "lucide-react"
import { AnalysisDashboard } from "@/components/analysis-dashboard"
import { ModuleLibrary } from "@/components/module-library"
import { RecommendationsPanel } from "@/components/recommendations-panel"
import { ReportsPanel } from "@/components/reports-panel"
import { ModuleCostEstimator } from "@/components/module-cost-estimator"
import { DetailedModuleBreakdown } from "@/components/detailed-module-breakdown"
import { PatternAnalysis } from "@/components/patternAnalysis"
import { RFPAnalysis } from "@/components/rfp_analysis"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("rfp-analysis")
  const [analysisData, setAnalysisData] = useState(null)
  const [showNavbar, setShowNavbar] = useState(false)
  const [showToast, setShowToast] = useState(true)

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data)
    setActiveTab("reports")
    setShowNavbar(false)
    setShowToast(true) // Show toast after analysis
  }

  const handleViewMoreDetails = () => {
    setShowNavbar(true)
    setShowToast(false) // Hide toast when navbar is shown
  }

  const handleDismissToast = () => {
    setShowToast(false)
  }

  const tabs = [
    { id: "rfp-analysis", label: "RFP Analysis", icon: Upload },
    { id: "reports", label: "RFP Response and Reports", icon: FileOutput },
    { id: "dashboard", label: "Results Dashboard", icon: Brain },
    { id: "pattern-analysis", label: "Pattern Analysis", icon: TrendingUp },
    { id: "costs", label: "Cost Estimator", icon: Calculator },
    { id: "breakdown", label: "Module Breakdown", icon: FileText },
    { id: "modules", label: "Module Library", icon: FileText },
    { id: "recommendations", label: "AI Recommendations", icon: AlertCircle },
  ]

  const handleUploadRedirect = () => {
    setAnalysisData(null) // Reset analysis data
    setActiveTab("rfp-analysis")
    setShowNavbar(false) // Hide navbar when starting fresh
    setShowToast(false) // Hide any existing toasts
  }

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
              <Button
                variant="outline"
                size="sm"
                onClick={handleUploadRedirect}
                disabled={activeTab === "rfp-analysis" && !analysisData}
              >
                <DockIcon className="w-4 h-4 mr-2" />
                {activeTab === "rfp-analysis" && !analysisData ? "Analyzing..." : "Upload RFP"}
              </Button>
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

      {/* Navigation (with slide-in animation) */}
      {showNavbar && (
        <nav className="bg-white border-b animate-slide-in">
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
                    aria-current={activeTab === tab.id ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Enhanced Floating Action Button for View More Details */}
        {activeTab === "reports" && !showNavbar && (
          <div className="fixed bottom-8 right-8 z-20 group">
            <Button
              onClick={handleViewMoreDetails}
              className="rounded-full w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 focus:ring-4 focus:ring-blue-300 border-2 border-white/20"
              aria-label="View more analysis options"
            >
              <div className="flex flex-col items-center">
                <AlertCircle className="w-6 h-6 mb-1" />
                <div className="text-xs font-medium">More</div>
              </div>
            </Button>
            <div className="absolute bottom-20 right-0 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl min-w-max">
              <div className="font-medium">Explore Advanced Analysis</div>
              <div className="text-xs text-gray-300 mt-1">AI recommendations, team optimization & more</div>
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
            </div>
          </div>
        )}

        {activeTab === "rfp-analysis" && <RFPAnalysis onAnalysisComplete={handleAnalysisComplete} />}
        {activeTab === "reports" && !showNavbar && (
          <div className="relative">
            <ReportsPanel data={analysisData} />
            {/* Enhanced Toast Notification */}
            {showToast && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 max-w-md border border-gray-700">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">More Analysis Available</div>
                  <div className="text-xs text-gray-300">Click the button to explore advanced tools</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissToast}
                  className="text-white hover:text-gray-200 hover:bg-white/10 rounded-full w-8 h-8 p-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
        {showNavbar && (
          <>
            {activeTab === "reports" && <ReportsPanel data={analysisData} />}
            {activeTab === "dashboard" && <AnalysisDashboard data={analysisData} />}
            {activeTab === "breakdown" && <DetailedModuleBreakdown data={analysisData} />}
            {activeTab === "modules" && <ModuleLibrary />}
            {activeTab === "recommendations" && <RecommendationsPanel data={analysisData} />}
            {activeTab === "pattern-analysis" && <PatternAnalysis data={analysisData} />}
            {activeTab === "costs" && <ModuleCostEstimator data={analysisData} />}
          </>
        )}
      </main>

      {/* CSS for Slide-in Animation */}
      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
