"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, Loader2, Brain } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface RFPUploadProps {
  onAnalysisComplete: (data: any) => void
}

export function RFPUpload({ onAnalysisComplete }: RFPUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([])

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

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisSteps([])

    const steps = [
      "Extracting text from RFP document...",
      "Analyzing requirements and patterns...",
      "Comparing with existing module library...",
      "Identifying gaps and opportunities...",
      "Generating recommendations...",
      "Creating analysis report...",
    ]

    for (let i = 0; i < steps.length; i++) {
      setAnalysisSteps((prev) => [...prev, steps[i]])
      setAnalysisProgress(((i + 1) / steps.length) * 100)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    // Simulate analysis results
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

    setIsAnalyzing(false)
    onAnalysisComplete(mockAnalysisData)
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
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
              {uploadedFile ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-600 flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>File uploaded successfully</span>
                  </p>
                  <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {isDragActive ? "Drop the file here" : "Drag & drop your RFP file here"}
                  </p>
                  <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX, TXT files up to 50MB</p>
                </div>
              )}
            </div>
          </div>

          {uploadedFile && (
            <div className="mt-6 flex justify-center">
              <Button onClick={startAnalysis} disabled={isAnalyzing} className="px-8">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Start AI Analysis
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analysis in Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={analysisProgress} className="w-full" />
            <div className="space-y-2">
              {analysisSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
