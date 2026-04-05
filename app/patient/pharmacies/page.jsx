"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Phone, MapPin, Navigation, Loader2, AlertCircle,
  X, Pill, ShoppingBag, CheckCircle, XCircle, ChevronDown, ChevronUp,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

// ─── Near Me Modal ─────────────────────────────────────────────────────────
function NearMeModal({ onClose, pharmacies }) {
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
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const buildMap = () => {
      if (leafletMapRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current).setView([userLat, userLng], 13);
      leafletMapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors", maxZoom: 19,
      }).addTo(map);
      L.marker([userLat, userLng], {
        icon: L.divIcon({
          className: "",
          html: `<div style="width:18px;height:18px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
          iconSize: [18,18], iconAnchor: [9,9],
        }),
      }).addTo(map).bindPopup("<b>📍 Your Location</b>").openPopup();

      const pharmIcon = L.divIcon({
        className: "",
        html: `<div style="width:34px;height:34px;background:#16a34a;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.35);font-size:16px">💊</div>`,
        iconSize: [34,34], iconAnchor: [17,17],
      });
      pharmacies.filter(p => p.location?.lat && p.location?.lng).forEach(pharm => {
        const dist = haversineKm(userLat, userLng, pharm.location.lat, pharm.location.lng).toFixed(1);
        L.marker([pharm.location.lat, pharm.location.lng], { icon: pharmIcon })
          .addTo(map)
          .bindPopup(`<div style="min-width:180px;font-family:sans-serif;line-height:1.6">
            <strong style="font-size:14px">${pharm.pharmacyName}</strong><br/>
            ${pharm.address ? `<span style="color:#6b7280;font-size:12px">${pharm.address}</span><br/>` : ""}
            <span style="color:#16a34a;font-weight:700;font-size:13px">📍 ${dist} km away</span>
            ${pharm.phone ? `<br/><span style="font-size:12px">📞 ${pharm.phone}</span>` : ""}
            ${pharm.isOpen
              ? `<br/><span style="color:#059669;font-size:12px;font-weight:600">✅ Open</span>`
              : `<br/><span style="color:#dc2626;font-size:12px;font-weight:600">❌ Closed</span>`}
          </div>`);
      });
      setStatus("ready");
    };
    if (window.L) buildMap();
    else if (!document.getElementById("leaflet-js")) {
      const s = document.createElement("script");
      s.id = "leaflet-js"; s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = buildMap; document.body.appendChild(s);
    }
  };

  useEffect(() => () => { leafletMapRef.current?.remove(); leafletMapRef.current = null; }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Navigation className="w-5 h-5 text-green-600" /> Pharmacies Near You
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="relative" style={{ height: 460 }}>
          {status === "locating" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-green-600 bg-white z-10">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="font-medium">Detecting your location…</p>
            </div>
          )}
          {status === "denied" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10 p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="font-semibold text-lg text-red-600">Location Access Denied</p>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Medicine Availability Row ──────────────────────────────────────────────
function MedicineRow({ medicine, pharmacy }) {
  // Try to find this medicine in the pharmacy's medicines list
  const found = pharmacy.medicines?.find(
    (m) => m.name?.toLowerCase() === medicine.toLowerCase()
  );
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
      found ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
    }`}>
      <div className="flex items-center gap-2">
        {found
          ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
        <span className={`font-medium ${found ? "text-green-800" : "text-red-700"}`}>
          {medicine}
        </span>
      </div>
      {found
        ? <span className="font-bold text-green-700 shrink-0">
            {found.price ? `Rs. ${found.price}` : "In Stock"}
          </span>
        : <span className="text-red-500 font-medium shrink-0 text-xs">Not Available</span>}
    </div>
  );
}

// ─── Pharmacy Card ──────────────────────────────────────────────────────────
function PharmacyCard({ pharmacy, prescribedMedicines, distanceLabel, rank }) {
  const [expanded, setExpanded] = useState(rank === 0); // auto-expand best match

  // Score: how many prescribed medicines are available
  const availableCount = prescribedMedicines.filter(med =>
    pharmacy.medicines?.some(m => m.name?.toLowerCase() === med.toLowerCase())
  ).length;
  const totalCount = prescribedMedicines.length;
  const hasPrescription = totalCount > 0;

  const dist = distanceLabel(pharmacy);

  return (
    <div className={`bg-white rounded-xl shadow-md border-2 transition-all hover:shadow-lg ${
      rank === 0 && hasPrescription
        ? "border-green-500 ring-4 ring-green-100"
        : "border-gray-200 hover:border-green-300"
    }`}>
      {/* Best match badge */}
      {rank === 0 && hasPrescription && (
        <div className="px-5 pt-4">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <CheckCircle className="w-3 h-3" /> Best Match — Most Medicines Available
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-green-100 rounded-lg shrink-0">
              <Pill className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
                {pharmacy.pharmacyName}
              </h3>
              {pharmacy.address && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{pharmacy.address}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              pharmacy.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}>
              {pharmacy.isOpen ? "✅ Open" : "❌ Closed"}
            </span>
            {dist && (
              <span className="text-xs font-bold text-green-600">📍 {dist}</span>
            )}
          </div>
        </div>

        {/* Prescription availability summary */}
        {hasPrescription && (
          <div className={`mb-3 px-4 py-2.5 rounded-lg border flex items-center justify-between ${
            availableCount === totalCount
              ? "bg-green-50 border-green-200"
              : availableCount > 0
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
          }`}>
            <span className="text-sm font-semibold text-gray-700">
              Prescription Coverage
            </span>
            <span className={`text-sm font-bold ${
              availableCount === totalCount
                ? "text-green-700"
                : availableCount > 0
                ? "text-yellow-700"
                : "text-red-600"
            }`}>
              {availableCount} / {totalCount} medicines
            </span>
          </div>
        )}

        {/* Toggle medicine list */}
        {hasPrescription && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-600 hover:text-green-700 transition-colors py-1 mb-2"
            >
              <span>Medicine Availability</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expanded && (
              <div className="space-y-1.5 mb-3">
                {prescribedMedicines.map((med, i) => (
                  <MedicineRow key={i} medicine={med} pharmacy={pharmacy} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2 border-t mt-2">
          {pharmacy.phone && (
            <a
              href={`tel:${pharmacy.phone}`}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-center hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
          )}
          {pharmacy.location?.lat && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.location.lat},${pharmacy.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm text-center flex items-center justify-center gap-1 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" /> Directions
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inner page ─────────────────────────────────────────────────────────────
function PharmacyPageInner() {
  const [searchTerm, setSearchTerm]     = useState("");
  const [pharmacies, setPharmacies]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [showNearMe, setShowNearMe]     = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [filterOpen, setFilterOpen]     = useState(false);
  const searchParams                    = useSearchParams();

  // Medicines from prescription (comma-separated in ?medicines=)
  const prescribedMedicines = (searchParams.get("medicines") || "")
    .split(",")
    .map(m => m.trim())
    .filter(Boolean);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {}
    );
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token   = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const res = await fetch(`${API}/api/pharmacies`, { headers });
        if (res.ok) {
          const data = await res.json();
          setPharmacies(data.pharmacies || []);
        } else {
          setError("Failed to load pharmacies.");
        }
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const distanceLabel = (pharm) => {
    if (!userLocation || !pharm.location?.lat) return null;
    const km = haversineKm(userLocation.lat, userLocation.lng, pharm.location.lat, pharm.location.lng);
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  };

  // Score: number of prescribed medicines available
  const availabilityScore = (pharm) =>
    prescribedMedicines.filter(med =>
      pharm.medicines?.some(m => m.name?.toLowerCase() === med.toLowerCase())
    ).length;

  const filteredPharmacies = pharmacies
    .filter((p) => {
      const q = searchTerm.toLowerCase();
      const nameOk = !q ||
        p.pharmacyName?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        (p.medicines || []).some((m) => m.name?.toLowerCase().includes(q));
      const openOk = !filterOpen || p.isOpen;
      return nameOk && openOk;
    })
    // Sort: pharmacies with most prescription coverage first
    .sort((a, b) => availabilityScore(b) - availabilityScore(a));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-green-600">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-lg font-medium">Loading pharmacies…</p>
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
        <NearMeModal onClose={() => setShowNearMe(false)} pharmacies={pharmacies} />
      )}

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pharmacies</h1>
            <p className="text-gray-600">Find pharmacies and check medicine availability near you</p>
          </div>

          {/* Prescription banner */}
          {prescribedMedicines.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Pill className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">Prescribed Medicines</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {prescribedMedicines.map((med, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-semibold border border-white/30">
                    💊 {med}
                  </span>
                ))}
              </div>
              <p className="text-green-100 text-xs mt-3">
                Pharmacies are sorted by how many of your prescribed medicines they carry.
              </p>
            </div>
          )}

          {/* Search + Near Me */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by pharmacy name, address, or medicine…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-base"
                />
              </div>
              <button
                onClick={() => setShowNearMe(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all flex items-center gap-2 font-semibold shadow-md"
              >
                <Navigation className="w-5 h-5" /> Near Me
              </button>
            </div>
            <div className="flex gap-3">
              {[
                { label: "🏥 All Pharmacies", value: false },
                { label: "✅ Open Now",        value: true  },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setFilterOpen(value)}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                    filterOpen === value
                      ? "bg-gradient-to-r from-green-600 to-teal-600 text-white border-transparent"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          {filteredPharmacies.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-16 text-center">
              <ShoppingBag className="w-20 h-20 text-green-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {pharmacies.length === 0 ? "No Pharmacies Yet" : "No Results Found"}
              </h3>
              <p className="text-gray-400 mb-6">
                {pharmacies.length === 0
                  ? "Pharmacies appear once they register in the system."
                  : "Try adjusting your search or filter."}
              </p>
              <button
                onClick={() => setShowNearMe(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold inline-flex items-center gap-2 shadow-md"
              >
                <Navigation className="w-5 h-5" /> Find Nearby Pharmacies on Map
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredPharmacies.map((pharm, i) => (
                <PharmacyCard
                  key={pharm._id}
                  pharmacy={pharm}
                  prescribedMedicines={prescribedMedicines}
                  distanceLabel={distanceLabel}
                  rank={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function PharmacyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    }>
      <PharmacyPageInner />
    </Suspense>
  );
}