"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Phone, Clock, Star, Beaker, Navigation, Loader2,
  AlertCircle, X, MapPin, CheckCircle, XCircle, ChevronDown, ChevronUp,
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

// ─── Near Me Modal ──────────────────────────────────────────────────────────
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

      const labIcon = L.divIcon({
        className: "",
        html: `<div style="width:34px;height:34px;background:#7c3aed;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.35);font-size:16px">🔬</div>`,
        iconSize: [34,34], iconAnchor: [17,17],
      });
      laboratories.filter(l => l.location?.lat && l.location?.lng).forEach(lab => {
        const dist = haversineKm(userLat, userLng, lab.location.lat, lab.location.lng).toFixed(1);
        L.marker([lab.location.lat, lab.location.lng], { icon: labIcon })
          .addTo(map)
          .bindPopup(`<div style="min-width:180px;font-family:sans-serif;line-height:1.6">
            <strong style="font-size:14px">${lab.labName}</strong><br/>
            ${lab.address ? `<span style="color:#6b7280;font-size:12px">${lab.address}</span><br/>` : ""}
            <span style="color:#7c3aed;font-weight:700;font-size:13px">📍 ${dist} km away</span>
            ${lab.phone ? `<br/><span style="font-size:12px">📞 ${lab.phone}</span>` : ""}
            ${lab.homeCollection ? `<br/><span style="color:#059669;font-size:12px;font-weight:600">🏠 Home Collection</span>` : ""}
            ${lab.rating ? `<br/><span style="color:#f59e0b;font-size:12px">⭐ ${lab.rating}</span>` : ""}
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
            <Navigation className="w-5 h-5 text-purple-600" /> Laboratories Near You
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="relative" style={{ height: 460 }}>
          {status === "locating" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-purple-600 bg-white z-10">
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

// ─── Test Availability Row ──────────────────────────────────────────────────
function TestRow({ testName, labTests, lab }) {
  const matchedTest = labTests.find(
    (t) => t.name?.toLowerCase() === testName.toLowerCase()
  );
  const testId  = matchedTest?._id || matchedTest?.id;
  const price   = testId ? lab.prices?.[testId] : null;
  const offered = price != null;

  const getFinalPrice = (p, discount = 0) => Math.round(p - (p * discount) / 100);

  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
      offered ? "bg-purple-50 border border-purple-200" : "bg-red-50 border border-red-200"
    }`}>
      <div className="flex items-center gap-2">
        {offered
          ? <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
          : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
        <span className={`font-medium ${offered ? "text-purple-800" : "text-red-700"}`}>
          {testName}
        </span>
      </div>
      {offered
        ? <div className="flex items-center gap-1.5 shrink-0">
            {(lab.discount || 0) > 0 && (
              <span className="text-xs text-red-400 line-through">Rs. {price}</span>
            )}
            <span className="font-bold text-purple-700">
              Rs. {getFinalPrice(price, lab.discount)}
            </span>
            {(lab.discount || 0) > 0 && (
              <span className="text-xs text-green-600 font-semibold">{lab.discount}% off</span>
            )}
          </div>
        : <span className="text-red-500 font-medium shrink-0 text-xs">Not Available</span>}
    </div>
  );
}

// ─── Lab Card ───────────────────────────────────────────────────────────────
function LabCard({ lab, prescribedTests, labTests, distanceLabel, rank }) {
  const [expanded, setExpanded] = useState(rank === 0);

  const availableCount = prescribedTests.filter(test => {
    const matched = labTests.find(t => t.name?.toLowerCase() === test.toLowerCase());
    const testId  = matched?._id || matched?.id;
    return testId && lab.prices?.[testId] != null;
  }).length;
  const totalCount     = prescribedTests.length;
  const hasPrescription = totalCount > 0;

  const dist = distanceLabel(lab);

  return (
    <div className={`bg-white rounded-xl shadow-md border-2 transition-all hover:shadow-lg ${
      rank === 0 && hasPrescription
        ? "border-purple-500 ring-4 ring-purple-100"
        : "border-gray-200 hover:border-purple-300"
    }`}>
      {rank === 0 && hasPrescription && (
        <div className="px-5 pt-4">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
            <CheckCircle className="w-3 h-3" /> Best Match — Most Tests Available
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-purple-100 rounded-lg shrink-0">
              <Beaker className="w-5 h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{lab.labName}</h3>
              {lab.address && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{lab.address}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {dist && <span className="text-xs font-bold text-purple-600">📍 {dist}</span>}
            {lab.rating && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                <Star className="w-3 h-3 inline mr-0.5" />{lab.rating}
              </span>
            )}
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-3">
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
          {lab.openHours && (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
              🕐 {lab.openHours}
            </span>
          )}
        </div>

        {/* Coverage summary */}
        {hasPrescription && (
          <div className={`mb-3 px-4 py-2.5 rounded-lg border flex items-center justify-between ${
            availableCount === totalCount
              ? "bg-purple-50 border-purple-200"
              : availableCount > 0
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
          }`}>
            <span className="text-sm font-semibold text-gray-700">Prescription Coverage</span>
            <span className={`text-sm font-bold ${
              availableCount === totalCount
                ? "text-purple-700"
                : availableCount > 0
                ? "text-yellow-700"
                : "text-red-600"
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
              className="w-full flex items-center justify-between text-sm font-medium text-gray-600 hover:text-purple-700 transition-colors py-1 mb-2"
            >
              <span>Test Availability & Prices</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
        <div className="flex gap-2 pt-2 border-t mt-2">
          {lab.phone && (
            <a
              href={`tel:${lab.phone}`}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-center hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
          )}
          {lab.location?.lat && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lab.location.lat},${lab.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm text-center flex items-center justify-center gap-1 transition-colors"
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
  blood: { label: "Blood Tests",  emoji: "🩸", bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    badge: "bg-red-100 text-red-700" },
  urine: { label: "Urine Tests",  emoji: "🧪", bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700" },
  other: { label: "Other Tests",  emoji: "🔬", bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-700" },
};

// ─── Inner page ─────────────────────────────────────────────────────────────
function LaboratoryPageInner() {
  const [searchTerm, setSearchTerm]     = useState("");
  const [laboratories, setLaboratories] = useState([]);
  const [labTests, setLabTests]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [showNearMe, setShowNearMe]     = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const searchParams                    = useSearchParams();

  // Parse tests from URL: supports both formats:
  //   ?tests=blood:CBC,blood:Hemoglobin,urine:Urinalysis   (typed)
  //   ?tests=CBC,Urinalysis                                  (legacy flat)
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

  // Only keep explicitly typed tests (blood/urine) — drop symptoms/conditions
  const prescribedTestNames = prescribedTests
    .filter(t => t.type === "blood" || t.type === "urine")
    .map(t => t.name);

  // Groups for the banner — only blood and urine
  const testGroups = ["blood", "urine"].map(type => ({
    type,
    tests: prescribedTests.filter(t => t.type === type),
  })).filter(g => g.tests.length > 0);

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
        const [testsRes, labsRes] = await Promise.all([
          fetch(`${API}/api/laboratories/tests`, { headers }),
          fetch(`${API}/api/laboratories`,        { headers }),
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

  const distanceLabel = (lab) => {
    if (!userLocation || !lab.location?.lat) return null;
    const km = haversineKm(userLocation.lat, userLocation.lng, lab.location.lat, lab.location.lng);
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  };

  const coverageScore = (lab) =>
    prescribedTestNames.filter(test => {
      const matched = labTests.find(t => t.name?.toLowerCase() === test.toLowerCase());
      const testId  = matched?._id || matched?.id;
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
        <NearMeModal onClose={() => setShowNearMe(false)} laboratories={laboratories} />
      )}

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Laboratory Tests</h1>
            <p className="text-gray-600">Find and compare lab test prices near you</p>
          </div>

          {/* Prescription banner */}
          {prescribedTestNames.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Beaker className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">Prescribed Tests</h2>
              </div>

              <div className="space-y-3">
                {testGroups.map(({ type, tests }) => {
                  const cfg = TEST_TYPE_CONFIG[type];
                  return (
                    <div key={type}>
                      <p className="text-xs font-bold uppercase tracking-wider text-purple-200 mb-1.5">
                        {cfg.emoji} {cfg.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tests.map((t, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-semibold border border-white/30"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-purple-100 text-xs mt-4">
                Labs are sorted by how many of your prescribed tests they offer.
              </p>
            </div>
          )}

          {/* Search + Near Me */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by lab name or address…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 text-base"
                />
              </div>
              <button
                onClick={() => setShowNearMe(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 font-semibold shadow-md"
              >
                <Navigation className="w-5 h-5" /> Near Me
              </button>
            </div>
          </div>

          {/* Lab cards */}
          {filteredLabs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-16 text-center">
              <Beaker className="w-20 h-20 text-purple-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {laboratories.length === 0 ? "No Laboratories Yet" : "No Results Found"}
              </h3>
              <p className="text-gray-400 mb-6">
                {laboratories.length === 0
                  ? "Labs appear once they register in the system."
                  : "Try adjusting your search."}
              </p>
              <button
                onClick={() => setShowNearMe(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold inline-flex items-center gap-2 shadow-md"
              >
                <Navigation className="w-5 h-5" /> Find Nearby Labs on Map
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    }>
      <LaboratoryPageInner />
    </Suspense>
  );
}