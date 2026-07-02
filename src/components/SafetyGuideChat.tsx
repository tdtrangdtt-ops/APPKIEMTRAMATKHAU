import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, Volume2, VolumeX, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";

interface SafetyGuideChatProps {
  onQuestionAsked: () => void;
  aiFeedbackText?: string;
  apiKey?: string;
  selectedModel?: string;
}

const PRESET_QUESTIONS = [
  "Vì sao không nên đặt mật khẩu bằng ngày sinh? 🎂",
  "Làm thế nào để nhớ được các mật khẩu siêu mạnh? 🧠",
  "Phép thuật bổ trợ (ký tự đặc biệt) giúp ích gì thế ạ? ✨",
  "Ai đó có thể bẻ khóa mật khẩu của cháu như thế nào? 🤖"
];

export default function SafetyGuideChat({ onQuestionAsked, aiFeedbackText, apiKey, selectedModel }: SafetyGuideChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Xin chào Đặc vụ nhí! Ta là Người Hướng dẫn An toàn Mạng AI. Phòng thí nghiệm này của chúng ta cực kỳ bí mật và an toàn! Cháu có câu hỏi nào về cách chế tạo chiếc chìa khóa vạn năng không? Cứ hỏi ta nha!",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle incoming feedback text changes to optionally speak them or add as alerts
  useEffect(() => {
    if (aiFeedbackText && messages[messages.length - 1]?.text !== aiFeedbackText) {
      setMessages(prev => [
        ...prev,
        {
          id: `feedback-${Date.now()}`,
          sender: "ai",
          text: aiFeedbackText,
          timestamp: Date.now()
        }
      ]);
      if (ttsEnabled) {
        speakText(aiFeedbackText);
      }
    }
  }, [aiFeedbackText]);

  // Speak text using browser SpeechSynthesis
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // Stop any active speech

    // Remove markdown-like tags to make TTS cleaner
    const cleanText = text
      .replace(/[*_#`~@$]/g, "")
      .replace(/:\w+:/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "vi-VN";

    // Find Vietnamese voice if available
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.toLowerCase().includes("vi"));
    if (viVoice) {
      utterance.voice = viVoice;
    }
    utterance.pitch = 1.15; // friendly pitch
    utterance.rate = 0.95;  // easy to follow

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);
    onQuestionAsked(); // Trigger badge check

    try {
      // Build context history from last few messages
      const historyContext = messages.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch("/api/cyber-guide/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-key": apiKey || "",
          "x-gemini-model": selectedModel || ""
        },
        body: JSON.stringify({
          message: text,
          history: historyContext
        })
      });

      const data = await res.json();
      if (res.status === 401) {
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "ai",
            text: "🔴 Yêu cầu cấu hình API Key. Bé hãy nhấp vào nút Cài đặt để thiết lập nha!",
            timestamp: Date.now()
          }
        ]);
      } else if (!res.ok || data.error) {
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "ai",
            text: `🔴 Đã dừng do lỗi: ${data.error || "Không thể tải phản hồi từ AI."}`,
            timestamp: Date.now()
          }
        ]);
      } else if (data.reply) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: data.reply,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
        if (ttsEnabled) {
          speakText(data.reply);
        }
      } else {
        throw new Error("No response text");
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: `🔴 Đã dừng do lỗi: Chà, Cổng liên lạc có chút gió bụi rồi. Lỗi: ${err.message || String(err)}`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTts = () => {
    const nextState = !ttsEnabled;
    setTtsEnabled(nextState);
    if (nextState) {
      speakText(messages[messages.length - 1]?.text || "Ta đã sẵn sàng nói chuyện!");
    } else {
      window.speechSynthesis?.cancel();
    }
  };

  // Pre-load voices to ensure speech synthesis works smoothly
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <div id="safety-guide-chat" className="bg-white rounded-3xl p-6 border-4 border-emerald-100 shadow-xl flex flex-col h-[520px]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
          <MessageSquare className="text-emerald-500 w-6 h-6 animate-pulse" />
          Hỏi Đáp Với Người Hướng Dẫn AI
        </h2>
        
        {/* TTS Toggle Switch */}
        <button
          id="toggle-tts-btn"
          onClick={toggleTts}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            ttsEnabled
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
          }`}
          title={ttsEnabled ? "Tắt giọng nói" : "Bật đọc giọng nói tiếng Việt"}
        >
          {ttsEnabled ? (
            <>
              <Volume2 className="w-4 h-4 animate-bounce" />
              Đang bật tiếng 🔊
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              Tắt tiếng 🔇
            </>
          )}
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 bg-emerald-50/35 rounded-2xl border-2 border-emerald-50 mb-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {/* Avatar */}
            <div className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.sender === "user" ? "bg-sky-100" : "bg-emerald-100"
            }`}>
              {msg.sender === "user" ? "👧" : "👩‍🏫"}
            </div>

            {/* Bubble */}
            <div className={`p-3.5 rounded-2xl text-sm leading-relaxed border shadow-sm ${
              msg.sender === "user"
                ? "bg-sky-500 text-white border-sky-400 rounded-tr-none"
                : msg.text.startsWith("🔴")
                ? "bg-rose-50 text-rose-700 border-rose-200 rounded-tl-none font-bold animate-pulse"
                : "bg-white text-emerald-950 border-emerald-100 rounded-tl-none"
            }`}>
              {msg.text}
              
              {/* Individual Speak Button for AI responses */}
              {msg.sender === "ai" && !msg.text.startsWith("🔴") && (
                <button
                  onClick={() => speakText(msg.text)}
                  className="block mt-1.5 text-[10px] font-bold text-emerald-600/70 hover:text-emerald-700 flex items-center gap-1 hover:underline"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe lại giọng nói
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="text-2xl w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center animate-spin">
              👩‍🏫
            </div>
            <div className="bg-white border border-emerald-100 p-3.5 rounded-2xl text-sm text-emerald-950 rounded-tl-none animate-pulse">
              Đang nghiên cứu câu hỏi của đặc vụ nhí... 🔮
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Qs (scrolling container) */}
      <div className="mb-3 overflow-x-auto whitespace-nowrap py-1 space-x-2 shrink-0 no-scrollbar">
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-normal max-w-xs align-top"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="flex gap-2 shrink-0">
        <input
          id="chat-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
          placeholder="Hỏi Người Hướng dẫn AI bất kỳ điều gì..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-300 focus:outline-none focus:bg-white text-sm transition-all"
        />
        <button
          id="send-chat-btn"
          onClick={() => handleSendMessage(inputValue)}
          disabled={isLoading || !inputValue.trim()}
          className={`p-3 rounded-xl text-white transition-all ${
            isLoading || !inputValue.trim()
              ? "bg-gray-200 cursor-not-allowed text-gray-400"
              : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-md"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
