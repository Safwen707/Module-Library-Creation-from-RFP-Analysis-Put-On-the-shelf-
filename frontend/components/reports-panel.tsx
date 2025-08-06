"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileOutput,
  Download,
  Share2,
  Printer,
  Mail,
  BarChart3,
  PieChart,
  FileText,
  Calendar,
  User,
  Building,
  Loader2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react"

interface ReportsPanelProps {
  data: any
}

interface GeneratedReport {
  report_id: string
  type: string
  generated_at: string
  analysis_id: string
  content: any
  download_url?: string
  source: string
}

export function ReportsPanel({ data }: ReportsPanelProps) {
  const [selectedReport, setSelectedReport] = useState("executive")
  const [generatedReports, setGeneratedReports] = useState<{[key: string]: GeneratedReport}>({})
  const [isGenerating, setIsGenerating] = useState<{[key: string]: boolean}>({})
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState<{[key: string]: boolean}>({})

  const reportTypes = [
    {
      id: "executive",
      name: "Executive Summary",
      description: "High-level overview for stakeholders",
      icon: Building,
      pages: 3,
      sections: ["Overview", "Key Findings", "Recommendations"],
      endpoint: "executive_summary"
    },
    {
      id: "technical",
      name: "Technical Analysis",
      description: "Detailed technical assessment",
      icon: FileText,
      pages: 12,
      sections: ["Architecture", "Modules", "Dependencies", "Implementation"],
      endpoint: "technical_analysis"
    },
    {
      id: "gap_analysis",
      name: "Gap Analysis Report",
      description: "Comprehensive gap identification",
      icon: BarChart3,
      pages: 8,
      sections: ["Current State", "Required State", "Gaps", "Mitigation"],
      endpoint: "gap_analysis"
    },
    {
      id: "resource_planning",
      name: "Resource Planning",
      description: "Team and resource requirements",
      icon: User,
      pages: 6,
      sections: ["Skills Matrix", "Hiring Plan", "Training Needs", "Timeline"],
      endpoint: "resource_planning"
    },
  ]

  const exportFormats = [
    { id: "pdf", name: "PDF", icon: FileOutput, description: "Portable document format" },
    { id: "docx", name: "Word", icon: FileText, description: "Microsoft Word document" },
    { id: "pptx", name: "PowerPoint", icon: PieChart, description: "Presentation slides" },
    { id: "excel", name: "Excel", icon: BarChart3, description: "Spreadsheet with data" },
  ]

  // Generate report using real backend
  const generateReport = async (reportType: string) => {
    if (!data) return

    setIsGenerating(prev => ({ ...prev, [reportType]: true }))
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_type: reportType,
          analysis_id: data.analysis_id || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Report generation failed')
      }

      const result = await response.json()

      if (result.success) {
        setGeneratedReports(prev => ({
          ...prev,
          [reportType]: result.report
        }))
      } else {
        throw new Error('Report generation failed')
      }

    } catch (err) {
      console.error('Report generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setIsGenerating(prev => ({ ...prev, [reportType]: false }))
    }
  }

  // Export report in specific format
  const exportReport = async (reportType: string, format: string) => {
    const exportKey = `${reportType}-${format}`
    setIsExporting(prev => ({ ...prev, [exportKey]: true }))

    try {
      // For now, download the generated report content
      const report = generatedReports[reportType]
      if (!report) {
        await generateReport(reportType)
        return
      }

      // Create downloadable content based on format
      let content = ''
      let filename = ''
      let mimeType = ''

      switch (format) {
        case 'pdf':
          // In a real implementation, you'd convert to PDF
          content = formatReportContent(report.content, 'text')
          filename = `${reportType}_report_${Date.now()}.txt`
          mimeType = 'text/plain'
          break
        case 'docx':
          content = formatReportContent(report.content, 'markdown')
          filename = `${reportType}_report_${Date.now()}.md`
          mimeType = 'text/markdown'
          break
        default:
          content = JSON.stringify(report.content, null, 2)
          filename = `${reportType}_report_${Date.now()}.json`
          mimeType = 'application/json'
      }

      // Download the file
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

    } catch (err) {
      console.error('Export error:', err)
      setError(`Failed to export ${format.toUpperCase()} report`)
    } finally {
      setIsExporting(prev => ({ ...prev, [exportKey]: false }))
    }
  }

  const formatReportContent = (content: any, format: 'text' | 'markdown'): string => {
    if (typeof content === 'string') return content

    if (format === 'markdown') {
      return Object.entries(content)
        .map(([key, value]) => `# ${key.replace('_', ' ').toUpperCase()}\n\n${value}\n\n`)
        .join('')
    }

    return Object.entries(content)
      .map(([key, value]) => `${key.replace('_', ' ').toUpperCase()}:\n${value}\n\n`)
      .join('')
  }

  const shareReport = async (reportType: string) => {
    try {
      const report = generatedReports[reportType]
      if (!report) {
        setError('Please generate the report first')
        return
      }

      const shareData = {
        title: `${reportTypes.find(r => r.id === reportType)?.name} - RFP Analysis`,
        text: `Analysis report for ${data?.rfpTitle || 'RFP Document'}`,
        url: window.location.href
      }

      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        )
        alert('Report link copied to clipboard!')
      }
    } catch (err) {
      console.error('Share error:', err)
    }
  }

  const emailReport = async (reportType: string) => {
    const report = generatedReports[reportType]
    if (!report) {
      setError('Please generate the report first')
      return
    }

    const subject = encodeURIComponent(`RFP Analysis Report - ${data?.rfpTitle || 'Document'}`)
    const body = encodeURIComponent(`Please find the ${reportType} report attached.\n\nGenerated on: ${new Date().toLocaleString()}\nSource: Real AI Backend Analysis`)

    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <FileOutput className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to generate reports</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Export</h2>
          <p className="text-gray-600">Generate and export comprehensive analysis reports from real backend data</p>
          {data.source && (
            <Badge variant="outline" className="mt-2">
              Source: {data.source}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => shareReport(selectedReport)}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={() => emailReport(selectedReport)}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button onClick={() => generateReport('all')}>
            <Download className="w-4 h-4 mr-2" />
            Generate All Reports
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon
          const isGenerated = generatedReports[report.id]
          const isCurrentlyGenerating = isGenerating[report.id]

          return (
            <Card
              key={report.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedReport === report.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-sm">{report.name}</CardTitle>
                  </div>
                  {isGenerated && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {isCurrentlyGenerating && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                </div>
                <CardDescription className="text-xs">{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      isGenerated ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {isCurrentlyGenerating ? 'Generating...' : isGenerated ? 'Ready' : 'Not Generated'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-600">Sections:</span>
                    <div className="flex flex-wrap gap-1">
                      {report.sections.slice(0, 2).map((section, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                      {report.sections.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{report.sections.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    variant={isGenerated ? "outline" : "default"}
                    onClick={(e) => {
                      e.stopPropagation()
                      generateReport(report.id)
                    }}
                    disabled={isCurrentlyGenerating}
                  >
                    {isCurrentlyGenerating ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : isGenerated ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Regenerate
                      </>
                    ) : (
                      'Generate'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Report Preview and Export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>{reportTypes.find((r) => r.id === selectedReport)?.description}</CardDescription>
                </div>
                {generatedReports[selectedReport] && (
                  <Badge variant="outline" className="text-xs">
                    Generated: {new Date(generatedReports[selectedReport].generated_at).toLocaleString()}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  <TabsTrigger value="raw">Raw Data</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg min-h-96">
                    {generatedReports[selectedReport] ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">
                            {reportTypes.find(r => r.id === selectedReport)?.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            Real Backend Data
                          </Badge>
                        </div>

                        <div className="space-y-4 text-sm">
                          {Object.entries(generatedReports[selectedReport].content).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                              <h4 className="font-medium text-gray-900 capitalize">
                                {key.replace('_', ' ')}
                              </h4>
                              <div className="bg-white p-4 rounded border text-gray-700 whitespace-pre-wrap">
                                {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <FileText className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Report Not Generated
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Click "Generate" to create this report using real backend data
                        </p>
                        <Button onClick={() => generateReport(selectedReport)}>
                          {isGenerating[selectedReport] ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            'Generate Report'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg min-h-96">
                    {generatedReports[selectedReport] ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Report Metadata</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium mb-2">Generation Info</h4>
                            <div className="space-y-1">
                              <div>Report ID: {generatedReports[selectedReport].report_id}</div>
                              <div>Type: {generatedReports[selectedReport].type}</div>
                              <div>Generated: {new Date(generatedReports[selectedReport].generated_at).toLocaleString()}</div>
                              <div>Source: {generatedReports[selectedReport].source}</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Analysis Info</h4>
                            <div className="space-y-1">
                              <div>Analysis ID: {generatedReports[selectedReport].analysis_id}</div>
                              <div>RFP Title: {data.rfpTitle || 'N/A'}</div>
                              <div>Total Requirements: {data.totalRequirements || 'N/A'}</div>
                              <div>Confidence: {data.confidence ? `${(data.confidence * 100).toFixed(1)}%` : 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">Generate report to view metadata</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="raw" className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg min-h-96">
                    <div className="space-y-4">
                      <h4 className="font-medium">Raw Analysis Data</h4>
                      <div className="bg-white p-4 rounded border overflow-auto max-h-80">
                        <pre className="text-xs">
                          {JSON.stringify(data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {exportFormats.map((format) => {
                const Icon = format.icon
                const exportKey = `${selectedReport}-${format.id}`
                const isCurrentlyExporting = isExporting[exportKey]
                const canExport = generatedReports[selectedReport]

                return (
                  <div
                    key={format.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-sm">{format.name}</div>
                        <div className="text-xs text-gray-500">{format.description}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportReport(selectedReport, format.id)}
                      disabled={!canExport || isCurrentlyExporting}
                    >
                      {isCurrentlyExporting ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3 mr-1" />
                      )}
                      {isCurrentlyExporting ? 'Exporting...' : 'Export'}
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include Charts</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include Raw Data</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Confidential Watermark</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Company Branding</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                size="sm"
                onClick={() => window.print()}
                disabled={!generatedReports[selectedReport]}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </Button>
              <Button
                className="w-full bg-transparent"
                variant="outline"
                size="sm"
                onClick={() => emailReport(selectedReport)}
                disabled={!generatedReports[selectedReport]}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Report
              </Button>
              <Button
                className="w-full bg-transparent"
                variant="outline"
                size="sm"
                onClick={() => shareReport(selectedReport)}
                disabled={!generatedReports[selectedReport]}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </CardContent>
          </Card>

          {/* Backend Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Backend Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Analysis Source:</span>
                  <Badge variant="outline" className="text-xs">
                    {data.source || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Reports Generated:</span>
                  <span className="font-medium">
                    {Object.keys(generatedReports).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Backend Version:</span>
                  <span className="text-gray-600">3.1.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}