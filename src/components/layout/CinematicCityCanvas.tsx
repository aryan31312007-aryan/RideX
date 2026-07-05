"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, ChevronRight, ChevronLeft, Sparkles, Navigation, Shield, Award, Star } from "lucide-react";

interface StoryStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  telemetry: string;
}

const STORY_STEPS: StoryStep[] = [
  {
    id: 1,
    title: "Request Initiated",
    subtitle: "Rider requests dispatch",
    description: "A customer triggers an AI booking request from Aerocity Terminal 3 to Cyber City Phase II.",
    telemetry: "PING: DISPATCH_REQUEST | TARGET: TERMINAL_3 | LATENCY: 8ms"
  },
  {
    id: 2,
    title: "Scanning Fleet",
    subtitle: "Locating nearby vehicles",
    description: "RideX neural networks scan local autonomous-assisted pods and electric SUVs in the grid.",
    telemetry: "SCANNING: GRID_ZONE_DELHI | RANGE: 2.5KM | ACTIVE_FLT: 42"
  },
  {
    id: 3,
    title: "Driver Assigned",
    subtitle: "Vikram Solanki accepts trip",
    description: "Driver Vikram S. (Tesla Model Y) accepts the dispatch. Biometrics and security clearances verified.",
    telemetry: "DRIVER: VIKRAM_S | RATING: 4.95 | VEHICLE: TESLA_M_Y"
  },
  {
    id: 4,
    title: "Engines Started",
    subtitle: "Vehicle departs dispatch hub",
    description: "The assigned Electric SUV starts its autonomous-assisted system and departs the local depot.",
    telemetry: "ENGINES: ONLINE | PROPULSION: EV_BATTERY | STATUS: ACTIVE"
  },
  {
    id: 5,
    title: "Route Established",
    subtitle: "GPS corridor locked",
    description: "A dynamic route is locked via the green energy corridor, optimizing for speed and zero carbon tolls.",
    telemetry: "GPS_LOCK: FASTEST_ROUTE | CO2_SAVED: 1.2kg | TOLL_COST: 0"
  },
  {
    id: 6,
    title: "Driver Arriving",
    subtitle: "Approaching pickup point",
    description: "Vikram S. pulls into the Aerocity pickup bay. The vehicle beacon lights up with the matching client color.",
    telemetry: "GPS: PICKUP_BAY | BEACON: ACTIVE | STATE: ARRIVING"
  },
  {
    id: 7,
    title: "Boarding Vehicle",
    subtitle: "Rider welcomes onboard",
    description: "Client boards the vehicle. Smart climate controls adjust to client preference (21.5°C, ambient soft lavender).",
    telemetry: "DOORS: SECURED | CLIMATE: 21.5C | AMBIENT: LAVENDER"
  },
  {
    id: 8,
    title: "Ride Commenced",
    subtitle: "Entering transit corridor",
    description: "Vehicle merges into the smart expressway, aligning speed with city traffic flow nodes.",
    telemetry: "VELOCITY: 62KM/H | STATE: TRANSIT | TRAFFIC_DENS: LOW"
  },
  {
    id: 9,
    title: "Cinematic Cruising",
    subtitle: "AI Guardian loop active",
    description: "Cruising smoothly. RideX Guardian monitors telematics, tire pressures, and corridor safety parameters.",
    telemetry: "GUARDIAN: ACTIVE | SAFETY_SCORE: 100% | TELEMETRY: OK"
  },
  {
    id: 10,
    title: "Approaching Destination",
    subtitle: "Slowing down for drop-off",
    description: "The vehicle pulls off the expressway and arrives smoothly at the Cyber City office park drop-off circle.",
    telemetry: "GPS: CYBER_CITY_P2 | TARGET: ARRIVED | SPEED: 0KM/H"
  },
  {
    id: 11,
    title: "5-Star Feedback",
    subtitle: "Review submitted instantly",
    description: "The customer submits feedback: 'Clean, silent, and fast. The future of urban transit.'",
    telemetry: "RATING: 5.0/5.0 | COMMENT: EXCELLENT | FARE: INVOICED"
  },
  {
    id: 12,
    title: "Dispatch Completed",
    subtitle: "System ready for next call",
    description: "Ride completed. The system logs 2.4kg carbon savings and returns the vehicle to active dispatch state.",
    telemetry: "TRIP: COMPLETE | INVOICE: RE1992 | STATUS: READY"
  }
];

export default function CinematicCityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [dayNightProgress, setDayNightProgress] = useState(0); // 0 to 1 cycle
  
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto progression of steps
  useEffect(() => {
    if (isPlaying) {
      stepTimerRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % STORY_STEPS.length);
      }, 5500);
    } else {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    }

    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [isPlaying]);

  // Slowly progress day-night cycles
  useEffect(() => {
    let animFrame: number;
    const updateCycle = () => {
      setDayNightProgress((prev) => (prev + 0.0003) % 1);
      animFrame = requestAnimationFrame(updateCycle);
    };
    animFrame = requestAnimationFrame(updateCycle);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Simulated elements states
    const particles: Array<{ x: number; y: number; speed: number; size: number; alpha: number }> = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.2 + Math.random() * 0.4,
        size: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.4,
      });
    }

    const drones: Array<{ x: number; y: number; targetX: number; targetY: number; speed: number; pulse: number }> = [];
    for (let i = 0; i < 5; i++) {
      drones.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        targetX: Math.random() * width,
        targetY: Math.random() * (height * 0.4),
        speed: 0.5 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI,
      });
    }

    // Coordinates of route path
    const getRoutePoint = (t: number) => {
      // Smooth spline route coordinates across the canvas
      const xStart = width * 0.15;
      const yStart = height * 0.75;
      const xEnd = width * 0.85;
      const yEnd = height * 0.65;
      
      const cp1x = width * 0.35;
      const cp1y = height * 0.5;
      const cp2x = width * 0.65;
      const cp2y = height * 0.9;

      // Cubic bezier curve
      const mt = 1 - t;
      const x = mt * mt * mt * xStart + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * xEnd;
      const y = mt * mt * mt * yStart + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * yEnd;

      return { x, y };
    };

    // Main animation loop
    let vehicleT = 0;
    let cameraPulse = 0;

    const render = () => {
      // 1. CLEAR CANVAS
      ctx.clearRect(0, 0, width, height);

      // 2. DAY-TO-NIGHT SKY GRADIENT
      // Cycle: 0 (Day) -> 0.25 (Sunset) -> 0.5 (Night) -> 0.75 (Sunrise) -> 1 (Day)
      const cycle = dayNightProgress;
      let skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      
      if (cycle < 0.2) {
        // Daytime: Crisp sky blue to lavender white
        skyGrad.addColorStop(0, "#eef2ff");
        skyGrad.addColorStop(0.5, "#faf5ff");
        skyGrad.addColorStop(1, "#ffffff");
      } else if (cycle < 0.4) {
        // Sunset: Deep orange/pink to lavender
        const sunsetRatio = (cycle - 0.2) / 0.2;
        skyGrad.addColorStop(0, interpolateColor("#eef2ff", "#fdba74", sunsetRatio));
        skyGrad.addColorStop(0.4, interpolateColor("#faf5ff", "#f472b6", sunsetRatio));
        skyGrad.addColorStop(0.8, interpolateColor("#ffffff", "#fae8ff", sunsetRatio));
        skyGrad.addColorStop(1, "#fafaff");
      } else if (cycle < 0.7) {
        // Nighttime: Deep slate blue/purple
        const nightRatio = (cycle - 0.4) / 0.3;
        skyGrad.addColorStop(0, interpolateColor("#fdba74", "#0f172a", nightRatio));
        skyGrad.addColorStop(0.5, interpolateColor("#f472b6", "#1e1b4b", nightRatio));
        skyGrad.addColorStop(1, interpolateColor("#fafaff", "#0b0f19", nightRatio));
      } else {
        // Sunrise: Indigo transitioning back to day
        const sunriseRatio = (cycle - 0.7) / 0.3;
        skyGrad.addColorStop(0, interpolateColor("#0f172a", "#eef2ff", sunriseRatio));
        skyGrad.addColorStop(0.5, interpolateColor("#1e1b4b", "#faf5ff", sunriseRatio));
        skyGrad.addColorStop(1, interpolateColor("#0b0f19", "#ffffff", sunriseRatio));
      }

      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Sky Night Stars (render only if night cycle)
      const nightIntensity = getNightIntensity(cycle);
      if (nightIntensity > 0.1) {
        ctx.save();
        ctx.globalAlpha = nightIntensity;
        ctx.fillStyle = "#ffffff";
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 3. DRAW BACKGROUND SKYSCRAPERS (FUTURISTIC CITY OUTLINES)
      drawSkyline(ctx, width, height, cycle, nightIntensity);

      // 4. DRAW SMART GRID CORRIDOR ROAD SYSTEM
      drawSmartRoads(ctx, width, height, cycle, nightIntensity);

      // 5. DRAW ACTIVE TRIP ROUTE (GLOW PATH)
      // Dynamic route glow depends on the current story phase
      const hasRouteLocked = currentStep >= 4 && currentStep <= 10;
      const isCompletePhase = currentStep === 11 || currentStep === 11;
      
      const routeColor = currentStep === 10 ? "rgba(16, 185, 129, 0.4)" : "rgba(139, 92, 246, 0.35)";
      const activeColor = currentStep === 10 ? "#10b981" : "#8b5cf6";

      if (currentStep >= 1) {
        ctx.save();
        ctx.beginPath();
        const startPoint = getRoutePoint(0);
        ctx.moveTo(startPoint.x, startPoint.y);
        for (let t = 0.01; t <= 1.01; t += 0.01) {
          const pt = getRoutePoint(t);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = nightIntensity > 0.4 ? "rgba(226, 232, 240, 0.15)" : "rgba(15, 23, 42, 0.05)";
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        if (hasRouteLocked) {
          // Inner glowing dynamic path
          ctx.strokeStyle = routeColor;
          ctx.lineWidth = 8;
          ctx.stroke();

          ctx.strokeStyle = activeColor;
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 12]);
          ctx.lineDashOffset = -vehicleT * 180;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw Pins
      if (currentStep >= 0) {
        const pStart = getRoutePoint(0);
        const pEnd = getRoutePoint(1);

        // Pickup Beacon (Aerocity Terminal 3)
        ctx.save();
        ctx.beginPath();
        ctx.arc(pStart.x, pStart.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.stroke();
        
        // Pulsing radar ring
        ctx.beginPath();
        const pulseRadius = 10 + (Math.sin(Date.now() * 0.005) + 1) * 8;
        ctx.arc(pStart.x, pStart.y, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(59, 130, 246, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Dropoff Beacon (Cyber City Office)
        ctx.save();
        ctx.beginPath();
        ctx.arc(pEnd.x, pEnd.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ec4899";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ec4899";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        const dropPulse = 10 + (Math.cos(Date.now() * 0.004) + 1) * 6;
        ctx.arc(pEnd.x, pEnd.y, dropPulse, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(236, 72, 153, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // 6. DRAW THE DRIVER VEHICLE (SLEEK EV POD)
      // Animate vehicle position based on story step (progresses smoothly forward along path)
      let targetT = 0;
      if (currentStep < 8) targetT = 0.0;
      else if (currentStep === 8) targetT = 0.35;
      else if (currentStep === 9) targetT = 0.70;
      else if (currentStep >= 10) targetT = 1.0;

      // Smooth interpolation for vehicle coordinate path
      vehicleT += (targetT - vehicleT) * 0.05;

      if (currentStep >= 3) {
        const vPos = getRoutePoint(vehicleT);
        
        // Calculate tangent angle for car heading
        const nextPos = getRoutePoint(Math.min(1, vehicleT + 0.01));
        const dx = nextPos.x - vPos.x;
        const dy = nextPos.y - vPos.y;
        const angle = Math.atan2(dy, dx);

        ctx.save();
        ctx.translate(vPos.x, vPos.y);
        ctx.rotate(angle);

        // Vehicle Shadow
        ctx.beginPath();
        ctx.ellipse(0, 4, 14, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(15, 23, 42, 0.15)";
        ctx.fill();

        // Sleek Capsule Body
        ctx.beginPath();
        ctx.roundRect(-14, -6, 28, 12, 5);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.strokeStyle = "#8b5cf6";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#8b5cf6";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.stroke();

        // Windshield Glass (frosted violet)
        ctx.beginPath();
        ctx.roundRect(4, -4, 6, 8, 2);
        ctx.fillStyle = "rgba(139, 92, 246, 0.5)";
        ctx.fill();

        // Glowing wheels/nodes
        ctx.fillStyle = "#8b5cf6";
        ctx.fillRect(-10, -7, 4, 1);
        ctx.fillRect(-10, 6, 4, 1);
        ctx.fillRect(6, -7, 4, 1);
        ctx.fillRect(6, 6, 4, 1);

        // Headlight beams
        let glowGrad = ctx.createLinearGradient(12, 0, 32, 0);
        glowGrad.addColorStop(0, "rgba(139, 92, 246, 0.4)");
        glowGrad.addColorStop(1, "rgba(139, 92, 246, 0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.moveTo(12, -3);
        ctx.lineTo(32, -8);
        ctx.lineTo(32, 8);
        ctx.lineTo(12, 3);
        ctx.fill();

        ctx.restore();
      }

      // 7. DRAW FLYING DRONES
      drones.forEach((d) => {
        // Move towards target
        d.x += (d.targetX - d.x) * 0.01 * d.speed;
        d.y += (d.targetY - d.y) * 0.01 * d.speed;

        // If close, set new target
        if (Math.abs(d.x - d.targetX) < 10) {
          d.targetX = Math.random() * width;
          d.targetY = Math.random() * (height * 0.4);
        }

        d.pulse += 0.03;
        const size = 3 + Math.sin(d.pulse) * 1;

        ctx.save();
        ctx.beginPath();
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fillStyle = nightIntensity > 0.4 ? "rgba(96, 165, 250, 0.85)" : "rgba(79, 70, 229, 0.75)";
        ctx.shadowColor = "#60a5fa";
        ctx.shadowBlur = 5;
        ctx.fill();

        // Small green/red signal lights
        ctx.beginPath();
        ctx.arc(d.x - 4, d.y - 1, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#10b981";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(d.x + 4, d.y + 1, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.restore();
      });

      // Request next frame
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentStep, dayNightProgress]);

  // Color interpolation helper
  const interpolateColor = (color1: string, color2: string, factor: number) => {
    // Basic hex/rgb parsing
    const c1 = parseColor(color1);
    const c2 = parseColor(color2);
    
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const parseColor = (col: string) => {
    if (col.startsWith("#")) {
      const hex = col.substring(1);
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
    }
    if (col.startsWith("rgb")) {
      const match = col.match(/\d+/g);
      if (match) {
        return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
      }
    }
    return { r: 255, g: 255, b: 255 };
  };

  const getNightIntensity = (cycle: number) => {
    // Returns 0 to 1 depending on darkness level
    if (cycle > 0.4 && cycle < 0.7) {
      // Midnight peaking zone
      return 1;
    }
    if (cycle >= 0.2 && cycle <= 0.4) {
      return (cycle - 0.2) / 0.2; // fading night in
    }
    if (cycle >= 0.7 && cycle <= 0.9) {
      return 1 - (cycle - 0.7) / 0.2; // fading night out
    }
    return 0;
  };

  const drawSkyline = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cycle: number,
    nightIntensity: number
  ) => {
    // Generate silhouette building pillars
    const bWidth = 60;
    const spacing = 15;
    const startY = height * 0.85;

    ctx.save();
    ctx.globalAlpha = 0.65;
    
    // Choose fill style depending on day cycle
    const baseBuildingColor = nightIntensity > 0.5
      ? "rgba(30, 41, 59, 0.4)"
      : "rgba(226, 232, 240, 0.5)";

    ctx.fillStyle = baseBuildingColor;

    for (let x = 0; x < width; x += bWidth + spacing) {
      // Semi-random height based on x index to keep layout static
      const hSeed = Math.abs(Math.sin(x * 0.05)) * (height * 0.4) + 60;
      ctx.fillRect(x, startY - hSeed, bWidth, hSeed);

      // Blinking antenna towers
      if (Math.floor(x) % 2 === 0) {
        ctx.beginPath();
        ctx.arc(x + bWidth / 2, startY - hSeed - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = Math.sin(Date.now() * 0.007 + x) > 0 ? "#ef4444" : "transparent";
        ctx.fill();
      }

      // Drawing window dots on building facades in light night conditions
      if (nightIntensity > 0.3) {
        ctx.fillStyle = `rgba(253, 224, 71, ${nightIntensity * 0.65})`;
        for (let wy = startY - hSeed + 10; wy < startY - 10; wy += 20) {
          for (let wx = x + 8; wx < x + bWidth - 8; wx += 14) {
            // Randomize active glowing window cards
            if (Math.sin(wx * wy) > -0.2) {
              ctx.fillRect(wx, wy, 5, 5);
            }
          }
        }
        ctx.fillStyle = baseBuildingColor; // restore
      }
    }
    ctx.restore();
  };

  const drawSmartRoads = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cycle: number,
    nightIntensity: number
  ) => {
    const roadY = height * 0.82;
    ctx.save();
    // Grid Lines representing smart road tunnels
    ctx.beginPath();
    ctx.moveTo(0, roadY);
    ctx.lineTo(width, roadY);
    ctx.strokeStyle = nightIntensity > 0.4 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Smart glowing lanes underneath grid
    ctx.beginPath();
    ctx.moveTo(0, roadY + 8);
    ctx.lineTo(width, roadY + 8);
    ctx.strokeStyle = nightIntensity > 0.5 ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.05)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  const currentStepData = STORY_STEPS[currentStep];

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % STORY_STEPS.length);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1 + STORY_STEPS.length) % STORY_STEPS.length);
  };

  return (
    <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating Smart City Telemetry Overlay (Bottom Left) */}
      <div className="absolute bottom-8 left-8 z-20 max-w-sm glass-card-light p-5 rounded-2xl border border-slate-200/60 bg-white/70 shadow-lg text-left hidden md:block">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Dispatch Simulator
          </span>
          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 border border-purple-100 rounded-full font-mono">
            {currentStep + 1} / {STORY_STEPS.length}
          </span>
        </div>

        <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">{currentStepData.title}</h4>
        <p className="text-[10px] text-purple-600 font-bold tracking-tight mt-0.5">{currentStepData.subtitle}</p>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{currentStepData.description}</p>
        
        <code className="text-[9px] font-mono block mt-3.5 bg-slate-50 p-2 rounded border border-slate-200/50 text-slate-500 leading-none truncate">
          {currentStepData.telemetry}
        </code>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200/50">
          <div className="flex gap-2">
            <button 
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-slate-200/60 hover:bg-slate-50 text-slate-600 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-slate-200/60 hover:bg-slate-50 text-slate-600 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase transition-all shadow-md shadow-purple-500/10 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3" /> Pause Story
              </>
            ) : (
              <>
                <Play className="w-3 h-3" /> Resume Story
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Floating HUD banner overlay */}
      <div className="absolute top-24 left-4 right-4 z-20 glass-card-light p-3.5 rounded-xl border border-slate-200/60 bg-white/75 shadow-md text-left md:hidden flex justify-between items-center">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
            <span className="text-[9px] font-extrabold text-slate-800 uppercase tracking-tight">{currentStepData.title}</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate mt-0.5">{currentStepData.description}</p>
        </div>
        <button 
          onClick={handleNext}
          className="p-1.5 rounded-lg bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
