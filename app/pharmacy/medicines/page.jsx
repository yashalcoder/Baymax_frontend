"use client"
import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Search, Save, X, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/Navbar"

export default function ManageMedicinesPage() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    strengthValue: "",
    strengthUnit: "mg",
    dosageForm: "Tablet",
    price: "",
    quantityAvailable: "",
    brand: "",
  })

  useEffect(() => {
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pharmacy/medicines`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      const data = await response.json()
      if (Array.isArray(data)) setMedicines(data)
    } catch (error) {
      console.error("Error fetching medicines:", error)
      setError("Failed to load medicines")
    } finally {
      setLoading(false)
    }
  }

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.brand || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: "",
      strengthValue: "",
      strengthUnit: "mg",
      dosageForm: "Tablet",
      price: "",
      quantityAvailable: "",
      brand: "",
    })
    setIsAdding(false)
    setEditingId(null)
    setError("")
    setSuccessMsg("")
  }

  const handleAdd = async () => {
    if (!formData.name || !formData.price) {
      setError("Medicine name and price are required")
      return
    }

    if (formData.name.trim().length < 3) {
      setError("Medicine name must be at least 3 characters")
      return
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0")
      return
    }

    if (formData.quantityAvailable && Number(formData.quantityAvailable) < 0) {
      setError("Stock quantity cannot be negative")
      return
    }
    if (formData.strengthValue && Number(formData.strengthValue) === 0) {
      setError("Strength cannot be 0")
      return
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pharmacy/medicine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: formData.name,
            strengthValue: Number(formData.strengthValue) || 0,
            strengthUnit: formData.strengthUnit,
            dosageForm: formData.dosageForm,
            price: Number(formData.price),
            quantityAvailable: Number(formData.quantityAvailable) || 0,
            brand: formData.brand,
          }),
        }
      )
      const data = await response.json()
      if (data.medicines) {
        setMedicines(data.medicines)
        resetForm()
        setSuccessMsg("Medicine added successfully!")
        setTimeout(() => setSuccessMsg(""), 3000)
      } else {
        setError(data.message || "Failed to add medicine")
      }
    } catch (error) {
      console.error("Error adding medicine:", error)
      setError("Failed to add medicine")
    }
  }

  const handleEdit = (medicine) => {
    setFormData({
      name: medicine.name,
      strengthValue: medicine.strengthValue || "",
      strengthUnit: medicine.strengthUnit || "mg",
      dosageForm: medicine.dosageForm || "Tablet",
      price: medicine.price,
      quantityAvailable: medicine.quantityAvailable || "",
      brand: medicine.brand || "",
    })
    setEditingId(medicine._id)
    setIsAdding(true)
  }

  const handleUpdate = async () => {
    if (!formData.name || !formData.price) {
      setError("Medicine name and price are required")
      return
    }

    if (formData.name.trim().length < 3) {
      setError("Medicine name must be at least 3 characters")
      return
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0")
      return
    }

    if (formData.quantityAvailable && Number(formData.quantityAvailable) < 0) {
      setError("Stock quantity cannot be negative")
      return
    }
    if (formData.strengthValue && Number(formData.strengthValue) === 0) {
      setError("Strength cannot be 0")
      return
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pharmacy/medicine/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: formData.name,
            strengthValue: Number(formData.strengthValue) || 0,
            strengthUnit: formData.strengthUnit,
            dosageForm: formData.dosageForm,
            price: Number(formData.price),
            quantityAvailable: Number(formData.quantityAvailable) || 0,
            brand: formData.brand,
          }),
        }
      )
      const data = await response.json()
      if (data.medicine) {
        setMedicines(medicines.map((m) => (m._id === editingId ? data.medicine : m)))
        resetForm()
        setSuccessMsg("Medicine updated successfully!")
        setTimeout(() => setSuccessMsg(""), 3000)
      } else {
        setError(data.message || "Failed to update medicine")
      }
    } catch (error) {
      console.error("Error updating medicine:", error)
      setError("Failed to update medicine")
    }
  }

  const handleDelete = async (medicineId) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pharmacy/medicine/${medicineId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      setMedicines(medicines.filter((m) => m._id !== medicineId))
      setSuccessMsg("Medicine deleted successfully!")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (error) {
      console.error("Error deleting medicine:", error)
      setError("Failed to delete medicine")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">
                  Manage Medicines
                </h1>
                <p className="text-muted-foreground">
                  Add, update, or remove medicines from your catalog
                </p>
              </div>
              <Button
                className="bg-hero-gradient text-white shadow-medical-lg hover:opacity-90 transition-opacity"
                onClick={() => {
                  setIsAdding(true)
                  setEditingId(null)
                  setFormData({
                    name: "", strengthValue: "", strengthUnit: "mg",
                    dosageForm: "Tablet", price: "", quantityAvailable: "", brand: "",
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            </div>

            {/* Success / Error */}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {successMsg}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Add/Edit Form */}
            {isAdding && (
              <Card className="border-2 border-hero-gradient/20 shadow-medical-lg">
                <CardHeader>
                  <CardTitle>{editingId ? "Edit Medicine" : "Add New Medicine"}</CardTitle>
                  <CardDescription>
                    Enter medicine details like name, strength, form, and price.
                  </CardDescription>
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
                      placeholder="Brand (e.g. Panadol)"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    {/* Strength — number + unit */}
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Amount (e.g. 500)"
                        value={formData.strengthValue}
                        onChange={(e) => setFormData({ ...formData, strengthValue: e.target.value })}
                        className="w-1/2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <select
                        value={formData.strengthUnit}
                        onChange={(e) => setFormData({ ...formData, strengthUnit: e.target.value })}
                        className="w-1/2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option>mg</option>
                        <option>ml</option>
                        <option>g</option>
                        <option>mcg</option>
                        <option>IU</option>
                      </select>
                    </div>

                    <select
                      value={formData.dosageForm}
                      onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
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
                      min="0"
                      placeholder="Price (Rs.)"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Stock Quantity"
                      value={formData.quantityAvailable}
                      onChange={(e) => setFormData({ ...formData, quantityAvailable: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={resetForm}>
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button
                      className="bg-hero-gradient text-white"
                      onClick={editingId ? handleUpdate : handleAdd}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? "Update" : "Add"} Medicine
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search */}
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
                {loading ? (
                  <div className="py-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading medicines...</span>
                  </div>
                ) : filteredMedicines.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No medicines found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary/30 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-foreground">Name</th>
                          <th className="px-6 py-4 text-left font-semibold text-foreground">Brand</th>
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
                          <tr key={medicine._id} className="hover:bg-secondary/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Pill className="w-4 h-4 text-primary" />
                                <span className="font-medium">{medicine.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {medicine.brand || "-"}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {medicine.strengthValue ? `${medicine.strengthValue} ${medicine.strengthUnit}` : "-"}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {medicine.dosageForm || "-"}
                            </td>
                            <td className="px-6 py-4 font-semibold text-primary">
                              Rs. {medicine.price}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {medicine.quantityAvailable ?? 0} units
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${medicine.status === "Available"
                                  ? "bg-green-100 text-green-600"
                                  : medicine.status === "Low Stock"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                                }`}>
                                {medicine.status || "Available"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(medicine)}
                                  className="p-2 hover:bg-secondary rounded-lg transition-colors text-primary"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(medicine._id)}
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
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}