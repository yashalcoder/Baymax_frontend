"use client"
import { useState } from "react"
import { Plus, Edit2, Trash2, Search, Save, X, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/Navbar"

export default function ManageMedicinesPage() {
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Paracetamol",
      strength: "500mg",
      form: "Tablet",
      price: "50",
      stock: 450,
      status: "Available",
    },
    {
      id: 2,
      name: "Amoxicillin",
      strength: "250mg",
      form: "Capsule",
      price: "120",
      stock: 200,
      status: "Available",
    },
    {
      id: 3,
      name: "Cough Syrup",
      strength: "5ml",
      form: "Syrup",
      price: "80",
      stock: 30,
      status: "Low Stock",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    strength: "",
    form: "Tablet",
    price: "",
    stock: "",
  })

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.strength.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = () => {
    if (formData.name && formData.strength && formData.price) {
      const newMedicine = {
        id: medicines.length + 1,
        ...formData,
        stock: Number.parseInt(formData.stock) || 0,
        status: Number.parseInt(formData.stock) > 50 ? "Available" : "Low Stock",
      }
      setMedicines([...medicines, newMedicine])
      setFormData({ name: "", strength: "", form: "Tablet", price: "", stock: "" })
      setIsAdding(false)
    }
  }

  const handleEdit = (id) => {
    const medicine = medicines.find((m) => m.id === id)
    setFormData(medicine)
    setEditingId(id)
  }

  const handleUpdate = () => {
    setMedicines(
      medicines.map((m) =>
        m.id === editingId
          ? {
              ...m,
              ...formData,
              stock: Number.parseInt(formData.stock),
              status: Number.parseInt(formData.stock) > 50 ? "Available" : "Low Stock",
            }
          : m,
      ),
    )
    setEditingId(null)
    setFormData({ name: "", strength: "", form: "Tablet", price: "", stock: "" })
  }

  const handleDelete = (id) => {
    setMedicines(medicines.filter((m) => m.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">Manage Medicines</h1>
                <p className="text-muted-foreground">Add, update, or remove medicines from your catalog</p>
              </div>
              <Button
                className="bg-hero-gradient text-white shadow-medical-lg hover:opacity-90 transition-opacity"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
              <Card className="border-2 border-hero-gradient/20 shadow-medical-lg">
                <CardHeader>
                  <CardTitle>{editingId ? "Edit Medicine" : "Add New Medicine"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Strength (e.g., 500mg)"
                      value={formData.strength}
                      onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                      value={formData.form}
                      onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Tablet</option>
                      <option>Capsule</option>
                      <option>Syrup</option>
                      <option>Injection</option>
                      <option>Ointment</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false)
                        setEditingId(null)
                        setFormData({ name: "", strength: "", form: "Tablet", price: "", stock: "" })
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button className="bg-hero-gradient text-white" onClick={editingId ? handleUpdate : handleAdd}>
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? "Update" : "Add"} Medicine
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search & Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Medicines Table */}
            <Card className="shadow-medical-lg border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-2xl">Your Medicines</CardTitle>
                <CardDescription>Manage your pharmacy inventory</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary/30 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Name</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Strength</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Form</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Price</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Stock</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredMedicines.map((medicine) => (
                        <tr key={medicine.id} className="hover:bg-secondary/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Pill className="w-4 h-4 text-primary" />
                              <span className="font-medium">{medicine.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{medicine.strength}</td>
                          <td className="px-6 py-4">{medicine.form}</td>
                          <td className="px-6 py-4 font-semibold text-primary">Rs. {medicine.price}</td>
                          <td className="px-6 py-4">{medicine.stock} units</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                medicine.status === "Available"
                                  ? "bg-medical-success/20 text-medical-success"
                                  : "bg-medical-warning/20 text-medical-warning"
                              }`}
                            >
                              {medicine.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(medicine.id)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors text-primary"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(medicine.id)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
