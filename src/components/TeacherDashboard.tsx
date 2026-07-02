import React, { useState, useEffect } from "react";
import { Student, Planet } from "../types";
import { defaultStudents, planets } from "../data";
import { Users, Lock, Sparkles, Send, Bell, BarChart3, HelpCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface TeacherDashboardProps {
  onBroadcastPlanet: (planet: Planet) => void;
}

export default function TeacherDashboard({ onBroadcastPlanet }: TeacherDashboardProps) {
  const [students, setStudents] = useState<Student[]>(defaultStudents);
  const [syncTarget, setSyncTarget] = useState<string>("jupiter");
  const [isSyncActive, setIsSyncActive] = useState<boolean>(false);
  const [quizStatus, setQuizStatus] = useState<"idle" | "pushing" | "completed">("idle");
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<string>(
    "Sức hút hấp dẫn (Trọng lực) trên Sao Mộc mạnh gấp bao nhiêu lần Trái Đất?"
  );

  // Recharts Chart Data representing real-time responses
  const [chartData, setChartData] = useState<{ name: string; votes: number; correct: boolean }[]>([
    { name: "Đáp án A: Gấp 0.5 lần", votes: 0, correct: false },
    { name: "Đáp án B: Gấp 2.5 lần", votes: 0, correct: true },
    { name: "Đáp án C: Gấp 10 lần", votes: 0, correct: false },
    { name: "Đáp án D: Gấp 25 lần", votes: 0, correct: false },
  ]);

  // Simulate attention levels wandering or syncing over time
  useEffect(() => {
    const interval = setInterval(() => {
      setStudents((prevStudents) =>
        prevStudents.map((s) => {
          // Wander attention slightly
          const change = Math.floor(Math.random() * 7) - 3;
          let newAttention = Math.min(100, Math.max(45, s.attentionRate + change));
          
          // If gaze-lock sync is active, keep attention rate extremely high!
          if (isSyncActive) {
            newAttention = Math.min(100, Math.max(92, s.attentionRate + 1));
          }

          return {
            ...s,
            attentionRate: newAttention,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isSyncActive]);

  // Handle forcing all students to look at a specific planet (Gaze-lock Sync)
  const handleTriggerGazeLock = () => {
    setIsSyncActive(true);
    const targetPlanet = planets.find((p) => p.id === syncTarget)!;
    
    // Broadcast back to parent so the main student preview panel also updates!
    onBroadcastPlanet(targetPlanet);

    // Sync mock students' active planet
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        activePlanet: syncTarget,
        attentionRate: Math.min(100, s.attentionRate + 12),
      }))
    );

    // Release sync visual after 8 seconds
    setTimeout(() => {
      setIsSyncActive(false);
    }, 8000);
  };

  // Simulate students casting their quiz votes in real-time
  const handlePushQuiz = () => {
    setQuizStatus("pushing");
    
    // Reset votes
    setChartData([
      { name: "A: Gấp 0.5 lần", votes: 0, correct: false },
      { name: "B: Gấp 2.5 lần (Đúng)", votes: 0, correct: true },
      { name: "C: Gấp 10 lần", votes: 0, correct: false },
      { name: "D: Gấp 25 lần", votes: 0, correct: false },
    ]);

    // Feed answers sequentially with timeouts to simulate real kids answering
    setTimeout(() => {
      // Minh votes B
      setChartData((prev) => prev.map((item, idx) => idx === 1 ? { ...item, votes: 1 } : item));
    }, 1000);

    setTimeout(() => {
      // Vy votes C (incorrect)
      setChartData((prev) => prev.map((item, idx) => idx === 2 ? { ...item, votes: 1 } : item));
    }, 2000);

    setTimeout(() => {
      // Trang votes B
      setChartData((prev) => prev.map((item, idx) => idx === 1 ? { ...item, votes: 2 } : item));
    }, 3200);

    setTimeout(() => {
      // Nam votes B
      setChartData((prev) => prev.map((item, idx) => idx === 1 ? { ...item, votes: 3 } : item));
    }, 4500);

    setTimeout(() => {
      // Huy votes D (incorrect)
      setChartData((prev) => prev.map((item, idx) => idx === 3 ? { ...item, votes: 1 } : item));
      setQuizStatus("completed");
    }, 5500);
  };

  const COLORS = ["#f87171", "#10b981", "#60a5fa", "#fbbf24"];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full" id="teacher-dashboard-block">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Bảng Điều Khiển Đồng Bộ Của Giáo Viên</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-[10px] text-slate-400 font-mono">ĐỒNG BỘ LỚP HỌC (ONLINE)</span>
        </div>
      </div>

      {/* Classroom Gaze Synchronizer Control Card */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-3">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span>Khóa Tiêu Điểm Học Tập (Synchronized Gaze-Lock)</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
          Đồng bộ hóa tầm nhìn AR của toàn bộ học sinh về cùng một tọa độ hành tinh để cùng thám hiểm chi tiết nhất.
        </p>

        <div className="flex flex-col md:flex-row gap-2">
          <select
            value={syncTarget}
            onChange={(e) => setSyncTarget(e.target.value)}
            disabled={isSyncActive}
            className="flex-1 text-xs bg-slate-900 border border-slate-800 text-slate-200 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {planets
              .filter((p) => p.id !== "sun")
              .map((p) => (
                <option key={p.id} value={p.id}>
                  Mô hình: {p.name} ({p.englishName})
                </option>
              ))}
          </select>
          <button
            onClick={handleTriggerGazeLock}
            disabled={isSyncActive}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {isSyncActive ? "Đang Gaze-Lock..." : "Khóa Toàn Bộ Tầm Nhìn 📡"}
          </button>
        </div>

        {isSyncActive && (
          <div className="mt-3 text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-2 rounded flex items-center gap-2 animate-pulse">
            <Bell className="w-3.5 h-3.5" />
            <span>Đang phát tín hiệu cưỡng bức: Đồng bộ màn hình tất cả học sinh về {planets.find(p => p.id === syncTarget)?.name}!</span>
          </div>
        )}
      </div>

      {/* Class Students Live Grid status */}
      <div className="mb-4">
        <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-mono mb-2">Trạng thái học tập trực tuyến (5 Học sinh)</span>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {students.map((s) => {
            const planetObj = planets.find((p) => p.id === s.activePlanet);
            return (
              <div key={s.id} className="bg-slate-950 border border-slate-800 rounded-lg p-2 flex flex-col justify-between gap-2 text-center relative overflow-hidden">
                {/* Active attention bar */}
                <div 
                  className="absolute bottom-0 left-0 h-1 transition-all duration-500"
                  style={{ 
                    width: `${s.attentionRate}%`,
                    backgroundColor: s.attentionRate > 85 ? "#10b981" : s.attentionRate > 70 ? "#f59e0b" : "#ef4444" 
                  }}
                ></div>

                <div>
                  <span className="block text-lg">{s.avatar.split(" ")[0]}</span>
                  <span className="block text-[10px] font-semibold text-slate-200 truncate">{s.name}</span>
                </div>
                
                <div className="space-y-0.5">
                  <span className="block text-[9px] text-slate-500">Tiêu điểm:</span>
                  <span className="inline-block text-[9px] bg-slate-900 text-indigo-400 px-1 py-0.5 rounded border border-indigo-950 truncate max-w-full font-medium">
                    {planetObj ? planetObj.name : "Vũ Trụ"}
                  </span>
                </div>

                <div className="text-[10px] font-mono font-bold">
                  <span className={s.attentionRate > 85 ? "text-emerald-400" : s.attentionRate > 70 ? "text-amber-500" : "text-red-500"}>
                    {s.attentionRate}% Tập trung
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synchronized Live Assessment Interactive Chamber */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <span>Đánh Giá Năng Lực Trực Tiếp (Assessment Hub)</span>
          </div>
          {quizStatus === "completed" && (
            <span className="text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-1.5 py-0.5 rounded">
              Đã thu đủ bài (5/5)
            </span>
          )}
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/50 mb-3 text-[11px] text-slate-300">
          <strong className="text-amber-400">Câu hỏi kiểm tra nhanh: </strong>
          {activeQuizQuestion}
        </div>

        {/* Realtime rechart results display */}
        <div className="flex-1 min-h-[140px] bg-slate-950 border border-slate-900 rounded p-2 relative flex flex-col justify-center">
          {quizStatus === "idle" ? (
            <div className="text-center py-6 text-slate-500 text-[11px] flex flex-col items-center justify-center gap-1">
              <HelpCircle className="w-7 h-7 text-slate-600 mb-1" />
              <span>Chưa có câu hỏi nào được phát. Nhấp phát đề dưới để xem kết quả trực tiếp của học sinh.</span>
            </div>
          ) : (
            <div className="w-full h-full" style={{ minHeight: "140px" }}>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 9 }} />
                  <YAxis allowDecimals={false} domain={[0, 5]} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontSize: 10 }}
                    labelStyle={{ color: "#f8fafc", fontWeight: "bold" }}
                  />
                  <Bar dataKey="votes" fill="#60a5fa">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <button
          onClick={handlePushQuiz}
          disabled={quizStatus === "pushing"}
          className="mt-3 w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/10"
        >
          <Send className="w-3.5 h-3.5" />
          {quizStatus === "pushing" ? "Đang đồng bộ thu phiếu..." : "Phát Phiếu Kiểm Tra Nhanh Lớp Học 📝"}
        </button>
      </div>
    </div>
  );
}
