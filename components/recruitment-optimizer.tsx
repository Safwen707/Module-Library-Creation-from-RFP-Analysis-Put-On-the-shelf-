"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Calendar, TrendingUp, AlertCircle, CheckCircle, Calculator } from "lucide-react"

interface RecruitmentOptimizerProps {
  data: any
}

interface SkillRequirement {
  id: string
  skillName: string
  level: "Junior" | "Mid-level" | "Senior" | "Expert"
  urgency: "Immediate" | "Short-term" | "Long-term"
  projectDuration: number // in months
  workload: number // percentage of full-time
  modules: string[]
  businessImpact: "Critical" | "High" | "Medium" | "Low"
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
  minDuration: number // in weeks
  maxDuration: number // in weeks
  knowledgeRetention: "High" | "Medium" | "Low"
  teamIntegration: "High" | "Medium" | "Low"
  specialization: "General" | "Specialized" | "Expert"
}

export function RecruitmentOptimizer({ data }: RecruitmentOptimizerProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [projectDuration, setProjectDuration] = useState(12)

  const skillRequirements: SkillRequirement[] = [
    {
      id: "ai_ml_engineer",
      skillName: "AI/ML Engineer",
      level: "Senior",
      urgency: "Immediate",
      projectDuration: 16,
      workload: 100,
      modules: ["AI/ML Processing Engine", "Predictive Analytics", "Model Training"],
      businessImpact: "Critical",
    },
    {
      id: "blockchain_developer",
      skillName: "Blockchain Developer",
      level: "Expert",
      urgency: "Short-term",
      projectDuration: 18,
      workload: 80,
      modules: ["Blockchain Integration", "Smart Contracts", "Crypto Wallet"],
      businessImpact: "High",
    },
    {
      id: "iot_specialist",
      skillName: "IoT Specialist",
      level: "Senior",
      urgency: "Immediate",
      projectDuration: 12,
      workload: 100,
      modules: ["IoT Device Gateway", "Protocol Handlers", "Device Management"],
      businessImpact: "Critical",
    },
    {
      id: "devops_engineer",
      skillName: "DevOps Engineer",
      level: "Senior",
      urgency: "Immediate",
      projectDuration: 24,
      workload: 75,
      modules: ["Cloud Infrastructure", "CI/CD Pipeline", "Monitoring"],
      businessImpact: "High",
    },
    {
      id: "security_architect",
      skillName: "Security Architect",
      level: "Expert",
      urgency: "Short-term",
      projectDuration: 15,
      workload: 60,
      modules: ["Advanced Security", "Compliance Module", "Threat Detection"],
      businessImpact: "Critical",
    },
    {
      id: "mobile_developer",
      skillName: "Mobile Developer",
      level: "Mid-level",
      urgency: "Long-term",
      projectDuration: 8,
      workload: 100,
      modules: ["Mobile App Backend", "Push Notifications", "Offline Sync"],
      businessImpact: "Medium",
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

    const expertRate = consultantRate * 1.5 // Premium for short-term experts
    const freelancerRate = consultantRate * 0.8 // Lower rate for freelancers

    return [
      {
        type: "CDI",
        monthlyCost: baseSalary / 12,
        setupCost: 5000,
        benefits: (baseSalary / 12) * 0.15,
        socialCharges: (baseSalary / 12) * 0.45,
        totalMonthlyCost: (baseSalary / 12) * 1.6,
        availability: "2-3 months",
        minDuration: 52, // 1 year minimum
        maxDuration: 999, // No limit
        knowledgeRetention: "High",
        teamIntegration: "High",
        specialization: "General",
        advantages: [
          "Long-term commitment and loyalty",
          "Deep knowledge retention",
          "Strong team integration",
          "Lower hourly cost for long projects",
          "Investment in company culture",
          "Continuous skill development",
        ],
        disadvantages: [
          "High social charges (45%)",
          "Difficult and costly to terminate",
          "Benefits and vacation costs",
          "Training investment risk",
          "Fixed cost regardless of workload",
          "Long recruitment process",
        ],
        bestFor: [
          "Long-term projects (>18 months)",
          "Core team positions",
          "Knowledge-critical roles",
          "Strategic positions",
        ],
      },
      {
        type: "CDD",
        monthlyCost: baseSalary / 12,
        setupCost: 2000,
        benefits: (baseSalary / 12) * 0.1,
        socialCharges: (baseSalary / 12) * 0.42,
        totalMonthlyCost: (baseSalary / 12) * 1.52,
        availability: "1 month",
        minDuration: 4, // 1 month minimum
        maxDuration: 78, // 18 months maximum
        knowledgeRetention: "Medium",
        teamIntegration: "Medium",
        specialization: "General",
        advantages: [
          "Fixed duration contract",
          "Lower social charges than CDI",
          "Easier to end contract",
          "Good for specific projects",
          "Moderate commitment level",
          "Faster recruitment than CDI",
        ],
        disadvantages: [
          "Still significant social charges (42%)",
          "Limited contract duration",
          "Potential conversion to CDI required",
          "Benefits still required",
          "May leave before project completion",
          "Renewal limitations",
        ],
        bestFor: [
          "Medium-term projects (6-18 months)",
          "Specific expertise needs",
          "Project-based work",
          "Seasonal demands",
        ],
      },
      {
        type: "Consultant",
        monthlyCost: consultantRate * 22,
        setupCost: 500,
        benefits: 0,
        socialCharges: 0,
        totalMonthlyCost: consultantRate * 22,
        availability: "1-2 weeks",
        minDuration: 2, // 2 weeks minimum
        maxDuration: 52, // 1 year maximum typically
        knowledgeRetention: "Low",
        teamIntegration: "Medium",
        specialization: "Specialized",
        advantages: [
          "No social charges (0%)",
          "No benefits required",
          "Quick availability",
          "Specialized expertise",
          "Easy to terminate",
          "Pay only for work done",
          "Flexible engagement",
        ],
        disadvantages: [
          "Higher daily rate",
          "No long-term commitment",
          "Knowledge leaves with consultant",
          "Less team integration",
          "Potential availability conflicts",
          "No loyalty to company",
        ],
        bestFor: [
          "Short to medium-term projects (<12 months)",
          "Specialized expertise",
          "Urgent needs",
          "Part-time work",
        ],
      },
      {
        type: "Expert_Mission",
        monthlyCost: expertRate * 22,
        setupCost: 200,
        benefits: 0,
        socialCharges: 0,
        totalMonthlyCost: expertRate * 22,
        availability: "Immediate",
        minDuration: 1, // 1 week minimum
        maxDuration: 12, // 3 months maximum
        knowledgeRetention: "Low",
        teamIntegration: "Low",
        specialization: "Expert",
        advantages: [
          "Immediate availability",
          "World-class expertise",
          "No long-term commitment",
          "Rapid problem solving",
          "Knowledge transfer focused",
          "Premium quality delivery",
          "Flexible scheduling",
        ],
        disadvantages: [
          "Very high daily rate",
          "Limited availability window",
          "Minimal team integration",
          "Knowledge transfer required",
          "May not understand company context",
          "Premium pricing",
        ],
        bestFor: [
          "Critical urgent issues",
          "Very specialized problems",
          "Knowledge transfer missions",
          "Architecture reviews",
          "Crisis management",
        ],
      },
      {
        type: "Internal_Transfer",
        monthlyCost: (baseSalary / 12) * 1.1, // 10% premium for internal transfer
        setupCost: 1000, // Training and transition costs
        benefits: (baseSalary / 12) * 0.15,
        socialCharges: (baseSalary / 12) * 0.45,
        totalMonthlyCost: (baseSalary / 12) * 1.7,
        availability: "1-2 weeks",
        minDuration: 8, // 2 months minimum
        maxDuration: 104, // 2 years maximum
        knowledgeRetention: "High",
        teamIntegration: "High",
        specialization: "General",
        advantages: [
          "Already knows company culture",
          "Fast integration",
          "Existing security clearances",
          "Known performance history",
          "Internal knowledge retention",
          "Career development opportunity",
          "Lower risk hire",
        ],
        disadvantages: [
          "May lack specific expertise",
          "Creates gap in original team",
          "Potential internal conflicts",
          "Limited external perspective",
          "May require additional training",
          "Opportunity cost for other projects",
        ],
        bestFor: [
          "When internal talent is available",
          "Company-specific knowledge needed",
          "Fast team integration required",
          "Career development initiatives",
        ],
      },
      {
        type: "Exchange_Program",
        monthlyCost: (baseSalary / 12) * 0.8, // 20% discount through partnership
        setupCost: 3000, // Program administration costs
        benefits: (baseSalary / 12) * 0.1,
        socialCharges: (baseSalary / 12) * 0.25, // Reduced charges through program
        totalMonthlyCost: (baseSalary / 12) * 1.15,
        availability: "1 month",
        minDuration: 12, // 3 months minimum
        maxDuration: 52, // 1 year maximum
        knowledgeRetention: "Medium",
        teamIntegration: "Medium",
        specialization: "Specialized",
        advantages: [
          "Cost-effective through partnerships",
          "Fresh external perspective",
          "Cross-industry knowledge",
          "Reduced social charges",
          "Cultural exchange benefits",
          "Network expansion",
          "Innovation catalyst",
        ],
        disadvantages: [
          "Limited availability",
          "Program coordination overhead",
          "Potential cultural differences",
          "Fixed program duration",
          "May require reciprocal exchange",
          "Administrative complexity",
        ],
        bestFor: [
          "Innovation projects",
          "Cross-industry expertise needed",
          "Cultural transformation",
          "Partnership strengthening",
          "Knowledge exchange initiatives",
        ],
      },
      {
        type: "Freelancer",
        monthlyCost: freelancerRate * 22,
        setupCost: 100,
        benefits: 0,
        socialCharges: 0,
        totalMonthlyCost: freelancerRate * 22,
        availability: "Immediate",
        minDuration: 1, // 1 week minimum
        maxDuration: 26, // 6 months maximum
        knowledgeRetention: "Low",
        teamIntegration: "Low",
        specialization: "Specialized",
        advantages: [
          "Very flexible engagement",
          "Lower cost than consultants",
          "Immediate availability",
          "Task-specific expertise",
          "No long-term commitment",
          "Easy scaling up/down",
          "Global talent pool access",
        ],
        disadvantages: [
          "Variable quality",
          "Limited availability guarantee",
          "Minimal team integration",
          "Communication challenges",
          "Time zone differences possible",
          "Less accountability",
        ],
        bestFor: ["Small specific tasks", "Prototype development", "Design work", "Content creation", "Testing and QA"],
      },
      {
        type: "Interim_Manager",
        monthlyCost: expertRate * 22 * 1.2, // Premium for management
        setupCost: 2000,
        benefits: 0,
        socialCharges: 0,
        totalMonthlyCost: expertRate * 22 * 1.2,
        availability: "1-2 weeks",
        minDuration: 4, // 1 month minimum
        maxDuration: 52, // 1 year maximum
        knowledgeRetention: "Medium",
        teamIntegration: "High",
        specialization: "Expert",
        advantages: [
          "Immediate leadership",
          "Change management expertise",
          "No long-term commitment",
          "Crisis management skills",
          "Objective perspective",
          "Rapid decision making",
          "Proven track record",
        ],
        disadvantages: [
          "Very high cost",
          "Temporary solution only",
          "May not align with culture",
          "Team acceptance challenges",
          "Limited long-term vision",
          "Handover complexity",
        ],
        bestFor: [
          "Leadership gaps",
          "Crisis management",
          "Transformation projects",
          "Interim positions",
          "Change management",
        ],
      },
    ]
  }

  const calculateOptimalChoice = (skill: SkillRequirement) => {
    const options = getContractOptions(skill)
    const duration = skill.projectDuration
    const workloadFactor = skill.workload / 100

    const calculations = options.map((option) => {
      const totalCost = option.setupCost + option.totalMonthlyCost * duration * workloadFactor
      const monthlyCostAdjusted = option.totalMonthlyCost * workloadFactor

      // Risk factors
      let riskMultiplier = 1
      if (option.type === "CDI" && duration < 18) riskMultiplier = 1.2 // Risk of over-commitment
      if (option.type === "CDD" && duration > 18) riskMultiplier = 1.15 // Risk of conversion
      if (option.type === "Consultant" && duration > 12) riskMultiplier = 1.1 // Risk of knowledge loss

      // Urgency factors
      let urgencyMultiplier = 1
      if (skill.urgency === "Immediate") {
        if (option.type === "Consultant")
          urgencyMultiplier = 0.9 // Faster to hire
        else urgencyMultiplier = 1.1 // Slower recruitment process
      }

      const adjustedCost = totalCost * riskMultiplier * urgencyMultiplier

      return {
        ...option,
        totalProjectCost: adjustedCost,
        monthlyCostAdjusted,
        riskMultiplier,
        urgencyMultiplier,
        costPerMonth: adjustedCost / duration,
      }
    })

    return calculations.sort((a, b) => a.totalProjectCost - b.totalProjectCost)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Immediate":
        return "bg-red-100 text-red-800"
      case "Short-term":
        return "bg-yellow-100 text-yellow-800"
      case "Long-term":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
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
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recruitment Analysis Available</h3>
        <p className="text-gray-500">Complete an RFP analysis to see recruitment recommendations</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
                <p className="text-sm font-medium text-gray-600">Immediate Needs</p>
                <p className="text-2xl font-bold text-red-600">
                  {skillRequirements.filter((s) => s.urgency === "Immediate").length}
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
                <p className="text-sm font-medium text-gray-600">Est. Total Cost</p>
                <p className="text-2xl font-bold text-purple-600">
                  €
                  {Math.round(
                    skillRequirements.reduce((sum, skill) => {
                      const optimal = calculateOptimalChoice(skill)[0]
                      return sum + optimal.totalProjectCost
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

      {/* New Recruitment Options Overview */}
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

          <div className="mt-4 p-3 bg-white rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-blue-800">Smart Recommendations</div>
                <div className="text-xs text-blue-700 mt-1">
                  Our AI analyzes project duration, urgency, expertise level, and budget to recommend the optimal mix of
                  recruitment strategies for maximum efficiency and cost-effectiveness.
                </div>
              </div>
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
              const optimal = calculateOptimalChoice(skill)[0]
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
                      <div className="flex flex-col gap-1">
                        <Badge className={getUrgencyColor(skill.urgency)}>{skill.urgency}</Badge>
                        <Badge className={getImpactColor(skill.businessImpact)}>{skill.businessImpact}</Badge>
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
                        <div className="text-sm text-gray-600 mb-1">Optimal Choice:</div>
                        <div className="flex items-center justify-between">
                          <Badge className={getContractColor(optimal.type)}>{optimal.type}</Badge>
                          <span className="font-bold text-green-600">
                            €{Math.round(optimal.totalProjectCost / 1000)}K
                          </span>
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

      {/* Detailed Analysis */}
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
              const options = calculateOptimalChoice(skill)

              return (
                <div className="space-y-6">
                  {/* Project Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-bold">{skill.projectDuration} months</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Workload</div>
                      <div className="font-bold">{skill.workload}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Urgency</div>
                      <Badge className={getUrgencyColor(skill.urgency)}>{skill.urgency}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Impact</div>
                      <Badge className={getImpactColor(skill.businessImpact)}>{skill.businessImpact}</Badge>
                    </div>
                  </div>

                  {/* Cost Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {options.slice(0, 6).map((option, index) => (
                      <Card key={option.type} className={`${index === 0 ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center space-x-2">
                              {getContractIcon(option.type)}
                              <Badge className={getContractColor(option.type)}>{formatContractType(option.type)}</Badge>
                              {index === 0 && <CheckCircle className="w-5 h-5 text-green-600" />}
                            </CardTitle>
                            {index === 0 && <Badge className="bg-green-100 text-green-800">OPTIMAL</Badge>}
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
                                <span className="text-green-600">€{Math.round(option.totalProjectCost / 1000)}K</span>
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

                  {/* Show More Options Button */}
                  {options.length > 6 && (
                    <div className="text-center mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          /* Toggle show all */
                        }}
                      >
                        Show All {options.length} Options
                      </Button>
                    </div>
                  )}

                  {/* Recommendation */}
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-800">💡 Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-green-800">
                          <strong>Best choice: {options[0].type}</strong> for this {skill.skillName} position.
                        </p>
                        <p className="text-sm text-green-700">
                          Based on {skill.projectDuration}-month duration, {skill.urgency.toLowerCase()} urgency, and{" "}
                          {skill.businessImpact.toLowerCase()} business impact, this option provides the best
                          cost-effectiveness with total project cost of €
                          {Math.round(options[0].totalProjectCost / 1000)}K.
                        </p>
                        <div className="mt-3">
                          <h4 className="font-medium text-sm text-green-800 mb-1">Key Benefits:</h4>
                          <ul className="text-sm text-green-700">
                            {options[0].bestFor.map((benefit, idx) => (
                              <li key={idx}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Overall Recruitment Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Recruitment Strategy</CardTitle>
          <CardDescription>Optimized hiring plan for all required skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Skills */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-800">Current Skill Requirements</h4>
              {skillRequirements.map((skill) => {
                const optimal = calculateOptimalChoice(skill)[0]
                return (
                  <div key={skill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{skill.skillName}</div>
                      <div className="text-sm text-gray-600">
                        {skill.level} • {skill.projectDuration} months • {skill.urgency}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getContractColor(optimal.type)}>{formatContractType(optimal.type)}</Badge>
                      <div className="text-right">
                        <div className="font-bold">€{Math.round(optimal.totalProjectCost / 1000)}K</div>
                        <div className="text-sm text-gray-600">€{Math.round(optimal.totalMonthlyCost)}/month</div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>Total Recruitment Cost:</span>
                  <span className="text-green-600">
                    €
                    {Math.round(
                      skillRequirements.reduce((sum, skill) => {
                        const optimal = calculateOptimalChoice(skill)[0]
                        return sum + optimal.totalProjectCost
                      }, 0) / 1000,
                    )}
                    K
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Optimized mix: {skillRequirements.filter((s) => calculateOptimalChoice(s)[0].type === "CDI").length}{" "}
                  CDI, {skillRequirements.filter((s) => calculateOptimalChoice(s)[0].type === "CDD").length} CDD,{" "}
                  {skillRequirements.filter((s) => calculateOptimalChoice(s)[0].type === "Consultant").length} Consultants
                </div>
              </div>
            </div>

            {/* New Profile Recruitment Recommendations */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-800 flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-600" />
                <span>New Profile Recruitment Recommendations</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-green-800">Data Scientist</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Senior • Immediate • 12 months • High Impact
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Enhances analytics for Predictive Analytics and AI/ML modules.
                      </div>
                      <div className="mt-2">
                        <Badge className="bg-green-100 text-green-800">Consultant</Badge>
                        <span className="ml-2 text-xs font-medium text-green-600">€180K est. cost</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-700">
                        <strong>Sourcing:</strong> LinkedIn, Data Science Job Boards
                      </div>
                      <div className="mt-1 text-xs text-gray-700">
                        <strong>Why:</strong> Specialized expertise for urgent analytics needs.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-green-800">UI/UX Designer</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Mid-level • Short-term • 6 months • Medium Impact
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Improves user experience for Mobile App Backend and Offline Sync.
                      </div>
                      <div className="mt-2">
                        <Badge className="bg-teal-100 text-teal-800">Freelancer</Badge>
                        <span className="ml-2 text-xs font-medium text-green-600">€50K est. cost</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-700">
                        <strong>Sourcing:</strong> Upwork, Dribbble, Behance
                      </div>
                      <div className="mt-1 text-xs text-gray-700">
                        <strong>Why:</strong> Flexible, task-specific design work for short-term needs.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-green-800">Project Manager</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Senior • Long-term • 24 months • Critical Impact
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Streamlines execution across all critical modules.
                      </div>
                      <div className="mt-2">
                        <Badge className="bg-blue-100 text-blue-800">CDI</Badge>
                        <span className="ml-2 text-xs font-medium text-green-600">€220K est. cost</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-700">
                        <strong>Sourcing:</strong> Internal Talent Pool, LinkedIn
                      </div>
                      <div className="mt-1 text-xs text-gray-700">
                        <strong>Why:</strong> Long-term leadership for team integration and project success.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-green-800">Recruitment Strategy Tips</div>
                    <div className="text-xs text-green-700 mt-1">
                      Leverage global talent platforms like LinkedIn and Upwork for rapid hiring. Partner with industry networks for specialized roles. Prioritize candidates with proven expertise in high-impact modules. Use AI-driven job matching for efficiency.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}