"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface Point {
  lat: number;
  lng: number;
}

interface DriverMarker {
  uid: string;
  name: string;
  location: Point;
  type?: "bike" | "car" | "truck";
  status: string;
}

interface RealMapProps {
  pickup?: Point;
  drop?: Point;
  drivers?: DriverMarker[];
  activeRoute?: Point[]; // pre-stored route (used in tracking page)
  progress?: number;     // 0–1 vehicle progress along route
  onMapClick?: (point: Point, address: string) => void;
  interactive?: boolean;
  center?: Point;
  zoom?: number;
}

const DEFAULT_CENTER: Point = { lat: 28.6139, lng: 77.209 };

// Fetch real road route from OSRM (free, no API key, OpenStreetMap data)
async function fetchRoadRoute(from: Point, to: Point): Promise<Point[]> {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${from.lng},${from.lat};${to.lng},${to.lat}` +
      `?overview=full&geometries=geojson&steps=false`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("OSRM request failed");
    const data = await res.json();

    if (data.code !== "Ok" || !data.routes?.length) throw new Error("No route");

    // GeoJSON coordinates are [lng, lat] — flip to { lat, lng }
    return (data.routes[0].geometry.coordinates as [number, number][]).map(
      ([lng, lat]) => ({ lat, lng })
    );
  } catch {
    // Fallback: 8-point curved approximation if OSRM is unreachable
    const pts: Point[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const curve = Math.sin(t * Math.PI) * 0.004;
      pts.push({
        lat: from.lat + (to.lat - from.lat) * t + curve,
        lng: from.lng + (to.lng - from.lng) * t,
      });
    }
    return pts;
  }
}

export default function RealMap({
  pickup,
  drop,
  drivers = [],
  activeRoute = [],
  progress = 0,
  onMapClick,
  interactive = true,
  center = DEFAULT_CENTER,
  zoom = 13,
}: RealMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylineRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vehicleMarkerRef = useRef<any>(null);

  const [isClient, setIsClient] = useState(false);
  // Stores the OSRM-fetched road geometry
  const [roadRoute, setRoadRoute] = useState<Point[]>([]);
  const [routeLoading, setRouteLoading] = useState(false);

  // Always keep the latest onMapClick in a ref to avoid stale closures
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // Only run on client (Leaflet is browser-only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch real road route whenever pickup/drop changes
  useEffect(() => {
    if (!pickup || !drop) {
      setRoadRoute([]);
      return;
    }

    // If a pre-stored route exists (tracking page), use it and enrich via OSRM
    // For the booking page, fetch fresh from OSRM
    setRouteLoading(true);
    fetchRoadRoute(pickup, drop).then((pts) => {
      setRoadRoute(pts);
      setRouteLoading(false);
    });
  }, [pickup?.lat, pickup?.lng, drop?.lat, drop?.lng]);

  // Initialize Leaflet map ONCE
  useEffect(() => {
    if (!isClient || !mapRef.current) return;
    if (leafletMapRef.current) return;

    import("leaflet").then((L) => {
      // Fix default icon paths broken by Webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [center.lat, center.lng],
        zoom,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        attributionControl: true,
      });

      // CartoDB Dark Matter tiles — free, no API key
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      // Click handler — reads latest callback via ref (no stale closure)
      if (interactive) {
        map.on("click", async (e: any) => {
          const cb = onMapClickRef.current;
          if (!cb) return;
          const { lat, lng } = e.latlng;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
              { headers: { "Accept-Language": "en" } }
            );
            const data = await res.json();
            const address =
              data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            cb({ lat, lng }, address);
          } catch {
            cb({ lat, lng }, `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`);
          }
        });
      }

      leafletMapRef.current = map;
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  // Redraw markers and route whenever props or fetched route changes
  useEffect(() => {
    if (!isClient || !leafletMapRef.current) return;

    import("leaflet").then((L) => {
      const map = leafletMapRef.current;
      if (!map) return;

      // Clear previous overlays
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.remove();
        vehicleMarkerRef.current = null;
      }

      const bounds: [number, number][] = [];

      // Pickup pin (blue teardrop)
      if (pickup) {
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:40px;height:52px;">
              <div style="
                width:30px;height:30px;border-radius:50% 50% 50% 0;
                background:#3b82f6;border:3px solid #fff;
                transform:rotate(-45deg);
                box-shadow:0 4px 18px rgba(59,130,246,0.85);
                position:absolute;bottom:0;left:5px;
              "></div>
              <div style="
                position:absolute;top:0;left:50%;transform:translateX(-50%);
                background:#3b82f6;color:#fff;padding:2px 7px;border-radius:999px;
                font-size:9px;font-weight:800;white-space:nowrap;letter-spacing:0.06em;
                box-shadow:0 1px 6px rgba(0,0,0,0.35);
              ">PICKUP</div>
            </div>`,
          iconSize: [40, 52],
          iconAnchor: [20, 52],
          popupAnchor: [0, -54],
        });
        const m = L.marker([pickup.lat, pickup.lng], { icon }).addTo(map);
        markersRef.current.push(m);
        bounds.push([pickup.lat, pickup.lng]);
      }

      // Drop pin (orange teardrop)
      if (drop) {
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:40px;height:52px;">
              <div style="
                width:30px;height:30px;border-radius:50% 50% 50% 0;
                background:#f97316;border:3px solid #fff;
                transform:rotate(-45deg);
                box-shadow:0 4px 18px rgba(249,115,22,0.85);
                position:absolute;bottom:0;left:5px;
              "></div>
              <div style="
                position:absolute;top:0;left:50%;transform:translateX(-50%);
                background:#f97316;color:#fff;padding:2px 7px;border-radius:999px;
                font-size:9px;font-weight:800;white-space:nowrap;letter-spacing:0.06em;
                box-shadow:0 1px 6px rgba(0,0,0,0.35);
              ">DROP</div>
            </div>`,
          iconSize: [40, 52],
          iconAnchor: [20, 52],
          popupAnchor: [0, -54],
        });
        const m = L.marker([drop.lat, drop.lng], { icon }).addTo(map);
        markersRef.current.push(m);
        bounds.push([drop.lat, drop.lng]);
      }

      // Decide which route geometry to draw:
      // Priority: OSRM road route > pre-stored activeRoute > straight line
      const routePts =
        roadRoute.length > 1
          ? roadRoute
          : activeRoute.length > 1
          ? activeRoute
          : pickup && drop
          ? [pickup, drop]
          : [];

      if (routePts.length >= 2) {
        const latlngs = routePts.map((p) => [p.lat, p.lng] as [number, number]);

        // Draw a subtle white shadow line for road feel
        L.polyline(latlngs, {
          color: "#fff",
          weight: 9,
          opacity: 0.12,
        }).addTo(map);

        // Main indigo route line
        polylineRef.current = L.polyline(latlngs, {
          color: "#6366f1",
          weight: 5,
          opacity: 0.95,
          lineJoin: "round",
          lineCap: "round",
        }).addTo(map);

        // Animated dashed overlay for direction feel
        L.polyline(latlngs, {
          color: "#a5b4fc",
          weight: 2.5,
          opacity: 0.7,
          dashArray: "10 14",
          lineCap: "round",
        }).addTo(map);
      }

      // Moving vehicle along route
      if (routePts.length >= 2 && progress > 0 && progress <= 1) {
        const totalPts = routePts.length;
        const rawIdx = progress * (totalPts - 1);
        const idx = Math.min(Math.floor(rawIdx), totalPts - 2);
        const frac = rawIdx - idx;
        const p1 = routePts[idx];
        const p2 = routePts[idx + 1];
        const vLat = p1.lat + (p2.lat - p1.lat) * frac;
        const vLng = p1.lng + (p2.lng - p1.lng) * frac;

        const vehicleIcon = L.divIcon({
          className: "",
          html: `<div style="
            width:38px;height:38px;border-radius:50%;
            background:#10b981;border:3px solid #fff;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 0 20px rgba(16,185,129,0.9),0 0 40px rgba(16,185,129,0.4);
            font-size:18px;line-height:1;
          ">🚗</div>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });
        vehicleMarkerRef.current = L.marker([vLat, vLng], {
          icon: vehicleIcon,
        }).addTo(map);
        bounds.push([vLat, vLng]);
      }

      // Driver markers (admin fleet view)
      drivers.forEach((driver) => {
        const isOnline = driver.status === "online";
        const emoji =
          driver.type === "bike" ? "🏍️" : driver.type === "truck" ? "🚛" : "🚕";
        const driverIcon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;">
              <div style="
                width:32px;height:32px;border-radius:50%;
                background:${isOnline ? "#10b981" : "#6b7280"};
                border:2px solid ${isOnline ? "#d1fae5" : "#e5e7eb"};
                display:flex;align-items:center;justify-content:center;
                box-shadow:0 2px 8px rgba(0,0,0,0.5);
                font-size:14px;
              ">${emoji}</div>
              <div style="
                position:absolute;top:-16px;left:50%;transform:translateX(-50%);
                background:rgba(0,0,0,0.8);color:#fff;padding:1px 5px;border-radius:4px;
                font-size:9px;font-weight:700;white-space:nowrap;
              ">${driver.name.split(" ")[0]}</div>
            </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        const m = L.marker([driver.location.lat, driver.location.lng], {
          icon: driverIcon,
        })
          .bindPopup(
            `<b>${driver.name}</b><br>Status: ${driver.status}<br>Type: ${
              driver.type || "car"
            }`
          )
          .addTo(map);
        markersRef.current.push(m);
        bounds.push([driver.location.lat, driver.location.lng]);
      });

      // Auto-fit bounds
      if (bounds.length >= 2) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 15);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, pickup, drop, drivers, activeRoute, progress, roadRoute]);

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[400px] rounded-2xl bg-gray-900 flex items-center justify-center border border-white/5">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Leaflet map container */}
      <div
        ref={mapRef}
        className="w-full h-full min-h-[400px]"
        style={{ zIndex: 0 }}
      />

      {/* Route loading indicator */}
      {routeLoading && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-950/90 backdrop-blur text-xs text-indigo-400 font-semibold px-4 py-2 rounded-full border border-indigo-500/30 flex items-center gap-2"
          style={{ zIndex: 1001 }}
        >
          <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin inline-block" />
          Fetching road route…
        </div>
      )}

      {/* Legend overlay */}
      <div
        className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-gray-950/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-300 pointer-events-none"
        style={{ zIndex: 1000 }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            Pickup
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
            Drop
          </span>
          {drivers.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Driver
            </span>
          )}
        </div>
        {interactive && (
          <div className="text-[10px] text-gray-400 font-mono hidden sm:block">
            1st click = Pickup &nbsp;·&nbsp; 2nd click = Drop
          </div>
        )}
      </div>
    </div>
  );
}
