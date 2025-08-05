"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Lightbulb,
  Users,
  Code,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  DollarSign,
  Calendar,
  Calculator,
  Target,
  Sparkles,
  ChevronRight,
  UserPlus,
} from "lucide-react"
import { useState } from "react"
import { TeamOptimizer } from "./team-optimizer"

interface RecommendationsPanelProps {
  data: any
}

interface SkillRequirement {
  id: string
  skillName: string
  level: "Junior" | "Mid-level" | "Senior" | "Expert"
  projectDuration: number
  workload: number
  modules: string[]
}

interface ContractOption {
  type:
    | "CDI"
    | "CDD"
    | "Consultant"
    | "Expert_Mission"
    | "Internal_Transfer"
    | "Exchange_Program"
    | "Freelancer"
    | "Interim_Manager"
  monthlyCost: number
  setupCost: number
  benefits: number
  socialCharges: number
  totalMonthlyCost: number
  advantages: string[]
  disadvantages: string[]
  bestFor: string[]
  availability: "Immediate" | "1-2 weeks" | "1 month" | "2-3 months"
  minDuration: number
  maxDuration: number
  knowledgeRetention: "High" | "Medium" | "Low"
  teamIntegration: "High" | "Medium" | "Low"
  specialization: "General" | "Specialized" | "Expert"
  totalProjectCost?: number
}

export function RecommendationsPanel({ data }: RecommendationsPanelProps) {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([])
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

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
  ]

  const skillRequirements: SkillRequirement[] = [
    {
      id: "ai_ml_engineer",
      skillName: "AI/ML Engineer",
      level: "Senior",
      projectDuration: 16,
      workload: 100,
      modules: ["AI/ML Processing Engine", "Predictive Analytics", "Model Training"],
    },
    {
      id: "blockchain_developer",
      skillName: "Blockchain Developer",
      level: "Expert",
      projectDuration: 18,
      workload: 80,
      modules: ["Blockchain Integration", "Smart Contracts", "Crypto Wallet"],
    },
    {
      id: "iot_specialist",
      skillName: "IoT Specialist",
      level: "Senior",
      projectDuration: 12,
      workload: 100,
      modules: ["IoT Device Gateway", "Protocol Handlers", "Device Management"],
    },
    {
      id: "devops_engineer",
      skillName: "DevOps Engineer",
      level: "Senior",
      projectDuration: 24,
      workload: 75,
      modules: ["Cloud Infrastructure", "CI/CD Pipeline", "Monitoring"],
    },
    {
      id: "security_architect",
      skillName: "Security Architect",
      level: "Expert",
      projectDuration: 15,
      workload: 60,
      modules: ["Advanced Security", "Compliance Module", "Threat Detection"],
    },
    {
      id: "mobile_developer",
      skillName: "Mobile Developer",
      level: "Mid-level",
      projectDuration: 8,
      workload: 100,
      modules: ["Mobile App Backend", "Push Notifications", "Offline Sync"],
    },
  ]

  const quickTeamRecommendation = {
    totalCost: 450000,
    duration: 12,
    profiles: [
      { id: "ai_ml", name: "AI/ML Engineer", type: "Consultant", cost: 180000, priority: "Critical" },
      { id: "devops", name: "DevOps Engineer", type: "CDI", cost: 120000, priority: "High" },
      { id: "security", name: "Security Architect", type: "Expert_Mission", cost: 150000, priority: "Critical" },
    ],
    benefits: ["Fastest time to market", "Optimal cost-efficiency", "Proven success pattern"],
    timeline: "2-4 weeks to full team",
  }

  const availableProfiles = [
    {
      id: "ai_ml",
      name: "AI/ML Engineer",
      level: "Senior",
      type: "Consultant",
      monthlyCost: 15000,
      setupCost: 500,
      minDuration: 6,
      skills: ["Python", "TensorFlow", "MLOps"],
    },
    {
      id: "blockchain",
      name: "Blockchain Developer",
      level: "Expert",
      type: "Expert_Mission",
      monthlyCost: 22000,
      setupCost: 200,
      minDuration: 3,
      skills: ["Solidity", "Web3", "Smart Contracts"],
    },
    {
      id: "devops",
      name: "DevOps Engineer",
      level: "Senior",
      type: "CDI",
      monthlyCost: 10000,
      setupCost: 5000,
      minDuration: 12,
      skills: ["AWS", "Kubernetes", "CI/CD"],
    },
    {
      id: "mobile",
      name: "Mobile Developer",
      level: "Mid-level",
      type: "CDD",
      monthlyCost: 8000,
      setupCost: 2000,
      minDuration: 6,
      skills: ["React Native", "iOS", "Android"],
    },
    {
      id: "security",
      name: "Security Architect",
      level: "Expert",
      type: "Expert_Mission",
      monthlyCost: 25000,
      setupCost: 200,
      minDuration: 2,
      skills: ["Cybersecurity", "Compliance", "Risk Assessment"],
    },
    {
      id: "ux",
      name: "UX/UI Designer",
      level: "Senior",
      type: "Freelancer",
      monthlyCost: 12000,
      setupCost: 100,
      minDuration: 3,
      skills: ["Figma", "User Research", "Prototyping"],
    },
  ]

  const getContractOptions = (skill: SkillRequirement): ContractOption[] => {
    const baseSalary = {
      Junior: 45000,
      "Mid-level": 60000,
      Senior: 80000,
      Expert: 100000,
    }[skill.level]

    const consultantRate = {
      Junior: 400,
      "Mid-level": 550,
      Senior: 750,
      Expert: 950,
    }[skill.level]

    return [
      {
        type: "CDI",
        monthlyCost: baseSalary / 12,
        setupCost: 5000,
        benefits: (baseSalary / 12) * 0.15,
        socialCharges: (baseSalary / 12) * 0.45,
        totalMonthlyCost: (baseSalary / 12) * 1.6,
        availability: "2-3 months",
        minDuration: 52,
        maxDuration: 999,
        knowledgeRetention: "High",
        teamIntegration: "High",
        specialization: "General",
        advantages: ["Long-term commitment", "Deep knowledge retention", "Strong team integration"],
        disadvantages: ["High social charges", "Difficult to terminate", "Fixed cost"],
        bestFor: ["Long-term projects", "Core positions", "Strategic roles"],
        totalProjectCost: 5000 + (baseSalary / 12) * 1.6 * skill.projectDuration,
      },
      {
        type: "Consultant",
        monthlyCost: consultantRate * 22,
        setupCost: 500,
        benefits: 0,
        socialCharges: 0,
        totalMonthlyCost: consultantRate * 22,
        availability: "1-2 weeks",
        minDuration: 2,
        maxDuration: 52,
        knowledgeRetention: "Low",
        teamIntegration: "Medium",
        specialization: "Specialized",
        advantages: ["No social charges", "Quick availability", "Specialized expertise"],
        disadvantages: ["Higher daily rate", "No long-term commitment", "Knowledge leaves"],
        bestFor: ["Short-term projects", "Specialized expertise", "Urgent needs"],
        totalProjectCost: 500 + consultantRate * 22 * skill.projectDuration,
      },
    ]
  }

  const calculateManualTeamCost = () => {
    return selectedProfiles.reduce((total, profileId) => {
      const profile = availableProfiles.find((p) => p.id === profileId)
      if (!profile) return total
      return total + profile.monthlyCost * profile.minDuration + profile.setupCost
    }, 0)
  }

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
      case "pattern_application":
        return <Target className="w-5 h-5 text-blue-600" />
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

  const getContractIcon = (type: string) => {
    switch (type) {
      case "CDI":
        return <Users className="w-4 h-4" />
      case "CDD":
        return <Calendar className="w-4 h-4" />
      case "Consultant":
        return <Users className="w-4 h-4" />
      case "Expert_Mission":
        return <TrendingUp className="w-4 h-4" />
      case "Internal_Transfer":
        return <Users className="w-4 h-4" />
      case "Exchange_Program":
        return <Users className="w-4 h-4" />
      case "Freelancer":
        return <Users className="w-4 h-4" />
      case "Interim_Manager":
        return <Users className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getContractColor = (type: string) => {
    switch (type) {
      case "CDI":
        return "bg-blue-100 text-blue-800"
      case "CDD":
        return "bg-purple-100 text-purple-800"
      case "Consultant":
        return "bg-green-100 text-green-800"
      case "Expert_Mission":
        return "bg-red-100 text-red-800"
      case "Internal_Transfer":
        return "bg-indigo-100 text-indigo-800"
      case "Exchange_Program":
        return "bg-orange-100 text-orange-800"
      case "Freelancer":
        return "bg-teal-100 text-teal-800"
      case "Interim_Manager":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatContractType = (type: string) => {
    switch (type) {
      case "Expert_Mission":
        return "Expert Mission"
      case "Internal_Transfer":
        return "Internal Transfer"
      case "Exchange_Program":
        return "Exchange Program"
      case "Interim_Manager":
        return "Interim Manager"
      default:
        return type
    }
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to see personalized recommendations</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">AI-Powered Recommendations</h1>
                  <p className="text-blue-100 text-lg">
                    Strategic insights for optimal team building and project success
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{mockRecommendations.length}</div>
              <div className="text-blue-200 text-sm">Action Items</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-300" />
                <span className="text-sm text-blue-100">High Priority</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {mockRecommendations.filter((r) => r.priority === "high").length}
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-300" />
                <span className="text-sm text-blue-100">Skills Needed</span>
              </div>
              <div className="text-2xl font-bold mt-1">{skillRequirements.length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-yellow-300" />
                <span className="text-sm text-blue-100">Est. Investment</span>
              </div>
              <div className="text-2xl font-bold mt-1">€{quickTeamRecommendation.totalCost.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment Optimizer</TabsTrigger>
        </TabsList>

        {/* AI Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-8">
          {/* Action Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-blue-600" />
                <span>Priority Action Items</span>
              </CardTitle>
              <CardDescription>Key recommendations based on RFP analysis and success patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecommendations.slice(0, 3).map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {getTypeIcon(recommendation.type)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                        </div>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <span>Impact: {recommendation.impact}</span>
                        <span>Timeline: {recommendation.timeline}</span>
                        <span>Skills: {recommendation.skills.join(", ")}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Building Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-500 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Quick Team Recommendation</CardTitle>
                <CardDescription className="text-lg">
                  Get an AI-powered optimal team configuration instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">€450K</div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-gray-600">Key Profiles</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2-4w</div>
                    <div className="text-sm text-gray-600">Setup Time</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">What you get:</h4>
                  <ul className="space-y-2">
                    {[
                      "Optimized team composition",
                      "Cost-effective hiring strategy",
                      "Proven success patterns",
                      "Immediate actionable plan",
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 group-hover:shadow-lg transition-all">
                  Get Quick Recommendation
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-500 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Custom Team Builder</CardTitle>
                <CardDescription className="text-lg">
                  Build your team manually with real-time cost analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">6</div>
                    <div className="text-sm text-gray-600">Available Profiles</div>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">Custom</div>
                    <div className="text-sm text-gray-600">Your Choice</div>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">Live</div>
                    <div className="text-sm text-gray-600">Cost Updates</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">What you control:</h4>
                  <ul className="space-y-2">
                    {[
                      "Select specific profiles",
                      "Choose contract types",
                      "Adjust project duration",
                      "Compare cost scenarios",
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 group-hover:shadow-lg transition-all">
                  Build Custom Team
                  <Calculator className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recruitment Optimizer Tab */}
        <TabsContent value="recruitment" className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recruitment Cost Optimizer</h2>
              <p className="text-gray-600">Optimize hiring decisions: CDI vs CDD vs Consultant</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Calculator className="w-4 h-4 mr-2" />
                Cost Calculator
              </Button>
              <Button>
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate Plan
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Skills Needed</p>
                    <p className="text-2xl font-bold text-blue-600">{skillRequirements.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(
                        skillRequirements.reduce((sum, s) => sum + s.projectDuration, 0) / skillRequirements.length,
                      )}
                    </p>
                    <p className="text-xs text-gray-500">months</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contract Types</p>
                    <p className="text-2xl font-bold text-purple-600">8</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Est. Total Cost</p>
                    <p className="text-2xl font-bold text-purple-600">
                      €
                      {Math.round(
                        skillRequirements.reduce((sum, skill) => {
                          const options = getContractOptions(skill)
                          const optimal = options.sort(
                            (a, b) => (a.totalProjectCost || 0) - (b.totalProjectCost || 0),
                          )[0]
                          return sum + (optimal.totalProjectCost || 0)
                        }, 0) / 1000,
                      )}
                      K
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Extended Recruitment Options */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Extended Recruitment Options</span>
              </CardTitle>
              <CardDescription>Beyond traditional hiring: experts, exchanges, and flexible solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="font-medium text-sm">Expert Missions</div>
                  <div className="text-xs text-gray-600">1-12 weeks</div>
                  <div className="text-xs text-red-600 font-medium">Premium expertise</div>
                </div>

                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="font-medium text-sm">Internal Transfer</div>
                  <div className="text-xs text-gray-600">2-24 months</div>
                  <div className="text-xs text-indigo-600 font-medium">Fast integration</div>
                </div>

                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="font-medium text-sm">Exchange Program</div>
                  <div className="text-xs text-gray-600">3-12 months</div>
                  <div className="text-xs text-orange-600 font-medium">Cost-effective</div>
                </div>

                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="font-medium text-sm">Freelancers</div>
                  <div className="text-xs text-gray-600">1-26 weeks</div>
                  <div className="text-xs text-teal-600 font-medium">Flexible tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Requirements Overview</CardTitle>
              <CardDescription>Click on a skill to see detailed cost analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {skillRequirements.map((skill) => {
                  const isSelected = selectedSkill === skill.id

                  return (
                    <Card
                      key={skill.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedSkill(skill.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{skill.skillName}</CardTitle>
                            <CardDescription className="mt-1">{skill.level} level</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Duration:</span>
                              <span className="ml-2 font-medium">{skill.projectDuration} months</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Workload:</span>
                              <span className="ml-2 font-medium">{skill.workload}%</span>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-600 mb-1">Modules:</div>
                            <div className="flex flex-wrap gap-1">
                              {skill.modules.slice(0, 2).map((module, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {module}
                                </Badge>
                              ))}
                              {skill.modules.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{skill.modules.length - 2}
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
            </CardContent>
          </Card>

          {/* Detailed Analysis for Selected Skill */}
          {selectedSkill && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Detailed Cost Analysis: {skillRequirements.find((s) => s.id === selectedSkill)?.skillName}
                </CardTitle>
                <CardDescription>Comparison of CDI, CDD, and Consultant options for this role</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const skill = skillRequirements.find((s) => s.id === selectedSkill)!
                  const options = getContractOptions(skill)

                  return (
                    <div className="space-y-6">
                      {/* Project Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600">Duration</div>
                          <div className="font-bold">{skill.projectDuration} months</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Workload</div>
                          <div className="font-bold">{skill.workload}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Level</div>
                          <div className="font-bold">{skill.level}</div>
                        </div>
                      </div>

                      {/* Cost Comparison */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {options.map((option, index) => (
                          <Card
                            key={option.type}
                            className={`${index === 0 ? "ring-2 ring-green-500 bg-green-50" : ""}`}
                          >
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                  {getContractIcon(option.type)}
                                  <Badge className={getContractColor(option.type)}>
                                    {formatContractType(option.type)}
                                  </Badge>
                                  {index === 0 && <CheckCircle className="w-5 h-5 text-green-600" />}
                                </CardTitle>
                                {index === 0 && <Badge className="bg-green-100 text-green-800">RECOMMENDED</Badge>}
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-600">
                                <span>📅 {option.availability}</span>
                                <span>
                                  ⏱️ {option.minDuration}-{option.maxDuration}w
                                </span>
                                <span>🎯 {option.specialization}</span>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {/* Cost Breakdown */}
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Monthly Base:</span>
                                    <span>€{Math.round(option.monthlyCost)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Social Charges:</span>
                                    <span>€{Math.round(option.socialCharges)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Benefits:</span>
                                    <span>€{Math.round(option.benefits)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Setup Cost:</span>
                                    <span>€{option.setupCost}</span>
                                  </div>
                                  <hr />
                                  <div className="flex justify-between font-bold">
                                    <span>Total Monthly:</span>
                                    <span>€{Math.round(option.totalMonthlyCost)}</span>
                                  </div>
                                  <div className="flex justify-between font-bold text-lg">
                                    <span>Total Project:</span>
                                    <span className="text-green-600">
                                      €{Math.round((option.totalProjectCost || 0) / 1000)}K
                                    </span>
                                  </div>
                                </div>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="text-center">
                                    <div className="font-medium">Knowledge</div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        option.knowledgeRetention === "High"
                                          ? "bg-green-100 text-green-800"
                                          : option.knowledgeRetention === "Medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                      }}`}
                                    >
                                      {option.knowledgeRetention}
                                    </Badge>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">Integration</div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        option.teamIntegration === "High"
                                          ? "bg-green-100 text-green-800"
                                          : option.teamIntegration === "Medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                      }}`}
                                    >
                                      {option.teamIntegration}
                                    </Badge>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">Expertise</div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        option.specialization === "Expert"
                                          ? "bg-purple-100 text-purple-800"
                                          : option.specialization === "Specialized"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                      }}`}
                                    >
                                      {option.specialization}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Advantages */}
                                <div>
                                  <h4 className="font-medium text-sm mb-2 text-green-600">Advantages:</h4>
                                  <ul className="space-y-1">
                                    {option.advantages.slice(0, 3).map((advantage, idx) => (
                                      <li key={idx} className="text-xs text-gray-700 flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span>{advantage}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Best For */}
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Best For:</h4>
                                  <ul className="space-y-1">
                                    {option.bestFor.slice(0, 2).map((use, idx) => (
                                      <li key={idx} className="text-xs text-gray-700">
                                        • {use}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Quick Team Recommendation Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Zap className="w-6 h-6" />
                <span>Quick Team Recommendation Summary</span>
              </CardTitle>
              <CardDescription className="text-green-700">
                AI-powered analysis suggests this team configuration for maximum efficiency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600">
                    €{quickTeamRecommendation.totalCost.toLocaleString()}
                  </div>
                  <div className="text-gray-600">Total Investment</div>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-600">{quickTeamRecommendation.duration}</div>
                  <div className="text-gray-600">Months Duration</div>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-600">{quickTeamRecommendation.profiles.length}</div>
                  <div className="text-gray-600">Key Profiles</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Recommended Team Composition</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickTeamRecommendation.profiles.map((profile, index) => (
                    <Card key={profile.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{profile.name}</h4>
                            <Badge
                              className={
                                profile.priority === "Critical"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                              }
                            >
                              {profile.priority}
                            </Badge>
                          </div>
                          <Badge variant="outline">{profile.type}</Badge>
                        </div>
                        <div className="text-2xl font-bold text-green-600 mb-1">€{profile.cost.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Total cost</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Key Benefits</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickTeamRecommendation.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Accept Recommendation
                </Button>
                <Button size="lg" variant="outline">
                  Customize Team
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Team Building */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-purple-600" />
                <span>Manual Team Building</span>
              </CardTitle>
              <CardDescription>Select the profiles you need and see real-time cost calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {availableProfiles.map((profile) => {
                  const isSelected = selectedProfiles.includes(profile.id)
                  const totalCost = profile.monthlyCost * profile.minDuration + profile.setupCost

                  return (
                    <Card
                      key={profile.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "ring-2 ring-purple-500 bg-purple-50 border-purple-200"
                          : "hover:shadow-md border-gray-200"
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedProfiles((prev) => prev.filter((id) => id !== profile.id))
                        } else {
                          setSelectedProfiles((prev) => [...prev, profile.id])
                        }
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                            <p className="text-sm text-gray-600">{profile.level}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{profile.type}</Badge>
                            {isSelected && <CheckCircle className="w-5 h-5 text-purple-600" />}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Monthly Cost:</span>
                            <span className="font-semibold">€{profile.monthlyCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Setup Cost:</span>
                            <span className="font-semibold">€{profile.setupCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Min Duration:</span>
                            <span className="font-semibold">{profile.minDuration} months</span>
                          </div>
                          <hr />
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">Total Cost:</span>
                            <span className="text-lg font-bold text-purple-600">€{totalCost.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Key Skills:</h4>
                          <div className="flex flex-wrap gap-1">
                            {profile.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {selectedProfiles.length > 0 && (
                <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Selected Team Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedProfiles.length}</div>
                      <div className="text-sm text-gray-600">Profiles Selected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        €{calculateManualTeamCost().toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Investment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.max(
                          ...selectedProfiles.map((id) => availableProfiles.find((p) => p.id === id)?.minDuration || 0),
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Max Duration (months)</div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" onClick={() => setSelectedProfiles([])}>
                      Clear Selection
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        const optimizer = document.querySelector("[data-optimizer]")
                        if (optimizer) {
                          optimizer.scrollIntoView({ behavior: "smooth" })
                        }
                      }}
                    >
                      Analyze Selected Team
                    </Button>
                  </div>
                </div>
              )}
              {selectedProfiles.length > 0 && (
                <div className="mt-8" data-optimizer>
                  <TeamOptimizer
                    selectedProfiles={selectedProfiles}
                    availableProfiles={availableProfiles}
                    rfpData={data}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
