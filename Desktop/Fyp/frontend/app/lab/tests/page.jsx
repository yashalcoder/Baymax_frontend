"use client";

import React, { useState } from "react";
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
  const [tests, setTests] = useState([
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "Hematology",
      price: "800",
      sampleType: "Blood",
      turnaroundTime: "24 hours",
      code: "CBC-01",
    },
    {
      id: 2,
      name: "Lipid Profile",
      category: "Biochemistry",
      price: "1500",
      sampleType: "Blood",
      turnaroundTime: "48 hours",
      code: "LIP-12",
    },
    {
      id: 3,
      name: "Thyroid Function Test",
      category: "Endocrinology",
      price: "1800",
      sampleType: "Blood",
      turnaroundTime: "72 hours",
      code: "TFT-07",
    },
    {
      id: 4,
      name: "Fasting Blood Sugar",
      category: "Glucose",
      price: "500",
      sampleType: "Blood",
      turnaroundTime: "Same day",
      code: "GLU-03",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "Hematology",
    price: "",
    sampleType: "Blood",
    turnaroundTime: "",
  });

  const categories = [
    "Hematology",
    "Biochemistry",
    "Endocrinology",
    "Microbiology",
    "Serology",
    "Imaging",
    "Glucose",
  ];

  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (test.code || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      category: "Hematology",
      price: "",
      sampleType: "Blood",
      turnaroundTime: "",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!formData.name || !formData.category || !formData.price) return;

    const newTest = {
      id: tests.length ? tests[tests.length - 1].id + 1 : 1,
      ...formData,
    };

    setTests([...tests, newTest]);
    resetForm();
  };

  const handleEdit = (id) => {
    const test = tests.find((t) => t.id === id);
    if (!test) return;
    setFormData(test);
    setEditingId(id);
    setIsAdding(true);
  };

  const handleUpdate = () => {
    setTests(
      tests.map((t) => (t.id === editingId ? { ...t, ...formData } : t))
    );
    resetForm();
  };

  const handleDelete = (id) => {
    setTests(tests.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-hero">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  Lab Tests
                </h1>
                <p className="text-muted-foreground text-sm">
                  Add, update, or remove diagnostic tests from your lab
                  catalogue.
                </p>
              </div>

              <Button
                className="bg-hero-gradient text-white shadow-medical-lg hover:opacity-90 transition-opacity"
                onClick={() => {
                  setIsAdding(true);
                  setEditingId(null);
                  setFormData({
                    name: "",
                    code: "",
                    category: "Hematology",
                    price: "",
                    sampleType: "Blood",
                    turnaroundTime: "",
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Test
              </Button>
            </div>

            {/* Add / Edit Form */}
            {isAdding && (
              <Card className="border-2 border-hero-gradient/20 shadow-medical-lg">
                <CardHeader>
                  <CardTitle>
                    {editingId ? "Edit Test" : "Add New Test"}
                  </CardTitle>
                  <CardDescription>
                    Enter test details like name, code, category, sample type,
                    and price.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Test Name (e.g. Complete Blood Count)"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <input
                      type="text"
                      placeholder="Test Code (e.g. CBC-01)"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Price (Rs.)"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <select
                      value={formData.sampleType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sampleType: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Blood</option>
                      <option>Urine</option>
                      <option>Stool</option>
                      <option>Saliva</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Turnaround Time (e.g. 24 hours)"
                      value={formData.turnaroundTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          turnaroundTime: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={resetForm}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
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

            {/* Search */}
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

            {/* Tests Table */}
            <Card className="shadow-medical-lg border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-2xl">All Lab Tests</CardTitle>
                <CardDescription>
                  Complete list of diagnostic tests available in your lab.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredTests.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No tests match your search.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary/30 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Test Name
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Code
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Category
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Sample Type
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Price
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Turnaround
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredTests.map((test) => (
                          <tr
                            key={test.id}
                            className="hover:bg-secondary/50 transition-colors"
                          >
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
                            <td className="px-6 py-4 text-sm">
                              {test.sampleType}
                            </td>
                            <td className="px-6 py-4 font-semibold text-primary">
                              Rs. {test.price}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {test.turnaroundTime}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(test.id)}
                                  className="p-2 hover:bg-secondary rounded-lg transition-colors text-primary"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(test.id)}
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
