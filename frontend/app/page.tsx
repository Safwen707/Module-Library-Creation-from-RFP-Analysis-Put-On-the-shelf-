"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Activity,
  Wifi,
  WifiOff,
  Database,
} from "lucide-react"

// Import all updated components with real backend integration
import { LandingPage } from "@/components/landing-page"
import { AnalysisDashboard } from "@/components/analysis-dashboard"
import { ModuleLibrary } from "@/components/module-library"
import { RecommendationsPanel } from "@/components/recommendations-panel"
import { ReportsPanel } from "@/components/reports-panel"
import { ModuleCostEstimator } from "@/components/module-cost-estimator"
import { DetailedModuleBreakdown } from "@/components/detailed-module-breakdown"
import { RecruitmentOptimizer } from "@/components/recruitment-optimizer"
import { PatternAnalysis } from "@/components/patternAnalysis"
import { RFPAnalysis } from "@/components/rfp-analysis"

interface AnalysisData {
  rfpTitle: string
  analysisType: string
  timestamp: string
  totalRequirements: number
  existingModules: number
  modulesToModify: number
  newModulesNeeded: number
  gapAnalysis: {
    technical: string[]
    functional: string[]
    skills: string[]
  }
  moduleAnalysis?: any
  patternAnalysis?: any
  recommendations?: any[]
  confidence?: number
  source: string
  analysis_id?: string
}

interface BackendStatus {
  backend_available: boolean
  system_ready: boolean
  documents_indexed: number
  version: string
}

export default function HomePage() {
    const [hasEntered, setHasEntered] = useState(false)
    const [activeTab, setActiveTab] = useState("rfp-analysis")
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [showNavbar, setShowNavbar] = useState(false)
  const [showToast, setShowToast] = useState(true)
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    backend_available: false,
    system_ready: false,
    documents_indexed: 0,
    version: "Unknown"
  })
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting")

  // Check backend availability on component mount
  useEffect(() => {
    checkBackendHealth()
    // Set up periodic health checks
    const interval = setInterval(checkBackendHealth, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const checkBackendHealth = async () => {
    try {
      setConnectionStatus("connecting")

      // Check backend health
      const healthResponse = await fetch('http://localhost:8000/api/health')
      if (healthResponse.ok) {
        const health = await healthResponse.json()

        // Get system status
        const statusResponse = await fetch('http://localhost:8000/api/status')
        if (statusResponse.ok) {
          const status = await statusResponse.json()
          setBackendStatus(status)
        }

        setConnectionStatus("connected")
        console.log('✅ Backend connected:', health)
      }
    } catch (error) {
      console.warn('⚠️ Backend not available:', error)
      setConnectionStatus("disconnected")
      setBackendStatus(prev => ({ ...prev, backend_available: false }))
    }
  }

  const handleAnalysisComplete = (data: AnalysisData) => {
    console.log('Analysis completed with real backend:', data)
    setAnalysisData(data)
    setActiveTab("reports")
    setShowNavbar(false)
    setShowToast(data.source === "real_backend") // Only show toast for real backend analysis
  }

  const handleViewMoreDetails = () => {
    setShowNavbar(true)
    setShowToast(false)
  }

  const handleDismissToast = () => {
    setShowToast(false)
  }

  const tabs = [
    { id: "rfp-analysis", label: "RFP Analysis", icon: Upload, requiresData: false },
    { id: "reports", label: "RFP Response & Reports", icon: FileOutput, requiresData: true },
    { id: "dashboard", label: "AI Dashboard", icon: Brain, requiresData: true },
    { id: "pattern-analysis", label: "Pattern Analysis", icon: TrendingUp, requiresData: true },
    { id: "recruitment", label: "Recruitment Optimizer", icon: Users, requiresData: true },
    { id: "costs", label: "Cost Estimator", icon: Calculator, requiresData: true },
    { id: "breakdown", label: "Module Breakdown", icon: FileText, requiresData: true },
    { id: "modules", label: "Module Library", icon: Database, requiresData: false },
    { id: "recommendations", label: "AI Recommendations", icon: AlertCircle, requiresData: true },
  ]

  const handleUploadRedirect = () => {
    setActiveTab("rfp-analysis")
    setShowNavbar(false)
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="w-4 h-4 text-green-600" />
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-red-600" />
      case "connecting":
        return <Activity className="w-4 h-4 text-yellow-600 animate-pulse" />
    }
  }

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case "connected": return "text-green-600"
      case "disconnected": return "text-red-600"
      case "connecting": return "text-yellow-600"
    }
  }

  const handleEnterPlatform = () => {
      setHasEntered(true)
  }

   if (!hasEntered) {
    return <LandingPage onEnterApp={handleEnterPlatform} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <DockIcon className="w-6 h-6 text-white"/>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Aura AI</h1>
                <p className="text-sm text-gray-500">AI-Powered RFP Analysis & Module Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Backend Status Indicator */}
              <div className="flex items-center space-x-2">
                {getConnectionIcon()}
                <div className="text-sm">
                  <span className={`font-medium ${getConnectionColor()}`}>
                    {connectionStatus === "connected" ? "Backend Online" :
                     connectionStatus === "disconnected" ? "Backend Offline" : "Connecting..."}
                  </span>
                  {backendStatus.backend_available && (
                    <div className="text-xs text-gray-500">
                      {backendStatus.documents_indexed} docs • v{backendStatus.version}
                    </div>
                  )}
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleUploadRedirect}>
                <Upload className="w-4 h-4 mr-2"/>
                Upload RFP
              </Button>
              <Button variant="outline" size="sm" onClick={checkBackendHealth}>
                <Activity className="w-4 h-4 mr-2"/>
                Status
              </Button>
            </div>
          </div>
        </div>

        {/* Backend Warning Banner */}
        {connectionStatus === "disconnected" && (
          <div className="bg-yellow-50 border-b border-yellow-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-yellow-800 font-medium text-sm">
                    Backend Disconnected
                  </p>
                  <p className="text-yellow-700 text-xs">
                    Please ensure your FastAPI server is running on localhost:8000 for AI-powered analysis.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={checkBackendHealth}>
                  Retry Connection
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Success Banner */}
        {analysisData && analysisData.source === "real_backend" && (
          <div className="bg-green-50 border-b border-green-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium text-sm">
                      AI Analysis Complete
                    </p>
                    <p className="text-green-700 text-xs">
                      {analysisData.rfpTitle} • {analysisData.totalRequirements} requirements • {analysisData.confidence ? `${Math.round(analysisData.confidence * 100)}%` : 'High'} confidence
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {analysisData.source}
                  </Badge>
                  {analysisData.analysis_id && (
                    <Badge variant="outline" className="text-xs">
                      ID: {analysisData.analysis_id.slice(-6)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Navigation (with slide-in animation) */}
      {showNavbar && (
        <nav className="bg-white border-b animate-slide-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isDisabled = tab.requiresData && !analysisData

                return (
                  <button
                    key={tab.id}
                    onClick={() => !isDisabled && setActiveTab(tab.id)}
                    disabled={isDisabled}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : isDisabled
                        ? "border-transparent text-gray-400 cursor-not-allowed"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {isDisabled && (
                      <Badge variant="outline" className="text-xs ml-1">
                        Requires Analysis
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Floating Action Button for View More Details */}
        {activeTab === "reports" && !showNavbar && analysisData && (
          <div className="fixed top-4 right-4 z-20 group">
            <Button
              onClick={handleViewMoreDetails}
              className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:scale-110 transition-transform duration-200 focus:ring-4 focus:ring-blue-300"
              aria-label="View more analysis options"
            >
              <Brain className="w-6 h-6" />
            </Button>
            <div className="absolute top-14 right-0 bg-gray-800 text-white text-sm px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Explore AI Analysis Tools
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "rfp-analysis" && (
          <RFPAnalysis onAnalysisComplete={handleAnalysisComplete} />
        )}

        {activeTab === "reports" && !showNavbar && (
          <div className="relative">
            <ReportsPanel data={analysisData} />
            {/* Enhanced Toast Notification */}
            {showToast && analysisData?.source === "real_backend" && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-md">
                <Brain className="w-5 h-5" />
                <span className="text-sm font-medium">
                  AI analysis complete! Explore advanced insights and tools.
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissToast}
                  className="text-white hover:text-gray-200 hover:bg-white/10"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Navigation-based content */}
        {showNavbar && (
          <>
            {activeTab === "reports" && <ReportsPanel data={analysisData} />}
            {activeTab === "dashboard" && <AnalysisDashboard data={analysisData} />}
            {activeTab === "breakdown" && <DetailedModuleBreakdown data={analysisData} />}
            {activeTab === "modules" && <ModuleLibrary />}
            {activeTab === "recommendations" && <RecommendationsPanel data={analysisData} />}
            {activeTab === "pattern-analysis" && <PatternAnalysis data={analysisData} />}
            {activeTab === "recruitment" && <RecruitmentOptimizer data={analysisData} />}
            {activeTab === "costs" && <ModuleCostEstimator data={analysisData} />}
          </>
        )}

        {/* No Analysis Data State */}
        {(activeTab !== "rfp-analysis" && activeTab !== "modules") && !analysisData && showNavbar && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Analysis Data Available
            </h3>
            <p className="text-gray-600 mb-4">
              Upload and analyze an RFP document to access AI-powered insights and tools.
            </p>
            <Button onClick={handleUploadRedirect}>
              <Upload className="w-4 h-4 mr-2" />
              Start RFP Analysis
            </Button>
          </div>
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