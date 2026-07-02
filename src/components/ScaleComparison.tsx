import React, { useState } from "react";
import { Planet } from "../types";
import { planets } from "../data";
import { Scale, ArrowRightLeft, Sparkles, HelpCircle } from "lucide-react";

interface ScaleComparisonProps {
  currentPlanet: Planet;
}

export default function ScaleComparison({ currentPlanet }: ScaleComparisonProps) {
  const [leftPlanet, setLeftPlanet] = useState<Planet>(currentPlanet);
  const [rightPlanet, setRightPlanet] = useState<Planet>(
    planets.find((p) => p.id === "jupiter") || planets[0]
  );

  // Sync left planet when current changes
  React.useEffect(() => {
    setLeftPlanet(currentPlanet);
  }, [currentPlanet]);

  const handleSwap = () => {
    const temp = leftPlanet;
    setLeftPlanet(rightPlanet);
    setRightPlanet(temp);
  };

  // Calculations
  const diameterRatio = leftPlanet.diameter / rightPlanet.diameter;
  const leftMass = parseFloat(leftPlanet.mass);
  const rightMass = parseFloat(rightPlanet.mass);
  const massRatio = leftMass / rightMass;
  
  // Volume ratio is roughly diameter ratio cubed
  const volumeRatio = Math.pow(leftPlanet.diameter / rightPlanet.diameter, 3);

  // SVG representation relative scale
  // Set maximum radius for the larger planet to be 110px
  const maxDiameter = Math.max(leftPlanet.diameter, rightPlanet.diameter);
  const leftScale = (leftPlanet.diameter / maxDiameter) * 110;
  const rightScale = (rightPlanet.diameter / maxDiameter) * 110;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full" id="scale-comparison-block">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-100 text-sm">Phòng Thí Nghiệm Tỷ Lệ Thực (Scale Lab)</h3>
        </div>
        <button
          onClick={handleSwap}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition"
          title="Đảo chiều so sánh"
        >
          <ArrowRightLeft className="w-3 h-3 text-amber-400" />
          Đảo bên
        </button>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-[10px] text-slate-400 mb-1">Vật thể bên Trái:</label>
          <select
            value={leftPlanet.id}
            onChange={(e) => setLeftPlanet(planets.find((p) => p.id === e.target.value)!)}
            className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {planets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.englishName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-slate-400 mb-1">Vật thể bên Phải:</label>
          <select
            value={rightPlanet.id}
            onChange={(e) => setRightPlanet(planets.find((p) => p.id === e.target.value)!)}
            className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {planets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.englishName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-side Visual rendering */}
      <div className="flex-1 bg-slate-950 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-center items-center min-h-[180px] mb-4 relative overflow-hidden">
        {/* Absolute stars background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="flex w-full items-center justify-around gap-6 relative z-10">
          {/* Left Planet Visual */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-[220px] flex items-center justify-center">
              <svg width="240" height="220" className="overflow-visible">
                <defs>
                  <radialGradient id={`grad-${leftPlanet.id}`} cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor={leftPlanet.color} />
                    <stop offset="100%" stopColor={leftPlanet.secondaryColor || "#1e293b"} />
                  </radialGradient>
                </defs>
                <circle
                  cx="120"
                  cy="110"
                  r={leftScale}
                  fill={`url(#grad-${leftPlanet.id})`}
                  className="transition-all duration-500"
                  filter={leftPlanet.id === 'sun' ? "drop-shadow(0 0 15px #f59e0b)" : "none"}
                />
                {leftPlanet.id === "saturn" && (
                  <ellipse
                    cx="120"
                    cy="110"
                    rx={leftScale * 1.8}
                    ry={leftScale * 0.4}
                    fill="none"
                    stroke="rgba(224, 180, 76, 0.45)"
                    strokeWidth={leftScale * 0.15}
                    transform={`rotate(-15, 120, 110)`}
                    className="transition-all duration-500"
                  />
                )}
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-200 mt-2">{leftPlanet.name}</span>
            <span className="text-[10px] text-slate-500">D = {leftPlanet.diameter.toLocaleString()} km</span>
          </div>

          {/* Right Planet Visual */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-[220px] flex items-center justify-center">
              <svg width="240" height="220" className="overflow-visible">
                <defs>
                  <radialGradient id={`grad-${rightPlanet.id}`} cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor={rightPlanet.color} />
                    <stop offset="100%" stopColor={rightPlanet.secondaryColor || "#1e293b"} />
                  </radialGradient>
                </defs>
                <circle
                  cx="120"
                  cy="110"
                  r={rightScale}
                  fill={`url(#grad-${rightPlanet.id})`}
                  className="transition-all duration-500"
                  filter={rightPlanet.id === 'sun' ? "drop-shadow(0 0 15px #f59e0b)" : "none"}
                />
                {rightPlanet.id === "saturn" && (
                  <ellipse
                    cx="120"
                    cy="110"
                    rx={rightScale * 1.8}
                    ry={rightScale * 0.4}
                    fill="none"
                    stroke="rgba(224, 180, 76, 0.45)"
                    strokeWidth={rightScale * 0.15}
                    transform={`rotate(-15, 120, 110)`}
                    className="transition-all duration-500"
                  />
                )}
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-200 mt-2">{rightPlanet.name}</span>
            <span className="text-[10px] text-slate-500">D = {rightPlanet.diameter.toLocaleString()} km</span>
          </div>
        </div>
      </div>

      {/* Numerical Data Sheets */}
      <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800 text-xs space-y-3 flex-1 overflow-auto">
        <h4 className="font-semibold text-amber-400 border-b border-slate-800 pb-1.5 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Kết quả so sánh khoa học:
        </h4>

        <div className="space-y-2">
          {/* Diameter */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-400">📏 Kích thước (Đường kính):</span>
            <span className="text-right font-medium text-slate-200 font-mono">
              {diameterRatio > 1 ? (
                <span>
                  <strong className="text-amber-500">{leftPlanet.name}</strong> to gấp{" "}
                  <strong className="text-emerald-400">{diameterRatio.toFixed(1)} lần</strong>{" "}
                  {rightPlanet.name}
                </span>
              ) : (
                <span>
                  <strong className="text-amber-500">{leftPlanet.name}</strong> chỉ bằng{" "}
                  <strong className="text-emerald-400">{(diameterRatio * 100).toFixed(1)}%</strong> so với{" "}
                  {rightPlanet.name}
                </span>
              )}
            </span>
          </div>

          {/* Volume Capacity / Misconception Solver */}
          <div className="bg-amber-950/20 rounded border border-amber-900/30 p-2 mt-1">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-amber-300">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Sự thật về Thể tích Không gian:
            </span>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              {volumeRatio > 1 ? (
                <span>
                  Bạn cần nhét khoảng <strong className="text-amber-400 font-mono">{Math.round(volumeRatio).toLocaleString()}</strong> hành tinh{" "}
                  <strong>{rightPlanet.name}</strong> vào trong lòng của <strong>{leftPlanet.name}</strong> mới có thể lấp đầy hoàn toàn!
                </span>
              ) : (
                <span>
                  Hành tinh <strong>{rightPlanet.name}</strong> khổng lồ có thể chứa đựng khoảng{" "}
                  <strong className="text-amber-400 font-mono">{Math.round(1 / volumeRatio).toLocaleString()}</strong> hành tinh{" "}
                  <strong>{leftPlanet.name}</strong> ở bên trong lòng nó!
                </span>
              )}
            </p>
          </div>

          {/* Mass comparison */}
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-400">⚖️ Trọng lượng (Khối lượng):</span>
            <span className="text-right font-medium text-slate-200 font-mono">
              {massRatio > 1 ? (
                <span>Gấp {massRatio.toFixed(1)} lần</span>
              ) : (
                <span>Bằng {(massRatio * 100).toFixed(3)}%</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
