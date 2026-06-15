"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Phone, Clock, Star, Beaker, Navigation, Loader2,
  AlertCircle, X, MapPin, CheckCircle, XCircle, ChevronDown, ChevronUp,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

// ─── Near Me Modal ──────────────────────────────────────────────────────────
function NearMeModal({ onClose, laboratories }) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [status, setStatus] = useState("locating");

  // Dismiss modal on Escape key down
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
      if (leafletMapRef.current || !mapRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current).setView([userLat, userLng], 13);
      leafletMapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors", maxZoom: 19,
      }).addTo(map);
      L.marker([userLat, userLng], {
        icon: L.divIcon({
          className: "",
          html: `<div style="width:18px;height:18px;background:#2563eb;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.2)"></div>`,
          iconSize: [18, 18], iconAnchor: [9, 9],
        }),
      }).addTo(map).bindPopup("<b>📍 Your Location</b>").openPopup();

      const labIcon = L.divIcon({
        className: "",
        html: `<div style="width:34px;height:34px;background:#2563eb;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.15);font-size:16px">🔬</div>`,
        iconSize: [34, 34], iconAnchor: [17, 17],
      });
      laboratories.filter(l => l.location?.lat && l.location?.lng).forEach(lab => {
        const dist = haversineKm(userLat, userLng, lab.location.lat, lab.location.lng).toFixed(1);
        L.marker([lab.location.lat, lab.location.lng], { icon: labIcon })
          .addTo(map)
          .bindPopup(`<div style="min-width:180px;font-family:sans-serif;line-height:1.6">
            <strong style="font-size:14px">${lab.labName}</strong><br/>
            ${lab.address ? `<span style="color:#6b7280;font-size:12px">${lab.address}</span><br/>` : ""}
            <span style="color:#2563eb;font-weight:700;font-size:13px">📍 ${dist} km away</span>
            ${lab.phone ? `<br/><span style="font-size:12px">📞 ${lab.phone}</span>` : ""}
            ${lab.homeCollection ? `<br/><span style="color:#16a34a;font-size:12px;font-weight:600">🏠 Home Collection</span>` : ""}
            ${lab.rating ? `<br/><span style="color:#d97706;font-size:12px">⭐ ${lab.rating}</span>` : ""}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" /> Laboratories Near You
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative" style={{ height: 460 }}>
          {status === "locating" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500 bg-white z-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Detecting your location…</p>
            </div>
          )}
          {status === "denied" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white z-10 p-8 text-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
              <p className="font-medium text-gray-900">Location Access Denied</p>
              <p className="text-xs text-gray-500">Please enable location permissions in your browser.</p>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Test Availability Row ──────────────────────────────────────────────────
function TestRow({ testName, labTests, lab }) {
  const matchedTest = labTests.find(
    (t) => t.name?.toLowerCase() === testName.toLowerCase()
  );
  const testId = matchedTest?._id || matchedTest?.id;
  const price = testId ? lab.prices?.[testId] : null;
  const offered = price != null;

  const getFinalPrice = (p, discount = 0) => Math.round(p - (p * discount) / 100);

  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border ${offered ? "bg-blue-50/50 border-blue-100 text-blue-900" : "bg-red-50/50 border-red-100 text-red-900"
      }`}>
      <div className="flex items-center gap-2 min-w-0">
        {offered
          ? <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
        <span className="font-medium truncate">{testName}</span>
      </div>
      {offered ? (
        <div className="flex items-center gap-1.5 shrink-0">
          {(lab.discount || 0) > 0 && (
            <span className="text-[10px] text-gray-400 line-through">Rs. {price}</span>
          )}
          <span className="font-semibold text-blue-700">
            Rs. {getFinalPrice(price, lab.discount)}
          </span>
          {(lab.discount || 0) > 0 && (
            <span className="text-[10px] text-green-600 font-medium">({lab.discount}% off)</span>
          )}
        </div>
      ) : (
        <span className="text-red-500 font-medium shrink-0 text-[11px]">Not Available</span>
      )}
    </div>
  );
}

// ─── Lab Card ───────────────────────────────────────────────────────────────
function LabCard({ lab, prescribedTests, labTests, distanceLabel, rank }) {
  const [expanded, setExpanded] = useState(rank === 0);

  const availableCount = prescribedTests.filter(test => {
    const matched = labTests.find(
      t => t.name?.toLowerCase() === test.toLowerCase()
    );
    const testId = matched?._id || matched?.id;
    return testId && lab.prices?.[testId] != null;
  }).length;
  const totalCount = prescribedTests.length;
  const hasPrescription = totalCount > 0;

  const dist = distanceLabel(lab);

  return (
    <div className={`bg-white rounded-xl border transition-all duration-200 ${rank === 0 && hasPrescription
      ? "border-blue-500 shadow-sm ring-1 ring-blue-500"
      : "border-gray-200 hover:border-gray-300 shadow-sm"
      }`}>
      {rank === 0 && hasPrescription && (
        <div className="px-4 pt-3.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
            <CheckCircle className="w-3 h-3" /> Best Match
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg shrink-0 mt-0.5">
              <Beaker className="w-4 h-4 text-gray-600" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">{lab.labName}</h3>
              {lab.address && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
                  <span className="truncate">{lab.address}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {dist && <span className="text-xs font-medium text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded">📍 {dist}</span>}
            {lab.rating && (
              <span className="text-[11px] text-amber-700 font-medium flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lab.rating}
              </span>
            )}
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {lab.homeCollection && (
            <span className="bg-gray-50 border border-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md text-[11px] font-medium">
              🏠 Home Collection
            </span>
          )}
          {lab.reportTime && (
            <span className="bg-gray-50 border border-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" /> {lab.reportTime}
            </span>
          )}
          {lab.openHours && (
            <span className="bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-0.5 rounded-md text-[11px]">
              🕐 {lab.openHours}
            </span>
          )}
        </div>

        {/* Coverage summary */}
        {hasPrescription && (
          <div className={`mb-3 px-3 py-2 rounded-lg border flex items-center justify-between text-xs ${availableCount === totalCount ? "bg-blue-50/30 border-blue-100" : availableCount > 0 ? "bg-amber-50/30 border-amber-100" : "bg-red-50/30 border-red-100"
            }`}>
            <span className="font-medium text-gray-600">Prescription Coverage</span>
            <span className={`font-semibold ${availableCount === totalCount ? "text-blue-700" : availableCount > 0 ? "text-amber-700" : "text-red-600"
              }`}>
              {availableCount} / {totalCount} tests
            </span>
          </div>
        )}

        {/* Toggle test list */}
        {hasPrescription && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors py-1 mb-2"
            >
              <span>Test Availability & Prices</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {expanded && (
              <div className="space-y-1.5 mb-3">
                {prescribedTests.map((test, i) => (
                  <TestRow key={i} testName={test} labTests={labTests} lab={lab} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-100 mt-2">
          {lab.phone && (
            <a
              href={`tel:${lab.phone}`}
              className="flex-1 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium text-center hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gray-400" /> Call
            </a>
          )}
          {lab.location?.lat && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lab.location.lat},${lab.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium text-center flex items-center justify-center gap-1 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" /> Directions
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Test type config ────────────────────────────────────────────────────────
const TEST_TYPE_CONFIG = {
  blood: { label: "Blood Tests", emoji: "🩸" },
  urine: { label: "Urine Tests", emoji: "🧪" },
  other: { label: "Other Tests", emoji: "🔬" },
};

// ─── Inner page ─────────────────────────────────────────────────────────────
function LaboratoryPageInner() {
  const [searchTerm, setSearchTerm] = useState("");
  const [laboratories, setLaboratories] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNearMe, setShowNearMe] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const searchParams = useSearchParams();

  const rawTests = (searchParams.get("tests") || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  const prescribedTests = rawTests.map(t => {
    const colonIdx = t.indexOf(":");
    if (colonIdx !== -1) {
      const type = t.slice(0, colonIdx).toLowerCase();
      const name = t.slice(colonIdx + 1);
      return { type: ["blood", "urine"].includes(type) ? type : "other", name };
    }
    return { type: "other", name: t };
  });

  const prescribedTestNames = prescribedTests
    .filter(t => t.type === "blood" || t.type === "urine")
    .map(t => t.name);

  const testGroups = ["blood", "urine"].map(type => ({
    type,
    tests: prescribedTests.filter(t => t.type === type),
  })).filter(g => g.tests.length > 0);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => { }
    );
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const [testsRes, labsRes] = await Promise.all([
          fetch(`${API}/api/laboratory/tests`, { headers }),
          fetch(`${API}/api/laboratory`, { headers }),
        ]);
        if (!isMounted) return;
        if (testsRes.ok) setLabTests((await testsRes.json()).tests || []);
        if (labsRes.ok) setLaboratories((await labsRes.json()).laboratories || []);
      } catch {
        if (isMounted) setError("Could not connect to server.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const distanceLabel = (lab) => {
    if (!userLocation || !lab.location?.lat) return null;
    const km = haversineKm(userLocation.lat, userLocation.lng, lab.location.lat, lab.location.lng);
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  };

  const coverageScore = (lab) =>
    prescribedTestNames.filter(test => {
      const matched = labTests.find(t => t.name?.toLowerCase() === test.toLowerCase());
      const testId = matched?._id || matched?.id;
      return testId && lab.prices?.[testId] != null;
    }).length;

  const filteredLabs = laboratories
    .filter((lab) => {
      const q = searchTerm.toLowerCase();
      return !q ||
        lab.labName?.toLowerCase().includes(q) ||
        lab.address?.toLowerCase().includes(q);
    })
    .sort((a, b) => coverageScore(b) - coverageScore(a));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-2 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading laboratory data…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-2 text-red-500">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    </div>
  );

  return (
    <>
      {showNearMe && (
        <NearMeModal onClose={() => setShowNearMe(false)} laboratories={laboratories} />
      )}

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Laboratory Tests</h1>
            <p className="text-sm text-gray-500 mt-1">Find and compare lab test prices near you</p>
          </div>

          {/* Prescription banner */}
          {prescribedTestNames.length > 0 && (
            <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                <Beaker className="w-4 h-4 text-blue-600" />
                <h2 className="font-semibold text-sm text-gray-900">Prescribed Tests</h2>
              </div>

              <div className="space-y-3">
                {testGroups.map(({ type, tests }) => {
                  const cfg = TEST_TYPE_CONFIG[type];
                  return (
                    <div key={type} className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                        {cfg?.emoji} {cfg?.label}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {tests.map((t, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-800 shadow-sm"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-gray-400 text-[11px] mt-3 italic">
                * Laboratories match sorted by available items in your record.
              </p>
            </div>
          )}

          {/* Search + Near Me */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by lab name or address…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm placeholder:text-gray-400 transition-all"
                />
              </div>
              <button
                onClick={() => setShowNearMe(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 font-medium text-sm shadow-sm"
              >
                <Navigation className="w-4 h-4" /> Near Me
              </button>
            </div>
          </div>

          {/* Lab cards */}
          {filteredLabs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <Beaker className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {laboratories.length === 0 ? "No Laboratories Yet" : "No Results Found"}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {laboratories.length === 0
                  ? "Labs appear once they register in the system."
                  : "Try adjusting your search criteria."}
              </p>
              <button
                onClick={() => setShowNearMe(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium inline-flex items-center gap-1.5 text-sm shadow-sm"
              >
                <Navigation className="w-4 h-4" /> Find Nearby Labs on Map
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredLabs.map((lab, i) => (
                <LabCard
                  key={lab._id}
                  lab={lab}
                  prescribedTests={prescribedTestNames}
                  labTests={labTests}
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

export default function LaboratoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <LaboratoryPageInner />
    </Suspense>
  );
}