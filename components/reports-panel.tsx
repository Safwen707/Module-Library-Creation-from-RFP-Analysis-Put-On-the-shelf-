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
  Eye,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
} from "lucide-react"

interface ReportsPanelProps {
  data: any
}

export function ReportsPanel({ data }: ReportsPanelProps) {
  const [showDetails, setShowDetails] = useState(false)
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

  // Summary View (Default)
  if (!showDetails) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">RFP Response Summary</h2>
            <p className="text-gray-600 mt-1">Executive overview of your RFP analysis results</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Summary
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Module Coverage</p>
                  <p className="text-2xl font-bold text-green-800">
                    {((data.existingModules / data.totalRequirements) * 100).toFixed(1)}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Ready Modules</p>
                  <p className="text-2xl font-bold text-blue-800">{data.existingModules}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">New Development</p>
                  <p className="text-2xl font-bold text-orange-800">{data.newModulesNeeded}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Estimated Timeline</p>
                  <p className="text-2xl font-bold text-purple-800">12 months</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Executive Summary Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-900">Executive Summary</CardTitle>
                <CardDescription className="text-gray-600">
                  Key findings and recommendations for {data.rfpTitle}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-white">
                Confidence: 94%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Project Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Project Overview
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">RFP Title:</span>
                      <span className="font-medium">{data.rfpTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Requirements:</span>
                      <span className="font-medium">{data.totalRequirements}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Analysis Date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project Type:</span>
                      <span className="font-medium">Enterprise Software Development</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Success Indicators
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Win Probability</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                        </div>
                        <span className="text-sm font-medium text-green-600">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Module Reusability</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "73%" }}></div>
                        </div>
                        <span className="text-sm font-medium text-blue-600">73%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk Level</span>
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                        Medium
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Findings */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Key Findings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-800">{data.existingModules}</div>
                    <div className="text-sm text-green-600">Modules ready for reuse</div>
                    <div className="text-xs text-green-500 mt-1">No modifications needed</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-800">{data.modulesToModify}</div>
                    <div className="text-sm text-orange-600">Modules need updates</div>
                    <div className="text-xs text-orange-500 mt-1">Minor to moderate changes</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-800">{data.newModulesNeeded}</div>
                    <div className="text-sm text-purple-600">New modules required</div>
                    <div className="text-xs text-purple-500 mt-1">Full development needed</div>
                  </div>
                </div>
              </div>

              {/* Top Recommendations */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Top Recommendations
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-blue-900">Prioritize Cloud Infrastructure Modules</div>
                      <div className="text-sm text-blue-700">87% historical success rate with cloud-first approach</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-green-900">Recruit AI/ML Specialists</div>
                      <div className="text-sm text-green-700">Critical skills gap identified for advanced features</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-purple-900">Implement Automated Testing Pipeline</div>
                      <div className="text-sm text-purple-700">Reduce deployment risks by 65%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Estimation */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Cost Estimation
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">€450K</div>
                    <div className="text-xs text-gray-600">Total Budget</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">€180K</div>
                    <div className="text-xs text-gray-600">Savings from Reuse</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">12 months</div>
                    <div className="text-xs text-gray-600">Timeline</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">8 people</div>
                    <div className="text-xs text-gray-600">Team Size</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center pt-6">
          <Button
            onClick={() => setShowDetails(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3"
          >
            <Eye className="w-5 h-5 mr-2" />
            Voir les Détails Complets
          </Button>
        </div>
      </div>
    )
  }

  // Detailed View
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setShowDetails(false)} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au Résumé</span>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rapports Détaillés</h2>
            <p className="text-gray-600">Analyse complète et rapports d'export</p>
          </div>
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
            Download Response
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
                            <div>Ready-to-use Modules: {data.existingModules}</div>
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
