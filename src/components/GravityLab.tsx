import React, { useState, useEffect, useRef } from "react";
import { Planet } from "../types";
import { planets } from "../data";
import { Zap, Play, ArrowDown, Sparkles, HelpCircle } from "lucide-react";

interface GravityLabProps {
  currentPlanet: Planet;
}

export default function GravityLab({ currentPlanet }: GravityLabProps) {
  const [activePlanet, setActivePlanet] = useState<Planet>(currentPlanet);
  const [isFalling, setIsFalling] = useState<boolean>(false);
  const [yPos, setYPos] = useState<number>(20); // 20px is starting height (top)
  const [velocity, setVelocity] = useState<number>(0); // pixels per second
  const [time, setTime] = useState<number>(0); // in seconds
  const [hasLanded, setHasLanded] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const [impactForce, setImpactForce] = useState<number>(0);
  const [hapticRipple, setHapticRipple] = useState<boolean>(false);

  const containerHeight = 260; // physics bounds
  const gravityScale = 12; // visual multiplier for physics representation
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Sync with main app planet
  useEffect(() => {
    setActivePlanet(currentPlanet);
    handleReset();
  }, [currentPlanet]);

  const handleStartDrop = () => {
    setIsFalling(true);
    setHasLanded(false);
    setYPos(20);
    setVelocity(0);
    setTime(0);
    setShake(false);
    setHapticRipple(false);
    startTimeRef.current = null;
  };

  const handleReset = () => {
    setIsFalling(false);
    setHasLanded(false);
    setYPos(20);
    setVelocity(0);
    setTime(0);
    setShake(false);
    setHapticRipple(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  useEffect(() => {
    if (!isFalling) return;

    const updatePhysics = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = (timestamp - startTimeRef.current) / 1000; // in seconds
      setTime(elapsed);

      // standard acceleration formula: s = s0 + 0.5 * g * t^2
      // g in m/s^2. We scale it for visual beauty.
      const g = activePlanet.gravity;
      const currentY = 20 + 0.5 * (g * gravityScale) * (elapsed * elapsed);
      const currentVel = g * elapsed; // v = g * t

      if (currentY >= containerHeight) {
        // Impact!
        setYPos(containerHeight);
        setVelocity(currentVel);
        setIsFalling(false);
        setHasLanded(true);
        setShake(true);
        setHapticRipple(true);
        
        // Calculate dynamic impact force representation
        const force = currentVel * 2.5; // arbitrary scaling
        setImpactForce(force);

        // Turn off screen shake after 500ms
        setTimeout(() => {
          setShake(false);
        }, 500);

        // Trigger native vibration haptic if supported
        if (navigator.vibrate) {
          navigator.vibrate(Math.min(200, Math.round(g * 10)));
        }
      } else {
        setYPos(currentY);
        setVelocity(currentVel);
        requestRef.current = requestAnimationFrame(updatePhysics);
      }
    };

    requestRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isFalling, activePlanet]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full" id="gravity-lab-block">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Thí Nghiệm Giả Lập Trọng Lực</h3>
        </div>
        <select
          value={activePlanet.id}
          onChange={(e) => {
            const selected = planets.find((p) => p.id === e.target.value)!;
            setActivePlanet(selected);
            handleReset();
          }}
          className="text-xs bg-slate-950 border border-slate-800 text-slate-100 py-1 px-2.5 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {planets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.gravity} m/s²)
            </option>
          ))}
        </select>
      </div>

      {/* Physics Chamber Display */}
      <div 
        className={`relative flex-1 bg-slate-950 rounded-xl border border-slate-800/80 p-4 min-h-[190px] overflow-hidden flex transition-all duration-100 ${
          shake ? "animate-bounce translate-y-1 ring-2 ring-red-500/50" : ""
        }`}
      >
        {/* Dynamic impact expanding ring (Haptic ripple) */}
        {hapticRipple && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border-2 border-emerald-500/60 pointer-events-none animate-ping"
            style={{ 
              width: `${Math.min(120, impactForce * 1.5)}px`, 
              height: `${Math.min(40, impactForce * 0.5)}px`,
              animationDuration: "0.8s"
            }}
          />
        )}

        {/* Altitude indicator lines */}
        <div className="absolute left-4 top-5 bottom-4 w-1 bg-slate-800 flex flex-col justify-between items-center text-[9px] text-slate-500 font-mono">
          <span>100m</span>
          <span>75m</span>
          <span>50m</span>
          <span>25m</span>
          <span>0m</span>
        </div>

        {/* Physics stage */}
        <div className="relative flex-1 h-full flex justify-center items-stretch ml-8">
          {/* Falling Object */}
          <div 
            className="absolute flex flex-col items-center transition-transform"
            style={{ 
              transform: `translateY(${yPos}px)`,
              top: 0
            }}
          >
            {/* Object body (looks like an AR spatial capsule) */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform ${
              isFalling ? "animate-pulse border-cyan-400 border bg-cyan-950/80 text-cyan-400" : "bg-indigo-600 text-slate-100"
            }`}>
              👨‍🚀
            </div>
            <ArrowDown className={`w-4 h-4 mt-0.5 text-indigo-400 transition-opacity ${isFalling ? "opacity-100 animate-bounce" : "opacity-0"}`} />
          </div>

          {/* Impact Surface base */}
          <div className="absolute bottom-0 inset-x-0 h-4 bg-slate-800 border-t border-slate-700 rounded-b flex items-center justify-center">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Bề mặt {activePlanet.name}</span>
          </div>
        </div>

        {/* Floating Data Overlay */}
        <div className="absolute top-4 right-4 bg-slate-950/95 border border-slate-800 rounded p-2.5 space-y-1 text-[10px] font-mono text-slate-300 w-36">
          <div className="flex justify-between">
            <span>Trọng lực:</span>
            <span className="text-indigo-400 font-semibold">{activePlanet.gravity} m/s²</span>
          </div>
          <div className="flex justify-between">
            <span>Tốc độ v:</span>
            <span className="text-emerald-400 font-semibold">{(velocity * 0.28).toFixed(1)} km/h</span>
          </div>
          <div className="flex justify-between">
            <span>Thời gian t:</span>
            <span className="text-amber-400 font-semibold">{time.toFixed(2)}s</span>
          </div>
          <div className="flex justify-between">
            <span>Độ cao:</span>
            <span className="text-slate-400 font-semibold">{Math.max(0, Math.round(100 - (yPos / containerHeight) * 100))}m</span>
          </div>
        </div>
      </div>

      {/* Surface Physics Details & Info */}
      <div className="mt-3 bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-lg text-xs space-y-1">
        <div className="flex items-center gap-1 text-indigo-400 font-semibold text-[11px]">
          <Sparkles className="w-3 h-3" />
          <span>Đặc trưng Trọng lực:</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          <strong>{activePlanet.name}</strong> có gia tốc trọng trường là {activePlanet.gravity} m/s². 
          {activePlanet.gravity > 9.8 ? (
            <span> Nặng gấp <strong>{(activePlanet.gravity / 9.8).toFixed(1)} lần</strong> Trái Đất. Trọng lực cực mạnh này khiến cơ thể bạn cảm thấy nặng nề khủng khiếp và nhảy rất thấp.</span>
          ) : activePlanet.gravity === 9.81 ? (
            <span> Trọng lực chuẩn 1G lý tưởng nơi cơ thể chúng ta phát triển cân bằng nhất.</span>
          ) : (
            <span> Nhẹ hơn Trái Đất, chỉ bằng <strong>{(activePlanet.gravity / 9.8 * 100).toFixed(0)}%</strong>. Tại đây bạn có thể nhảy cao gấp nhiều lần và rơi xuống rất chậm rãi như đang bay!</span>
          )}
        </p>
      </div>

      {/* Drop triggers */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleStartDrop}
          disabled={isFalling}
          className="flex-1 py-2 px-4 rounded-lg font-medium text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 font-semibold transition shadow-lg shadow-indigo-500/10 disabled:opacity-50"
        >
          {isFalling ? "Đang rơi..." : "Thả Thí Nghiệm 🚀"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-lg transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
