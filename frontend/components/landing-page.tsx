"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, FileText, TrendingUp, Users, Sparkles, Github, Linkedin, Mail } from "lucide-react"

// Define TypeScript interfaces for type safety
interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
  gradient: string
}

interface TeamMember {
  name: string
  role: string
  avatar: string
  color: string
}

interface LandingPageProps {
  onEnterApp: () => void
}

// Reusable GlassButton component
const GlassButton = ({
  children,
  onClick,
  className = "",
  icon: Icon,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  icon?: React.ComponentType<{ className?: string }>
}) => (
  <Button
    onClick={onClick}
    className={`relative overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-black/70 hover:border-white/20 group ${className}`}
    aria-label={typeof children === "string" ? children : undefined}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-700/0 via-blue-700/20 to-blue-700/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <span className="relative flex items-center">
      {children}
      {Icon && <Icon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />}
    </span>
  </Button>
)

// Reusable FeatureCard component
const FeatureCard = ({ feature, isActive }: { feature: Feature; isActive: boolean }) => {
  const { icon: Icon, title, description, color, gradient } = feature
  return (
    <div
      className={`group relative overflow-hidden transition-all duration-700 hover:scale-105 ${
        isActive ? "scale-105" : ""
      }`}
      role="region"
      aria-label={`Feature: ${title}`}
    >
      <div
        className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-700 ${
          isActive
            ? "bg-gradient-to-br from-white/15 to-white/5 shadow-xl shadow-blue-800/20 border-white/30"
            : "bg-gradient-to-br from-black/40 to-black/20 border-white/10 hover:from-white/10 hover:to-white/5 hover:border-white/20"
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 text-center">
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 mx-auto transition-all duration-500 shadow-xl ${
              isActive ? "scale-110 shadow-2xl" : "group-hover:scale-110"
            }`}
          >
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-300 transition-colors duration-300">
            {title}
          </h4>
          <p className="text-gray-300 text-sm font-light leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
            {description}
          </p>
          <div className="mt-4 flex justify-center">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isActive ? "bg-blue-500 scale-150" : "bg-gray-500 group-hover:bg-blue-500 group-hover:scale-125"
              }`}
            ></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-2xl"></div>
      </div>
    </div>
  )
}

// Reusable TeamMemberCard component
const TeamMemberCard = ({
  member,
  isActive,
  onClick,
}: {
  member: TeamMember
  isActive: boolean
  onClick: () => void
}) => (
  <div
    onClick={onClick}
    className={`group relative cursor-pointer transition-all duration-500 ease-out p-2 rounded-xl ${
      isActive
        ? "scale-105 opacity-100 bg-black/30 border border-white/20 shadow-lg"
        : "opacity-70 hover:opacity-100 hover:scale-105 bg-black/20 border border-transparent hover:border-white/10"
    }`}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    aria-label={`Team member: ${member.name}, ${member.role}`}
  >
    <div
      className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 mx-auto`}
    >
      <span className="text-3xl">{member.avatar}</span>
    </div>
    <div className="mt-3 text-center">
      <p className="text-white text-sm font-semibold">{member.name}</p>
      <p className="text-gray-400 text-xs">{member.role}</p>
    </div>
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  </div>
)

export function LandingPage({ onEnterApp }: LandingPageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [currentTeamMember, setCurrentTeamMember] = useState(0)

  // Memoize static data to prevent re-renders
  const features = useMemo<Feature[]>(
    () => [
      {
        icon: Brain,
        title: "AI-Powered Insights",
        description: "Leverage advanced AI to extract actionable insights from RFPs instantly",
        color: "from-blue-700 to-blue-500",
        gradient: "from-blue-700/10 to-blue-500/10",
      },
      {
        icon: FileText,
        title: "Automated Analysis",
        description: "Smart parsing and categorization for streamlined RFP processing",
        color: "from-purple-700 to-purple-500",
        gradient: "from-purple-700/10 to-purple-500/10",
      },
      {
        icon: TrendingUp,
        title: "Trend Detection",
        description: "Uncover patterns and opportunities across RFP documents",
        color: "from-emerald-700 to-emerald-500",
        gradient: "from-emerald-700/10 to-emerald-500/10",
      },
      {
        icon: Users,
        title: "Resource Optimization",
        description: "Match expertise and allocate resources efficiently for proposals",
        color: "from-cyan-700 to-cyan-500",
        gradient: "from-cyan-700/10 to-cyan-500/10",
      },
    ],
    [],
  )

  const teamMembers = useMemo<TeamMember[]>(
    () => [
      { name: "ASMA", role: "AI Lead Developer", avatar: "👩‍💻", color: "from-pink-600 to-rose-500" },
      { name: "SAFOUANE", role: "Backend Architect", avatar: "👨‍💻", color: "from-blue-600 to-cyan-500" },
      { name: "SOUFIANE", role: "UI/UX Specialist", avatar: "👨‍🎨", color: "from-purple-600 to-indigo-500" },
      { name: "IYED", role: "Machine Learning Expert", avatar: "🤖", color: "from-green-600 to-emerald-500" },
      { name: "DHIA", role: "Data Analyst", avatar: "📊", color: "from-yellow-600 to-orange-500" },
      { name: "HOUSSEM", role: "Infrastructure Engineer", avatar: "⚙️", color: "from-red-600 to-pink-500" },
      { name: "WASSIM", role: "Product Strategist", avatar: "🎯", color: "from-teal-600 to-cyan-500" },
    ],
    [],
  )

  // Handle animations and visibility
  useEffect(() => {
    setIsVisible(true)
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 5000) // Increased interval for smoother transitions

    const teamInterval = setInterval(() => {
      setCurrentTeamMember((prev) => (prev + 1) % teamMembers.length)
    }, 4000)

    return () => {
      clearInterval(featureInterval)
      clearInterval(teamInterval)
    }
  }, [features.length, teamMembers.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden relative font-inter text-gray-100">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => ( // Reduced particle count
          <div
            key={i}
            className="absolute animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
            <div className="w-1 h-1 bg-blue-600/30 rounded-full shadow-md shadow-blue-600/10"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div
              className={`flex items-center space-x-4 transition-all duration-1000 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Aura</h1>
                <p className="text-blue-400 text-sm font-medium">AI-Driven RFP Intelligence</p>
              </div>
            </div>
            <GlassButton>Request a Quote</GlassButton>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-24 text-center">
          <div className="max-w-6xl mx-auto">
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 mb-8">
                <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-blue-400 text-sm font-medium">AI-Powered RFP Solution</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Revolutionize Your
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent animate-gradient-x">
                  RFP Analysis
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Aura leverages cutting-edge AI to streamline RFP analysis, optimize resource allocation, and deliver winning proposals with unmatched precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlassButton onClick={onEnterApp} icon={ArrowRight}>
                  Start Analyzing RFPs
                </GlassButton>
                <GlassButton>Watch Demo</GlassButton>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-5xl font-bold text-white mb-6">Why Choose Aura?</h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Unlock the full potential of your RFP process with Aura’s intelligent automation and insights.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} isActive={currentFeature === index} />
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-6 py-24 relative">
          <div className="absolute inset-0 bg-purple-900/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-5xl font-bold text-white mb-6">Our Expert Team</h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Meet the innovators driving Aura’s AI-powered RFP solutions.
              </p>
            </div>
            <div className="flex justify-center mb-12">
              <div className="relative group transition-all duration-700 hover:scale-105">
                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-br ${teamMembers[currentTeamMember].color} flex items-center justify-center shadow-xl border-2 border-white/10 animate-pulse-border`}
                >
                  <span className="text-5xl transition-transform duration-500 group-hover:scale-110">
                    {teamMembers[currentTeamMember].avatar}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center mb-12">
              <h4 className="text-3xl font-bold text-white mb-2">{teamMembers[currentTeamMember].name}</h4>
              <p className="text-lg text-gray-300">{teamMembers[currentTeamMember].role}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {teamMembers.map((member, index) => (
                <TeamMemberCard
                  key={index}
                  member={member}
                  isActive={currentTeamMember === index}
                  onClick={() => setCurrentTeamMember(index)}
                />
              ))}
            </div>
            
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 py-24">
          <div className="max-w-5xl mx-auto text-center">
            <div className="relative bg-black/20 backdrop-blur-md rounded-2xl p-12 border border-white/10 shadow-lg group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-cyan-900/5 animate-gradient-x"></div>
              <h3 className="text-5xl font-bold text-white mb-6">Ready to Optimize Your RFPs?</h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Experience Aura’s AI-driven platform to create winning proposals faster and smarter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlassButton onClick={onEnterApp} icon={ArrowRight}>
                  Try Aura Now
                </GlassButton>
                <GlassButton>Book a Demo</GlassButton>
              </div>
            </div>
          </div>
        </section>

        {/* CSS Variables and Styles */}
        <style jsx>{`
          :root {
            --primary-blue: #3b82f6;
            --primary-cyan: #22d3ee;
            --primary-purple: #9333ea;
            --text-gray: #d1d5db;
          }

          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');

          .font-inter {
            font-family: 'Inter', sans-serif;
          }

          @keyframes float-particle {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.1); }
          }

          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }

          @keyframes pulse-border {
            0%, 100% { border-color: rgba(255, 255, 255, 0.1); }
            50% { border-color: rgba(255, 255, 255, 0.3); }
          }

          .animate-float-particle {
            animation: float-particle 8s ease-in-out infinite;
          }

          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 4s ease infinite;
          }

          .animate-pulse-slow {
            animation: pulse-slow 6s ease-in-out infinite;
          }

          .animate-pulse-border {
            animation: pulse-border 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  )
}