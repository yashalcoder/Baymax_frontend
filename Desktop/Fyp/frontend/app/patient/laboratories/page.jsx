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
  Download,
  Calendar,
  Filter,
  TrendingDown,
  Navigation,
} from "lucide-react";

export default function LaboratoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Test Categories
  const categories = [
    { id: "all", name: "All Tests", icon: "🔬" },
    { id: "blood", name: "Blood Tests", icon: "🩸" },
    { id: "urine", name: "Urine Tests", icon: "💧" },
    { id: "imaging", name: "Imaging", icon: "📷" },
    { id: "pathology", name: "Pathology", icon: "🧬" },
    { id: "radiology", name: "Radiology", icon: "☢️" },
  ];

  // Sample lab tests data
  const labTests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "blood",
      description: "Measures different components of blood",
      duration: "2-4 hours",
      fasting: "Not Required",
      minPrice: 500,
      maxPrice: 1200,
      avgPrice: 800,
    },
    {
      id: 2,
      name: "Lipid Profile",
      category: "blood",
      description: "Cholesterol and triglycerides test",
      duration: "4-6 hours",
      fasting: "12 hours required",
      minPrice: 800,
      maxPrice: 1500,
      avgPrice: 1100,
    },
    {
      id: 3,
      name: "Urine Routine Examination",
      category: "urine",
      description: "Complete urine analysis",
      duration: "1-2 hours",
      fasting: "Not Required",
      minPrice: 300,
      maxPrice: 600,
      avgPrice: 450,
    },
    {
      id: 4,
      name: "X-Ray Chest",
      category: "imaging",
      description: "Chest radiography",
      duration: "30 minutes",
      fasting: "Not Required",
      minPrice: 600,
      maxPrice: 1200,
      avgPrice: 900,
    },
    {
      id: 5,
      name: "Blood Sugar (Random)",
      category: "blood",
      description: "Random glucose level test",
      duration: "1-2 hours",
      fasting: "Not Required",
      minPrice: 200,
      maxPrice: 500,
      avgPrice: 350,
    },
  ];

  // Sample laboratories data
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
      prices: {
        1: 500,
        2: 800,
        3: 300,
        4: 600,
        5: 200,
      },
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
      prices: {
        1: 650,
        2: 1000,
        3: 400,
        4: 800,
        5: 250,
      },
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
      prices: {
        1: 700,
        2: 1100,
        3: 450,
        4: 900,
        5: 300,
      },
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
      prices: {
        1: 550,
        2: 900,
        3: 350,
        4: 700,
        5: 220,
      },
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
      prices: {
        1: 1200,
        2: 1500,
        3: 600,
        4: 1200,
        5: 500,
      },
      discount: 0,
    },
  ];

  const filteredTests = labTests.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const calculateFinalPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const getLowestPrice = (testId) => {
    const prices = laboratories
      .map((lab) => lab.prices[testId])
      .filter(Boolean);
    return Math.min(...prices);
  };

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

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search lab tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 text-lg"
              />
            </div>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium">
              <Navigation className="w-5 h-5" />
              Near Me
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Lab Tests List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-purple-600" />
                Available Tests ({filteredTests.length})
              </h2>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredTests.map((test) => (
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
                    <p className="text-xs text-gray-600 mb-2">
                      {test.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{test.duration}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded ${
                          test.fasting === "Not Required"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {test.fasting}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-purple-600">
                      Rs. {test.minPrice} - {test.maxPrice}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Laboratory Comparison */}
          <div className="lg:col-span-2">
            {selectedTest ? (
              <>
                {/* Selected Test Info */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mb-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {selectedTest.name}
                      </h2>
                      <p className="text-purple-100 mb-3">
                        {selectedTest.description}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Report: {selectedTest.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{selectedTest.fasting}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-purple-100 mb-1">
                        Price Range
                      </div>
                      <div className="text-3xl font-bold">
                        Rs. {selectedTest.minPrice} - {selectedTest.maxPrice}
                      </div>
                      <div className="text-sm text-purple-100 mt-1">
                        Avg: Rs. {selectedTest.avgPrice}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laboratory Cards */}
                <div className="space-y-4">
                  {sortedLaboratories.map((lab, index) => {
                    const originalPrice = lab.prices[selectedTest.id];
                    const finalPrice = calculateFinalPrice(
                      originalPrice,
                      lab.discount
                    );
                    const isLowest = index === 0;
                    const lowestPrice = getLowestPrice(selectedTest.id);
                    const savings = originalPrice - lowestPrice;

                    return (
                      <div
                        key={lab.id}
                        className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all hover:shadow-xl ${
                          isLowest
                            ? "border-green-500 ring-4 ring-green-100"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          {/* Lab Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {isLowest && (
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  BEST PRICE
                                </span>
                              )}
                              <h3 className="text-xl font-bold text-gray-900">
                                {lab.name}
                              </h3>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold text-gray-700">
                                  {lab.rating}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                <span>
                                  {lab.address} • {lab.distance}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-600" />
                                <span>{lab.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span>{lab.openHours}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-orange-600" />
                                <span>Report: {lab.reportTime}</span>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="flex gap-2 flex-wrap">
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

                          {/* Price Section */}
                          <div className="text-right ml-6">
                            <div className="mb-2">
                              {lab.discount > 0 && (
                                <div className="flex items-center gap-2 justify-end mb-1">
                                  <span className="text-gray-400 line-through text-sm">
                                    Rs. {originalPrice}
                                  </span>
                                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">
                                    -{lab.discount}%
                                  </span>
                                </div>
                              )}
                              <div className="text-3xl font-bold text-gray-900">
                                Rs. {finalPrice.toFixed(0)}
                              </div>
                            </div>

                            {isLowest && (
                              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold mb-3">
                                <TrendingDown className="w-4 h-4" />
                                Lowest Price
                              </div>
                            )}
                            {!isLowest && savings > 0 && (
                              <div className="text-orange-600 text-sm mb-3">
                                Save Rs. {savings} elsewhere
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm">
                                Book Test
                              </button>
                              <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
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
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Beaker className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Select a Lab Test
                </h3>
                <p className="text-gray-600">
                  Choose a test from the left panel to compare prices across
                  laboratories
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Banners */}
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Home Collection Available</p>
              <p>
                Many laboratories offer free home sample collection. Check the
                lab details for this service.
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-purple-900">
              <p className="font-semibold mb-1">Digital Reports</p>
              <p>
                Get your reports via email, WhatsApp, or download from the lab
                portal. Most labs provide reports within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
