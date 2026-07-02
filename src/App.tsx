import React, { useState } from "react";
import { planets } from "./data";
import { Planet } from "./types";
import InteractiveOrbit from "./components/InteractiveOrbit";
import ScaleComparison from "./components/ScaleComparison";
import GravityLab from "./components/GravityLab";
import TelescopeLab from "./components/TelescopeLab";
import LostPlanetQuest from "./components/LostPlanetQuest";
import TeacherDashboard from "./components/TeacherDashboard";
import InstructionGenerator from "./components/InstructionGenerator";
import { 
  Orbit, 
  Settings, 
  Users, 
  BookOpen, 
  Trophy, 
  Zap, 
  Sparkles, 
  Eye, 
  Compass, 
  Video, 
  Volume2, 
  BarChart3,
  Rocket
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"design" | "simulator" | "quest" | "teacher">("design");
  
  // Shared States across Student Simulator modules
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(planets[3]); // Default Earth
  const [timeSpeed, setTimeSpeed] = useState<number>(1.5);
  const [isARMode, setIsARMode] = useState<boolean>(false);
  const [broadcastNotification, setBroadcastNotification] = useState<string>("");

  // Handler for Classroom Sync gaze broadcast
  const handleTeacherBroadcast = (planet: Planet) => {
    setSelectedPlanet(planet);
    setBroadcastNotification(`📡 GIÁO VIÊN ĐÃ KHÓA TIÊU ĐIỂM: Đồng bộ tầm nhìn lớp học về ${planet.name}!`);
    
    // Auto clear notification after 5 seconds
    setTimeout(() => {
      setBroadcastNotification("");
    }, 5500);
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans relative overflow-x-hidden antialiased selection:bg-indigo-500 selection:text-white" id="main-space-root">
      {/* Decorative Nebula Lights */}
      <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[45%] bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[45%] h-[45%] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Main Navigation Bar */}
      <header className="bg-[#030712]/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50 px-4 md:px-8 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Rocket className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg md:text-xl tracking-tight bg-gradient-to-r from-slate-100 via-indigo-100 to-cyan-100 bg-clip-text text-transparent">
                Vũ Trụ 3D Tương Tác AR
              </h1>
              <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-semibold px-2 py-0.5 rounded-full">
                Sư phạm EdTech
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hệ thống Phân tích Thiết kế & Mô phỏng Trực quan AR cho Tiểu học
            </p>
          </div>
        </div>

        {/* Global Nav Tabs */}
        <nav className="flex bg-slate-950 p-1 rounded-xl border border-slate-900 max-w-full overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("design")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "design"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Studio Thiết Kế Hệ Thống
          </button>
          
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "simulator"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Học Sinh: Lab Vật Lý AR
          </button>

          <button
            onClick={() => setActiveTab("quest")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "quest"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Học Sinh: Thử Thách Quét Trạm
          </button>

          <button
            onClick={() => setActiveTab("teacher")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "teacher"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Giáo Viên: Dashboard Lớp
          </button>
        </nav>
      </header>

      {/* Synchronized Classroom broadcast banner alert */}
      {broadcastNotification && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-slate-950 text-xs font-bold px-4 py-2.5 text-center flex items-center justify-center gap-2 shadow-lg animate-slide-in sticky top-[72px] z-40">
          <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
          <span>{broadcastNotification}</span>
        </div>
      )}

      {/* Main Container Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 relative z-10 flex flex-col justify-stretch">
        
        {/* VIEW 1: STUDIO DESIGN OVERVIEW */}
        {activeTab === "design" && (
          <div className="space-y-6 flex flex-col h-full animate-fade-in">
            {/* Introductory Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
                <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">MỤC TIÊU SƯ PHẠM</span>
                <h3 className="font-bold text-slate-200 text-sm">Phương Pháp Thực Chứng</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Thay vì học chay vẹt lòng, học sinh tự tay điều khiển tỉ lệ quy mô hành tinh, 
                  thả rơi các tàu thám hiểm dưới gia tốc khác nhau để trực quan hóa các kiến thức trừu tượng.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">CÔNG NGHỆ CỐT LÕI</span>
                <h3 className="font-bold text-slate-200 text-sm">Haptic & Multi-sensory AR</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tích hợp cảm nhận lực va chạm rung phản hồi, hình ảnh 3 chiều AR di động, 
                  và AI thuyết minh âm học giọng nói sống động tăng cường 80% chỉ số ghi nhớ của trẻ em.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">QUẢN TRỊ HIỆU QUẢ</span>
                <h3 className="font-bold text-slate-200 text-sm">Gaze Sync & Assessment</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Giúp giáo viên đồng bộ tiêu điểm góc nhìn lớp học, không cho trẻ xao nhãng, 
                  đồng thời thu thập kết quả học tập nhanh biểu thị tức thì dưới dạng biểu đồ khoa học.
                </p>
              </div>
            </div>

            {/* Instruction customizer generator */}
            <InstructionGenerator />
          </div>
        )}

        {/* VIEW 2: DETAILED PHYSICAL SIMULATOR LAB */}
        {activeTab === "simulator" && (
          <div className="space-y-6 flex flex-col h-full animate-fade-in">
            {/* Banner info selected planet */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedPlanet.color }}></span>
                  <h2 className="font-bold text-lg text-slate-100">
                    Thám Hiểm Mục Tiêu: {selectedPlanet.name} ({selectedPlanet.englishName})
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                  {selectedPlanet.description}
                </p>
              </div>
              <div className="flex gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 self-start md:self-auto text-xs font-mono">
                <span className="text-slate-500 font-semibold px-2">Đường kính:</span>
                <span className="text-indigo-400 font-bold pr-2">{selectedPlanet.diameter.toLocaleString()} km</span>
              </div>
            </div>

            {/* Bento interactive grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Giant Left Column: Interactive Solar System Canvas */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <InteractiveOrbit 
                  selectedPlanet={selectedPlanet} 
                  onSelectPlanet={setSelectedPlanet}
                  timeSpeed={timeSpeed}
                  setTimeSpeed={setTimeSpeed}
                  isARMode={isARMode}
                  setIsARMode={setIsARMode}
                />
              </div>

              {/* Right Column: Virtual Telescope with TTS Thuyết minh */}
              <div className="lg:col-span-5">
                <TelescopeLab currentPlanet={selectedPlanet} />
              </div>
            </div>

            {/* Secondary horizontal grid: Physics Gravity drop and Scale Lab */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div>
                <GravityLab currentPlanet={selectedPlanet} />
              </div>
              <div>
                <ScaleComparison currentPlanet={selectedPlanet} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: GAMIFIED LOST PLANET QUEST */}
        {activeTab === "quest" && (
          <div className="max-w-3xl w-full mx-auto flex flex-col h-full justify-center animate-fade-in">
            <LostPlanetQuest />
          </div>
        )}

        {/* VIEW 4: TEACHER CLASSROOM SYNCHRONIZATION DASHBOARD */}
        {activeTab === "teacher" && (
          <div className="max-w-4xl w-full mx-auto flex flex-col h-full justify-center animate-fade-in">
            <TeacherDashboard onBroadcastPlanet={handleTeacherBroadcast} />
          </div>
        )}

      </main>

      {/* Footer copyright info */}
      <footer className="bg-[#030712] border-t border-slate-900 py-6 px-4 text-center text-[11px] text-slate-500 mt-12 relative z-10 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            © 2026 Studio Thiết Kế Hệ Thống Giáo Dục AR - Vũ Trụ 3D Tương Tác
          </span>
          <div className="flex items-center gap-3">
            <span>Sư phạm Kiến tạo</span>
            <span>•</span>
            <span>EdTech Lab</span>
            <span>•</span>
            <span>Thực thể Tăng cường</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
