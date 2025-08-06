"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  CheckCircle,
  AlertTriangle,
  Plus,
  Clock,
  Search,
  Loader2,
  RefreshCw,
  ExternalLink,
  Code,
  Settings,
  Zap
} from "lucide-react"

interface DetailedModuleBreakdownProps {
  data: any
}

interface BackendModule {
  id: string
  name: string
  description: string
  category: string
  status: string
  complexity?: string
  technologies?: string[]
  confidence?: number
  source: string
  update_reason?: string
  estimated_weeks?: number
  business_impact?: string
  technical_details?: string
  priority?: string
}

interface ModuleBreakdownData {
  breakdown: {
    ready: BackendModule[]
    needs_update: BackendModule[]
    to_create: BackendModule[]
  }
  summary: {
    ready_count: number
    update_count: number
    create_count: number
    total: number
    completion_rate: number
  }
  source: string
}

export function DetailedModuleBreakdown({ data }: DetailedModuleBreakdownProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [moduleData, setModuleData] = useState<ModuleBreakdownData | null>(null)
  const [allModules, setAllModules] = useState<BackendModule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Fetch real module breakdown from backend
  useEffect(() => {
    if (data && data.source === "real_backend") {
      fetchModuleBreakdown()
    }
  }, [data])

  const fetchModuleBreakdown = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/modules/breakdown')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to fetch module breakdown')
      }

      const breakdown = await response.json()
      setModuleData(breakdown)

      // Combine all modules with enhanced data
      const combinedModules: BackendModule[] = [
        ...breakdown.breakdown.ready.map((m: any, idx: number) => ({
          ...m,
          id: m.id || `ready_${idx}`,
          status: 'ready',
          priority: determinePriority(m),
          business_impact: generateBusinessImpact(m),
          technical_details: generateTechnicalDetails(m)
        })),
        ...breakdown.breakdown.needs_update.map((m: any, idx: number) => ({
          ...m,
          id: m.id || `update_${idx}`,
          status: 'needs_update',
          priority: determinePriority(m),
          business_impact: generateBusinessImpact(m),
          technical_details: generateTechnicalDetails(m)
        })),
        ...breakdown.breakdown.to_create.map((m: any, idx: number) => ({
          ...m,
          id: m.id || `create_${idx}`,
          status: 'to_create',
          priority: determinePriority(m),
          business_impact: generateBusinessImpact(m),
          technical_details: generateTechnicalDetails(m)
        }))
      ]

      setAllModules(combinedModules)
      setLastUpdated(new Date().toISOString())

    } catch (err) {
      console.error('Failed to fetch module breakdown:', err)
      setError(err instanceof Error ? err.message : 'Failed to load module breakdown')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshModules = () => {
    fetchModuleBreakdown()
  }

  // Helper functions to enrich module data
  const determinePriority = (module: any): string => {
    if (module.business_impact === "Critical" ||
        module.name?.toLowerCase().includes('security') ||
        module.name?.toLowerCase().includes('payment') ||
        module.name?.toLowerCase().includes('auth')) {
      return "High"
    }
    if (module.complexity === "Low" || module.estimated_weeks && module.estimated_weeks < 6) {
      return "Low"
    }
    return "Medium"
  }

  const generateBusinessImpact = (module: any): string => {
    if (module.business_impact) return module.business_impact

    const name = module.name?.toLowerCase() || ''
    if (name.includes('security') || name.includes('auth')) {
      return "Critical for system security and user access control"
    }
    if (name.includes('payment') || name.includes('billing')) {
      return "Essential for revenue generation and transaction processing"
    }
    if (name.includes('api') || name.includes('gateway')) {
      return "Enables integration and system interoperability"
    }
    if (name.includes('analytics') || name.includes('reporting')) {
      return "Important for business intelligence and decision making"
    }
    if (name.includes('notification') || name.includes('email')) {
      return "Critical for user engagement and communication"
    }
    return "Contributes to overall system functionality and user experience"
  }

  const generateTechnicalDetails = (module: any): string => {
    if (module.technical_details) return module.technical_details

    const name = module.name?.toLowerCase() || ''
    const category = module.category?.toLowerCase() || ''

    if (name.includes('auth') || category.includes('security')) {
      return "OAuth 2.0, JWT tokens, multi-factor authentication, role-based access control"
    }
    if (name.includes('payment')) {
      return "PCI DSS compliance, multiple payment providers, secure tokenization"
    }
    if (name.includes('api') || name.includes('gateway')) {
      return "RESTful APIs, rate limiting, authentication, monitoring, versioning"
    }
    if (name.includes('database') || name.includes('storage')) {
      return "Connection pooling, query optimization, backup/recovery, scaling"
    }
    if (name.includes('cloud') || name.includes('infrastructure')) {
      return "Container orchestration, auto-scaling, load balancing, monitoring"
    }
    if (name.includes('ai') || name.includes('ml')) {
      return "Machine learning models, training pipelines, inference engines"
    }
    if (name.includes('mobile')) {
      return "Cross-platform APIs, push notifications, offline synchronization"
    }
    return `${module.category || 'System'} module with modern architecture and scalable design`
  }

  // Extract categories and priorities from real data
  const getCategories = (): string[] => {
    const categories = new Set(allModules.map(m => m.category).filter(Boolean))
    return ['all', ...Array.from(categories).sort()]
  }

  const getPriorities = (): string[] => {
    const priorities = new Set(allModules.map(m => m.priority).filter(Boolean))
    return ['all', ...Array.from(priorities).sort()]
  }

  const categories = getCategories()
  const priorities = getPriorities()

  const filteredModules = allModules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory
    const matchesPriority = selectedPriority === "all" || module.priority === selectedPriority
    return matchesSearch && matchesCategory && matchesPriority
  })

  const readyModules = filteredModules.filter((m) => m.status === "ready")
  const updateModules = filteredModules.filter((m) => m.status === "needs_update")
  const createModules = filteredModules.filter((m) => m.status === "to_create")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "needs_update":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case "to_create":
        return <Plus className="w-5 h-5 text-purple-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "border-green-200 bg-green-50"
      case "needs_update":
        return "border-orange-200 bg-orange-50"
      case "to_create":
        return "border-purple-200 bg-purple-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const ModuleCard = ({ module }: { module: BackendModule }) => (
    <Card className={`transition-all duration-300 ${getStatusColor(module.status)}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(module.status)}
            <div>
              <CardTitle className="text-lg">{module.name}</CardTitle>
              <CardDescription className="mt-1">{module.description}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {module.complexity && (
              <Badge className={getComplexityColor(module.complexity)}>
                {module.complexity}
              </Badge>
            )}
            {module.priority && (
              <Badge className={getPriorityColor(module.priority)}>
                {module.priority}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {module.source}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 font-medium">{module.category || 'General'}</span>
            </div>
            {module.estimated_weeks && (
              <div>
                <span className="text-gray-600">Timeline:</span>
                <span className="ml-2 font-medium">{module.estimated_weeks} weeks</span>
              </div>
            )}
            {module.confidence && (
              <div>
                <span className="text-gray-600">Confidence:</span>
                <span className="ml-2 font-medium">{Math.round(module.confidence * 100)}%</span>
              </div>
            )}
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-medium capitalize">{module.status.replace('_', ' ')}</span>
            </div>
          </div>

          {module.update_reason && (
            <div>
              <h4 className="font-medium text-sm mb-2">Update Reason:</h4>
              <p className="text-sm text-gray-700">{module.update_reason}</p>
            </div>
          )}

          <div>
            <h4 className="font-medium text-sm mb-2">Business Impact:</h4>
            <p className="text-sm text-gray-700">{module.business_impact}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Technical Details:</h4>
            <p className="text-sm text-gray-700">{module.technical_details}</p>
          </div>

          {module.technologies && module.technologies.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Technologies:</h4>
              <div className="flex flex-wrap gap-1">
                {module.technologies.slice(0, 4).map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {module.technologies.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{module.technologies.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (!data) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Module Breakdown Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to see detailed module breakdown</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Module Breakdown</h2>
          <p className="text-gray-600">Detailed analysis of modules from real RFP requirements</p>
          {data.source && (
            <Badge variant="outline" className="mt-2">
              Source: {data.source}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={refreshModules}
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Backend Status */}
      <Card className={`${data.source === "real_backend" ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {data.source === "real_backend" ? "Real Module Analysis" : "Limited Module Data"}
                </p>
                <p className="text-sm text-gray-600">
                  {moduleData ? `${moduleData.source} - ${moduleData.summary.total} modules analyzed` : "Waiting for analysis"}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>Completion: {moduleData?.summary.completion_rate || 0}%</div>
              <div>Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <p className="text-gray-600">Loading detailed module breakdown from backend...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards - Real Data */}
      {!isLoading && moduleData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ready Modules</p>
                  <p className="text-2xl font-bold text-green-600">{moduleData.summary.ready_count}</p>
                  <p className="text-sm text-gray-500">
                    {moduleData.summary.completion_rate.toFixed(1)}% of requirements
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Needs Update</p>
                  <p className="text-2xl font-bold text-orange-600">{moduleData.summary.update_count}</p>
                  <p className="text-sm text-gray-500">
                    {((moduleData.summary.update_count / moduleData.summary.total) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <Settings className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">To Create</p>
                  <p className="text-2xl font-bold text-purple-600">{moduleData.summary.create_count}</p>
                  <p className="text-sm text-gray-500">
                    {((moduleData.summary.create_count / moduleData.summary.total) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <Code className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {!isLoading && allModules.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority === "all" ? "All Priorities" : priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Tabs */}
      {!isLoading && allModules.length > 0 && (
        <Tabs defaultValue="ready" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ready" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Ready ({readyModules.length})</span>
            </TabsTrigger>
            <TabsTrigger value="update" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Needs Update ({updateModules.length})</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>To Create ({createModules.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ready" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Production-Ready Modules</h3>
              <Badge variant="outline" className="text-xs">
                Real Backend Analysis
              </Badge>
            </div>
            {readyModules.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {readyModules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No ready modules found with current filters</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="update" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Modules Requiring Updates</h3>
              <Badge variant="outline" className="text-xs">
                AI-Identified Updates
              </Badge>
            </div>
            {updateModules.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {updateModules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No modules need updates with current filters</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Modules to Develop</h3>
              <Badge variant="outline" className="text-xs">
                Gap Analysis Results
              </Badge>
            </div>
            {createModules.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {createModules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No new modules to create with current filters</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* No Data State */}
      {!isLoading && allModules.length === 0 && data.source !== "real_backend" && (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Limited Module Breakdown Available
            </h3>
            <p className="text-gray-600 mb-4">
              Complete a real RFP analysis with backend processing to get detailed module breakdown
            </p>
            <Button onClick={refreshModules} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Loading Module Breakdown
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analysis Methodology */}
      {!isLoading && moduleData && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Module Analysis Methodology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{moduleData.summary.total}</div>
                <div className="text-sm text-gray-600">Total Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {moduleData.summary.completion_rate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Ready Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">AI-Powered</div>
                <div className="text-sm text-gray-600">Analysis Engine</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <strong>Analysis Source:</strong> {moduleData.source}<br/>
              <strong>Methodology:</strong> AI-powered gap analysis comparing RFP requirements with existing capabilities<br/>
              <strong>Categories:</strong> Modules are automatically categorized based on functionality and technology stack<br/>
              <strong>Priority Assessment:</strong> Business impact and technical complexity drive priority assignments
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}