"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  CheckCircle,
  Loader2,
  Brain,
  Search,
  Database,
  GitBranch,
  Zap,
  Target,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react"
import { useDropzone } from "react-dropzone"

interface RFPAnalysisProps {
  onAnalysisComplete: (data: any) => void
}

interface AnalysisStep {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "completed" | "error"
  progress: number
  icon: any
  duration: number
  details?: any
}

export function RFPAnalysis({ onAnalysisComplete }: RFPAnalysisProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    {
      id: "text_extraction",
      name: "Text Extraction",
      description: "Extract text from RFP document",
      status: "pending",
      progress: 0,
      icon: FileText,
      duration: 2000,
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
  })

  const startAnalysis = async () => {
    if (!uploadedFile) return

    setIsRunning(true)
    setCurrentStep(0)

    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i)
      setAnalysisSteps((prev) =>
        prev.map((step, index) => (index === i ? { ...step, status: "running", progress: 0 } : step)),
      )

      const stepDuration = analysisSteps[i].duration
      const progressInterval = stepDuration / 100

      for (let progress = 0; progress <= 100; progress += 2) {
        await new Promise((resolve) => setTimeout(resolve, progressInterval))

        setAnalysisSteps((prev) =>
          prev.map((step, index) => {
            if (index === i) {
              const updatedDetails = { ...step.details }

              switch (step.id) {
                case "text_extraction":
                  updatedDetails.extractedPages = Math.floor((progress / 100) * updatedDetails.totalPages)
                  break
                case "pattern_analysis":
                  updatedDetails.patternsFound = Math.floor((progress / 100) * updatedDetails.totalPatterns)
                  break
                case "module_matching":
                  updatedDetails.modulesMatched = Math.floor((progress / 100) * updatedDetails.totalModules)
                  break
                case "gap_analysis":
                  updatedDetails.gapsIdentified = Math.floor((progress / 100) * updatedDetails.totalGaps)
                  break
                case "llm_processing":
                  updatedDetails.tokensProcessed = Math.floor((progress / 100) * updatedDetails.totalTokens)
                  break
                case "storage_indexing":
                  updatedDetails.recordsStored = Math.floor((progress / 100) * updatedDetails.totalRecords)
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

      setAnalysisSteps((prev) =>
        prev.map((step, index) => (index === i ? { ...step, status: "completed", progress: 100 } : step)),
      )
    }

    // Generate mock analysis data
    const mockAnalysisData = {
      rfpTitle: uploadedFile.name,
      totalRequirements: 45,
      existingModules: 28,
      modulesToModify: 8,
      newModulesNeeded: 9,
      gapAnalysis: {
        technical: ["Cloud Architecture", "AI/ML Integration", "Microservices"],
        functional: ["Advanced Analytics", "Real-time Processing"],
        skills: ["DevOps Engineer", "Data Scientist", "Solution Architect"],
      },
      recommendations: [
        {
          type: "module_creation",
          priority: "high",
          title: "Cloud Infrastructure Module",
          description: "Create new module for cloud deployment and scaling",
        },
        {
          type: "skill_acquisition",
          priority: "medium",
          title: "Hire AI/ML Specialist",
          description: "Recruit specialist for machine learning implementation",
        },
      ],
    }

    setIsRunning(false)
    onAnalysisComplete(mockAnalysisData)
  }

  const resetAnalysis = () => {
    setUploadedFile(null)
    setAnalysisSteps((prev) =>
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

  const overallProgress = analysisSteps.reduce((acc, step) => acc + step.progress, 0) / analysisSteps.length

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!isRunning && !uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Import RFP Document</span>
            </CardTitle>
            <CardDescription>Upload your RFP document to begin the automated analysis process</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {isDragActive ? "Drop the file here" : "Drag & drop your RFP file here"}
                  </p>
                  <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX, TXT files up to 50MB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Info and Controls */}
      {uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {isRunning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analysis in Progress</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>RFP Analysis</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isRunning
                ? "Processing your RFP document through the analysis pipeline"
                : `Uploaded file: ${uploadedFile.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedFile && !isRunning && (
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium text-green-600 flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>File uploaded successfully</span>
                </p>
                <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={resetAnalysis} disabled={isRunning}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={startAnalysis} disabled={isRunning || !uploadedFile}>
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
            </div>
            {isRunning && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">{overallProgress.toFixed(1)}%</span>
                </div>
                <Progress value={overallProgress} className="w-full h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    Step {currentStep + 1} of {analysisSteps.length}
                  </span>
                  <span>{analysisSteps.filter((s) => s.status === "completed").length} completed</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analysis Steps */}
      {(isRunning || analysisSteps.some((s) => s.status !== "pending")) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {analysisSteps.map((step, index) => {
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
      )}
    </div>
  )
}