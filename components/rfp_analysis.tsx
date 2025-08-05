"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Brain, CheckCircle, Clock, Zap, Target, TrendingUp, Users, DollarSign } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface RFPAnalysisProps {
  onAnalysisComplete?: (data: any) => void
}

export function RFPAnalysis({ onAnalysisComplete }: RFPAnalysisProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStage, setAnalysisStage] = useState("")
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    multiple: true,
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const simulateAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const stages = [
      "Extracting text from documents...",
      "Analyzing requirements...",
      "Identifying technical specifications...",
      "Mapping to existing modules...",
      "Calculating complexity scores...",
      "Generating recommendations...",
      "Finalizing analysis...",
    ]

    for (let i = 0; i < stages.length; i++) {
      setAnalysisStage(stages[i])
      setAnalysisProgress((i + 1) * (100 / stages.length))
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    // Mock analysis results
    const mockResults = {
      projectName: projectName || "Enterprise Digital Platform",
      totalRequirements: 47,
      technicalComplexity: "High",
      estimatedDuration: "12-18 months",
      budgetRange: "€450K - €680K",
      riskLevel: "Medium",
      modules: [
        {
          name: "User Authentication & Authorization",
          complexity: "Medium",
          estimatedHours: 120,
          existingModule: true,
          adaptationRequired: "Minor",
        },
        {
          name: "Payment Processing Gateway",
          complexity: "High",
          estimatedHours: 200,
          existingModule: false,
          adaptationRequired: "New Development",
        },
        {
          name: "Real-time Analytics Dashboard",
          complexity: "High",
          estimatedHours: 180,
          existingModule: true,
          adaptationRequired: "Major",
        },
        {
          name: "Mobile API Gateway",
          complexity: "Medium",
          estimatedHours: 150,
          existingModule: true,
          adaptationRequired: "Minor",
        },
      ],
      keyRequirements: [
        "Multi-tenant architecture support",
        "Real-time data processing capabilities",
        "Advanced security and compliance features",
        "Scalable cloud infrastructure",
        "Mobile-first responsive design",
      ],
      recommendedTeam: [
        { role: "Solution Architect", level: "Senior", duration: "Full project" },
        { role: "Backend Developer", level: "Senior", duration: "12 months" },
        { role: "Frontend Developer", level: "Mid-level", duration: "10 months" },
        { role: "DevOps Engineer", level: "Senior", duration: "8 months" },
        { role: "QA Engineer", level: "Mid-level", duration: "6 months" },
      ],
    }

    setIsAnalyzing(false)
    onAnalysisComplete?.(mockResults)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
            <CardTitle className="text-2xl text-blue-900">AI Analysis in Progress</CardTitle>
            <CardDescription className="text-blue-700">
              Our AI is analyzing your RFP documents to extract requirements and generate insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-800">Analysis Progress</span>
                <span className="text-sm text-blue-600">{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-3" />
              <div className="flex items-center space-x-2 text-sm text-blue-700">
                <Clock className="w-4 h-4" />
                <span>{analysisStage}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-900">{files.length}</div>
                <div className="text-xs text-blue-600">Documents</div>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-green-900">47</div>
                <div className="text-xs text-green-600">Requirements Found</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Project Information</span>
          </CardTitle>
          <CardDescription>Provide basic information about your RFP project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Input id="projectType" placeholder="e.g., Web Application, Mobile App..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Project Description (Optional)</Label>
            <Textarea
              id="projectDescription"
              placeholder="Brief description of the project requirements..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Upload RFP Documents</span>
          </CardTitle>
          <CardDescription>
            Upload your RFP documents for AI-powered analysis. Supported formats: PDF, DOC, DOCX, TXT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              {isDragActive ? (
                <div>
                  <p className="text-lg font-medium text-blue-600">Drop the files here...</p>
                  <p className="text-sm text-blue-500">Release to upload your RFP documents</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drag & drop your RFP files here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">Support for PDF, DOC, DOCX, and TXT files up to 10MB each</p>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-gray-900">Uploaded Files ({files.length})</h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">{file.name}</div>
                        <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Analysis Options</span>
          </CardTitle>
          <CardDescription>Configure how you want the AI to analyze your RFP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Requirements Extraction</span>
              </div>
              <p className="text-sm text-gray-600">Extract and categorize all requirements</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Complexity Analysis</span>
              </div>
              <p className="text-sm text-gray-600">Assess technical complexity and risks</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Team Recommendations</span>
              </div>
              <p className="text-sm text-gray-600">Suggest optimal team composition</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <span className="font-medium">Cost Estimation</span>
              </div>
              <p className="text-sm text-gray-600">Generate budget and timeline estimates</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Analysis Button */}
      <div className="text-center">
        <Button
          onClick={simulateAnalysis}
          disabled={files.length === 0}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
        >
          <Zap className="w-5 h-5 mr-2" />
          Start AI Analysis
        </Button>
        {files.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">Please upload at least one RFP document to begin analysis</p>
        )}
      </div>
    </div>
  )
}
