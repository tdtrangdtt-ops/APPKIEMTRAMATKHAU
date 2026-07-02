import React, { useRef, useEffect, useState } from "react";
import { Planet } from "../types";
import { planets } from "../data";
import { Play, Pause, RotateCcw, Video, Eye, Compass, Info, Sparkles } from "lucide-react";

interface InteractiveOrbitProps {
  selectedPlanet: Planet;
  onSelectPlanet: (planet: Planet) => void;
  timeSpeed: number; // multiplier: 1x, 10x, 100x etc
  setTimeSpeed: (speed: number) => void;
  isARMode: boolean;
  setIsARMode: (isAR: boolean) => void;
}

export default function InteractiveOrbit({
  selectedPlanet,
  onSelectPlanet,
  timeSpeed,
  setTimeSpeed,
  isARMode,
  setIsARMode,
}: InteractiveOrbitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(0.85);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);

  // Keep track of orbit angles
  const anglesRef = useRef<{ [key: string]: number }>({
    mercury: 0,
    venus: 1.2,
    earth: 2.4,
    moon: 0, // orbit around earth
    mars: 3.6,
    jupiter: 4.8,
    saturn: 5.5,
  });

  // Handle canvas sizing and resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      canvas.width = rect?.width || 600;
      canvas.height = rect?.height || 500;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Primary Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Star positions
    const stars: { x: number; y: number; size: number; brightness: number }[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * 1200 - 600,
        y: Math.random() * 1200 - 600,
        size: Math.random() * 1.5,
        brightness: Math.random(),
      });
    }

    const draw = () => {
      // Clear with deep space color or semi-transparent AR green tint
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isARMode) {
        // High contrast tech grid background
        ctx.fillStyle = "rgba(4, 15, 15, 0.95)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw cyber radar lines
        ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let j = 0; j < canvas.height; j += 40) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(canvas.width, j);
          ctx.stroke();
        }
      } else {
        // Regular Space Dark background
        ctx.fillStyle = "#030712";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const centerX = canvas.width / 2 + pan.x;
      const centerY = canvas.height / 2 + pan.y;

      // Draw background stars (only if not AR mode for cleaner look, or subtle ones in AR)
      ctx.fillStyle = isARMode ? "rgba(16, 185, 129, 0.4)" : "#ffffff";
      stars.forEach((star) => {
        const sx = centerX + star.x * zoom;
        const sy = centerY + star.y * zoom;
        if (sx >= 0 && sx <= canvas.width && sy >= 0 && sy <= canvas.height) {
          ctx.globalAlpha = star.brightness * (0.3 + Math.sin(Date.now() * 0.002 + star.brightness * 10) * 0.3);
          ctx.fillRect(sx, sy, star.size, star.size);
        }
      });
      ctx.globalAlpha = 1.0;

      // Update angles if playing
      if (isPlaying) {
        planets.forEach((p) => {
          if (p.id !== "sun") {
            const speed = p.orbitSpeed * 0.004 * timeSpeed;
            anglesRef.current[p.id] = (anglesRef.current[p.id] || 0) + speed;
          }
        });
        // Moon rotation around Earth
        anglesRef.current["moon"] = (anglesRef.current["moon"] || 0) + 0.08 * timeSpeed;
      }

      // Draw Orbit Rings
      planets.forEach((p) => {
        if (p.id !== "sun" && p.id !== "moon") {
          ctx.beginPath();
          ctx.arc(centerX, centerY, p.orbitRadius * zoom, 0, Math.PI * 2);
          ctx.strokeStyle = isARMode ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.07)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw Sun
      const sun = planets.find((p) => p.id === "sun")!;
      const sunRadius = 24 * zoom;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = sun.color;
      ctx.shadowBlur = isARMode ? 10 : 35;
      ctx.shadowColor = sun.color;
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Draw sun solar flare effect
      if (!isARMode) {
        const pulse = Math.sin(Date.now() * 0.003) * 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, sunRadius + pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
        ctx.fill();
      }

      // Draw Planets
      let currentHovered: Planet | null = null;
      const planetPositions: { [id: string]: { x: number; y: number; size: number } } = {};

      planets.forEach((p) => {
        if (p.id === "sun") {
          planetPositions["sun"] = { x: centerX, y: centerY, size: sunRadius };
          return;
        }

        let px = centerX;
        let py = centerY;
        let pRadius = Math.max(4, Math.log2(p.diameter) * 1.5) * zoom;

        if (p.id === "moon") {
          // Special tracking around earth
          const earthPos = planetPositions["earth"];
          if (earthPos) {
            const moonDist = 18 * zoom;
            const angle = anglesRef.current["moon"] || 0;
            px = earthPos.x + Math.cos(angle) * moonDist;
            py = earthPos.y + Math.sin(angle) * moonDist;
            pRadius = 2.5 * zoom;
          }
        } else {
          // Normal orbit around sun
          const radius = p.orbitRadius * zoom;
          const angle = anglesRef.current[p.id] || 0;
          px = centerX + Math.cos(angle) * radius;
          py = centerY + Math.sin(angle) * radius;
        }

        planetPositions[p.id] = { x: px, y: py, size: pRadius };

        // Check if cursor is hovering this planet
        // Calculate mouse position relative to canvas
        const mouseX = lastMousePos.current.x;
        const mouseY = lastMousePos.current.y;
        const dist = Math.hypot(mouseX - px, mouseY - py);
        if (dist < pRadius + 6) {
          currentHovered = p;
        }

        // Draw orbital trail/shadow highlight
        if (selectedPlanet.id === p.id) {
          ctx.beginPath();
          ctx.arc(px, py, pRadius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = isARMode ? "#10b981" : "#f59e0b";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Reticle brackets for selection in AR mode
          if (isARMode) {
            const len = pRadius + 10;
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 2;
            
            // Top Left Bracket
            ctx.beginPath();
            ctx.moveTo(px - len, py - len + 5);
            ctx.lineTo(px - len, py - len);
            ctx.lineTo(px - len + 5, py - len);
            ctx.stroke();

            // Top Right
            ctx.beginPath();
            ctx.moveTo(px + len, py - len + 5);
            ctx.lineTo(px + len, py - len);
            ctx.lineTo(px + len - 5, py - len);
            ctx.stroke();

            // Bottom Left
            ctx.beginPath();
            ctx.moveTo(px - len, py + len - 5);
            ctx.lineTo(px - len, py + len);
            ctx.lineTo(px - len + 5, py + len);
            ctx.stroke();

            // Bottom Right
            ctx.beginPath();
            ctx.moveTo(px + len, py + len - 5);
            ctx.lineTo(px + len, py + len);
            ctx.lineTo(px + len - 5, py + len);
            ctx.stroke();
          }
        }

        // Draw planet sphere
        ctx.beginPath();
        ctx.arc(px, py, pRadius, 0, Math.PI * 2);

        if (isARMode) {
          // Cyber AR styling (semi-transparent green with rings)
          ctx.fillStyle = selectedPlanet.id === p.id ? "rgba(16, 185, 129, 0.45)" : "rgba(16, 185, 129, 0.25)";
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();
        } else {
          // Fancy realistic gradients
          const gradient = ctx.createRadialGradient(
            px - pRadius * 0.3,
            py - pRadius * 0.3,
            pRadius * 0.1,
            px,
            py,
            pRadius
          );
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, p.secondaryColor || "#1e293b");
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Saturn ring simulation
        if (p.id === "saturn") {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(-0.15);
          ctx.scale(1.8, 0.4);
          ctx.beginPath();
          ctx.arc(0, 0, pRadius * 1.3, 0, Math.PI * 2);
          ctx.strokeStyle = isARMode ? "rgba(16, 185, 129, 0.7)" : "rgba(224, 180, 76, 0.5)";
          ctx.lineWidth = 3 * zoom;
          ctx.stroke();
          ctx.restore();
        }

        // Label Planet
        if (zoom > 0.4) {
          ctx.font = "500 11px Inter, sans-serif";
          ctx.fillStyle = isARMode ? "#10b981" : "#e5e7eb";
          ctx.textAlign = "center";
          
          // Draw text above planet
          ctx.fillText(p.name, px, py - pRadius - 8);
          
          // Technical coordinates under planet if selected
          if (selectedPlanet.id === p.id && isARMode) {
            ctx.font = "12px JetBrains Mono, monospace";
            ctx.fillStyle = "rgba(16, 185, 129, 0.8)";
            ctx.fillText(`X:${Math.round(px)} Y:${Math.round(py)}`, px, py + pRadius + 15);
          }
        }
      });

      // Update hovered planet
      if (hoveredPlanet?.id !== currentHovered?.id) {
        setHoveredPlanet(currentHovered);
      }

      // Draw AR HUD Borders & Static
      if (isARMode) {
        drawARHUDOverlay(ctx, canvas);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const drawARHUDOverlay = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      // Vignette green aura
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.4,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7
      );
      grad.addColorStop(0, "rgba(16, 185, 129, 0)");
      grad.addColorStop(1, "rgba(16, 185, 129, 0.15)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top Header HUD Bar
      ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
      ctx.fillRect(10, 10, canvas.width - 20, 26);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, canvas.width - 20, 26);

      ctx.font = "11px JetBrains Mono, monospace";
      ctx.fillStyle = "#10b981";
      ctx.textAlign = "left";
      ctx.fillText("AR FEED: ACTIVE | PROMPT FOCUS LOCK", 25, 27);
      
      ctx.textAlign = "right";
      const timestamp = new Date().toLocaleTimeString();
      ctx.fillText(`CAM_HZ: 60 | FPS: 60 | TIME: ${timestamp}`, canvas.width - 25, 27);

      // Cyber crosshair at center
      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 20, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 + 20, canvas.height / 2);
      ctx.moveTo(canvas.width / 2, canvas.height / 2 - 20);
      ctx.lineTo(canvas.width / 2, canvas.height / 2 + 20);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Bottom Info Frame
      ctx.fillStyle = "rgba(16, 185, 129, 0.05)";
      ctx.fillRect(10, canvas.height - 35, canvas.width - 20, 25);
      ctx.strokeRect(10, canvas.height - 35, canvas.width - 20, 25);
      ctx.textAlign = "center";
      ctx.fillText(`SELECTED TARGET ID: ${selectedPlanet.englishName.toUpperCase()} // SYS: COORD_SYNC_OK`, canvas.width / 2, canvas.height - 18);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedPlanet, zoom, pan, isPlaying, timeSpeed, isARMode, hoveredPlanet]);

  // Keep track of cursor position
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastMousePos.current = { x, y };

    if (isDragging) {
      setPan({
        x: x - dragStart.x,
        y: y - dragStart.y,
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({
      x: x - pan.x,
      y: y - pan.y,
    });
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(false);

    // If mouseup is quick and on a planet, select it
    if (hoveredPlanet) {
      onSelectPlanet(hoveredPlanet);
    }
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl" id="orbit-container-block">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Mô Phỏng Quỹ Đạo Vũ Trụ 3D</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
            className="px-2 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
            title="Phóng to"
          >
            Zoom +
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.3))}
            className="px-2 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
            title="Thu nhỏ"
          >
            Zoom -
          </button>
          <button
            onClick={() => {
              setPan({ x: 0, y: 0 });
              setZoom(0.85);
            }}
            className="p-1 text-slate-400 hover:text-slate-200"
            title="Reset Góc Nhìn"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulator canvas stage */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] md:h-[450px] cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="block w-full h-full"
          id="orbit-canvas"
        />

        {/* Hover label overlay */}
        {hoveredPlanet && (
          <div
            className="absolute pointer-events-none bg-slate-950/90 text-slate-100 border border-slate-800 px-2 py-1.5 rounded text-xs shadow-lg flex items-center gap-1.5 transition-opacity"
            style={{
              left: lastMousePos.current.x + 15,
              top: lastMousePos.current.y - 15,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredPlanet.color }}></span>
            <span className="font-medium">{hoveredPlanet.name}</span>
            <span className="text-[10px] text-slate-400">({hoveredPlanet.englishName})</span>
          </div>
        )}

        {/* Instruction overlay for beginners */}
        <div className="absolute bottom-12 left-4 pointer-events-none text-[10px] text-slate-400 bg-slate-950/70 p-2 rounded border border-slate-800/50 space-y-1">
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400" />
            <span>Kéo chuột để di chuyển | Cuộn để phóng to</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Nhấp trực tiếp vào hành tinh để chọn</span>
          </div>
        </div>

        {/* Indicator AR vs VR */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => setIsARMode(!isARMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isARMode
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            {isARMode ? "Đang bật AR HUD" : "Xem Chế Độ AR"}
          </button>
        </div>
      </div>

      {/* Control panel & Time travel speed slider */}
      <div className="bg-slate-950 px-4 py-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Play/Pause & reset */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
              title={isPlaying ? "Tạm dừng mô phỏng" : "Tiếp tục quay"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">🚀 Tốc độ tự quay & quỹ đạo:</span>
              <span className="font-mono text-indigo-400 font-bold">{timeSpeed}x Ngày/Giây</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={timeSpeed}
              onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Quick select buttons of planets */}
        <div className="flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 mb-1">Chọn nhanh hành tinh:</span>
          <div className="flex flex-wrap gap-1.5">
            {planets.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPlanet(p)}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  selectedPlanet.id === p.id
                    ? "bg-indigo-600 text-white shadow-sm font-semibold ring-1 ring-indigo-400"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
