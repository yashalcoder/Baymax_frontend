"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Phone,
  Clock,
  Star,
  Beaker,
  Navigation,
  Loader2,
  AlertCircle,
  X,
  MapPin,
  CheckCircle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Haversine distance (km) ──────────────────────────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Near Me Modal — Leaflet / OpenStreetMap (no API key) ────────────────────
function NearMeModal({ onClose, laboratories }) {
  const mapRef        = useRef(null);
  const leafletMapRef = useRef(null);
  const [status, setStatus] = useState("locating");

  useEffect(() => {
    if (!navigator.geolocation) { setStatus("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => initLeafletMap(pos.coords.latitude, pos.coords.longitude),
      ()    => setStatus("denied"),
      { timeout: 10000 }
    );
  }, []);

  const initLeafletMap = (userLat, userLng) => {
    // Inject Leaflet CSS once
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id    = "leaflet-css";
      link.rel   = "stylesheet";
      link.href  = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const buildMap = () => {
      if (leafletMapRef.current) return; // already running

      const L   = window.L;
      const map = L.map(mapRef.current).setView([userLat, userLng], 13);
      leafletMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // User marker (blue dot)
      L.marker([userLat, userLng], {
        icon: L.divIcon({
          className: "",
          html: `<div style="width:18px;height:18px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
          iconSize: [18, 18], iconAnchor: [9, 9],
        }),
      }).addTo(map).bindPopup("<b>📍 Your Location</b>").openPopup();

      // Lab markers (purple microscope emoji)
      const labIcon = L.divIcon({
        className: "",
        html: `<div style="width:34px;height:34px;background:#7c3aed;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.35);font-size:16px">🔬</div>`,
        iconSize: [34, 34], iconAnchor: [17, 17],
      });

      const labsOnMap = laboratories.filter(
        (l) => l.location?.lat && l.location?.lng
      );

      labsOnMap.forEach((lab) => {
        const dist = haversineKm(
          userLat, userLng, lab.location.lat, lab.location.lng
        ).toFixed(1);

        L.marker([lab.location.lat, lab.location.lng], { icon: labIcon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:180px;font-family:sans-serif;line-height:1.6">
              <strong style="font-size:14px">${lab.labName}</strong><br/>
              ${lab.address ? `<span style="color:#6b7280;font-size:12px">${lab.address}</span><br/>` : ""}
              <span style="color:#7c3aed;font-weight:700;font-size:13px">📍 ${dist} km away</span>
              ${lab.phone    ? `<br/><span style="font-size:12px">📞 ${lab.phone}</span>` : ""}
              ${lab.openHours ? `<br/><span style="font-size:12px">🕐 ${lab.openHours}</span>` : ""}
              ${lab.homeCollection ? `<br/><span style="color:#059669;font-size:12px;font-weight:600">🏠 Home Collection</span>` : ""}
              ${lab.rating ? `<br/><span style="color:#f59e0b;font-size:12px">⭐ ${lab.rating}</span>` : ""}
            </div>`);
      });

      // Fit bounds to show everything
      if (labsOnMap.length > 0) {
        map.fitBounds(
          [[userLat, userLng], ...labsOnMap.map((l) => [l.location.lat, l.location.lng])],
          { padding: [40, 40] }
        );
      }

      setStatus("ready");
    };

    if (window.L) {
      buildMap();
    } else if (!document.getElementById("leaflet-js")) {
      const s   = document.createElement("script");
      s.id      = "leaflet-js";
      s.src     = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload  = buildMap;
      document.body.appendChild(s);
    } else {
      document.getElementById("leaflet-js").addEventListener("load", buildMap);
    }
  };

  // Destroy map on unmount to avoid "container already initialised" error
  useEffect(() => () => { leafletMapRef.current?.remove(); leafletMapRef.current = null; }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Navigation className="w-5 h-5 text-purple-600" />
            Laboratories Near You
            {status === "ready" && (
              <span className="text-sm font-normal text-gray-400">
                ({laboratories.filter((l) => l.location?.lat).length} on map)
              </span>
            )}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map */}
        <div className="relative" style={{ height: 460 }}>
          {status === "locating" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-purple-600 bg-white z-10">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="font-medium">Detecting your location…</p>
              <p className="text-sm text-gray-400">Allow location access if prompted</p>
            </div>
          )}
          {status === "denied" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10 p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="font-semibold text-lg text-red-600">Location Access Denied</p>
              <p className="text-sm text-gray-500">
                Allow location permission in your browser then try again.
              </p>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Warning if no labs have coordinates */}
        {status === "ready" &&
          laboratories.filter((l) => l.location?.lat).length === 0 && (
            <div className="p-3 bg-yellow-50 border-t border-yellow-200 text-sm text-yellow-800 text-center">
              ⚠️ No laboratories have saved coordinates yet.
            </div>
          )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LaboratoryPage() {
  const [searchTerm, setSearchTerm]             = useState("");
  const [selectedTest, setSelectedTest]         = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [labTests, setLabTests]                 = useState([]);
  const [laboratories, setLaboratories]         = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);
  const [showNearMe, setShowNearMe]             = useState(false);
  const [userLocation, setUserLocation]         = useState(null);

  const categories = [
    { id: "all",     name: "All Tests",   icon: "🔬" },
    { id: "blood",   name: "Blood Tests", icon: "🩸" },
    { id: "urine",   name: "Urine Tests", icon: "💧" },
    { id: "imaging", name: "Imaging",     icon: "🖥️" },
    { id: "general", name: "General",     icon: "🧪" },
  ];

  // Silently get user coords for distance labels in list view
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {}
    );
  }, []);

  // Fetch labs + tests from backend
  useEffect(() => {
    (async () => {
      try {
        const token   = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [testsRes, labsRes] = await Promise.all([
          fetch(`${API}/api/laboratory/tests`, { headers }),  // FIX: was /api/laboratory/tests
          fetch(`${API}/api/laboratory`,        { headers }),  // FIX: was /api/laboratory
        ]);

        if (testsRes.ok) setLabTests((await testsRes.json()).tests || []);
        if (labsRes.ok)  setLaboratories((await labsRes.json()).laboratories || []);
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getFinalPrice = (price, discount = 0) =>
    Math.round(price - (price * discount) / 100);

  const distanceLabel = (lab) => {
    if (!userLocation || !lab.location?.lat) return null;
    const km = haversineKm(userLocation.lat, userLocation.lng, lab.location.lat, lab.location.lng);
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  };

  const labsForTest = (testId) =>
    laboratories
      .filter((l) => l.prices?.[testId])
      .map((l) => ({ ...l, _price: l.prices[testId] }))
      .sort((a, b) => a._price - b._price);

  const displayedLabs = (() => {
    if (!selectedTest) return [];
    const testId = selectedTest._id || selectedTest.id;
    return laboratories
      .filter((l) => l.prices?.[testId])
      .sort((a, b) =>
        getFinalPrice(a.prices[testId], a.discount) -
        getFinalPrice(b.prices[testId], b.discount)
      );
  })();

  const filteredTests = labTests.filter((t) => {
    const q = searchTerm.toLowerCase();
    const catOk = selectedCategory === "all" || t.category === selectedCategory;
    return catOk && (!q || t.name?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
  });

  // ── Render ───────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-purple-600">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-lg font-medium">Loading laboratory data…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="text-lg font-medium">{error}</p>
      </div>
    </div>
  );

  return (
    <>
      {showNearMe && (
        <NearMeModal
          onClose={() => setShowNearMe(false)}
          laboratories={laboratories}
        />
      )}

      <div className="min-h-screen bg-hero-gra p-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Laboratory Tests</h1>
            <p className="text-gray-600">Find and compare lab test prices near you</p>
          </div>

          {/* Search + Near Me */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by test name…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 text-base"
                />
              </div>
              <button
                onClick={() => setShowNearMe(true)}
                className="px-6 py-3 bg-hero-gradient text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 font-semibold shadow-md"
              >
                <Navigation className="w-5 h-5" />
                Near Me
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? "bg-hero-gradient text-white border-transparent"
                      : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Empty state */}
          {labTests.length === 0 && laboratories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-16 text-center">
              <Beaker className="w-20 h-20 text-purple-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Laboratory Data Yet</h3>
              <p className="text-gray-400 mb-6">
                Tests and listings appear once labs register in the system.
              </p>
              <button
                onClick={() => setShowNearMe(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold inline-flex items-center gap-2 shadow-md"
              >
                <Navigation className="w-5 h-5" /> Find Nearby Labs on Map
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Test list */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-purple-600" />
                    Tests ({filteredTests.length})
                  </h2>
                  <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                    {filteredTests.length === 0 && (
                      <p className="py-8 text-center text-gray-400 text-sm">No tests match your search.</p>
                    )}
                    {filteredTests.map((test) => {
                      const testId   = test._id || test.id;
                      const labs4    = labsForTest(testId);
                      const selected = (selectedTest?._id || selectedTest?.id) === testId;
                      return (
                        <div
                          key={testId}
                          onClick={() => setSelectedTest(test)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                            selected
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <h3 className="font-semibold text-gray-900">{test.name}</h3>
                          {test.description && (
                            <p className="text-xs text-gray-400 mt-0.5">{test.description}</p>
                          )}
                          {(test.minPrice > 0 || test.maxPrice > 0) && (
                            <p className="text-sm font-bold text-purple-600 mt-1">
                              Rs. {test.minPrice}{test.maxPrice !== test.minPrice ? ` – ${test.maxPrice}` : ""}
                            </p>
                          )}
                          {labs4.length > 0 && (
                            <div className="mt-2">
                              <p className="text-[11px] text-gray-400">
                                {labs4.length} lab{labs4.length > 1 ? "s" : ""} available:
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {labs4.slice(0, 2).map((l) => (
                                  <span key={l._id} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[11px] font-medium">
                                    {l.labName} — Rs. {l._price}
                                  </span>
                                ))}
                                {labs4.length > 2 && (
                                  <span className="text-[11px] text-gray-400">+{labs4.length - 2} more</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Lab cards */}
              <div className="lg:col-span-2 space-y-4">
                {!selectedTest && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                    <Beaker className="w-20 h-20 text-purple-200 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a Test</h3>
                    <p className="text-gray-500">Pick a test from the left to compare lab prices</p>
                  </div>
                )}

                {selectedTest && displayedLabs.length === 0 && (
                  <div className="bg-white rounded-xl p-10 text-center border border-gray-200 shadow-md">
                    <Beaker className="w-12 h-12 text-purple-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No labs offer this test yet.</p>
                    <button
                      onClick={() => setShowNearMe(true)}
                      className="mt-4 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-sm inline-flex items-center gap-2"
                    >
                      <Navigation className="w-4 h-4" /> Find Nearby Labs
                    </button>
                  </div>
                )}

                {selectedTest && displayedLabs.length > 0 && (
                  <>
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                      <h2 className="text-2xl font-bold">{selectedTest.name}</h2>
                      {selectedTest.description && (
                        <p className="text-purple-100 text-sm mt-1">{selectedTest.description}</p>
                      )}
                    </div>

                    {displayedLabs.map((lab, i) => {
                      const testId   = selectedTest._id || selectedTest.id;
                      const origPrice = lab.prices[testId];
                      const finalPrice = getFinalPrice(origPrice, lab.discount);
                      const dist = distanceLabel(lab);

                      return (
                        <div
                          key={lab._id}
                          className={`bg-white p-6 rounded-xl shadow-md border-2 hover:shadow-lg transition-all ${
                            i === 0 ? "border-green-500 ring-4 ring-green-100" : "border-gray-200"
                          }`}
                        >
                          {i === 0 && (
                            <div className="mb-3">
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                <CheckCircle className="w-3 h-3" /> Best Price
                              </span>
                            </div>
                          )}

                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <h3 className="text-xl font-bold text-gray-900">{lab.labName}</h3>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                                {lab.address && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" /> {lab.address}
                                  </span>
                                )}
                                {dist && (
                                  <span className="font-semibold text-purple-600">
                                    📍 {dist}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {lab.homeCollection && (
                                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    🏠 Home Collection
                                  </span>
                                )}
                                {lab.reportTime && (
                                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    <Clock className="w-3 h-3 inline mr-1" />{lab.reportTime}
                                  </span>
                                )}
                                {lab.rating && (
                                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    <Star className="w-3 h-3 inline mr-1" />{lab.rating}
                                  </span>
                                )}
                              </div>

                              {lab.openHours && (
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {lab.openHours}
                                </p>
                              )}
                            </div>

                            <div className="text-right flex flex-col items-end justify-between gap-3 min-w-[130px]">
                              <div>
                                {(lab.discount || 0) > 0 && (
                                  <p className="text-sm text-red-400 line-through">Rs. {origPrice}</p>
                                )}
                                <p className="text-3xl font-extrabold text-gray-900">
                                  Rs. {finalPrice}
                                </p>
                                {(lab.discount || 0) > 0 && (
                                  <p className="text-xs text-green-600 font-semibold">{lab.discount}% off</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow transition-colors">
                                  Book
                                </button>
                                {lab.phone && (
                                  <a
                                    href={`tel:${lab.phone}`}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1 transition-colors"
                                  >
                                    <Phone className="w-3.5 h-3.5" /> Call
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}