"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, FileText, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react"

const mockModules = [
  {
    id: 1,
    name: "User Authentication Module",
    description: "Complete authentication system with OAuth, JWT, and multi-factor authentication",
    status: "active",
    version: "2.1.0",
    lastUpdated: "2024-01-15",
    category: "Security",
    complexity: "Medium",
    reusability: 95,
  },
  {
    id: 2,
    name: "Payment Processing Gateway",
    description: "Secure payment processing with multiple payment providers integration",
    status: "active",
    version: "1.8.2",
    lastUpdated: "2024-01-10",
    category: "Finance",
    complexity: "High",
    reusability: 88,
  },
  {
    id: 3,
    name: "Real-time Notification System",
    description: "WebSocket-based notification system with push notifications",
    status: "needs_update",
    version: "1.5.0",
    lastUpdated: "2023-12-20",
    category: "Communication",
    complexity: "Medium",
    reusability: 92,
  },
  {
    id: 4,
    name: "Data Analytics Dashboard",
    description: "Interactive dashboard with charts, filters, and export capabilities",
    status: "deprecated",
    version: "1.2.0",
    lastUpdated: "2023-11-15",
    category: "Analytics",
    complexity: "High",
    reusability: 75,
  },
  {
    id: 5,
    name: "File Upload & Management",
    description: "Secure file upload with cloud storage integration and file processing",
    status: "active",
    version: "2.0.1",
    lastUpdated: "2024-01-12",
    category: "Storage",
    complexity: "Low",
    reusability: 98,
  },
]

export function ModuleLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const categories = ["all", "Security", "Finance", "Communication", "Analytics", "Storage"]
  const statuses = ["all", "active", "needs_update", "deprecated"]

  const filteredModules = mockModules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || module.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "needs_update":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "deprecated":
        return <Clock className="w-4 h-4 text-red-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "needs_update":
        return "bg-orange-100 text-orange-800"
      case "deprecated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Module Library</h2>
          <p className="text-gray-600">Manage and organize your reusable modules</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Module
        </Button>
      </div>

      {/* Filters */}
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
                    {status === "all" ? "All Status" : status.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(module.status)}
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{module.reusability}%</span>
                </div>
              </div>
              <CardDescription className="text-sm">{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusColor(module.status)}>{module.status.replace("_", " ")}</Badge>
                  <Badge variant="outline">{module.category}</Badge>
                  <Badge className={getComplexityColor(module.complexity)}>{module.complexity}</Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-medium">{module.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{module.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reusability:</span>
                    <span className="font-medium">{module.reusability}%</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Use Module
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
