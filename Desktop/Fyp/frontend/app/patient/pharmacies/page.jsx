"use client";
import React, { useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  TrendingDown,
  TrendingUp,
  Navigation,
  Map as MapIcon,
  List,
} from "lucide-react";

export default function PharmacyComparison() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  // Sample medicines data
  const medicines = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      genericName: "Acetaminophen",
      type: "Tablet",
      manufacturer: "GSK",
      minPrice: 45,
      maxPrice: 85,
      avgPrice: 65,
    },
    {
      id: 2,
      name: "Amoxicillin 250mg",
      genericName: "Amoxicillin",
      type: "Capsule",
      manufacturer: "Pfizer",
      minPrice: 120,
      maxPrice: 180,
      avgPrice: 150,
    },
    {
      id: 3,
      name: "Ibuprofen 400mg",
      genericName: "Ibuprofen",
      type: "Tablet",
      manufacturer: "Abbott",
      minPrice: 60,
      maxPrice: 95,
      avgPrice: 78,
    },
  ];

  // Sample pharmacy data with coordinates
  const pharmacies = [
    {
      id: 1,
      name: "City Pharmacy",
      address: "123 Main Street, Shahkot",
      distance: "0.5 km",
      rating: 4.5,
      phone: "+92 300 1234567",
      openHours: "8:00 AM - 10:00 PM",
      coordinates: { x: 25, y: 30 },
      prices: {
        1: 45,
        2: 120,
        3: 60,
      },
      discount: 5,
    },
    {
      id: 2,
      name: "MediCare Plus",
      address: "456 Hospital Road, Shahkot",
      distance: "1.2 km",
      rating: 4.7,
      phone: "+92 300 2345678",
      openHours: "24 Hours",
      coordinates: { x: 60, y: 45 },
      prices: {
        1: 55,
        2: 135,
        3: 70,
      },
      discount: 10,
    },
    {
      id: 3,
      name: "Health First Pharmacy",
      address: "789 Market Plaza, Shahkot",
      distance: "2.0 km",
      rating: 4.3,
      phone: "+92 300 3456789",
      openHours: "9:00 AM - 9:00 PM",
      coordinates: { x: 40, y: 70 },
      prices: {
        1: 65,
        2: 150,
        3: 78,
      },
      discount: 0,
    },
    {
      id: 4,
      name: "Quick Meds",
      address: "321 Station Road, Shahkot",
      distance: "1.8 km",
      rating: 4.6,
      phone: "+92 300 4567890",
      openHours: "8:00 AM - 11:00 PM",
      coordinates: { x: 75, y: 25 },
      prices: {
        1: 50,
        2: 125,
        3: 65,
      },
      discount: 8,
    },
    {
      id: 5,
      name: "Life Care Pharmacy",
      address: "555 Green Avenue, Shahkot",
      distance: "2.5 km",
      rating: 4.4,
      phone: "+92 300 5678901",
      openHours: "7:00 AM - 10:00 PM",
      coordinates: { x: 50, y: 55 },
      prices: {
        1: 85,
        2: 180,
        3: 95,
      },
      discount: 0,
    },
  ];

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLowestPrice = (medicineId) => {
    const prices = pharmacies.map((p) => p.prices[medicineId]).filter(Boolean);
    return Math.min(...prices);
  };

  const calculateFinalPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const getPriceStatus = (price, medicineId) => {
    const lowestPrice = getLowestPrice(medicineId);
    if (price === lowestPrice) return "lowest";
    if (price <= lowestPrice * 1.1) return "good";
    return "high";
  };

  const sortedPharmacies = selectedMedicine
    ? [...pharmacies].sort((a, b) => {
        const priceA = calculateFinalPrice(
          a.prices[selectedMedicine.id],
          a.discount
        );
        const priceB = calculateFinalPrice(
          b.prices[selectedMedicine.id],
          b.discount
        );
        return priceA - priceB;
      })
    : pharmacies;

  const PharmacyCard = ({ pharmacy, index, compact = false }) => {
    const originalPrice = selectedMedicine
      ? pharmacy.prices[selectedMedicine.id]
      : 0;
    const finalPrice = calculateFinalPrice(originalPrice, pharmacy.discount);
    const priceStatus = selectedMedicine
      ? getPriceStatus(finalPrice, selectedMedicine.id)
      : null;
    const lowestPrice = selectedMedicine
      ? getLowestPrice(selectedMedicine.id)
      : 0;
    const savings = originalPrice - lowestPrice;

    return (
      <div
        onClick={() => setSelectedPharmacy(pharmacy)}
        className={`bg-white rounded-xl shadow-md border-2 p-4 transition-all hover:shadow-xl cursor-pointer ${
          index === 0 && selectedMedicine
            ? "border-green-500 ring-4 ring-green-100"
            : "border-gray-200"
        } ${
          selectedPharmacy?.id === pharmacy.id ? "ring-4 ring-blue-300" : ""
        } ${compact ? "p-3" : "p-6"}`}
      >
        <div
          className={`flex items-start ${
            compact ? "flex-col" : "justify-between"
          }`}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {index === 0 && selectedMedicine && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  BEST
                </span>
              )}
              <h3
                className={`font-bold text-gray-900 ${
                  compact ? "text-sm" : "text-xl"
                }`}
              >
                {pharmacy.name}
              </h3>
              <div className="flex items-center gap-1">
                <Star
                  className={`${
                    compact ? "w-3 h-3" : "w-4 h-4"
                  } fill-yellow-400 text-yellow-400`}
                />
                <span
                  className={`${
                    compact ? "text-xs" : "text-sm"
                  } font-semibold text-gray-700`}
                >
                  {pharmacy.rating}
                </span>
              </div>
            </div>

            {!compact && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {pharmacy.address} • {pharmacy.distance}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span>{pharmacy.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>{pharmacy.openHours}</span>
                </div>
              </div>
            )}

            {compact && (
              <div className="text-xs text-gray-600 mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>{pharmacy.distance}</span>
                </div>
              </div>
            )}
          </div>

          {selectedMedicine && (
            <div className={`text-right ${compact ? "mt-2 w-full" : "ml-6"}`}>
              <div className="mb-1">
                {pharmacy.discount > 0 && (
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <span
                      className={`text-gray-400 line-through ${
                        compact ? "text-xs" : "text-sm"
                      }`}
                    >
                      Rs. {originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">
                      -{pharmacy.discount}%
                    </span>
                  </div>
                )}
                <div
                  className={`font-bold text-gray-900 ${
                    compact ? "text-xl" : "text-3xl"
                  }`}
                >
                  Rs. {finalPrice.toFixed(0)}
                </div>
              </div>

              {priceStatus === "lowest" && (
                <div
                  className={`flex items-center gap-1 text-green-600 font-semibold ${
                    compact ? "text-xs" : "text-sm"
                  }`}
                >
                  <TrendingDown
                    className={`${compact ? "w-3 h-3" : "w-4 h-4"}`}
                  />
                  Lowest
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Pharmacy Price Comparison
          </h1>
          <p className="text-gray-600">
            Find the best prices for your medicines near you
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicine name or generic name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              />
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium">
              <Navigation className="w-5 h-5" />
              Near Me
            </button>
          </div>

          {/* Medicine Selection Pills */}
          <div className="flex flex-wrap gap-3">
            {filteredMedicines.map((med) => (
              <button
                key={med.id}
                onClick={() => setSelectedMedicine(med)}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  selectedMedicine?.id === med.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {med.name}
              </button>
            ))}
          </div>
        </div>

        {selectedMedicine ? (
          <>
            {/* Selected Medicine Info + View Toggle */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedMedicine.name}
                  </h2>
                  <p className="text-blue-100 mb-1">
                    Generic: {selectedMedicine.genericName}
                  </p>
                  <p className="text-blue-100">
                    {selectedMedicine.type} • {selectedMedicine.manufacturer}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-100 mb-1">Price Range</div>
                  <div className="text-3xl font-bold">
                    Rs. {selectedMedicine.minPrice} -{" "}
                    {selectedMedicine.maxPrice}
                  </div>
                  <div className="text-sm text-blue-100 mt-1">
                    Avg: Rs. {selectedMedicine.avgPrice}
                  </div>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-white/20 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                    viewMode === "list"
                      ? "bg-white text-blue-600"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <List className="w-4 h-4" />
                  List View
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                    viewMode === "map"
                      ? "bg-white text-blue-600"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                  Map View
                </button>
              </div>
            </div>

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {sortedPharmacies.map((pharmacy, index) => (
                  <PharmacyCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Map View */}
            {viewMode === "map" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Container */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 h-[600px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
                    {/* Decorative grid */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    ></div>

                    {/* Roads */}
                    <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-300"></div>
                    <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-300"></div>
                    <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-gray-300"></div>
                    <div className="absolute top-0 bottom-0 right-1/3 w-1 bg-gray-300"></div>

                    {/* Your Location */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="relative">
                        <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          You
                        </div>
                      </div>
                    </div>

                    {/* Pharmacy Markers */}
                    {sortedPharmacies.map((pharmacy, index) => {
                      const finalPrice = calculateFinalPrice(
                        pharmacy.prices[selectedMedicine.id],
                        pharmacy.discount
                      );
                      const isLowest = index === 0;

                      return (
                        <div
                          key={pharmacy.id}
                          className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-10 transition-all hover:z-30"
                          style={{
                            left: `${pharmacy.coordinates.x}%`,
                            top: `${pharmacy.coordinates.y}%`,
                          }}
                          onClick={() => setSelectedPharmacy(pharmacy)}
                        >
                          <div
                            className={`relative ${
                              selectedPharmacy?.id === pharmacy.id
                                ? "scale-125"
                                : "hover:scale-110"
                            } transition-transform`}
                          >
                            {/* Price tag */}
                            <div
                              className={`mb-2 px-3 py-1 rounded-lg shadow-lg font-bold text-sm whitespace-nowrap ${
                                isLowest
                                  ? "bg-green-500 text-white"
                                  : "bg-white text-gray-900"
                              }`}
                            >
                              Rs. {finalPrice.toFixed(0)}
                              {isLowest && <span className="ml-1">✓</span>}
                            </div>
                            {/* Pin marker */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                                  isLowest ? "bg-green-500" : "bg-red-500"
                                }`}
                              >
                                <MapPin className="w-5 h-5 text-white" />
                              </div>
                              <div
                                className={`w-1 h-4 ${
                                  isLowest ? "bg-green-500" : "bg-red-500"
                                }`}
                              ></div>
                            </div>
                            {/* Pharmacy name */}
                            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-semibold whitespace-nowrap">
                              {pharmacy.name}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
                    <div className="font-semibold mb-2">Legend</div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span>Your Location</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Best Price</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Pharmacy</span>
                    </div>
                  </div>
                </div>

                {/* Pharmacy Details Sidebar */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {selectedPharmacy ? (
                    <div>
                      <button
                        onClick={() => setSelectedPharmacy(null)}
                        className="text-blue-600 text-sm mb-3 hover:underline"
                      >
                        ← Back to all pharmacies
                      </button>
                      <PharmacyCard
                        pharmacy={selectedPharmacy}
                        index={sortedPharmacies.findIndex(
                          (p) => p.id === selectedPharmacy.id
                        )}
                      />
                      <button className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                        <Navigation className="w-5 h-5" />
                        Get Directions
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        All Pharmacies
                      </h3>
                      {sortedPharmacies.map((pharmacy, index) => (
                        <PharmacyCard
                          key={pharmacy.id}
                          pharmacy={pharmacy}
                          index={index}
                          compact={true}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Select a Medicine
            </h3>
            <p className="text-gray-600">
              Choose a medicine from above to compare prices across pharmacies
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">i</span>
          </div>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Price Comparison Tips</p>
            <p>
              Prices shown are indicative and may vary. Always verify prices
              directly with the pharmacy. Some pharmacies offer additional
              discounts on bulk purchases or with prescription.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
