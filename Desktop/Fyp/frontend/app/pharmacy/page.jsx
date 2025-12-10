"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, FileText, Plus, ChevronRight, Pill, Truck } from "lucide-react"
import { useRouter } from "next/navigation"

const PharmacyDashboard = () => {
  const router = useRouter()

  const orders = [
    {
      id: 1,
      patientName: "Ahmad Khan",
      medicine: "Amoxicillin 500mg",
      quantity: 30,
      orderDate: "2025-01-10",
      status: "Pending",
    },
    {
      id: 2,
      patientName: "Fatima Ali",
      medicine: "Metformin 1000mg",
      quantity: 60,
      orderDate: "2025-01-10",
      status: "Dispensed",
    },
    {
      id: 3,
      patientName: "Hassan Raza",
      medicine: "Aspirin 100mg",
      quantity: 14,
      orderDate: "2025-01-09",
      status: "Ready",
    },
    {
      id: 4,
      patientName: "Ayesha Malik",
      medicine: "Vitamin D3 1000IU",
      quantity: 30,
      orderDate: "2025-01-08",
      status: "Pending",
    },
  ]

  const stats = [
    {
      label: "Total Prescriptions",
      value: "542",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Orders Today",
      value: "28",
      icon: Pill,
      color: "text-green-600",
    },
    {
      label: "Pending Delivery",
      value: "12",
      icon: Truck,
      color: "text-amber-600",
    },
    {
      label: "Stock Alerts",
      value: "5",
      icon: Activity,
      color: "text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">Welcome, Pharmacy Manager</h1>
              <p className="text-muted-foreground">
                Here's your pharmacy <span className="font-poppins">overview today</span>
              </p>
            </div>
            <Button
              className="bg-hero-gradient text-white shadow-lg hover:opacity-90 transition-opacity"
              onClick={() => router.push("/pharmacy/orders")}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Order
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

          {/* Orders List */}
          <Card className="shadow-lg border-border">
            <CardHeader className="border-b border-border">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Recent Orders</CardTitle>
                  <CardDescription className="mt-1">Track and manage prescription orders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 hover:bg-secondary/50 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-hero-gradient flex items-center justify-center text-white font-semibold shadow-md">
                        <Pill className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{order.medicine}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.patientName} • Qty: {order.quantity} • {order.orderDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "Dispensed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Ready"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
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

export default PharmacyDashboard
