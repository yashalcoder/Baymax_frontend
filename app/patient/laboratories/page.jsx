"use client";
import React, { useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  Beaker,
  FileText,
  TrendingDown,
  Navigation,
} from "lucide-react";

export default function LaboratoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Tests", icon: "🔬" },
    { id: "blood", name: "Blood Tests", icon: "🩸" },
    { id: "urine", name: "Urine Tests", icon: "💧" },
  ];

  const labTests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "blood",
      description: "Measures different components of blood",
      minPrice: 500,
      maxPrice: 1200,
      avgPrice: 800,
    },
    {
      id: 2,
      name: "Lipid Profile",
      category: "blood",
      description: "Cholesterol and triglycerides test",
      minPrice: 800,
      maxPrice: 1500,
      avgPrice: 1100,
    },
    {
      id: 3,
      name: "Urine Routine Examination",
      category: "urine",
      description: "Complete urine analysis",
      minPrice: 300,
      maxPrice: 600,
      avgPrice: 450,
    },
    {
      id: 4,
      name: "X-Ray Chest",
      category: "imaging",
      description: "Chest radiography",
      minPrice: 600,
      maxPrice: 1200,
      avgPrice: 900,
    },
    {
      id: 5,
      name: "Blood Sugar (Random)",
      category: "blood",
      description: "Random glucose level test",
      minPrice: 200,
      maxPrice: 500,
      avgPrice: 350,
    },
  ];

  const laboratories = [
    {
      id: 1,
      name: "City Diagnostic Lab",
      address: "123 Main Street, Shahkot",
      distance: "0.8 km",
      rating: 4.6,
      phone: "+92 300 1234567",
      openHours: "7:00 AM - 9:00 PM",
      services: "Blood Tests, Urine Tests, Imaging",
      homeCollection: true,
      reportTime: "Same Day",
      prices: { 1: 500, 2: 800, 3: 300, 4: 600, 5: 200 },
      discount: 10,
    },
    {
      id: 2,
      name: "Medicare Diagnostics",
      address: "456 Hospital Road, Shahkot",
      distance: "1.5 km",
      rating: 4.8,
      phone: "+92 300 2345678",
      openHours: "24 Hours",
      services: "All Tests Available",
      homeCollection: true,
      reportTime: "4-6 Hours",
      prices: { 1: 650, 2: 1000, 3: 400, 4: 800, 5: 250 },
      discount: 15,
    },
    {
      id: 3,
      name: "Health Plus Lab",
      address: "789 Market Plaza, Shahkot",
      distance: "2.2 km",
      rating: 4.5,
      phone: "+92 300 3456789",
      openHours: "8:00 AM - 10:00 PM",
      services: "Blood Tests, Pathology",
      homeCollection: false,
      reportTime: "Same Day",
      prices: { 1: 700, 2: 1100, 3: 450, 4: 900, 5: 300 },
      discount: 5,
    },
    {
      id: 4,
      name: "Quick Test Laboratory",
      address: "321 Station Road, Shahkot",
      distance: "1.8 km",
      rating: 4.7,
      phone: "+92 300 4567890",
      openHours: "6:00 AM - 11:00 PM",
      services: "Express Reports, Home Collection",
      homeCollection: true,
      reportTime: "2-3 Hours",
      prices: { 1: 550, 2: 900, 3: 350, 4: 700, 5: 220 },
      discount: 12,
    },
    {
      id: 5,
      name: "Life Care Diagnostics",
      address: "555 Green Avenue, Shahkot",
      distance: "3.0 km",
      rating: 4.4,
      phone: "+92 300 5678901",
      openHours: "7:00 AM - 10:00 PM",
      services: "Advanced Imaging, Pathology",
      homeCollection: true,
      reportTime: "Next Day",
      prices: { 1: 1200, 2: 1500, 3: 600, 4: 1200, 5: 500 },
      discount: 0,
    },
  ];

  const calculateFinalPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const getLowestPrice = (testId) => {
    const prices = laboratories
      .map((lab) => lab.prices[testId])
      .filter(Boolean);
    return Math.min(...prices);
  };

  const getLabsForTest = (testId) => {
    return laboratories
      .filter((lab) => lab.prices[testId])
      .map((lab) => ({
        id: lab.id,
        name: lab.name,
        price: lab.prices[testId],
      }))
      .sort((a, b) => a.price - b.price);
  };

  const filteredTests = labTests.filter((test) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesCategory =
      selectedCategory === "all" || test.category === selectedCategory;

    if (!search) return matchesCategory;

    const matchesTestText =
      test.name.toLowerCase().includes(search) ||
      test.description.toLowerCase().includes(search);

    const matchesLabName = laboratories.some(
      (lab) =>
        lab.prices[test.id] &&
        lab.name.toLowerCase().includes(search)
    );

    return (matchesTestText || matchesLabName) && matchesCategory;
  });

  const sortedLaboratories = selectedTest
    ? [...laboratories].sort((a, b) => {
        const priceA = calculateFinalPrice(
          a.prices[selectedTest.id],
          a.discount
        );
        const priceB = calculateFinalPrice(
          b.prices[selectedTest.id],
          b.discount
        );
        return priceA - priceB;
      })
    : laboratories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Laboratory Tests
          </h1>
          <p className="text-gray-600">
            Find and compare lab test prices near you
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by test or lab name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 text-lg"
              />
            </div>

            <button className="px-6 py-3 bg-hero-gradient text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2 font-medium">
              <Navigation className="w-5 h-5" />
              Near Me
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? "bg-hero-gradient text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-800 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-purple-600" />
                Available Tests ({filteredTests.length})
              </h2>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredTests.map((test) => {
                  const labsForThisTest = getLabsForTest(test.id);

                  return (
                    <div
                      key={test.id}
                      onClick={() => setSelectedTest(test)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedTest?.id === test.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {test.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {test.description}
                      </p>

                      <div className="text-sm font-bold text-purple-600">
                        Rs. {test.minPrice} - {test.maxPrice}
                      </div>

                      {/* Labs Offering */}
                      <div className="mt-2">
                        <span className="text-[11px] text-gray-500">
                          Available at {labsForThisTest.length} labs:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {labsForThisTest.slice(0, 3).map((lab) => (
                            <span
                              key={lab.id}
                              className="px-2 py-1 bg-gray-100 rounded-full text-[11px] text-gray-700"
                            >
                              {lab.name} (Rs. {lab.price})
                            </span>
                          ))}
                          {labsForThisTest.length > 3 && (
                            <span className="text-[11px] text-gray-500">
                              +{labsForThisTest.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lab cards */}
          <div className="lg:col-span-2">
            {!selectedTest ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                <Beaker className="w-20 h-20 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Select a Lab Test
                </h3>
                <p className="text-gray-600">
                  Compare prices across laboratories
                </p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-6 text-white">
                  <h2 className="text-2xl font-bold mb-1">
                    {selectedTest.name}
                  </h2>
                  <p className="text-purple-100">{selectedTest.description}</p>
                </div>

                <div className="space-y-4">
                  {sortedLaboratories.map((lab, index) => {
                    const originalPrice = lab.prices[selectedTest.id];
                    const finalPrice = calculateFinalPrice(
                      originalPrice,
                      lab.discount
                    );
                    const isLowest = index === 0;

                    return (
                      <div
                        key={lab.id}
                        className={`bg-white p-6 rounded-xl shadow-md border-2 ${
                          isLowest
                            ? "border-green-500 ring-4 ring-green-100"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{lab.name}</h3>
                            <div className="text-sm text-gray-600">
                              {lab.address} • {lab.distance}
                            </div>
                            <div className="mt-2 text-gray-600 text-sm flex gap-2 flex-wrap">
                              {lab.homeCollection && (
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  🏠 Home Collection
                                </span>
                              )}
                              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                {lab.services}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            {lab.discount > 0 && (
                              <div className="text-sm text-red-500 line-through">
                                Rs. {originalPrice}
                              </div>
                            )}
                            <div className="text-3xl font-bold">
                              Rs. {finalPrice}
                            </div>

                            <div className="flex gap-2 mt-3">
                              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                                Book
                              </button>
                              <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                                Call
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
