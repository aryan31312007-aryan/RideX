"use client";

import React, { useRef, useEffect, useState } from "react";

interface Point {
  lat: number;
  lng: number;
}

interface MapCanvasProps {
  pickup?: Point;
  drop?: Point;
  drivers?: Array<{
    uid: string;
    name: string;
    location: Point;
    type: "bike" | "car" | "truck";
    status: string;
  }>;
  activeRoute?: Point[];
  progress?: number; // 0 to 1 along the route
  onMapClick?: (point: Point, address: string) => void;
  interactive?: boolean;
}

// Convert coordinates (lat: 28.5 to 28.7, lng: 77.1 to 77.3 - Delhi NCR bounds by default) to canvas X/Y
const bounds = {
  minLat: 28.55,
  maxLat: 28.67,
  minLng: 77.10,
  maxLng: 77.30
};

export default function MapCanvas({
  pickup,
  drop,
  drivers = [],
  activeRoute = [],
  progress = 0,
  onMapClick,
  interactive = true
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tick, setTick] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.parentElement?.getBoundingClientRect();
        setDimensions({
          width: rect?.width || 600,
          height: rect?.height || 400
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getXY = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * dimensions.width;
    const y = dimensions.height - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * dimensions.height;
    return { x, y };
  };

  const getLatLng = (x: number, y: number) => {
    const lng = bounds.minLng + (x / dimensions.width) * (bounds.maxLng - bounds.minLng);
    const lat = bounds.minLat + ((dimensions.height - y) / dimensions.height) * (bounds.maxLat - bounds.minLat);
    return { lat, lng };
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = "#0c101d";
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Draw grid mesh (street network simulator)
    ctx.strokeStyle = "rgba(99, 102, 241, 0.05)";
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    
    // Vertical grid lines
    for (let x = 0; x < dimensions.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, dimensions.height);
      ctx.stroke();
    }
    // Horizontal grid lines
    for (let y = 0; y < dimensions.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(dimensions.width, y);
      ctx.stroke();
    }

    // Draw city parks (blocks of green)
    ctx.fillStyle = "rgba(16, 185, 129, 0.03)";
    ctx.fillRect(gridSpacing * 2, gridSpacing * 2, gridSpacing * 3, gridSpacing * 2);
    ctx.fillRect(gridSpacing * 7, gridSpacing * 5, gridSpacing * 2, gridSpacing * 3);
    ctx.fillRect(gridSpacing * 1, gridSpacing * 7, gridSpacing * 4, gridSpacing * 1.5);

    // Draw city river (blue wavy line)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    for (let x = 0; x < dimensions.width; x += 10) {
      const y = dimensions.height * 0.4 + Math.sin(x * 0.01) * 30;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw major arterial roads (thicker dark-blue highways)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 3;
    
    // Main diagonal highway
    ctx.beginPath();
    ctx.moveTo(0, dimensions.height * 0.1);
    ctx.lineTo(dimensions.width, dimensions.height * 0.9);
    ctx.stroke();

    // Loop highway
    ctx.beginPath();
    ctx.arc(dimensions.width / 2, dimensions.height / 2, Math.min(dimensions.width, dimensions.height) * 0.35, 0, Math.PI * 2);
    ctx.stroke();

    // Draw active route path (if any)
    if (activeRoute.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "#4f46e5"; // Indigo route
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#4f46e5";

      const start = getXY(activeRoute[0].lat, activeRoute[0].lng);
      ctx.moveTo(start.x, start.y);

      for (let i = 1; i < activeRoute.length; i++) {
        const pt = getXY(activeRoute[i].lat, activeRoute[i].lng);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;

      // Draw dashed flow overlay animating along route
      ctx.beginPath();
      ctx.strokeStyle = "#a5b4fc";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 12]);
      ctx.lineDashOffset = -Date.now() * 0.02; // Moving effect
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < activeRoute.length; i++) {
        const pt = getXY(activeRoute[i].lat, activeRoute[i].lng);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash
    }

    // Draw dynamic delivery animation (moving vehicle along route)
    if (activeRoute.length > 1 && progress > 0 && progress < 1) {
      // Find current segment depending on progress
      const totalPoints = activeRoute.length;
      const targetIdx = Math.min(Math.floor(progress * (totalPoints - 1)), totalPoints - 2);
      const segmentProgress = (progress * (totalPoints - 1)) - targetIdx;

      const pt1 = getXY(activeRoute[targetIdx].lat, activeRoute[targetIdx].lng);
      const pt2 = getXY(activeRoute[targetIdx + 1].lat, activeRoute[targetIdx + 1].lng);

      const vehicleX = pt1.x + (pt2.x - pt1.x) * segmentProgress;
      const vehicleY = pt1.y + (pt2.y - pt1.y) * segmentProgress;

      // Draw active vehicle glowing circle
      ctx.beginPath();
      ctx.arc(vehicleX, vehicleY, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981"; // Emerald green
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#10b981";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw direction pointer arrow inside
      const angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.moveTo(vehicleX + Math.cos(angle) * 8, vehicleY + Math.sin(angle) * 8);
      ctx.lineTo(vehicleX + Math.cos(angle + 2.5) * 6, vehicleY + Math.sin(angle + 2.5) * 6);
      ctx.lineTo(vehicleX + Math.cos(angle - 2.5) * 6, vehicleY + Math.sin(angle - 2.5) * 6);
      ctx.closePath();
      ctx.fill();
    }

    // Draw drivers wandering map
    drivers.forEach((driver) => {
      const { x, y } = getXY(driver.location.lat, driver.location.lng);
      const isOnline = driver.status === "online";

      // Draw halo
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = isOnline ? "rgba(16, 185, 129, 0.2)" : "rgba(107, 114, 128, 0.2)";
      ctx.fill();

      // Draw driver dot
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = isOnline ? "#10b981" : "#6b7280";
      ctx.strokeStyle = "#0c101d";
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Simple label
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "9px monospace";
      ctx.fillText(driver.name.split(" ")[0], x - 12, y - 8);
    });

    // Draw Pickup Pin (Blue)
    if (pickup) {
      const p = getXY(pickup.lat, pickup.lng);
      // Ring pulse
      const pulseSize = 12 + Math.sin(Date.now() * 0.007) * 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pin base
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Text label
      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("PICKUP", p.x + 10, p.y + 3);
    }

    // Draw Drop Pin (Red/Orange)
    if (drop) {
      const d = getXY(drop.lat, drop.lng);
      // Ring pulse
      const pulseSize = 12 + Math.cos(Date.now() * 0.007) * 4;
      ctx.beginPath();
      ctx.arc(d.x, d.y, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(249, 115, 22, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pin base
      ctx.beginPath();
      ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#f97316";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Text label
      ctx.fillStyle = "#f97316";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("DROP", d.x + 10, d.y + 3);
    }
  }, [dimensions, pickup, drop, drivers, activeRoute, progress, tick]);

  // Tick-based animation loop — updates state every 50ms to re-trigger canvas draw
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || !onMapClick) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const coords = getLatLng(x, y);
    
    // Generate mock address based on click location
    const sectors = ["Connaught Place", "Saket", "Noida Sector 62", "Gurugram Phase 3", "Vasant Kunj", "Karol Bagh", "Dwarka Sector 10"];
    const block = Math.floor(coords.lat * 100) % 10 + 1;
    const sector = sectors[Math.floor((coords.lat + coords.lng) * 150) % sectors.length];
    const address = `H-No. ${block * 25}, ${sector}, New Delhi, NCR`;

    onMapClick(coords, address);
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-gray-900 shadow-2xl map-canvas-container flex flex-col min-h-[300px]">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleClick}
        className={`w-full flex-1 ${interactive ? "cursor-crosshair" : "cursor-default"}`}
      />
      
      {/* Legend / Hover Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-gray-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5 text-xs text-gray-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Pickup
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Drop
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Driver (Online)
          </span>
        </div>
        
        {interactive && (
          <div className="text-[10px] text-gray-400 font-mono hidden sm:block">
            Click map to specify pin locations
          </div>
        )}
      </div>
    </div>
  );
}
