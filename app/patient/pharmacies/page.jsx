"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Phone, MapPin, Navigation, Loader2, AlertCircle,
  X, Pill, ShoppingBag, CheckCircle, XCircle, ChevronDown, ChevronUp,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
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
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [status, setStatus] = useState("locating");

  useEffect(() => {
    if (!navigator.geolocation) { setStatus("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => initLeafletMap(pos.coords.latitude, pos.coords.longitude),
      () => setStatus("denied"),
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
          iconSize: [18, 18], iconAnchor: [9, 9],
        }),
      }).addTo(map).bindPopup("<b>📍 Your Location</b>").openPopup();

      const pharmIcon = L.divIcon({
        className: "",
        html: `<div style="width:34px;height:34px;background:#16a34a;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.35);font-size:16px">💊</div>`,
        iconSize: [34, 34], iconAnchor: [17, 17],
      });
      pharmacies.filter(p => p.location?.lat && p.location?.lng).forEach(pharm => {
        const dist = haversineKm(userLat, userLng, parseFloat(pharm.location.lat), parseFloat(pharm.location.lng)).toFixed(1);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b bg-slate-50">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Navigation className="w-5 h-5 text-blue-600" /> Pharmacies Near You
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200 transition-colors text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="relative" style={{ height: 460 }}>
          {status === "locating" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 text-sm font-medium bg-white z-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-1" />
              <span>Detecting your location…</span>
            </div>
          )}
          {status === "denied" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10 p-8 text-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
              <p className="font-bold text-lg text-slate-800">Location Access Denied</p>
              <p className="text-sm text-slate-400 max-w-xs">Please enable location permissions in your browser settings to see nearby labs.</p>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full bg-slate-50 relative z-0" />
        </div>
      </div>
    </div>
  );
}

// ─── Medicine Availability Row ──────────────────────────────────────────────
function MedicineRow({ medicine, pharmacy }) {
  const found = pharmacy.medicines?.find(
    (m) => m.name?.toLowerCase() === medicine.toLowerCase()
  );
  return (
    <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${found ? "bg-blue-50/60 border border-blue-100" : "bg-red-50/60 border border-red-100"
      }`}>
      <div className="flex items-center gap-2 min-w-0">
        {found
          ? <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
          : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
        <span className={`font-medium truncate ${found ? "text-blue-900" : "text-red-700"}`}>
          {medicine}
        </span>
      </div>
      {found
        ? <span className="font-bold text-blue-700 shrink-0 ml-2">
          {found.price ? `Rs. ${found.price}` : "In Stock"}
        </span>
        : <span className="text-red-500 font-semibold shrink-0 text-xs bg-red-100/50 px-2 py-0.5 rounded">Not Available</span>}
    </div>
  );
}

// ─── Pharmacy Card ──────────────────────────────────────────────────────────
function PharmacyCard({ pharmacy, prescribedMedicines, distanceLabel, rank }) {
  const [expanded, setExpanded] = useState(rank === 0);

  const availableCount = prescribedMedicines.filter(med =>
    pharmacy.medicines?.some(m => m.name?.toLowerCase() === med.toLowerCase())
  ).length;
  const totalCount = prescribedMedicines.length;
  const hasPrescription = totalCount > 0;

  const dist = distanceLabel(pharmacy);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md ${rank === 0 && hasPrescription
        ? "border-blue-500 ring-4 ring-blue-50"
        : "border-slate-200 hover:border-blue-300"
      }`}>
      {rank === 0 && hasPrescription && (
        <div className="px-5 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            <CheckCircle className="w-3.5 h-3.5" /> Best Match — Most Medicines Available
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl shrink-0">
              <Pill className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-base md:text-lg leading-snug truncate">
                {pharmacy.pharmacyName}
              </h3>
              {pharmacy.address && (
                <p className="text-xs md:text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{pharmacy.address}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${pharmacy.isOpen
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
              }`}>
              {pharmacy.isOpen ? "🟢 Open" : "❌ Closed"}
            </span>
            {dist && (
              <span className="text-xs font-bold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100">📍 {dist}</span>
            )}
          </div>
        </div>

        {hasPrescription && (
          <div className={`mb-4 px-4 py-3 rounded-xl border flex items-center justify-between ${availableCount === totalCount
              ? "bg-emerald-50/60 border-emerald-200"
              : availableCount > 0
                ? "bg-amber-50/60 border-amber-200"
                : "bg-red-50/60 border-red-200"
            }`}>
            <span className="text-xs md:text-sm font-semibold text-slate-700">
              Prescription Coverage
            </span>
            <span className={`text-xs md:text-sm font-bold px-2.5 py-0.5 rounded-full ${availableCount === totalCount
                ? "text-emerald-800 bg-emerald-100"
                : availableCount > 0
                  ? "text-amber-800 bg-amber-100"
                  : "text-red-700 bg-red-100"
              }`}>
              {availableCount} / {totalCount} medicines
            </span>
          </div>
        )}

        {hasPrescription && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between text-xs md:text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors py-1 mb-2 border-t pt-2"
            >
              <span>Medicine Availability</span>
              {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {expanded && (
              <div className="space-y-1.5 mb-4 max-h-48 overflow-y-auto pr-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {prescribedMedicines.map((med, i) => (
                  <MedicineRow key={i} medicine={med} pharmacy={pharmacy} />
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex gap-2 pt-3 border-t mt-2">
          {pharmacy.phone && (
            <a
              href={`tel:${pharmacy.phone}`}
              className="flex-1 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-center hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all text-slate-700"
            >
              <Phone className="w-4 h-4 text-slate-500" /> Call
            </a>
          )}
          {pharmacy.location?.lat && pharmacy.location?.lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.location.lat},${pharmacy.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-sm font-medium text-center flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-blue-200"
            >
              <Navigation className="w-4 h-4" /> Directions
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inner page ─────────────────────────────────────────────────────────────
function PharmacyPageInner() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNearMe, setShowNearMe] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchParams = useSearchParams();

  const prescribedMedicines = (searchParams.get("medicines") || "")
    .split(",")
    .map(m => m.trim())
    .filter(Boolean);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => { }
    );
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
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
    if (!userLocation || !pharm.location?.lat || !pharm.location?.lng) return null;
    const pLat = parseFloat(pharm.location.lat);
    const pLng = parseFloat(pharm.location.lng);
    if (isNaN(pLat) || isNaN(pLng)) return null;

    const km = haversineKm(userLocation.lat, userLocation.lng, pLat, pLng);
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  };

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
    .sort((a, b) => availabilityScore(b) - availabilityScore(a));

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-slate-50 to-indigo-50/20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-slate-400 text-sm font-medium">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-1" />
        <span>Loading pharmacies…</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-slate-50 to-indigo-50/20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-red-500 p-6 bg-white rounded-2xl border border-red-100 shadow-xl max-w-md text-center">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-base font-bold text-slate-800">{error}</p>
        <p className="text-xs text-slate-400 leading-relaxed">Please make sure the server backend is running properly and try again.</p>
      </div>
    </div>
  );

  return (
    <>
      {showNearMe && (
        <NearMeModal onClose={() => setShowNearMe(false)} pharmacies={pharmacies} />
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-slate-50 to-indigo-50/20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Pharmacies</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">Find reliable pharmacies and check digital medicine inventory near you</p>
          </div>

          {prescribedMedicines.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-md border border-blue-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/10 backdrop-blur rounded-xl border border-white/10">
                  <Pill className="w-5 h-5 text-blue-100" />
                </div>
                <h2 className="font-bold text-lg">Prescribed Medicines</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {prescribedMedicines.map((med, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs md:text-sm font-semibold border border-white/20 shadow-sm">
                    💊 {med}
                  </span>
                ))}
              </div>
              <p className="text-blue-100 text-xs mt-4 font-medium opacity-90">
                💡 Pharmacies are automatically organized by the amount of your prescribed stock coverage.
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 md:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pharmacy name, area address, or medicines…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 text-sm md:text-base font-medium transition-all bg-slate-50/50 text-slate-800"
                />
              </div>
              <button
                onClick={() => setShowNearMe(true)}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 font-semibold shadow-sm shadow-blue-200 text-sm md:text-base whitespace-nowrap"
              >
                <Navigation className="w-5 h-5" /> Near Me Map
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { label: "🏥 All Pharmacies", value: false },
                { label: "🟢 Open Now", value: true },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setFilterOpen(value)}
                  className={`px-4 py-2 rounded-full border text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${filterOpen === value
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filteredPharmacies.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-12 md:p-16 text-center shadow-sm">
              <ShoppingBag className="w-12 h-12 text-blue-200 mx-auto mb-3" />
              <h3 className="text-lg md:text-xl font-bold text-slate-700 mb-1">
                {pharmacies.length === 0 ? "No Pharmacies Registered" : "No Match Found"}
              </h3>
              <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                {pharmacies.length === 0
                  ? "Pharmacies will display once they complete onboarding inside the medical network."
                  : "Try checking spelling or adjusting the filters to discover more shops."}
              </p>
              <button
                onClick={() => setShowNearMe(true)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold inline-flex items-center gap-2 text-sm border border-slate-200 transition-colors"
              >
                <Navigation className="w-4 h-4" /> Open Search Area Map
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-slate-50 to-indigo-50/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <PharmacyPageInner />
    </Suspense>
  );
}