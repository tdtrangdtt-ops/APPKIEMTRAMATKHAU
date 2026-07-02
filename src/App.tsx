import React, { useState, useEffect, useRef } from "react";
import PasswordInputZone from "./components/PasswordInputZone";
import RobotCracker from "./components/RobotCracker";
import BadgeCollection from "./components/BadgeCollection";
import SafetyGuideChat from "./components/SafetyGuideChat";
import { PasswordStrength, Badge } from "./types";
import { ShieldCheck, Sparkles, Volume2, Info, Lock } from "lucide-react";

const INITIAL_BADGES: Badge[] = [
  {
    id: "rookie",
    name: "Tân binh An toàn 🥉",
    description: "Bé đã tự mình rèn chiếc chìa khóa bảo mật đầu tiên!",
    icon: "🛡️",
    unlocked: false,
    criteria: "Nhập mật mã có ít nhất 4 ký tự"
  },
  {
    id: "knight",
    name: "Hiệp sĩ Mật mã 🥈",
    description: "Bé chế tạo thành công lá chắn 'Rất Mạnh' hoặc 'Huyền Thoại'!",
    icon: "⚔️",
    unlocked: false,
    criteria: "Sức mạnh mật mã đạt mức Rất Mạnh"
  },
  {
    id: "master",
    name: "Bậc thầy Ẩn danh 🥇",
    description: "Lá chắn kiên cố mà không để lộ một bí mật riêng tư nào!",
    icon: "👤",
    unlocked: false,
    criteria: "Mật khẩu Rất Mạnh và Không dùng tên/ngày sinh"
  },
  {
    id: "wall",
    name: "Bức tường Thép 🧱",
    description: "Chìa khóa siêu dài lâu bẻ gãy mọi mũi giáo của robot bẻ khóa!",
    icon: "💎",
    unlocked: false,
    criteria: "Độ dài mật mã đạt từ 12 ký tự trở lên"
  },
  {
    id: "sage",
    name: "Đặc vụ Thông thái 🔮",
    description: "Bé biết chủ động học hỏi các mẹo an toàn từ Người Hướng dẫn!",
    icon: "🧠",
    unlocked: false,
    criteria: "Hỏi đáp với Người Hướng dẫn AI ít nhất 1 câu hỏi"
  }
];

export default function App() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<PasswordStrength>("weak");
  const [properties, setProperties] = useState({
    length: 0,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    sensitiveDetected: false,
    sensitiveDetails: ""
  });
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [aiFeedback, setAiFeedback] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedBadge, setCelebratedBadge] = useState<string | null>(null);

  // API settings states
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3-flash-preview");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  const [tempModel, setTempModel] = useState("gemini-3-flash-preview");

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize API Key and Model from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem("x-gemini-key") || "";
    const savedModel = localStorage.getItem("x-gemini-model") || "gemini-3-flash-preview";
    setApiKey(savedKey);
    setSelectedModel(savedModel);
    setTempApiKey(savedKey);
    setTempModel(savedModel);

    // If key doesn't exist, show modal automatically
    if (!savedKey) {
      setShowSettingsModal(true);
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("x-gemini-key", tempApiKey);
    localStorage.setItem("x-gemini-model", tempModel);
    setApiKey(tempApiKey);
    setSelectedModel(tempModel);
    setShowSettingsModal(false);
  };

  // Debounced API call to get personalized feedback from the AI Safety Guide
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!password) {
      setAiFeedback("");
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);
    setAiFeedback("🔮 Người Hướng dẫn AI đang xem xét chìa khóa mới của bé...");

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/cyber-guide/analyze", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-gemini-key": apiKey || "",
            "x-gemini-model": selectedModel || ""
          },
          body: JSON.stringify({
            length: properties.length,
            hasUpper: properties.hasUpper,
            hasLower: properties.hasLower,
            hasNumber: properties.hasNumber,
            hasSpecial: properties.hasSpecial,
            sensitiveDetected: properties.sensitiveDetected,
            sensitiveDetails: properties.sensitiveDetails
          })
        });

        const data = await res.json();
        if (res.status === 401) {
          setAiFeedback("🔴 Yêu cầu cấu hình API Key. Bé hãy nhấp vào nút Cài đặt để thiết lập.");
          setShowSettingsModal(true);
        } else if (!res.ok || data.error) {
          setAiFeedback(`🔴 Đã dừng do lỗi: ${data.error || "Không thể phân tích mật mã"}`);
        } else if (data.feedback) {
          setAiFeedback(data.feedback);
        }
      } catch (err) {
        console.error("Analysis API failed:", err);
        setAiFeedback("🔴 Đã dừng do lỗi: Chà, rào chắn truyền tin của ta đang bảo trì một xíu!");
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500); // 1.5s debounce to keep typing smooth

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [password, properties, apiKey, selectedModel]);

  // Evaluate dynamic gamification badges
  useEffect(() => {
    let updated = false;
    const newBadges = badges.map(badge => {
      let nowUnlocked = badge.unlocked;

      if (badge.id === "rookie") {
        nowUnlocked = properties.length >= 4;
      } else if (badge.id === "knight") {
        nowUnlocked = strength === "strong" || strength === "legendary";
      } else if (badge.id === "master") {
        nowUnlocked = (strength === "strong" || strength === "legendary") && !properties.sensitiveDetected;
      } else if (badge.id === "wall") {
        nowUnlocked = properties.length >= 12;
      } else if (badge.id === "sage") {
        nowUnlocked = questionsAsked >= 1;
      }

      if (nowUnlocked && !badge.unlocked) {
        updated = true;
        // Trigger visual fanfare for newly unlocked badge
        setCelebratedBadge(badge.name);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }

      return { ...badge, unlocked: nowUnlocked };
    });

    if (updated) {
      setBadges(newBadges);
    }
  }, [properties, strength, questionsAsked]);

  const handlePasswordChange = (
    newPw: string,
    newStrength: PasswordStrength,
    newProps: typeof properties
  ) => {
    setPassword(newPw);
    setStrength(newStrength);
    setProperties(newProps);
  };

  const handleQuestionAsked = () => {
    setQuestionsAsked(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-sky-950 font-sans pb-16">
      {/* Top Header Row */}
      <header className="bg-white/80 backdrop-blur-md border-b-4 border-sky-100 sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500 rounded-2xl text-white shadow-md shadow-sky-200 animate-pulse">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-sky-950 flex items-center gap-2">
                Phòng Thí Nghiệm Bảo Mật 🛡️
              </h1>
              <p className="text-xs font-bold text-sky-500 uppercase tracking-widest">
                Dành Cho Các Đặc Vụ Nhí
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {!apiKey ? (
              <a 
                href="https://aistudio.google.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-black text-rose-600 hover:underline animate-pulse mr-1"
              >
                🔴 Lấy API key để sử dụng app
              </a>
            ) : (
              <span className="text-xs font-bold text-emerald-600 mr-1">
                🟢 Đã cấu hình Key
              </span>
            )}

            <button
              id="settings-btn"
              onClick={() => {
                setTempApiKey(apiKey);
                setTempModel(selectedModel);
                setShowSettingsModal(true);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-4 py-2 rounded-full border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              ⚙️ Cài đặt (API Key)
            </button>

            <span className="bg-sky-50 text-sky-700 px-4 py-1.5 font-bold rounded-full text-xs border border-sky-100 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-sky-500" />
              Chế độ Đặc vụ Ngoại tuyến
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* Intro Banner Card */}
        <section className="bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl p-6 text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-15 select-none pointer-events-none transform translate-x-12 -translate-y-6">
            <Lock className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <span className="bg-white/20 px-3 py-1 text-xs font-black uppercase rounded-full tracking-wider">
              Nhiệm Vụ Tuần Này
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-3">
              Chế tạo chiếc "Chìa khóa vạn năng" bảo vệ kho báu!
            </h2>
            <p className="text-sky-100 text-sm sm:text-base mt-2 leading-relaxed">
              Chào mừng Đặc vụ nhí đến với Phòng Thí nghiệm! Bằng cách thêm các <b>chữ cái khổng lồ</b>, 
              <b>chữ số bí mật</b>, và <b>phép thuật bổ trợ</b>, bé sẽ chế tạo ra những chiếc chìa khóa mật mã mạnh mẽ nhất 
              để đánh bại Robot Bẻ Khóa của Hacker. Mọi thông tin tại đây đều được giữ bí mật tuyệt đối!
            </p>
          </div>
        </section>

        {/* Dynamic Badge unlock toast */}
        {showCelebration && (
          <div className="fixed top-24 right-6 bg-amber-500 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce border-3 border-white">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-xs text-amber-100">HUÂN CHƯƠNG MỚI!</p>
              <p className="text-sm">Bé vừa mở khóa thành công: {celebratedBadge}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input + AI Agent Bubble (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <PasswordInputZone onPasswordChange={handlePasswordChange} />

            {/* AI Guide Live Interaction Status Box */}
            <div className="bg-white rounded-3xl p-6 border-4 border-sky-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Người Hướng dẫn AI
              </div>
              <div className="flex gap-4 items-start">
                <div className="text-4xl bg-sky-50 p-3 rounded-2xl shrink-0">
                  👩‍🏫
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-sky-950 text-base flex items-center gap-1.5">
                    Lời Khuyên Từ Chỉ Huy AI
                    {isAnalyzing && (
                      <span className="inline-block w-2.5 h-2.5 bg-sky-500 rounded-full animate-ping" />
                    )}
                  </h3>
                  <div className={`text-sm leading-relaxed font-medium ${aiFeedback.startsWith("🔴") ? "text-rose-600 font-bold" : "text-sky-800"}`}>
                    {password ? aiFeedback : "Nhập một mật mã bất kỳ vào ô chế tạo bên trên để nhận được lời khuyên, gợi ý và giải mã trực tiếp từ ta nha!"}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Chat box for Q&A */}
            <SafetyGuideChat 
              onQuestionAsked={handleQuestionAsked} 
              aiFeedbackText={password && !isAnalyzing ? aiFeedback : undefined}
              apiKey={apiKey}
              selectedModel={selectedModel}
            />
          </div>

          {/* Right Column: Simulations + Achievements (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <RobotCracker
              passwordLength={password.length}
              strength={strength}
              properties={properties}
            />

            <BadgeCollection badges={badges} />
          </div>
        </div>

        {/* Static privacy and educative footer */}
        <footer className="mt-12 border-t-4 border-sky-100 pt-8 flex flex-col md:flex-row items-center justify-between text-sky-900/40 text-xs font-bold uppercase tracking-wider gap-4">
          <p>🛡️ Phòng Thí nghiệm Bảo mật Hoạt động Ngoại tuyến Toàn bộ</p>
          <p>© 2026 Đặc vụ Mật mã nhí — Bảo mật & Giáo dục</p>
        </footer>
      </main>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-sky-100 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95 duration-200 relative text-sky-950 font-sans">
            <h2 className="text-xl font-black text-sky-950 flex items-center gap-2">
              ⚙️ Cài đặt Model & API Key
            </h2>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-sky-900/80">
                1. Nhập Gemini API Key
              </label>
              <input
                type="text"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Nhập AI Studio API Key..."
                className="w-full px-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:border-sky-400 focus:outline-none font-mono text-sm"
              />
              <p className="text-xs text-sky-700/80 leading-relaxed font-medium">
                Để lấy API key miễn phí, bé hãy cùng bố mẹ truy cập:{" "}
                <a 
                  href="https://aistudio.google.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sky-600 font-black hover:underline"
                >
                  Google AI Studio 🔑
                </a>
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-sky-900/80">
                2. Chọn Model AI xử lý
              </label>
              
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: "gemini-3-flash-preview", name: "gemini-3-flash-preview (Mặc định)", desc: "Xử lý siêu tốc, phản hồi nhanh" },
                  { id: "gemini-3-pro-preview", name: "gemini-3-pro-preview", desc: "Thông minh vượt trội, bảo mật cao" },
                  { id: "gemini-2.5-flash", name: "gemini-2.5-flash", desc: "Mẫu ổn định, đa năng" }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setTempModel(m.id)}
                    className={`p-3.5 rounded-2xl border-3 text-left transition-all cursor-pointer ${
                      tempModel === m.id
                        ? "border-sky-500 bg-sky-50 shadow-sm"
                        : "border-gray-100 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-bold text-xs text-sky-950">{m.name}</p>
                    <p className="text-[10px] text-sky-700/70 font-bold mt-1">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {apiKey && (
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold rounded-2xl transition-all cursor-pointer border border-slate-200"
                >
                  Đóng
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={!tempApiKey.trim()}
                className={`flex-1 py-3 text-sm font-bold rounded-2xl text-white shadow-md transition-all cursor-pointer ${
                  !tempApiKey.trim()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-sky-500 hover:bg-sky-600 active:scale-95"
                }`}
              >
                Lưu Cài Đặt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
