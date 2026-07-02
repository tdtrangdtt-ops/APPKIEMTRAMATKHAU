import React, { useState } from "react";
import { Planet } from "../types";
import { planets } from "../data";
import { Trophy, Award, CheckCircle, AlertCircle, HelpCircle, Sparkles, RefreshCcw } from "lucide-react";

interface Quest {
  id: number;
  clue: string;
  correctPlanetId: string;
  points: number;
  badge: string;
}

const quests: Quest[] = [
  {
    id: 1,
    clue: "Tôi là hành tinh gần Mặt Trời nhất, nhỏ nhắn nhất và quay nhanh nhất, nhưng ban đêm lại lạnh cóng đến -180 độ C. Tôi là ai?",
    correctPlanetId: "mercury",
    points: 100,
    badge: "⚡ Tiên Phong Thần Tốc",
  },
  {
    id: 2,
    clue: "Tôi sở hữu bầu khí quyển CO2 siêu dày đặc, giữ nhiệt cực tốt biến tôi thành lò nướng nóng bỏng nhất Hệ Mặt Trời (465 độ C). Tôi là ai?",
    correctPlanetId: "venus",
    points: 150,
    badge: "🔥 Chúa Tể Nhiệt Độ",
  },
  {
    id: 3,
    clue: "Tôi là hành tinh có sắc đỏ do rỉ sét sắt trên bề mặt, và sở hữu ngọn núi lửa Olympus Mons cao gấp 3 lần Everest. Tôi là ai?",
    correctPlanetId: "mars",
    points: 120,
    badge: "🔴 Thám Hiểm Hành Tinh Đỏ",
  },
  {
    id: 4,
    clue: "Tôi là hành tinh to lớn vĩ đại nhất, có thể chứa vừa 1300 Trái Đất bên trong và mang một vết bão Đỏ Lớn khổng lồ hoành hành 350 năm. Tôi là ai?",
    correctPlanetId: "jupiter",
    points: 180,
    badge: "🪐 Bậc Thầy Khổng Lồ",
  },
  {
    id: 5,
    clue: "Tôi có mật độ siêu nhẹ có thể nổi trên mặt nước và nổi tiếng khắp thiên hà nhờ vành đai băng đá kỳ vĩ tráng lệ. Tôi là ai?",
    correctPlanetId: "saturn",
    points: 200,
    badge: "💍 Vành Đai Kỳ Vĩ",
  }
];

export default function LostPlanetQuest() {
  const [currentQuestIndex, setCurrentQuestIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [collectedFlashcards, setCollectedFlashcards] = useState<Planet[]>([]);
  const [badges, setBadges] = useState<string[]>([]);

  const activeQuest = quests[currentQuestIndex];

  const handleSelectPlanetOption = (planetId: string) => {
    if (isAnswered) return;
    setSelectedPlanetId(planetId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedPlanetId || isAnswered) return;

    const correct = selectedPlanetId === activeQuest.correctPlanetId;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore((prev) => prev + activeQuest.points);
      
      // Collect the planet's flashcard
      const planetObj = planets.find((p) => p.id === activeQuest.correctPlanetId);
      if (planetObj && !collectedFlashcards.some((p) => p.id === planetObj.id)) {
        setCollectedFlashcards((prev) => [...prev, planetObj]);
      }

      // Collect badge
      if (!badges.includes(activeQuest.badge)) {
        setBadges((prev) => [...prev, activeQuest.badge]);
      }
    }
  };

  const handleNextQuest = () => {
    setSelectedPlanetId(null);
    setIsAnswered(false);
    setIsCorrect(false);
    if (currentQuestIndex < quests.length - 1) {
      setCurrentQuestIndex((prev) => prev + 1);
    } else {
      // Loop or finish
      setCurrentQuestIndex(0);
    }
  };

  const handleResetQuest = () => {
    setCurrentQuestIndex(0);
    setScore(0);
    setSelectedPlanetId(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCollectedFlashcards([]);
    setBadges([]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full" id="lost-planet-quest-block">
      {/* Quiz Game Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Nhiệm vụ: Tìm kiếm Hành tinh Thất lạc</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-[9px] text-slate-400">ĐIỂM SỐ CHẶNG:</span>
            <span className="font-mono text-xs text-yellow-400 font-bold">{score} XP</span>
          </div>
          <button
            onClick={handleResetQuest}
            className="p-1 text-slate-400 hover:text-slate-200"
            title="Làm lại từ đầu"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Clue Prompt Box */}
      <div className="bg-slate-950 border border-indigo-950 p-4 rounded-xl mb-4 relative overflow-hidden">
        {/* Hologram aesthetic lines */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-indigo-500/20"></div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-950 flex items-center justify-center text-indigo-400 shrink-0 font-bold font-mono text-sm">
            Q{activeQuest.id}
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Mật thư từ tàu vũ trụ:</span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "{activeQuest.clue}"
            </p>
          </div>
        </div>
      </div>

      {/* Planet Selection Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {planets
          .filter((p) => p.id !== "sun" && p.id !== "moon")
          .map((p) => {
            const isSelected = selectedPlanetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPlanetOption(p.id)}
                disabled={isAnswered}
                className={`p-2 rounded-lg border text-left transition relative flex flex-col items-center justify-center text-center gap-2 ${
                  isSelected
                    ? "bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-400"
                    : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
                } ${isAnswered ? "opacity-80" : "cursor-pointer"}`}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-md"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.secondaryColor || "#1e293b"})`,
                  }}
                ></div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-200">{p.name}</span>
                  <span className="block text-[9px] text-slate-500 font-mono">{p.englishName}</span>
                </div>
              </button>
            );
          })}
      </div>

      {/* Answer feedback panel */}
      {isAnswered ? (
        <div className={`p-3.5 rounded-xl border mb-4 flex items-start gap-2.5 ${
          isCorrect 
            ? "bg-emerald-950/30 border-emerald-900/60 text-emerald-400" 
            : "bg-red-950/30 border-red-900/60 text-red-400"
        }`}>
          {isCorrect ? (
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
          )}
          <div className="space-y-1">
            <span className="font-semibold text-xs uppercase tracking-wide">
              {isCorrect ? "Câu Trả Lời Chính Xác! 🎉" : "Chưa Đúng Rồi! 😢"}
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isCorrect 
                ? `Tuyệt vời! Bạn đã mở khóa thành công thẻ học thuật AR 3D của ${planets.find(p => p.id === activeQuest.correctPlanetId)?.name} và được tặng danh hiệu: ${activeQuest.badge}!`
                : `Gợi ý: Hãy nhớ lại các thông số đặc trưng về vành đai, kích thước hoặc bầu khí quyển CO2 dày đặc nhé.`}
            </p>
          </div>
        </div>
      ) : null}

      {/* Trigger CTA button */}
      <div className="flex gap-2">
        {!isAnswered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedPlanetId}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-xs rounded-lg transition shadow-lg shadow-indigo-600/10"
          >
            Nộp câu trả lời 📡
          </button>
        ) : (
          <button
            onClick={handleNextQuest}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition shadow-lg shadow-emerald-600/10"
          >
            {currentQuestIndex === quests.length - 1 ? "Bắt đầu lại chặng 🌟" : "Mật thư tiếp theo ➡️"}
          </button>
        )}
      </div>

      {/* Collected rewards gallery */}
      <div className="mt-5 border-t border-slate-800/80 pt-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Thẻ AR đã thu thập ({collectedFlashcards.length}/5)</span>
          {badges.length > 0 && (
            <span className="text-[9px] bg-yellow-950/40 text-yellow-500 border border-yellow-900/30 px-1.5 py-0.5 rounded flex items-center gap-1">
              <Award className="w-3 h-3" />
              Đạt danh hiệu!
            </span>
          )}
        </div>

        {collectedFlashcards.length === 0 ? (
          <div className="bg-slate-950/40 border border-dashed border-slate-800 p-4 rounded-lg text-center text-slate-500 text-[10px]">
            Chưa có Thẻ Flashcard nào được sưu tầm. Hãy giải câu đố để mở khóa!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
            {collectedFlashcards.map((p) => (
              <div 
                key={p.id} 
                className="bg-slate-950 border border-emerald-950/60 p-2 rounded-lg flex items-center gap-2 relative overflow-hidden group"
              >
                {/* Visual glow on collected card */}
                <div className="absolute right-0 top-0 w-8 h-8 bg-emerald-500/5 rounded-full blur pointer-events-none"></div>
                <div 
                  className="w-6 h-6 rounded-full shrink-0"
                  style={{ background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.secondaryColor})` }}
                ></div>
                <div className="overflow-hidden">
                  <span className="block text-[10px] font-semibold text-slate-200 truncate">{p.name}</span>
                  <span className="block text-[8px] text-emerald-400 font-mono">THẺ HOLOGRAPHIC</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Badges row */}
        {badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {badges.map((badge, idx) => (
              <span key={idx} className="text-[9px] bg-slate-950 text-slate-300 border border-indigo-900/60 px-2 py-0.5 rounded-full">
                🏅 {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
