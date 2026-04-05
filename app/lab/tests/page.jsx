"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Save, X, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/Navbar";

export default function ManageTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Hematology",
    price: "",
    code: "",
    sampleType: "Blood",
    turnaroundValue: "",
    turnaroundUnit: "Hours",
  });

  const categories = [
    "Hematology", "Biochemistry", "Endocrinology",
    "Microbiology", "Serology", "Imaging", "Glucose",
  ];

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/laboratory/tests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) setTests(data);
    } catch (error) {
      console.error("Error fetching tests:", error);
      setError("Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (test.code || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Hematology",
      price: "",
      code: "",
      sampleType: "Blood",
      turnaroundValue: "",
      turnaroundUnit: "Hours",
    });
    setIsAdding(false);
    setEditingId(null);
    setError("");
    setSuccessMsg("");
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.category || !formData.price) {
      setError("Name, category and price are required");
      return;
    }

    if (formData.name.trim().length < 3) {
      setError("Test name must be at least 3 characters");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (formData.turnaroundValue && Number(formData.turnaroundValue) === 0) {
      setError("Turnaround time cannot be 0")
      return
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/laboratory/test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            code: formData.code,
            sampleType: formData.sampleType,
            turnaroundValue: Number(formData.turnaroundValue) || 0,
            turnaroundUnit: formData.turnaroundUnit,
          }),
        }
      );
      const data = await response.json();
      if (data.tests) {
        setTests(data.tests);
        resetForm();
        setSuccessMsg("Test added successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.message || "Failed to add test");
      }
    } catch (error) {
      console.error("Error adding test:", error);
      setError("Failed to add test");
    }
  };

  const handleEdit = (test) => {
    setFormData({
      name: test.name,
      category: test.category,
      price: test.price,
      code: test.code || "",
      sampleType: test.sampleType || "Blood",
      turnaroundValue: test.turnaroundValue || "",
      turnaroundUnit: test.turnaroundUnit || "Hours",
    });
    setEditingId(test._id);
    setIsAdding(true);
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.category || !formData.price) {
      setError("Name, category and price are required");
      return;
    }

    if (formData.name.trim().length < 3) {
      setError("Test name must be at least 3 characters");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (formData.turnaroundValue && Number(formData.turnaroundValue) === 0) {
      setError("Turnaround time cannot be 0")
      return
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/laboratory/test/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            code: formData.code,
            sampleType: formData.sampleType,
            turnaroundValue: Number(formData.turnaroundValue) || 0,
            turnaroundUnit: formData.turnaroundUnit,
          }),
        }
      );
      const data = await response.json();
      if (data.test) {
        setTests(tests.map((t) => (t._id === editingId ? data.test : t)));
        resetForm();
        setSuccessMsg("Test updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.message || "Failed to update test");
      }
    } catch (error) {
      console.error("Error updating test:", error);
      setError("Failed to update test");
    }
  };

  const handleDelete = async (testId) => {
    if (!confirm("Are you sure you want to delete this test?")) return;
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/laboratory/test/${testId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTests(tests.filter((t) => t._id !== testId));
      setSuccessMsg("Test deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Error deleting test:", error);
      setError("Failed to delete test");
    }
  };

  const handleToggleAvailable = async (test) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/laboratory/test/${test._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            available: !test.available,
          }),
        }
      );
      const data = await response.json();
      if (data.test) {
        setTests(tests.map((t) => (t._id === test._id ? data.test : t)));
        setSuccessMsg(`Test ${!test.available ? "enabled" : "disabled"} successfully!`);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (error) {
      console.error("Error toggling test:", error);
      setError("Failed to update test availability");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  Lab Tests
                </h1>
                <p className="text-muted-foreground text-sm">
                  Add, update, or remove diagnostic tests from your lab catalogue.
                </p>
              </div>
              <Button
                className="bg-hero-gradient text-white shadow-medical-lg hover:opacity-90 transition-opacity"
                onClick={() => {
                  setIsAdding(true);
                  setEditingId(null);
                  setFormData({
                    name: "", category: "Hematology", price: "",
                    code: "", sampleType: "Blood",
                    turnaroundValue: "", turnaroundUnit: "Hours",
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Test
              </Button>
            </div>

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

            {isAdding && (
              <Card className="border-2 border-hero-gradient/20 shadow-medical-lg">
                <CardHeader>
                  <CardTitle>{editingId ? "Edit Test" : "Add New Test"}</CardTitle>
                  <CardDescription>
                    Enter test details like name, code, category, sample type, and price.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Complete Blood Count"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Code</label>
                      <input
                        type="text"
                        placeholder="e.g. CBC-01"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 1500"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sample Type</label>
                      <select
                        value={formData.sampleType}
                        onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option>Blood</option>
                        <option>Urine</option>
                        <option>Stool</option>
                        <option>Saliva</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Turnaround Time</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 24"
                          value={formData.turnaroundValue}
                          onChange={(e) => setFormData({ ...formData, turnaroundValue: e.target.value })}
                          className="w-1/2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <select
                          value={formData.turnaroundUnit}
                          onChange={(e) => setFormData({ ...formData, turnaroundUnit: e.target.value })}
                          className="w-1/2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option>Hours</option>
                          <option>Days</option>
                          <option>Weeks</option>
                        </select>
                      </div>
                    </div>

                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={resetForm}>
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button
                      className="bg-hero-gradient text-white"
                      onClick={editingId ? handleUpdate : handleAdd}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? "Update Test" : "Add Test"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by test name, category, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <Card className="shadow-medical-lg border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-2xl">All Lab Tests</CardTitle>
                <CardDescription>
                  Complete list of diagnostic tests available in your lab.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="py-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading tests...</span>
                  </div>
                ) : filteredTests.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No tests found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary/30 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Test Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Code</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Sample Type</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Turnaround</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Available</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredTests.map((test) => (
                          <tr key={test._id} className={`hover:bg-secondary/50 transition-colors ${test.available === false ? "opacity-60" : ""}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Beaker className="w-4 h-4 text-primary" />
                                <span className="font-medium">{test.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {test.code || "-"}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {test.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">{test.sampleType || "-"}</td>
                            <td className="px-6 py-4 font-semibold text-primary">
                              Rs. {test.price}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {test.turnaroundValue ? `${test.turnaroundValue} ${test.turnaroundUnit}` : "-"}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleToggleAvailable(test)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${test.available !== false ? "bg-green-500" : "bg-gray-300"
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${test.available !== false ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(test)}
                                  className="p-2 hover:bg-secondary rounded-lg transition-colors text-primary"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(test._id)}
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
  );
}