"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Users, Code, TrendingUp, AlertCircle, CheckCircle, Clock, ArrowRight } from "lucide-react"

interface RecommendationsPanelProps {
  data: any
}

export function RecommendationsPanel({ data }: RecommendationsPanelProps) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to see personalized recommendations</p>
      </div>
    )
  }

  const mockRecommendations = [
    {
      id: 1,
      type: "module_creation",
      priority: "high",
      title: "Create Cloud Infrastructure Module",
      description:
        "Develop a comprehensive cloud deployment and scaling module to address infrastructure requirements in the RFP.",
      impact: "High",
      effort: "Medium",
      timeline: "4-6 weeks",
      skills: ["DevOps Engineer", "Cloud Architect"],
      benefits: ["Faster deployment", "Better scalability", "Cost optimization"],
    },
    {
      id: 2,
      type: "skill_acquisition",
      priority: "high",
      title: "Hire AI/ML Specialist",
      description:
        "Recruit a machine learning specialist to implement AI-driven features identified in the RFP analysis.",
      impact: "High",
      effort: "High",
      timeline: "8-12 weeks",
      skills: ["Machine Learning Engineer", "Data Scientist"],
      benefits: ["Advanced analytics", "Predictive capabilities", "Competitive advantage"],
    },
    {
      id: 3,
      type: "module_update",
      priority: "medium",
      title: "Upgrade Authentication Module",
      description: "Update existing authentication module to support advanced security features required by the RFP.",
      impact: "Medium",
      effort: "Low",
      timeline: "2-3 weeks",
      skills: ["Security Engineer", "Backend Developer"],
      benefits: ["Enhanced security", "Compliance", "Better user experience"],
    },
    {
      id: 4,
      type: "process_improvement",
      priority: "medium",
      title: "Implement Automated Testing",
      description: "Set up comprehensive automated testing pipeline to ensure quality and reliability.",
      impact: "Medium",
      effort: "Medium",
      timeline: "3-4 weeks",
      skills: ["QA Engineer", "DevOps Engineer"],
      benefits: ["Faster delivery", "Higher quality", "Reduced bugs"],
    },
    {
      id: 5,
      type: "training",
      priority: "low",
      title: "Team Training on New Technologies",
      description: "Provide training to existing team members on emerging technologies identified in the gap analysis.",
      impact: "Medium",
      effort: "Low",
      timeline: "2-4 weeks",
      skills: ["All team members"],
      benefits: ["Skill enhancement", "Better productivity", "Knowledge sharing"],
    },
    {
      id: 6,
      type: "pattern_application",
      priority: "high",
      title: "Apply Cloud-First Win Pattern",
      description: "Implement cloud-native architecture based on historical success patterns (87% win rate).",
      impact: "High",
      effort: "Medium",
      timeline: "3-5 weeks",
      skills: ["Cloud Architect", "DevOps Engineer"],
      benefits: ["Higher win probability", "Scalable solution", "Cost optimization"],
    },
    {
      id: 7,
      type: "pattern_avoidance",
      priority: "high",
      title: "Avoid Monolithic Architecture Pattern",
      description: "Prevent using monolithic design patterns that historically lead to 77% failure rate.",
      impact: "High",
      effort: "Low",
      timeline: "1-2 weeks",
      skills: ["Solution Architect", "Technical Lead"],
      benefits: ["Avoid common pitfalls", "Better scalability", "Modern architecture"],
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "module_creation":
        return <Code className="w-5 h-5 text-blue-600" />
      case "skill_acquisition":
        return <Users className="w-5 h-5 text-green-600" />
      case "module_update":
        return <TrendingUp className="w-5 h-5 text-orange-600" />
      case "process_improvement":
        return <CheckCircle className="w-5 h-5 text-purple-600" />
      case "training":
        return <Lightbulb className="w-5 h-5 text-yellow-600" />
      case "pattern_application":
        return <Code className="w-5 h-5 text-blue-600" />
      case "pattern_avoidance":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Recommendations</h2>
          <p className="text-gray-600">Actionable insights based on RFP analysis</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button>Create Action Plan</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockRecommendations.filter((r) => r.priority === "high").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medium Priority</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockRecommendations.filter((r) => r.priority === "medium").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Actions</p>
                <p className="text-2xl font-bold text-blue-600">{mockRecommendations.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {mockRecommendations.map((recommendation) => (
          <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(recommendation.type)}
                  <div>
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                    <CardDescription className="mt-1">{recommendation.description}</CardDescription>
                  </div>
                </div>
                <Badge className={getPriorityColor(recommendation.priority)}>
                  {recommendation.priority.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Metrics */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impact:</span>
                      <span className={`font-medium ${getImpactColor(recommendation.impact)}`}>
                        {recommendation.impact}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effort:</span>
                      <span className="font-medium">{recommendation.effort}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="font-medium">{recommendation.timeline}</span>
                    </div>
                  </div>
                </div>

                {/* Skills Required */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Expected Benefits</h4>
                  <ul className="space-y-1">
                    {recommendation.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">
                  Start Implementation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
