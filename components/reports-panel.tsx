"use client"

import { useState } from "react"
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
} from "lucide-react"

interface ReportsPanelProps {
  data: any
}

export function ReportsPanel({ data }: ReportsPanelProps) {
  const [selectedReport, setSelectedReport] = useState("executive")

  const reportTypes = [
    {
      id: "executive",
      name: "Executive Summary",
      description: "High-level overview for stakeholders",
      icon: Building,
      pages: 3,
      sections: ["Overview", "Key Findings", "Recommendations"],
    },
    {
      id: "technical",
      name: "Technical Analysis",
      description: "Detailed technical assessment",
      icon: FileText,
      pages: 12,
      sections: ["Architecture", "Modules", "Dependencies", "Implementation"],
    },
    {
      id: "gap_analysis",
      name: "Gap Analysis Report",
      description: "Comprehensive gap identification",
      icon: BarChart3,
      pages: 8,
      sections: ["Current State", "Required State", "Gaps", "Mitigation"],
    },
    {
      id: "resource_planning",
      name: "Resource Planning",
      description: "Team and resource requirements",
      icon: User,
      pages: 6,
      sections: ["Skills Matrix", "Hiring Plan", "Training Needs", "Timeline"],
    },
  ]

  const exportFormats = [
    { id: "pdf", name: "PDF", icon: FileOutput, description: "Portable document format" },
    { id: "docx", name: "Word", icon: FileText, description: "Microsoft Word document" },
    { id: "pptx", name: "PowerPoint", icon: PieChart, description: "Presentation slides" },
    { id: "excel", name: "Excel", icon: BarChart3, description: "Spreadsheet with data" },
  ]

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
          <p className="text-gray-600">Generate and export comprehensive analysis reports</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon
          return (
            <Card
              key={report.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedReport === report.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-sm">{report.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Pages:</span>
                    <span className="font-medium">{report.pages}</span>
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
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>{reportTypes.find((r) => r.id === selectedReport)?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg min-h-96">
                    {selectedReport === "executive" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Executive Summary</h3>
                        <div className="space-y-3 text-sm">
                          <p>
                            <strong>Project:</strong> {data.rfpTitle}
                          </p>
                          <p>
                            <strong>Analysis Date:</strong> {new Date().toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Total Requirements:</strong> {data.totalRequirements}
                          </p>
                          <p>
                            <strong>Module Coverage:</strong>{" "}
                            {((data.existingModules / data.totalRequirements) * 100).toFixed(1)}%
                          </p>

                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Key Findings:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              <li>{data.existingModules} modules can be reused directly</li>
                              <li>{data.modulesToModify} modules require modifications</li>
                              <li>{data.newModulesNeeded} new modules need to be developed</li>
                              <li>Critical skills gaps identified in {data.gapAnalysis?.skills?.length || 0} areas</li>
                            </ul>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Recommendations:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              <li>Prioritize development of cloud infrastructure modules</li>
                              <li>Recruit AI/ML specialists for advanced features</li>
                              <li>Implement automated testing pipeline</li>
                              <li>Establish module reusability standards</li>
                            </ul>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Win/Lose Pattern Analysis:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              <li>5 winning patterns identified with 84% average success rate</li>
                              <li>3 risk patterns detected that require mitigation</li>
                              <li>Cloud-first approach recommended (87% historical win rate)</li>
                              <li>Avoid monolithic architecture (23% historical success rate)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedReport === "technical" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Technical Analysis</h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <h4 className="font-medium mb-2">Architecture Overview:</h4>
                            <p className="text-gray-700">
                              The RFP requires a microservices-based architecture with cloud-native deployment. Current
                              module library covers {((data.existingModules / data.totalRequirements) * 100).toFixed(1)}
                              % of requirements.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Module Analysis:</h4>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                              <div className="bg-green-100 p-3 rounded">
                                <div className="text-lg font-bold text-green-800">{data.existingModules}</div>
                                <div className="text-xs text-green-600">Ready to Use</div>
                              </div>
                              <div className="bg-orange-100 p-3 rounded">
                                <div className="text-lg font-bold text-orange-800">{data.modulesToModify}</div>
                                <div className="text-xs text-orange-600">Need Updates</div>
                              </div>
                              <div className="bg-purple-100 p-3 rounded">
                                <div className="text-lg font-bold text-purple-800">{data.newModulesNeeded}</div>
                                <div className="text-xs text-purple-600">To Develop</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Technical Gaps:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {data.gapAnalysis?.technical?.map((gap: string, index: number) => (
                                <li key={index}>{gap}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedReport === "gap_analysis" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Gap Analysis Report</h3>
                        <div className="space-y-4 text-sm">
                          <div>
                            <h4 className="font-medium mb-2">Current State Assessment:</h4>
                            <p className="text-gray-700">
                              Analysis of {data.totalRequirements} requirements shows {data.existingModules}
                              modules are available and ready for use.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h5 className="font-medium text-red-600 mb-2">Technical Gaps</h5>
                              <ul className="space-y-1">
                                {data.gapAnalysis?.technical?.map((gap: string, index: number) => (
                                  <li key={index} className="text-xs text-gray-600">
                                    • {gap}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-orange-600 mb-2">Functional Gaps</h5>
                              <ul className="space-y-1">
                                {data.gapAnalysis?.functional?.map((gap: string, index: number) => (
                                  <li key={index} className="text-xs text-gray-600">
                                    • {gap}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-blue-600 mb-2">Skill Gaps</h5>
                              <ul className="space-y-1">
                                {data.gapAnalysis?.skills?.map((skill: string, index: number) => (
                                  <li key={index} className="text-xs text-gray-600">
                                    • {skill}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedReport === "resource_planning" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Resource Planning</h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <h4 className="font-medium mb-2">Skills Matrix:</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-xs font-medium text-gray-600 mb-1">Required Skills</h5>
                                {data.gapAnalysis?.skills?.map((skill: string, index: number) => (
                                  <div key={index} className="flex justify-between text-xs py-1">
                                    <span>{skill}</span>
                                    <Badge variant="outline" className="text-xs">
                                      High
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                              <div>
                                <h5 className="text-xs font-medium text-gray-600 mb-1">Timeline</h5>
                                <div className="space-y-1">
                                  <div className="text-xs">Immediate: 2-4 weeks</div>
                                  <div className="text-xs">Short-term: 1-3 months</div>
                                  <div className="text-xs">Long-term: 3-6 months</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="charts" className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg min-h-96 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Interactive charts and visualizations</p>
                      <p className="text-sm text-gray-500">Available in exported reports</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg min-h-96">
                    <div className="space-y-4">
                      <h4 className="font-medium">Raw Data Export</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium mb-2">Analysis Metrics</h5>
                          <div className="space-y-1">
                            <div>Total Requirements: {data.totalRequirements}</div>
                            <div>Existing Modules: {data.existingModules}</div>
                            <div>Modules to Modify: {data.modulesToModify}</div>
                            <div>New Modules Needed: {data.newModulesNeeded}</div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Gap Counts</h5>
                          <div className="space-y-1">
                            <div>Technical Gaps: {data.gapAnalysis?.technical?.length || 0}</div>
                            <div>Functional Gaps: {data.gapAnalysis?.functional?.length || 0}</div>
                            <div>Skill Gaps: {data.gapAnalysis?.skills?.length || 0}</div>
                          </div>
                        </div>
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
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      Export
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
              <Button className="w-full" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </Button>
              <Button className="w-full bg-transparent" variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Email
              </Button>
              <Button className="w-full bg-transparent" variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
