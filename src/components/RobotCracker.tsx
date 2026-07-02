import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, ShieldAlert, ShieldCheck, Play, RotateCcw, Cpu, Search, Calendar, ZapOff } from "lucide-react";
import { PasswordStrength, CrackMethod } from "../types";

interface RobotCrackerProps {
  passwordLength: number;
  strength: PasswordStrength;
  properties: {
    length: number;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    sensitiveDetected: boolean;
    sensitiveDetails: string;
  };
}

export default function RobotCracker({ passwordLength, strength, properties }: RobotCrackerProps) {
  const [activeTab, setActiveTab] = useState<"brute" | "dict" | "guess">("brute");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Sẵn sàng bẻ khóa!");
  const [attempts, setAttempts] = useState(0);
  const [crackTime, setCrackTime] = useState("");
  const [showResult, setShowResult] = useState(false);

  // Stop running and reset if password changes
  useEffect(() => {
    setIsRunning(false);
    setProgress(0);
    setStatusText("Sẵn sàng bẻ khóa chìa khóa mới!");
    setAttempts(0);
    setShowResult(false);
  }, [passwordLength, activeTab]);

  const runSimulation = () => {
    if (passwordLength === 0) {
      setStatusText("Hãy chế tạo mật mã trước khi bẻ khóa nha!");
      return;
    }
    setIsRunning(true);
    setProgress(0);
    setAttempts(0);
    setShowResult(false);

    let currentProgress = 0;
    let currentAttempts = 0;

    // Determine simulation speed based on password strength and simulation type
    let totalSteps = 40;
    let baseInterval = 40; // fast

    // If strong or legendary, make it take longer or error out
    let finalCrackTime = "";
    let isVulnerable = false;

    if (activeTab === "brute") {
      if (strength === "weak") {
        finalCrackTime = "0.02 giây";
        isVulnerable = true;
      } else if (strength === "medium") {
        finalCrackTime = "5 phút";
        isVulnerable = true;
      } else if (strength === "strong") {
        finalCrackTime = "38 năm";
        isVulnerable = false;
      } else {
        finalCrackTime = "99 tỷ năm";
        isVulnerable = false;
      }
    } else if (activeTab === "dict") {
      if (strength === "weak" || properties.sensitiveDetected) {
        finalCrackTime = "0.001 giây";
        isVulnerable = true;
      } else {
        finalCrackTime = "Thất bại hoàn toàn (Không nằm trong từ điển)";
        isVulnerable = false;
      }
    } else { // guess (personal info guessing)
      if (properties.sensitiveDetected) {
        finalCrackTime = "0.1 giây (Đã tìm thấy thông tin trùng khớp)";
        isVulnerable = true;
      } else {
        finalCrackTime = "Thất bại (Không thu thập được thông tin cá nhân)";
        isVulnerable = false;
      }
    }

    setCrackTime(finalCrackTime);

    const interval = setInterval(() => {
      currentProgress += 100 / totalSteps;
      currentAttempts += Math.floor(Math.random() * 5000) + 1000;

      setProgress(Math.min(100, currentProgress));
      setAttempts(currentAttempts);

      // Status messages based on progress
      if (currentProgress < 30) {
        setStatusText(
          activeTab === "brute"
            ? "🤖 Robot đang khởi tạo thuật toán xoay khóa..."
            : activeTab === "dict"
            ? "📖 Robot đang tra cứu kho từ điển phổ biến nhất..."
            : "🕵️‍♂️ Robot đang tìm kiếm thông tin của bé trên mạng..."
        );
      } else if (currentProgress < 70) {
        setStatusText(
          activeTab === "brute"
            ? "⚡ Robot tăng tốc độ xoay (Thử hàng triệu tổ hợp)..."
            : activeTab === "dict"
            ? "📖 Robot đang so khớp cấu trúc từ..."
            : "🕵️‍♂️ Robot đang thử ghép tên và năm sinh..."
        );
      } else if (currentProgress < 95) {
        setStatusText("🔒 Chuẩn bị đối chiếu lá chắn cuối cùng...");
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setShowResult(true);
        setStatusText(
          isVulnerable
            ? "💥 Ôi không! Cổng bảo vệ đã bị xuyên thủng!"
            : "🛡️ Xuất sắc! Robot đầu hàng, lá chắn quá vững chãi!"
        );
      }
    }, baseInterval);
  };

  const getRobotFace = () => {
    if (passwordLength === 0) return "😴"; // sleeping
    if (isRunning) return "🕵️"; // thinking / searching
    if (showResult) {
      if (strength === "strong" || strength === "legendary") {
        if (activeTab === "brute" || !properties.sensitiveDetected) return "😵"; // dizzy/defeated
        return "🤖";
      }
      return "😈"; // evil grin
    }
    return "🤖"; // normal
  };

  return (
    <div id="robot-cracker-panel" className="bg-white rounded-3xl p-6 border-4 border-rose-100 shadow-xl transition-all hover:shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-rose-950 flex items-center gap-2">
          <Cpu className="text-rose-500 w-6 h-6 animate-pulse" />
          Phòng Mô Phỏng Hacker
        </h2>
        <span className="text-xs bg-rose-50 text-rose-600 px-3 py-1 font-bold rounded-full border border-rose-100">
          Robot Bẻ Khóa v3.0
        </span>
      </div>

      {/* Tabs of hacking methods */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-rose-50/50 rounded-2xl mb-6">
        <button
          id="tab-brute"
          onClick={() => setActiveTab("brute")}
          className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
            activeTab === "brute"
              ? "bg-white text-rose-700 shadow-md"
              : "text-rose-500/70 hover:text-rose-700 hover:bg-rose-50"
          }`}
        >
          <Search className="w-4 h-4" />
          Mò Mẫm Siêu Tốc
        </button>
        <button
          id="tab-dict"
          onClick={() => setActiveTab("dict")}
          className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
            activeTab === "dict"
              ? "bg-white text-rose-700 shadow-md"
              : "text-rose-500/70 hover:text-rose-700 hover:bg-rose-50"
          }`}
        >
          <Cpu className="w-4 h-4" />
          Từ Điển Trộm Cắp
        </button>
        <button
          id="tab-guess"
          onClick={() => setActiveTab("guess")}
          className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
            activeTab === "guess"
              ? "bg-white text-rose-700 shadow-md"
              : "text-rose-500/70 hover:text-rose-700 hover:bg-rose-50"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Đoán Bí Mật Cá Nhân
        </button>
      </div>

      {/* Robot Simulator Stage */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white text-center relative overflow-hidden mb-5 border-4 border-slate-800">
        {/* Matrix Rain effect fallback / tech dots */}
        <div className="absolute inset-0 opacity-10 flex flex-wrap justify-center items-center font-mono text-[10px] text-green-500 overflow-hidden select-none pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mx-2">01011010110011011</span>
          ))}
        </div>

        <div className="relative z-10">
          {/* Animated Robot Face */}
          <motion.div
            animate={
              isRunning
                ? { y: [0, -10, 0], scale: [1, 1.05, 1] }
                : showResult && (strength === "strong" || strength === "legendary")
                ? { rotate: [0, -15, 15, -15, 0] }
                : {}
            }
            transition={{ repeat: isRunning ? Infinity : 0, duration: 1.2 }}
            className="text-6xl mb-4 select-none"
          >
            {getRobotFace()}
          </motion.div>

          <p className="font-mono text-sm text-sky-400 min-h-[40px] px-2 flex items-center justify-center">
            {statusText}
          </p>

          {/* Running indicators */}
          {(isRunning || showResult) && (
            <div className="mt-4 font-mono text-xs text-rose-300">
              <p>Số lần thử: <span className="text-white font-bold">{attempts.toLocaleString()}</span></p>
              {crackTime && <p className="mt-1">Thời gian bẻ khóa: <span className="text-yellow-400 font-bold">{crackTime}</span></p>}
            </div>
          )}

          {/* Progress bar */}
          {isRunning && (
            <div className="w-full bg-slate-800 rounded-full h-3 mt-4 overflow-hidden border border-slate-700">
              <motion.div
                className="bg-gradient-to-r from-rose-500 to-amber-500 h-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex gap-3">
        <button
          id="btn-run-simulation"
          onClick={runSimulation}
          disabled={isRunning || passwordLength === 0}
          className={`flex-1 py-3.5 px-4 font-bold rounded-2xl text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            passwordLength === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
              : isRunning
              ? "bg-rose-300 cursor-not-allowed"
              : "bg-rose-500 hover:bg-rose-600 active:scale-95"
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          Kích hoạt Robot Bẻ Khóa
        </button>
      </div>

      {/* Interactive explanations for kids */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`mt-5 p-4 rounded-2xl border-2 ${
              strength === "strong" || strength === "legendary"
                ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                : "bg-rose-50 border-rose-200 text-rose-950"
            }`}
          >
            <div className="flex gap-2.5">
              {strength === "strong" || strength === "legendary" ? (
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {strength === "strong" || strength === "legendary"
                    ? "🎉 Chúc mừng Đặc vụ! Lá chắn quá vững chãi!"
                    : "⚠️ Ôi không! Cánh cổng bí mật quá lỏng lẻo!"}
                </h4>
                <p className="text-xs mt-1 leading-relaxed">
                  {activeTab === "brute" && (
                    strength === "strong" || strength === "legendary"
                      ? "Robot mò mẫm siêu tốc đã đầu hàng! Để tìm ra chìa khóa này bằng cách thử từng chữ, Robot sẽ mất hàng ngàn tới hàng tỷ năm, khi đó robot đã bị gỉ sét rồi!"
                      : "Mật mã quá ngắn và đơn giản giúp Robot bẻ khóa nhanh chóng bằng phương pháp thử tất cả các chữ cái và số."
                  )}
                  {activeTab === "dict" && (
                    strength === "strong" || strength === "legendary"
                      ? "Chiếc chìa khóa của bé không hề có từ ngữ thông thường hay mật khẩu mẫu, nên phương pháp tra từ điển phổ biến của Hacker hoàn toàn vô tác dụng!"
                      : "Hacker có những thư viện khổng lồ chứa hàng triệu mật khẩu quen thuộc. Chỉ trong một cái nháy mắt, Robot đã tìm thấy mật mã của bé trong từ điển rồi!"
                  )}
                  {activeTab === "guess" && (
                    properties.sensitiveDetected
                      ? "Bằng cách tìm kiếm thông tin cá nhân như tên riêng, ngày sinh hay số điện thoại, Robot bẻ khóa đã dễ dàng suy luận ra mật mã. Tránh dùng thông tin riêng tư nha!"
                      : "Tuyệt vời! Bé không hề dùng thông tin cá nhân nào như tên hay ngày sinh trong mật khẩu, khiến Robot bẻ khóa không có manh mối nào để phỏng đoán!"
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
