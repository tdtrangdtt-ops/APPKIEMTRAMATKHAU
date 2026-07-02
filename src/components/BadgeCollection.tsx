import React from "react";
import { Award, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "../types";

interface BadgeCollectionProps {
  badges: Badge[];
}

export default function BadgeCollection({ badges }: BadgeCollectionProps) {
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div id="badge-collection-panel" className="bg-white rounded-3xl p-6 border-4 border-amber-100 shadow-xl transition-all hover:shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2">
          <Award className="text-amber-500 w-6 h-6 animate-pulse" />
          Hòm Huân Chương Đặc Vụ
        </h2>
        <span className="text-sm bg-amber-50 text-amber-700 px-3 py-1 font-bold rounded-full border border-amber-200 flex items-center gap-1">
          🏆 {unlockedCount}/{badges.length} Đã Mở
        </span>
      </div>

      <p className="text-xs text-amber-900/60 mb-6 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
        ✨ Hoàn thành các thử thách chế tạo mật mã để mở khóa huân chương danh giá và nâng cấp cấp độ đặc vụ của bé nha!
      </p>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            id={`badge-card-${badge.id}`}
            className={`p-4 rounded-2xl border-3 transition-all relative overflow-hidden group ${
              badge.unlocked
                ? "bg-gradient-to-br from-amber-50 to-orange-50/30 border-amber-200 shadow-md hover:-translate-y-1"
                : "bg-gray-50/50 border-gray-100 opacity-60"
            }`}
          >
            {/* Sparkle effects on unlocked badges */}
            {badge.unlocked && (
              <div className="absolute top-1 right-1">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              </div>
            )}

            <div className="flex gap-3 items-start">
              <div className={`text-4xl p-2.5 rounded-xl ${badge.unlocked ? 'bg-amber-100 animate-bounce' : 'bg-gray-100'}`}>
                {badge.unlocked ? badge.icon : "🔒"}
              </div>
              
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-1">
                  <h4 className={`font-bold text-sm ${badge.unlocked ? 'text-amber-950' : 'text-gray-500'}`}>
                    {badge.name}
                  </h4>
                  {badge.unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
                <p className={`text-xs ${badge.unlocked ? 'text-amber-900/80' : 'text-gray-400'}`}>
                  {badge.description}
                </p>
                <p className="text-[10px] font-medium text-amber-600/70 bg-white/60 px-2 py-0.5 rounded-md inline-block mt-1">
                  🎯 Yêu cầu: {badge.criteria}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
