import React, { useState } from "react";
import { SystemInstructionParams, LessonPlan } from "../types";
import { defaultSystemInstructionText, generateSystemInstructionMarkdown } from "../data";
import { Code, Copy, Check, Sparkles, BookOpen, Settings, RefreshCw, Layers } from "lucide-react";

export default function InstructionGenerator() {
  const [params, setParams] = useState<SystemInstructionParams>({
    grade: 3,
    mainFocus: "So sánh Tỷ lệ Thực và Kính Viễn vọng Ảo",
    pedagogicalFramework: "Học tập qua Trải nghiệm (Experiential Learning)",
    narratorVoice: "Kore",
  });

  const [generatedInstruction, setGeneratedInstruction] = useState<string>(
    generateSystemInstructionMarkdown(params)
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [copiedLesson, setCopiedLesson] = useState<boolean>(false);
  
  // Gemini Lesson Plan State
  const [lessonPlanText, setLessonPlanText] = useState<string>("");
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);
  const [errorLesson, setErrorLesson] = useState<string>("");

  const handleParamChange = (key: keyof SystemInstructionParams, value: any) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
    setGeneratedInstruction(generateSystemInstructionMarkdown(updated));
  };

  const handleCopyInstruction = () => {
    navigator.clipboard.writeText(generatedInstruction);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLesson = () => {
    if (!lessonPlanText) return;
    navigator.clipboard.writeText(lessonPlanText);
    setCopiedLesson(true);
    setTimeout(() => setCopiedLesson(false), 2000);
  };

  const handleGenerateLessonPlan = async () => {
    setIsLoadingLesson(true);
    setErrorLesson("");
    setLessonPlanText("");

    try {
      const prompt = `Hãy soạn một Giáo án Sư phạm & Kịch bản Hoạt cảnh tương tác AR chi tiết về Vũ Trụ 3D dành cho học sinh Lớp ${params.grade}. 
Chủ đề trọng tâm là: "${params.mainFocus}". 
Áp dụng khung phương pháp giáo dục: "${params.pedagogicalFramework}".
Người thuyết minh sử dụng giọng: "${params.narratorVoice === "Kore" ? "Kore Nữ trầm ấm" : "Zephyr Nam truyền cảm"}".

Hãy viết bằng Tiếng Việt chuẩn mực, chuyên nghiệp dưới dạng Markdown, cấu trúc gồm:
1. Thông tin tổng quan giáo án (Mục tiêu học tập, Thiết bị AR cần chuẩn bị)
2. Kịch bản hoạt cảnh AR chi tiết từng bước (Hành động của học sinh, Hiển thị AR trên màn hình, Lời thoại thuyết minh tương ứng của AI)
3. 2 Câu hỏi kiểm tra tư duy thực hành vật lý / thiên văn học.`;

      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          systemInstruction: "Bạn là một Chuyên gia Thiết kế Hệ thống Học thuật Tương tác AR và nhà sư phạm vũ trụ tiểu học cao cấp."
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể liên kết với Gemini API. Hãy chắc chắn GEMINI_API_KEY đã được thiết lập.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setLessonPlanText(data.text || "Không nhận được kết quả.");
    } catch (err: any) {
      console.error(err);
      setErrorLesson(err.message || "Đã xảy ra lỗi không xác định.");
    } finally {
      setIsLoadingLesson(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="instruction-generator-block">
      
      {/* LEFT COLUMN: PARAMETERS CUSTOMIZATION */}
      <div className="space-y-6">
        
        {/* Core Prompt Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3 text-slate-100">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-sm">Thiết Kế Hệ Thống Giáo Dục AR</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hệ thống này hỗ trợ phân tích đa chiều về phương pháp sư phạm, cơ chế tương tác, 
            và gamification để phục vụ thiết kế bot AI chuyên về Vũ Trụ 3D AR. Hãy tùy chỉnh 
            các chỉ số kỹ thuật và sư phạm bên dưới để tạo ra đặc tả thiết kế tốt nhất.
          </p>
        </div>

        {/* Configuration Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Settings className="w-4.5 h-4.5 text-indigo-400" />
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Tùy biến Sư phạm & Tương tác</h4>
          </div>

          {/* Grade */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Đối tượng học sinh (Độ tuổi/Lớp):</label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 4, 5].map((g) => (
                <button
                  key={g}
                  onClick={() => handleParamChange("grade", g)}
                  className={`py-1.5 px-3 text-xs rounded font-medium transition ${
                    params.grade === g
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-950 hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  Lớp {g} (Học sinh)
                </button>
              ))}
            </div>
          </div>

          {/* Focus */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Trọng tâm tương tác học thuật:</label>
            <select
              value={params.mainFocus}
              onChange={(e) => handleParamChange("mainFocus", e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="So sánh Tỷ lệ Thực và Kính Viễn vọng Ảo">So sánh Tỷ lệ Thực & Kính Viễn vọng Ảo</option>
              <option value="Giả lập Trọng lực vật lý và Phản hồi haptic">Giả lập Trọng lực vật lý & Phản hồi haptic</option>
              <option value="Quỹ đạo tự quay và Chu kỳ Ngày đêm (Du hành Thời gian)">Quỹ đạo tự quay & Chu kỳ Ngày đêm</option>
              <option value="Hệ thống Thẻ Holographic và Giải đố Tìm kiếm hành tinh">Thẻ Holographic & Giải đố tìm hành tinh</option>
            </select>
          </div>

          {/* Framework */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Khung phương pháp Sư phạm áp dụng:</label>
            <select
              value={params.pedagogicalFramework}
              onChange={(e) => handleParamChange("pedagogicalFramework", e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Học tập qua Trải nghiệm (Experiential Learning)">Học tập qua Trải nghiệm (Experiential Learning)</option>
              <option value="Khung Bloom's Taxonomy cải tiến cho AR">Khung Bloom's Taxonomy cải tiến cho AR</option>
              <option value="Thuyết kiến tạo xã hội (Constructivism) trong EdTech">Thuyết kiến tạo xã hội (Constructivism)</option>
              <option value="Thúc đẩy Động lực Học tập tự chủ (Gamification Flow)">Thúc đẩy Động lực Học tập tự chủ (Gamification)</option>
            </select>
          </div>

          {/* AI Narrator Voice */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Người thuyết minh AI mặc định:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleParamChange("narratorVoice", "Kore")}
                className={`py-1.5 px-2 text-xs rounded transition ${
                  params.narratorVoice === "Kore"
                    ? "bg-indigo-600 text-white font-medium"
                    : "bg-slate-950 hover:bg-slate-800 text-slate-300"
                }`}
              >
                👩‍🚀 Giọng nữ trầm Kore (Warm)
              </button>
              <button
                onClick={() => handleParamChange("narratorVoice", "Zephyr")}
                className={`py-1.5 px-2 text-xs rounded transition ${
                  params.narratorVoice === "Zephyr"
                    ? "bg-indigo-600 text-white font-medium"
                    : "bg-slate-950 hover:bg-slate-800 text-slate-300"
                }`}
              >
                👨‍🚀 Giọng nam truyền cảm Zephyr
              </button>
            </div>
          </div>
        </div>

        {/* AI Lesson Plan Generator Trigger block */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-yellow-400 animate-pulse" />
              <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">AI Copilot: Giáo Án & Kịch Bản Hoạt Cảnh</h4>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sử dụng trí tuệ nhân tạo Gemini 3.5 Flash để soạn thảo giáo án chi tiết và kịch bản tương tác AR đồng hành theo thiết lập sư phạm đã chọn ở trên.
          </p>

          <button
            onClick={handleGenerateLessonPlan}
            disabled={isLoadingLesson}
            className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-semibold text-xs rounded-lg transition shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1.5"
          >
            {isLoadingLesson ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Đang biên soạn với Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Biên Soạn Giáo Án Với Gemini AI ✨
              </>
            )}
          </button>

          {/* Generated Lesson Plan Results rendering */}
          {errorLesson && (
            <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-400 rounded-lg text-xs">
              ⚠️ Lỗi: {errorLesson}
            </div>
          )}

          {lessonPlanText && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] text-emerald-400 font-mono">BẢN THIẾT KẾ GIÁO ÁN AR ĐÃ TẠO</span>
                <button
                  onClick={handleCopyLesson}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded flex items-center gap-1 text-[10px]"
                >
                  {copiedLesson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedLesson ? "Đã sao chép" : "Sao chép"}
                </button>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-sans prose prose-invert overflow-y-auto max-h-[280px] pr-2 space-y-2 whitespace-pre-line">
                {lessonPlanText}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: DETAILED INSTRUCTION SPECIFICATION PREVIEW */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full">
        
        {/* Header preview tool */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100 text-sm">System Instruction Đặc Tả Thiết Kế</h3>
          </div>
          <button
            onClick={handleCopyInstruction}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition shadow font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Đã sao chép" : "Sao chép"}
          </button>
        </div>

        {/* Display System Instruction Block */}
        <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800/80 p-4 overflow-hidden flex flex-col min-h-[300px]">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-2">Đầu ra đặc tả Markdown (Bot AI Read-Ready)</span>
          <textarea
            readOnly
            value={generatedInstruction}
            className="w-full flex-1 bg-transparent border-none text-slate-300 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-0 overflow-y-auto pr-2"
            style={{ minHeight: "280px" }}
          />
        </div>

        {/* Pedagogical footnote */}
        <div className="mt-4 bg-indigo-950/20 border border-indigo-900/30 rounded-lg p-3 text-xs flex items-start gap-2.5">
          <Layers className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 text-[11px] leading-relaxed">
            <strong>Mẹo ứng dụng:</strong> Sao chép đoạn System Instruction đặc tả này dán vào hướng dẫn hệ thống của bất kỳ mô hình ngôn ngữ lớn (LLM) nào để huấn luyện nó thành một trợ lý thiết kế phần mềm, chuyên viết các hoạt cảnh AR khoa học chuẩn mực sư phạm.
          </p>
        </div>
      </div>
    </div>
  );
}
