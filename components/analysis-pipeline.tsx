"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Brain,
  Database,
  Search,
  GitBranch,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Target,
  TrendingUp,
  Loader2,
  Play,
  RotateCcw,
} from "lucide-react"

interface AnalysisPipelineProps {
  data: any
}

interface PipelineStep {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "completed" | "error"
  progress: number
  icon: any
  duration: number
  details?: any
}

export function AnalysisPipeline({ data }: AnalysisPipelineProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([
    {
      id: "document_processing",
      name: "Document Processing",
      description: "Extract and preprocess RFP content",
      status: "pending",
      progress: 0,
      icon: FileText,
      duration: 5000,
      details: { extractedPages: 0, totalPages: 45 },
    },
    {
      id: "pattern_analysis",
      name: "Pattern Analysis",
      description: "Analyze requirements patterns and structure",
      status: "pending",
      progress: 0,
      icon: Search,
      duration: 8000,
      details: { patternsFound: 0, totalPatterns: 23 },
    },
    {
      id: "win_lose_analysis",
      name: "Win/Lose Pattern Analysis",
      description: "Analyze success and failure patterns from historical data",
      status: "pending",
      progress: 0,
      icon: TrendingUp,
      duration: 9000,
      details: { winPatterns: 0, losePatterns: 0, totalHistoricalRFPs: 45 },
    },
    {
      id: "llm_processing",
      name: "LLM Processing",
      description: "Process content with language models",
      status: "pending",
      progress: 0,
      icon: Brain,
      duration: 12000,
      details: { tokensProcessed: 0, totalTokens: 15420 },
    },
    {
      id: "storage_indexing",
      name: "Storage & Indexing",
      description: "Store and index processed data",
      status: "pending",
      progress: 0,
      icon: Database,
      duration: 3000,
      details: { recordsStored: 0, totalRecords: 156 },
    },
    {
      id: "module_matching",
      name: "Module Matching",
      description: "Match requirements with existing modules",
      status: "pending",
      progress: 0,
      icon: GitBranch,
      duration: 6000,
      details: { modulesMatched: 0, totalModules: 28 },
    },
    {
      id: "gap_analysis",
      name: "Gap Analysis",
      description: "Identify gaps and missing capabilities",
      status: "pending",
      progress: 0,
      icon: Target,
      duration: 4000,
      details: { gapsIdentified: 0, totalGaps: 12 },
    },
    {
      id: "multi_agent_orchestration",
      name: "Multi-Agent Orchestration",
      description: "Coordinate multiple AI agents for analysis",
      status: "pending",
      progress: 0,
      icon: Users,
      duration: 10000,
      details: { agentsActive: 0, totalAgents: 5 },
    },
    {
      id: "recommendation_generation",
      name: "Recommendation Generation",
      description: "Generate actionable recommendations",
      status: "pending",
      progress: 0,
      icon: Zap,
      duration: 7000,
      details: { recommendationsGenerated: 0, totalRecommendations: 8 },
    },
    {
      id: "report_compilation",
      name: "Report Compilation",
      description: "Compile final analysis report",
      status: "pending",
      progress: 0,
      icon: TrendingUp,
      duration: 3000,
      details: { sectionsCompleted: 0, totalSections: 6 },
    },
  ])

  const startPipeline = async () => {
    setIsRunning(true)
    setCurrentStep(0)

    for (let i = 0; i < pipelineSteps.length; i++) {
      setCurrentStep(i)

      // Update step status to running
      setPipelineSteps((prev) =>
        prev.map((step, index) => (index === i ? { ...step, status: "running", progress: 0 } : step)),
      )

      // Simulate step progress
      const stepDuration = pipelineSteps[i].duration
      const progressInterval = stepDuration / 100

      for (let progress = 0; progress <= 100; progress += 2) {
        await new Promise((resolve) => setTimeout(resolve, progressInterval))

        setPipelineSteps((prev) =>
          prev.map((step, index) => {
            if (index === i) {
              const updatedDetails = { ...step.details }

              // Update step-specific details based on progress
              switch (step.id) {
                case "document_processing":
                  updatedDetails.extractedPages = Math.floor((progress / 100) * updatedDetails.totalPages)
                  break
                case "pattern_analysis":
                  updatedDetails.patternsFound = Math.floor((progress / 100) * updatedDetails.totalPatterns)
                  break
                case "win_lose_analysis":
                  updatedDetails.winPatterns = Math.floor((progress / 100) * 12)
                  updatedDetails.losePatterns = Math.floor((progress / 100) * 8)
                  break
                case "llm_processing":
                  updatedDetails.tokensProcessed = Math.floor((progress / 100) * updatedDetails.totalTokens)
                  break
                case "storage_indexing":
                  updatedDetails.recordsStored = Math.floor((progress / 100) * updatedDetails.totalRecords)
                  break
                case "module_matching":
                  updatedDetails.modulesMatched = Math.floor((progress / 100) * updatedDetails.totalModules)
                  break
                case "gap_analysis":
                  updatedDetails.gapsIdentified = Math.floor((progress / 100) * updatedDetails.totalGaps)
                  break
                case "multi_agent_orchestration":
                  updatedDetails.agentsActive = Math.floor((progress / 100) * updatedDetails.totalAgents)
                  break
                case "recommendation_generation":
                  updatedDetails.recommendationsGenerated = Math.floor(
                    (progress / 100) * updatedDetails.totalRecommendations,
                  )
                  break
                case "report_compilation":
                  updatedDetails.sectionsCompleted = Math.floor((progress / 100) * updatedDetails.totalSections)
                  break
              }

              return { ...step, progress, details: updatedDetails }
            }
            return step
          }),
        )
      }

      // Mark step as completed
      setPipelineSteps((prev) =>
        prev.map((step, index) => (index === i ? { ...step, status: "completed", progress: 100 } : step)),
      )
    }

    setIsRunning(false)
  }

  const resetPipeline = () => {
    setPipelineSteps((prev) =>
      prev.map((step) => ({
        ...step,
        status: "pending",
        progress: 0,
        details: {
          ...step.details,
          ...Object.keys(step.details || {}).reduce((acc, key) => {
            if (
              key.includes("extracted") ||
              key.includes("Found") ||
              key.includes("Processed") ||
              key.includes("Stored") ||
              key.includes("Matched") ||
              key.includes("Identified") ||
              key.includes("Active") ||
              key.includes("Generated") ||
              key.includes("Completed")
            ) {
              acc[key] = 0
            }
            return acc
          }, {} as any),
        },
      })),
    )
    setCurrentStep(0)
    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "running":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50"
      case "running":
        return "border-blue-200 bg-blue-50"
      case "error":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const overallProgress = pipelineSteps.reduce((acc, step) => acc + step.progress, 0) / pipelineSteps.length

  return (
    <div className="space-y-6">
      {/* Pipeline Control Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="w-6 h-6" />
                <span>RFP Analysis Pipeline</span>
              </CardTitle>
              <CardDescription>Automated multi-stage analysis pipeline with AI agents orchestration</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetPipeline} disabled={isRunning}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={startPipeline} disabled={isRunning || !data}>
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Pipeline
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{overallProgress.toFixed(1)}%</span>
            </div>
            <Progress value={overallProgress} className="w-full h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Step {currentStep + 1} of {pipelineSteps.length}
              </span>
              <span>{pipelineSteps.filter((s) => s.status === "completed").length} completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {pipelineSteps.map((step, index) => {
          const Icon = step.icon
          return (
            <Card key={step.id} className={`transition-all duration-300 ${getStatusColor(step.status)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <CardTitle className="text-sm font-medium">{step.name}</CardTitle>
                  </div>
                  {getStatusIcon(step.status)}
                </div>
                <CardDescription className="text-xs">{step.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {step.status !== "pending" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{step.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={step.progress} className="h-1" />
                    </div>
                  )}

                  {step.details && (
                    <div className="space-y-1">
                      {Object.entries(step.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                          </span>
                          <span className="font-medium">
                            {typeof value === "number" ? value.toLocaleString() : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      step.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : step.status === "running"
                          ? "bg-blue-100 text-blue-800"
                          : step.status === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pipeline Architecture Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Architecture</CardTitle>
          <CardDescription>Visual representation of the analysis workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex flex-wrap justify-center items-center gap-4 p-6">
              {pipelineSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                      ${
                        step.status === "completed"
                          ? "bg-green-100 border-green-300"
                          : step.status === "running"
                            ? "bg-blue-100 border-blue-300"
                            : step.status === "error"
                              ? "bg-red-100 border-red-300"
                              : "bg-gray-100 border-gray-300"
                      }
                    `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < pipelineSteps.length - 1 && (
                      <div
                        className={`
                        w-8 h-0.5 mx-2 transition-all
                        ${
                          pipelineSteps[index + 1].status === "completed"
                            ? "bg-green-300"
                            : step.status === "completed"
                              ? "bg-blue-300"
                              : "bg-gray-300"
                        }
                      `}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle>Real-time Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {pipelineSteps.find((s) => s.id === "llm_processing")?.details?.tokensProcessed || 0}
                </div>
                <div className="text-sm text-gray-600">Tokens Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {pipelineSteps.find((s) => s.id === "module_matching")?.details?.modulesMatched || 0}
                </div>
                <div className="text-sm text-gray-600">Modules Matched</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {pipelineSteps.find((s) => s.id === "gap_analysis")?.details?.gapsIdentified || 0}
                </div>
                <div className="text-sm text-gray-600">Gaps Identified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {pipelineSteps.find((s) => s.id === "multi_agent_orchestration")?.details?.agentsActive || 0}
                </div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
