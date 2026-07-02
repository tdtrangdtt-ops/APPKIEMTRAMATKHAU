import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ShieldCheck, ShieldAlert, Zap, AlertTriangle, Sparkles } from "lucide-react";
import { PasswordStrength, SensitivePattern } from "../types";

interface PasswordInputZoneProps {
  onPasswordChange: (
    password: string, 
    strength: PasswordStrength, 
    properties: {
      length: number;
      hasUpper: boolean;
      hasLower: boolean;
      hasNumber: boolean;
      hasSpecial: boolean;
      sensitiveDetected: boolean;
      sensitiveDetails: string;
    }
  ) => void;
}

// Common Vietnamese names and keywords that kids might use
const COMMON_VIETNAMESE_SENSITIVE = [
  "hoang", "hung", "nam", "lan", "hoa", "anh", "minh", "vy", "dung", "hiep", "trang", "long", 
  "phong", "tuan", "khanh", "linh", "huong", "mai", "duc", "hai", "thanh", "yen", "son",
  "matkhau", "123456", "admin", "admin123", "qwerty", "asdfgh"
];

export default function PasswordInputZone({ onPasswordChange }: PasswordInputZoneProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [patterns, setPatterns] = useState<SensitivePattern[]>([]);

  // Password properties
  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  // Check for sensitive patterns
  useEffect(() => {
    const detected: SensitivePattern[] = [];
    const lowerPw = password.toLowerCase();

    // 1. Check for common names or simple dictionary words
    const matchedNames = COMMON_VIETNAMESE_SENSITIVE.filter(name => lowerPw.includes(name));
    if (matchedNames.length > 0) {
      detected.push({
        name: "Tên riêng hoặc từ phổ biến",
        detected: true,
        reason: `Mật khẩu có chứa từ dễ đoán: "${matchedNames.join(", ")}"`,
        suggestion: "Hãy tránh dùng tên riêng, biệt danh hoặc từ phổ biến nha. Kẻ đột nhập có thể đoán ra rất nhanh!"
      });
    }

    // 2. Check for years (e.g. 1980 - 2026)
    const yearRegex = /(19[8-9][0-9]|20[0-2][0-6])/;
    const yearMatch = password.match(yearRegex);
    if (yearMatch) {
      detected.push({
        name: "Năm sinh hoặc mốc thời gian",
        detected: true,
        reason: `Mật khẩu có chứa năm: "${yearMatch[0]}"`,
        suggestion: "Ngày sinh hoặc năm sinh là bí mật cá nhân dễ đoán nhất. Chúng mình nên giấu nó đi!"
      });
    }

    // 3. Check for sequential characters (e.g., 123, abc)
    const sequences = ["123", "abc", "qwerty", "xyz"];
    const matchedSeq = sequences.filter(seq => lowerPw.includes(seq));
    if (matchedSeq.length > 0) {
      detected.push({
        name: "Dãy ký tự liên tiếp",
        detected: true,
        reason: `Có chuỗi dễ đoán: "${matchedSeq.join(", ")}"`,
        suggestion: "Các phím nằm cạnh nhau trên bàn phím rất dễ bị Robot bẻ khóa dò ra trong nháy mắt!"
      });
    }

    // 4. Check for telephone numbers (e.g. sequence of 7+ digits or starts with 0)
    const phoneRegex = /(0[3|5|7|8|9][0-9]{8})|([0-9]{7,})/;
    const phoneMatch = password.match(phoneRegex);
    if (phoneMatch && !matchedSeq.some(seq => seq === "123")) {
      detected.push({
        name: "Số điện thoại hoặc dãy số dài",
        detected: true,
        reason: `Mật khẩu có dãy số dài: "${phoneMatch[0]}"`,
        suggestion: "Số điện thoại của bố mẹ hay của bạn rất dễ bị lộ. Đừng đưa nó vào chìa khóa nhé!"
      });
    }

    setPatterns(detected);

    // Calculate strength based on criteria
    let score = 0;
    if (length > 0) {
      if (length >= 8) score += 2;
      else score += 1;
      
      if (length >= 12) score += 1; // Extra point for long length
      if (hasUpper) score += 1;
      if (hasLower) score += 1;
      if (hasNumber) score += 1;
      if (hasSpecial) score += 1;
      
      // Penalize sensitive details
      if (detected.length > 0) score = Math.max(1, score - 2);
    }

    let strength: PasswordStrength = "weak";
    if (score >= 7) strength = "legendary";
    else if (score >= 5) strength = "strong";
    else if (score >= 3) strength = "medium";

    onPasswordChange(password, strength, {
      length,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      sensitiveDetected: detected.length > 0,
      sensitiveDetails: detected.map(d => d.reason).join("; ")
    });
  }, [password]);

  const getStrengthBadge = (strength: PasswordStrength) => {
    switch (strength) {
      case "legendary":
        return {
          text: "Huyền Thoại 👑",
          bg: "bg-purple-100 text-purple-700 border-purple-200",
          desc: "Siêu chìa khóa! Thách thức mọi Robot bẻ khóa!"
        };
      case "strong":
        return {
          text: "Rất Mạnh 🛡️",
          bg: "bg-emerald-100 text-emerald-700 border-emerald-200",
          desc: "Lá chắn kiên cố bảo vệ kho báu tuyệt vời!"
        };
      case "medium":
        return {
          text: "Trung Bình ⚡",
          bg: "bg-amber-100 text-amber-700 border-amber-200",
          desc: "Khá tốt nhưng cần thêm phép thuật bổ trợ để mạnh hơn."
        };
      case "weak":
      default:
        return {
          text: "Quá Yếu 🛑",
          bg: "bg-rose-100 text-rose-700 border-rose-200",
          desc: "Robot có thể phá cổng trong 1 giây! Hãy gia cố ngay!"
        };
    }
  };

  const badgeConfig = getStrengthBadge(password ? (length < 4 ? "weak" : (patterns.length > 0 ? (length >= 12 ? "medium" : "weak") : (length >= 12 && hasUpper && hasNumber && hasSpecial ? "legendary" : (length >= 8 && (hasUpper || hasSpecial) ? "strong" : "medium")))) : "weak");

  return (
    <div id="password-zone" className="bg-white rounded-3xl p-6 border-4 border-sky-100 shadow-xl transition-all hover:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-sky-950 flex items-center gap-2">
          <Zap className="text-sky-500 w-6 h-6 animate-bounce" />
          Khu Chế Tạo Mật Mã
        </h2>
        {password && (
          <span className={`px-3 py-1 text-sm font-bold rounded-full border ${badgeConfig.bg}`}>
            {badgeConfig.text}
          </span>
        )}
      </div>

      {/* Input container */}
      <div className="relative mb-5">
        <input
          id="password-input"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập chiếc chìa khóa của bé tại đây..."
          className="w-full px-5 py-4 text-lg bg-sky-50/50 border-3 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none transition-all placeholder:text-sky-300 font-medium"
        />
        <button
          id="toggle-password-btn"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 p-1"
          title={showPassword ? "Ẩn chìa khóa" : "Hiện chìa khóa"}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {password && (
        <p className="text-sm font-medium text-sky-700 mb-6 bg-sky-50 p-3 rounded-xl border border-sky-100/50">
          ✨ {badgeConfig.desc}
        </p>
      )}

      {/* Checklist items styled for kids */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-bold text-sky-900/60 uppercase tracking-wider mb-2">Thành phần chế tạo:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${length >= 8 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
            <span className="text-2xl">📏</span>
            <div>
              <p className="font-bold text-sm">Cánh tay dài lâu</p>
              <p className="text-xs">Độ dài từ 8 ký tự trở lên</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${hasUpper ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
            <span className="text-2xl">🔠</span>
            <div>
              <p className="font-bold text-sm">Chữ cái khổng lồ</p>
              <p className="text-xs">Có ít nhất một chữ IN HOA</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${hasNumber ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
            <span className="text-2xl">🔢</span>
            <div>
              <p className="font-bold text-sm">Chữ số bí mật</p>
              <p className="text-xs">Có các con số (0-9)</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${hasSpecial ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-bold text-sm">Phép thuật bổ trợ</p>
              <p className="text-xs">Có ký tự đặc biệt (@, #, $, !...)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings Zone */}
      {patterns.length > 0 && (
        <div id="sensitive-warnings" className="bg-amber-50 border-3 border-amber-200 rounded-2xl p-4 space-y-3 animate-pulse">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-500 w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 text-base">Cảnh báo: Bí mật bị rò rỉ!</h4>
              <p className="text-xs text-amber-900 mt-1">Chúng mình phát hiện một số thông tin riêng tư có thể bị lộ trong chìa khóa này.</p>
            </div>
          </div>
          <div className="space-y-2 border-t border-amber-150 pt-3">
            {patterns.map((pat, index) => (
              <div key={index} className="bg-white/80 p-3 rounded-xl text-xs border border-amber-100">
                <p className="font-bold text-amber-950 flex items-center gap-1">
                  🔍 {pat.name}: <span className="text-rose-600 font-mono">{pat.reason.split(": ")[1]}</span>
                </p>
                <p className="text-amber-800 mt-1 font-medium">{pat.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
