import React, { useState, useEffect, useRef } from "react";
import { Planet } from "../types";
import { planets } from "../data";
import { Eye, Volume2, VolumeX, Sparkles, HelpCircle, AudioLines } from "lucide-react";

interface TelescopeLabProps {
  currentPlanet: Planet;
}

export default function TelescopeLab({ currentPlanet }: TelescopeLabProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [narratorVoice, setNarratorVoice] = useState<string>("Kore"); // Kore (Female) or Zephyr (Male)
  const [captionText, setCaptionText] = useState<string>("");
  const [captionIndex, setCaptionIndex] = useState<number>(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const captionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopAudio();
    };
  }, []);

  // Stop audio whenever planet changes, and update zoom
  useEffect(() => {
    stopAudio();
    setZoomLevel(1.2);
    setCaptionText("Đặt kính viễn vọng hướng về " + currentPlanet.name + ". Sẵn sàng thám hiểm.");
  }, [currentPlanet]);

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel(); // cancel any active speaking

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to select a Vietnamese voice if available
    const voices = synthRef.current.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith("vi") || v.name.includes("Vietnam") || v.name.includes("Google vi-VN"));
    if (viVoice) {
      utterance.voice = viVoice;
    }
    
    // Adjust pitch / rate based on mock narrator choices
    if (narratorVoice === "Kore") {
      utterance.pitch = 1.1; // warmer/slightly higher female
      utterance.rate = 0.95; // child-friendly paced speech
    } else {
      utterance.pitch = 0.85; // deep male voice
      utterance.rate = 1.0;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
      animateCaptionsEnd();
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      animateCaptionsEnd();
    };

    utteranceRef.current = utterance;
    setIsPlayingAudio(true);
    synthRef.current.speak(utterance);

    // Start closed-caption typewriter sync simulation
    startCaptionStream(text);
  };

  const startCaptionStream = (text: string) => {
    if (captionTimerRef.current) clearInterval(captionTimerRef.current);

    const words = text.split(" ");
    let currentWordIndex = 0;
    setCaptionText(words[0]);

    captionTimerRef.current = window.setInterval(() => {
      currentWordIndex++;
      if (currentWordIndex < words.length) {
        setCaptionText((prev) => prev + " " + words[currentWordIndex]);
      } else {
        if (captionTimerRef.current) clearInterval(captionTimerRef.current);
      }
    }, 280); // Speed of scrolling text
  };

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (captionTimerRef.current) {
      clearInterval(captionTimerRef.current);
    }
    setIsPlayingAudio(false);
  };

  const animateCaptionsEnd = () => {
    if (captionTimerRef.current) clearInterval(captionTimerRef.current);
  };

  const handlePlayNarrative = () => {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      const narrative = `${currentPlanet.name}, còn gọi là ${currentPlanet.englishName}. ${currentPlanet.description} Một sự thật thú vị là: ${currentPlanet.funFact}`;
      speakText(narrative);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full" id="telescope-lab-block">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Kính Viễn Vọng Ảo & AI Thuyết Minh</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">Giọng AI:</span>
          <select
            value={narratorVoice}
            onChange={(e) => {
              setNarratorVoice(e.target.value);
              stopAudio();
            }}
            className="text-[10px] bg-slate-950 border border-slate-800 text-slate-200 py-0.5 px-1.5 rounded focus:outline-none"
          >
            <option value="Kore">👩‍🚀 Kore (Nữ trầm ấm)</option>
            <option value="Zephyr">👨‍🚀 Zephyr (Nam truyền cảm)</option>
          </select>
        </div>
      </div>

      {/* Main Viewfinder Box */}
      <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[190px] flex flex-col justify-center items-center overflow-hidden">
        {/* Hologram alignment grids */}
        <div className="absolute inset-0 border border-slate-800/40 pointer-events-none rounded-xl"></div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-500/10 pointer-events-none"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-500/10 pointer-events-none"></div>

        {/* Circular Viewport */}
        <div className="relative w-44 h-44 md:w-48 md:h-48 rounded-full border-4 border-slate-800 flex items-center justify-center bg-[#010309] shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden">
          {/* Scientific reticle overlay */}
          <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/20 pointer-events-none animate-[spin_50s_linear_infinite]"></div>
          <div className="absolute inset-6 rounded-full border border-cyan-500/10 pointer-events-none"></div>

          {/* Planet Visual Closeup */}
          <div
            className="w-28 h-28 md:w-32 md:h-32 rounded-full transition-transform duration-500 flex items-center justify-center relative"
            style={{
              transform: `scale(${zoomLevel})`,
            }}
          >
            {/* Base Planet Circle with complex shadows */}
            <div
              className="absolute inset-0 rounded-full shadow-inner"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${currentPlanet.color} 10%, ${currentPlanet.secondaryColor || "#1e293b"} 100%)`,
                boxShadow: "inset -15px -15px 40px rgba(0,0,0,0.8), 0 0 20px rgba(6,182,212,0.2)",
              }}
            ></div>

            {/* Atmosphere/Shine glow */}
            <div
              className="absolute inset-0 rounded-full mix-blend-screen opacity-40 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 25% 25%, #ffffff 0%, transparent 60%)`,
              }}
            ></div>

            {/* Saturn Special Rings */}
            {currentPlanet.id === "saturn" && (
              <div
                className="absolute w-[200%] h-[40%] border-4 border-amber-400/40 rounded-full pointer-events-none"
                style={{
                  transform: "rotate(-15deg) scaleY(0.4)",
                  boxShadow: "0 0 10px rgba(245,158,11,0.2)",
                }}
              ></div>
            )}
          </div>

          {/* Tech coordinates inside lens */}
          <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
            <span className="text-[8px] text-cyan-400/60 font-mono tracking-widest uppercase">
              MAG: {(zoomLevel * 10).toFixed(0)}X | TRG: {currentPlanet.englishName}
            </span>
          </div>
        </div>

        {/* Dynamic Zoom slider below lens */}
        <div className="w-2/3 mt-3 flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">1X</span>
          <input
            type="range"
            min="0.8"
            max="2.5"
            step="0.1"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-500 font-mono">5X</span>
        </div>
      </div>

      {/* Closed Captions & Voice waveform block */}
      <div className="mt-3 bg-slate-950 border border-slate-800 rounded-lg p-3 min-h-[90px] flex flex-col justify-between">
        {/* Animated closed captions */}
        <p className="text-xs text-slate-300 leading-relaxed italic transition-all duration-300 flex-1">
          {captionText}
        </p>

        {/* Pulsating Audio wave visualizer */}
        {isPlayingAudio && (
          <div className="flex items-center gap-1.5 h-6 mt-2 justify-center border-t border-slate-900 pt-2 animate-pulse">
            <AudioLines className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">AI AUDIO STREAMING...</span>
            <div className="flex gap-0.5 items-end h-3">
              <span className="w-0.5 bg-cyan-400 h-2 rounded animate-[pulse_0.4s_infinite_alternate]"></span>
              <span className="w-0.5 bg-cyan-400 h-3 rounded animate-[pulse_0.6s_infinite_alternate_0.1s]"></span>
              <span className="w-0.5 bg-cyan-400 h-1.5 rounded animate-[pulse_0.5s_infinite_alternate_0.2s]"></span>
              <span className="w-0.5 bg-cyan-400 h-4 rounded animate-[pulse_0.7s_infinite_alternate_0.15s]"></span>
              <span className="w-0.5 bg-cyan-400 h-2.5 rounded animate-[pulse_0.5s_infinite_alternate]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Narrative play trigger */}
      <button
        onClick={handlePlayNarrative}
        className={`mt-4 py-2 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition ${
          isPlayingAudio
            ? "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/15"
            : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/15"
        }`}
      >
        {isPlayingAudio ? (
          <>
            <VolumeX className="w-4 h-4" />
            Dừng thuyết minh
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            Bật Thuyết Minh AI 🎙️
          </>
        )}
      </button>

      {/* Fun Facts card */}
      <div className="mt-3 bg-cyan-950/20 border border-cyan-900/30 rounded-lg p-2.5 text-xs flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-cyan-300 font-semibold text-[11px]">Thông số chi tiết (AR Card):</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-300 font-mono">
            <div>🪐 Vệ tinh: <span className="text-cyan-400">{currentPlanet.arDetails.moonsCount}</span></div>
            <div>🌡️ Nhiệt độ: <span className="text-cyan-400">{currentPlanet.arDetails.coreTemperature}</span></div>
            <div>🌫️ Khí quyển: <span className="text-cyan-400">{currentPlanet.arDetails.atmosphere}</span></div>
            <div>📅 Chu kỳ năm: <span className="text-cyan-400">{currentPlanet.arDetails.yearDuration}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
