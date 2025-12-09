"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Microscope, FileText, Plus, ChevronRight, Beaker, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const LabDashboard = () => {
  const router = useRouter()

  const tests = [
    {
      id: 1,
      patientName: "Ahmad Khan",
      testType: "Complete Blood Count",
      referredBy: "Dr. Ahmed",
      orderDate: "2025-01-10",
      status: "In Progress",
    },
    {
      id: 2,
      patientName: "Fatima Ali",
      testType: "Lipid Panel",
      referredBy: "Dr. Sarah",
      orderDate: "2025-01-10",
      status: "Completed",
    },
    {
      id: 3,
      patientName: "Hassan Raza",
      testType: "Thyroid Function Tests",
      referredBy: "Dr. Ahmed",
      orderDate: "2025-01-09",
      status: "Pending",
    },
    {
      id: 4,
      patientName: "Ayesha Malik",
      testType: "Glucose Test",
      referredBy: "Dr. Fatima",
      orderDate: "2025-01-08",
      status: "Completed",
    },
  ]

  const stats = [
    {
      label: "Total Tests",
      value: "1,247",
      icon: Microscope,
      color: "text-purple-600",
    },
    {
      label: "Today's Tests",
      value: "34",
      icon: Beaker,
      color: "text-indigo-600",
    },
    {
      label: "Completed",
      value: "28",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Pending Results",
      value: "6",
      icon: FileText,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">Welcome, Lab Manager</h1>
              <p className="text-muted-foreground">
                Here's your laboratory <span className="font-poppins">status today</span>
              </p>
            </div>
            <Button
              className="bg-hero-gradient text-white shadow-lg hover:opacity-90 transition-opacity"
              onClick={() => router.push("/lab/tests")}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Test
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <Card key={idx} className="bg-gradient-card border-border shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tests List */}
          <Card className="shadow-lg border-border">
            <CardHeader className="border-b border-border">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Recent Tests</CardTitle>
                  <CardDescription className="mt-1">Track and manage laboratory test requests</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className="p-6 hover:bg-secondary/50 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-hero-gradient flex items-center justify-center text-white font-semibold shadow-md">
                        <Microscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{test.testType}</h3>
                        <p className="text-sm text-muted-foreground">
                          {test.patientName} • By: {test.referredBy} • {test.orderDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          test.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : test.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {test.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default LabDashboard
