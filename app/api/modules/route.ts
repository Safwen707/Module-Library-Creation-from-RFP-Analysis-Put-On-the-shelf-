import { type NextRequest, NextResponse } from "next/server"

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
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const status = searchParams.get("status")
  const search = searchParams.get("search")

  let filteredModules = mockModules

  if (category && category !== "all") {
    filteredModules = filteredModules.filter((module) => module.category === category)
  }

  if (status && status !== "all") {
    filteredModules = filteredModules.filter((module) => module.status === status)
  }

  if (search) {
    filteredModules = filteredModules.filter(
      (module) =>
        module.name.toLowerCase().includes(search.toLowerCase()) ||
        module.description.toLowerCase().includes(search.toLowerCase()),
    )
  }

  return NextResponse.json(filteredModules)
}

export async function POST(request: NextRequest) {
  try {
    const moduleData = await request.json()

    // Simulate creating a new module
    const newModule = {
      id: mockModules.length + 1,
      ...moduleData,
      lastUpdated: new Date().toISOString().split("T")[0],
      reusability: Math.floor(Math.random() * 20) + 80,
    }

    return NextResponse.json(newModule, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create module" }, { status: 500 })
  }
}
