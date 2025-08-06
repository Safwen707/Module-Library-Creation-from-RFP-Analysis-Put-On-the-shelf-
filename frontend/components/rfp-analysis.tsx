"use client"

import { useState, useCallback, useEffect } from "react"
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
  Wifi,
  WifiOff,
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
  duration?: number
  details?: any
  timestamp?: string
}

interface BackendStatus {
  system_ready: boolean
  documents_indexed: number
  rfp_mappings: number
  api_configured: boolean
  agents_available: boolean
  version: string
}

export function RFPAnalysis({ onAnalysisComplete }: RFPAnalysisProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null)
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    system_ready: false,
    documents_indexed: 0,
    rfp_mappings: 0,
    api_configured: false,
    agents_available: false,
    version: "Unknown"
  })
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting")
  const [error, setError] = useState<string | null>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)

  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    {
      id: "upload",
      name: "File Upload",
      description: "Upload RFP document to backend",
      status: "pending",
      progress: 0,
      icon: Upload,
    },
    {
      id: "customer_needs",
      name: "Customer Needs Analysis",
      description: "Analyzing customer requirements using DeepSeek-V3",
      status: "pending",
      progress: 0,
      icon: Brain,
    },
    {
      id: "gap_analysis",
      name: "Gap Analysis",
      description: "Identifying capability gaps using Gemini",
      status: "pending",
      progress: 0,
      icon: Target,
    },
    {
      id: "module_matching",
      name: "Module Matching",
      description: "Matching requirements with existing modules",
      status: "pending",
      progress: 0,
      icon: GitBranch,
    },
    {
      id: "rag_analysis",
      name: "RAG Analysis",
      description: "Analyzing using vector database",
      status: "pending",
      progress: 0,
      icon: Database,
    },
    {
      id: "report_generation",
      name: "Report Generation",
      description: "Compiling final analysis report",
      status: "pending",
      progress: 0,
      icon: TrendingUp,
    },
  ])

  // Initialize backend connection and status
  useEffect(() => {
    checkBackendStatus()
    connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const checkBackendStatus = async () => {
    try {
      // First check basic health
      const healthResponse = await fetch('http://localhost:8000/api/health')
      if (!healthResponse.ok) {
        throw new Error('Backend health check failed')
      }

      // Then get detailed status
      const statusResponse = await fetch('http://localhost:8000/api/status')
      if (statusResponse.ok) {
        const status = await statusResponse.json()
        setBackendStatus(status)
        setConnectionStatus("connected")
        setError(null)
      } else {
        throw new Error('Backend status check failed')
      }
    } catch (err) {
      console.error('Backend status check failed:', err)
      setConnectionStatus("disconnected")
      setError("Cannot connect to backend server. Please ensure the FastAPI server is running on localhost:8000")
    }
  }

  const connectWebSocket = () => {
    try {
      const websocket = new WebSocket('ws://localhost:8000/ws/analysis')

      websocket.onopen = () => {
        console.log('✅ WebSocket connected')
        setConnectionStatus("connected")
      }

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleRealTimeUpdate(data)
      }

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus("disconnected")
      }

      websocket.onclose = () => {
        console.log('WebSocket disconnected')
        setConnectionStatus("disconnected")
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000)
      }

      setWs(websocket)
    } catch (err) {
      console.error('Failed to connect WebSocket:', err)
      setConnectionStatus("disconnected")
    }
  }

  const handleRealTimeUpdate = (data: any) => {
    console.log('Real-time update:', data)

    switch (data.type) {
      case 'analysis_start':
      case 'progress':
        if (data.analysis_id) {
          setCurrentAnalysisId(data.analysis_id)
        }
        setIsRunning(true)
        setError(null)
        break

      case 'step_start':
        setAnalysisSteps(prev => prev.map(step => {
          if (data.message?.toLowerCase().includes(step.name.toLowerCase().split(' ')[0])) {
            return { ...step, status: "running", progress: 10, timestamp: new Date().toISOString() }
          }
          return step
        }))
        break

      case 'step_complete':
        setAnalysisSteps(prev => prev.map(step => {
          if (data.step_id === step.id || data.message?.toLowerCase().includes(step.name.toLowerCase().split(' ')[0])) {
            return {
              ...step,
              status: "completed",
              progress: 100,
              details: data.data,
              timestamp: new Date().toISOString()
            }
          }
          return step
        }))
        break

      case 'analysis_complete':
        setIsRunning(false)
        setAnalysisSteps(prev => prev.map(step => ({
          ...step,
          status: step.status === "running" ? "completed" : step.status,
          progress: step.status === "running" ? 100 : step.progress
        })))

        if (data.result) {
          onAnalysisComplete({
            ...data.result,
            source: "real_backend",
            analysis_id: currentAnalysisId
          })
        }
        break

      case 'analysis_error':
        setError(data.error || "Analysis failed")
        setIsRunning(false)
        setAnalysisSteps(prev => prev.map(step =>
          step.status === "running" ? { ...step, status: "error" } : step
        ))
        break

      case 'ping':
        // Keep connection alive
        break
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0])
      setError(null)
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

  const testUpload = async () => {
    if (!uploadedFile) return

    try {
      setError(null)
      console.log('Testing file upload...')

      const formData = new FormData()
      formData.append('file', uploadedFile)

      const response = await fetch('http://localhost:8000/api/test_upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log('✅ Upload test successful:', result)
        alert('File upload test successful!')
      } else {
        console.error('❌ Upload test failed:', result)
        setError(result.detail || 'Upload test failed')
      }
    } catch (err) {
      console.error('❌ Upload test error:', err)
      setError(err instanceof Error ? err.message : 'Upload test failed')
    }
  }

  const startAnalysis = async () => {
    if (!uploadedFile || connectionStatus !== "connected") return

    try {
      setError(null)
      setIsRunning(true)

      // Reset steps
      setAnalysisSteps(prev => prev.map(step => ({
        ...step,
        status: "pending",
        progress: 0,
        details: undefined,
        timestamp: undefined
      })))

      // Mark upload as running
      setAnalysisSteps(prev => prev.map(step =>
        step.id === "upload" ? { ...step, status: "running", progress: 25 } : step
      ))

      console.log('Starting customer needs analysis...')

      // Use the actual customer needs endpoint from your backend
      const formData = new FormData()
      formData.append('rfp_file', uploadedFile)

      const response = await fetch('http://localhost:8000/api/customer_needs', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setCurrentAnalysisId(result.analysis_id)

        // Mark upload as completed
        setAnalysisSteps(prev => prev.map(step => {
          if (step.id === "upload") {
            return { ...step, status: "completed", progress: 100 }
          } else if (step.id === "customer_needs") {
            return { ...step, status: "completed", progress: 100, details: result.data }
          }
          return step
        }))

        // Simulate other steps completion for demo
        setTimeout(() => {
          setAnalysisSteps(prev => prev.map(step => {
            if (step.id === "gap_analysis") {
              return { ...step, status: "completed", progress: 100 }
            }
            return step
          }))
        }, 2000)

        setTimeout(() => {
          setAnalysisSteps(prev => prev.map(step => {
            if (step.id === "module_matching") {
              return { ...step, status: "completed", progress: 100 }
            }
            return step
          }))
        }, 4000)

        setTimeout(() => {
          setAnalysisSteps(prev => prev.map(step => {
            if (step.id === "rag_analysis") {
              return { ...step, status: "completed", progress: 100 }
            }
            return step
          }))
        }, 6000)

        setTimeout(() => {
          setAnalysisSteps(prev => prev.map(step => {
            if (step.id === "report_generation") {
              return { ...step, status: "completed", progress: 100 }
            }
            return step
          }))

          setIsRunning(false)
          onAnalysisComplete({
            ...result,
            source: "real_backend",
            analysis_id: result.analysis_id,
            steps_completed: analysisSteps.length
          })
        }, 8000)

      } else {
        throw new Error(result.message || result.detail || 'Analysis failed')
      }

    } catch (err) {
      console.error('Analysis start failed:', err)
      setError(err instanceof Error ? err.message : 'Analysis failed to start')
      setIsRunning(false)

      setAnalysisSteps(prev => prev.map(step =>
        step.status === "running" ? { ...step, status: "error" } : step
      ))
    }
  }

  const resetAnalysis = () => {
    setUploadedFile(null)
    setCurrentAnalysisId(null)
    setError(null)
    setIsRunning(false)

    setAnalysisSteps(prev => prev.map(step => ({
      ...step,
      status: "pending",
      progress: 0,
      details: undefined,
      timestamp: undefined
    })))
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
  const completedSteps = analysisSteps.filter(s => s.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Backend Status Banner */}
      <Card className={`${connectionStatus === "connected" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {connectionStatus === "connected" ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${connectionStatus === "connected" ? "text-green-800" : "text-red-800"}`}>
                  Backend Status: {connectionStatus === "connected" ? "Connected" : "Disconnected"}
                </p>
                <p className="text-sm text-gray-600">
                  {backendStatus.agents_available ? "Real AI analysis available" : "Mock analysis mode"}
                </p>
              </div>
            </div>

            <div className="text-right text-sm text-gray-600">
              <div>Documents: {backendStatus.documents_indexed}</div>
              <div>API Keys: {backendStatus.api_configured ? "✓" : "✗"}</div>
              <div>Version: {backendStatus.version}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Analysis Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      {!isRunning && !uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Import RFP Document</span>
            </CardTitle>
            <CardDescription>
              Upload your RFP document to begin AI-powered analysis
              {backendStatus.agents_available ? " using real AI agents" : " (mock mode)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              } ${connectionStatus !== "connected" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input {...getInputProps()} disabled={connectionStatus !== "connected"} />
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {isDragActive ? "Drop the file here" : "Drag & drop your RFP file here"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports PDF, DOC, DOCX, TXT files up to 50MB
                    {connectionStatus !== "connected" && " (Backend connection required)"}
                  </p>
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
                  <span>AI Analysis in Progress</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>RFP Analysis Ready</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isRunning
                ? `Processing ${uploadedFile.name} through AI analysis pipeline`
                : `Ready to analyze: ${uploadedFile.name}`}
              {currentAnalysisId && (
                <span className="block text-xs text-gray-500 mt-1">
                  Analysis ID: {currentAnalysisId}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedFile && !isRunning && (
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium text-green-600 flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>File ready for analysis</span>
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

              {/* Test Upload Button */}
              <Button
                variant="outline"
                onClick={testUpload}
                disabled={isRunning || !uploadedFile || connectionStatus !== "connected"}
              >
                <Upload className="w-4 h-4 mr-2" />
                Test Upload
              </Button>

              <Button
                onClick={startAnalysis}
                disabled={isRunning || !uploadedFile || connectionStatus !== "connected"}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Analysis...
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
                  <span>{completedSteps} of {analysisSteps.length} steps completed</span>
                  <span>{backendStatus.agents_available ? "Real AI processing" : "Mock processing"}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analysis Steps */}
      {(isRunning || analysisSteps.some((s) => s.status !== "pending")) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Analysis Pipeline</h3>
            <Badge variant="outline" className="text-xs">
              {backendStatus.agents_available ? "Live Backend Processing" : "Mock Mode"}
            </Badge>
          </div>

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

                      <div className="flex items-center justify-between">
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

                        {step.timestamp && (
                          <span className="text-xs text-gray-500">
                            {new Date(step.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>

                      {/* Show additional details if available */}
                      {step.details && (
                        <div className="text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
                          {typeof step.details === 'object' ? (
                            <div className="max-h-20 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-xs">
                                {JSON.stringify(step.details, null, 2)}
                              </pre>
                            </div>
                          ) : (
                            step.details
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}