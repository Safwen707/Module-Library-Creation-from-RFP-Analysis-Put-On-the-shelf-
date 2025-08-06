"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Loader2,
  RefreshCw,
  ExternalLink,
  Code,
  Settings,
  Zap,
  Users,
  Database,
  Shield,
  Smartphone,
  Cloud
} from "lucide-react"

interface BackendModule {
  id: string
  name: string
  description: string
  status: string
  complexity: string
  category: string
  technologies?: string[]
  confidence?: number
  source: string
  update_reason?: string
  estimated_weeks?: number
}

interface ModuleBreakdown {
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

export function ModuleLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [moduleData, setModuleData] = useState<ModuleBreakdown | null>(null)
  const [allModules, setAllModules] = useState<BackendModule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Fetch real module data from backend
  useEffect(() => {
    fetchModuleData()
  }, [])

  const fetchModuleData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch module breakdown
      const breakdownResponse = await fetch('http://localhost:8000/api/modules/breakdown')

      if (!breakdownResponse.ok) {
        const errorData = await breakdownResponse.json()
        throw new Error(errorData.detail || 'Failed to fetch module breakdown')
      }

      const breakdown = await breakdownResponse.json()
      setModuleData(breakdown)

      // Combine all modules with proper status mapping
      const combinedModules: BackendModule[] = [
        ...breakdown.breakdown.ready.map((m: any) => ({ ...m, status: 'ready' })),
        ...breakdown.breakdown.needs_update.map((m: any) => ({ ...m, status: 'needs_update' })),
        ...breakdown.breakdown.to_create.map((m: any) => ({ ...m, status: 'to_create' }))
      ]

      setAllModules(combinedModules)
      setLastUpdated(new Date().toISOString())

    } catch (err) {
      console.error('Failed to fetch module data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load module data')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshModules = () => {
    fetchModuleData()
  }

  // Extract categories from real data
  const getCategories = (): string[] => {
    const categories = new Set(allModules.map(m => m.category).filter(Boolean))
    return ['all', ...Array.from(categories).sort()]
  }

  const categories = getCategories()
  const statuses = ["all", "ready", "needs_update", "to_create"]

  const filteredModules = allModules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || module.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "needs_update":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "to_create":
        return <Plus className="w-4 h-4 text-blue-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800"
      case "needs_update":
        return "bg-orange-100 text-orange-800"
      case "to_create":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const getCategoryIcon = (category: string) => {
    const categoryLower = category?.toLowerCase() || ''
    if (categoryLower.includes('security')) return <Shield className="w-4 h-4" />
    if (categoryLower.includes('mobile')) return <Smartphone className="w-4 h-4" />
    if (categoryLower.includes('cloud')) return <Cloud className="w-4 h-4" />
    if (categoryLower.includes('database')) return <Database className="w-4 h-4" />
    if (categoryLower.includes('api')) return <Code className="w-4 h-4" />
    if (categoryLower.includes('user')) return <Users className="w-4 h-4" />
    return <Settings className="w-4 h-4" />
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready": return "Ready to Use"
      case "needs_update": return "Needs Update"
      case "to_create": return "To Create"
      default: return status
    }
  }

  const ModuleCard = ({ module }: { module: BackendModule }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(module.status)}
            <div className="flex items-center space-x-2">
              {getCategoryIcon(module.category)}
              <CardTitle className="text-lg">{module.name}</CardTitle>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">
              {module.confidence ? `${Math.round(module.confidence * 100)}%` : '85%'}
            </span>
          </div>
        </div>
        <CardDescription className="text-sm">{module.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(module.status)}>
              {getStatusText(module.status)}
            </Badge>
            {module.category && (
              <Badge variant="outline">{module.category}</Badge>
            )}
            {module.complexity && (
              <Badge className={getComplexityColor(module.complexity)}>
                {module.complexity}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {module.source}
            </Badge>
          </div>

          {/* Technologies */}
          {module.technologies && module.technologies.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Technologies:</h4>
              <div className="flex flex-wrap gap-1">
                {module.technologies.slice(0, 3).map((tech, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {module.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{module.technologies.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium">{getStatusText(module.status)}</span>
            </div>
            {module.confidence && (
              <div className="flex justify-between">
                <span>Confidence:</span>
                <span className="font-medium">{Math.round(module.confidence * 100)}%</span>
              </div>
            )}
            {module.estimated_weeks && (
              <div className="flex justify-between">
                <span>Est. Timeline:</span>
                <span className="font-medium">{module.estimated_weeks} weeks</span>
              </div>
            )}
            {module.update_reason && (
              <div className="mt-2">
                <span className="font-medium">Update Reason:</span>
                <p className="text-xs text-gray-600 mt-1">{module.update_reason}</p>
              </div>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button
              size="sm"
              className={`flex-1 ${
                module.status === 'ready' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : module.status === 'needs_update'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {module.status === 'ready' ? 'Use Module' :
               module.status === 'needs_update' ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Analyzed Module Library</h2>
          <p className="text-gray-600">Modules identified from real RFP analysis and gap assessment</p>
          {moduleData?.source && (
            <Badge variant="outline" className="mt-2">
              Source: {moduleData.source}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshModules} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Module
          </Button>
        </div>
      </div>

      {/* Backend Status */}
      <Card className={`${moduleData?.source === "real_backend_analysis" ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {moduleData?.source === "real_backend_analysis" ? "Real Module Analysis" : "Limited Module Data"}
                </p>
                <p className="text-sm text-gray-600">
                  {lastUpdated && `Updated: ${new Date(lastUpdated).toLocaleString()}`}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>Total Modules: {moduleData?.summary.total || 0}</div>
              <div>Completion Rate: {moduleData?.summary.completion_rate || 0}%</div>
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
              <p className="text-gray-600">Loading module analysis from backend...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      {!isLoading && moduleData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ready to Use</p>
                  <p className="text-2xl font-bold text-green-600">{moduleData.summary.ready_count}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Need Updates</p>
                  <p className="text-2xl font-bold text-orange-600">{moduleData.summary.update_count}</p>
                </div>
                <Settings className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">To Create</p>
                  <p className="text-2xl font-bold text-blue-600">{moduleData.summary.create_count}</p>
                </div>
                <Code className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion</p>
                  <p className="text-2xl font-bold text-purple-600">{moduleData.summary.completion_rate.toFixed(1)}%</p>
                </div>
                <Zap className="w-8 h-8 text-purple-600" />
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
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Status" : getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Grid */}
      {!isLoading && filteredModules.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {filteredModules.length} Module{filteredModules.length !== 1 ? 's' : ''} Found
            </h3>
            <Badge variant="outline" className="text-xs">
              Real Backend Analysis
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredModules.length === 0 && allModules.length > 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules match your criteria</h3>
          <p className="text-gray-500">Try adjusting your search or filter settings</p>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && allModules.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Module Analysis Available
            </h3>
            <p className="text-gray-600 mb-4">
              Complete an RFP analysis with backend processing to get AI-powered module recommendations
            </p>
            <Button onClick={refreshModules} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Loading Modules
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Module Categories Overview */}
      {!isLoading && moduleData && allModules.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Module Categories Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.filter(cat => cat !== 'all').map((category) => {
                const categoryModules = allModules.filter(m => m.category === category)
                const readyCount = categoryModules.filter(m => m.status === 'ready').length
                const totalCount = categoryModules.length

                return (
                  <div key={category} className="text-center p-3 bg-white rounded-lg border">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      {getCategoryIcon(category)}
                    </div>
                    <div className="font-medium text-sm">{category}</div>
                    <div className="text-xs text-gray-600">{totalCount} modules</div>
                    <div className="text-xs text-green-600 font-medium">
                      {readyCount} ready ({totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0}%)
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Module analysis based on real RFP requirements and AI-powered gap assessment
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}