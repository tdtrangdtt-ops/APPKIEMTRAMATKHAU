import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK helper
function getGeminiClient(userApiKey?: string) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Map user model names to actual Gemini API model IDs
function mapModelName(name: string): string {
  switch (name) {
    case "gemini-3-pro-preview":
      return "gemini-2.5-pro";
    case "gemini-3-flash-preview":
      return "gemini-2.5-flash";
    case "gemini-2.5-flash":
      return "gemini-2.5-flash";
    default:
      return "gemini-2.5-flash"; // Safe fallback
  }
}

// Fallback model list
function getModelFallbackList(selectedModel?: string): string[] {
  const list = [
    selectedModel ? mapModelName(selectedModel) : undefined,
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-1.5-flash"
  ].filter(Boolean) as string[];
  return Array.from(new Set(list));
}

const systemInstruction = `Bạn là "Người Hướng dẫn An toàn Mạng AI" chuyên nghiệp và thân thiện trong "Phòng thí nghiệm Bảo mật" dành cho học sinh tiểu học (Đặc vụ nhí).
Nhiệm vụ: Hướng dẫn các em cách tạo mật khẩu an toàn và giải thích tầm quan trọng của an toàn thông tin mạng bằng ngôn ngữ dễ thương, dễ hiểu cho trẻ em từ 6-11 tuổi.

Quy tắc giao tiếp:
1. Ngôn ngữ thân thiện: Dùng ẩn dụ dễ thương:
- Chữ in hoa -> "Chữ cái khổng lồ"
- Ký tự đặc biệt -> "Phép thuật bổ trợ"
- Mật khẩu mạnh -> "Lá chắn bảo vệ" hoặc "Chìa khóa vạn năng"
- Thông tin cá nhân (ngày sinh, tên) -> "Bí mật cá nhân"
- Kẻ bẻ khóa/Hacker -> "Robot Bẻ Khóa" hoặc "Kẻ đột nhập"
- Hệ thống bảo vệ -> "Cổng kho báu"
- Người dùng -> "Đặc vụ nhí"
2. Phản hồi ngắn gọn, dễ hiểu để trẻ em nghe qua giọng nói (Text-to-Speech) dễ tiếp thu. Tránh dùng câu dài, phức tạp hoặc chứa ký tự đặc biệt khó đọc.
3. Không bao giờ tiết lộ thông tin kỹ thuật khô khan hoặc mã hóa khó hiểu. Tập trung vào việc cổ vũ, động viên và khuyên nhủ nhẹ nhàng.
4. Nhấn mạnh việc ứng dụng hoạt động ngoại tuyến, cực kỳ an toàn và không thu thập bất kỳ dữ liệu cá nhân nào.
5. Luôn xưng hô: "Đặc vụ nhí" hoặc "Bạn", gọi mình là "Người Hướng dẫn AI" hoặc "Chỉ huy AI".`;

// Endpoint 1: Analyze password properties anonymously to maintain strict privacy
app.post("/api/cyber-guide/analyze", async (req, res) => {
  try {
    const userApiKey = req.headers["x-gemini-key"] as string;
    const userModel = req.headers["x-gemini-model"] as string;

    let ai;
    try {
      ai = getGeminiClient(userApiKey);
    } catch (e) {
      return res.status(401).json({ error: "Yêu cầu cấu hình API Key. Vui lòng nhấp vào nút Cài đặt để thiết lập." });
    }

    const { 
      length, 
      hasUpper, 
      hasLower, 
      hasNumber, 
      hasSpecial, 
      sensitiveDetected, 
      sensitiveDetails 
    } = req.body;

    const analysisPrompt = `Đặc vụ nhí vừa thiết kế một chìa khóa có các đặc điểm:
- Độ dài: ${length} ký tự
- Có chữ in hoa ("Chữ cái khổng lồ"): ${hasUpper ? "Có" : "Không"}
- Có chữ in thường: ${hasLower ? "Có" : "Không"}
- Có số: ${hasNumber ? "Có" : "Không"}
- Có ký tự đặc biệt ("Phép thuật bổ trợ"): ${hasSpecial ? "Có" : "Không"}
- Có chứa thông tin nhạy cảm (tên riêng, ngày sinh, sđt...): ${sensitiveDetected ? "Có" : "Không"}${sensitiveDetected ? ` (Chi tiết: ${sensitiveDetails})` : ""}

Hãy đóng vai Người Hướng dẫn An toàn Mạng AI để đưa ra một phản hồi ngắn gọn, siêu dễ thương và mang tính giáo dục cao cho Đặc vụ nhí. 
Nếu mật khẩu yếu, hãy gợi ý cách cải thiện một cách vui vẻ.
Nếu mật khẩu mạnh hoặc huyền thoại, hãy khen ngợi hết lời và trao cho bé một lời khen đầy cảm hứng!
Nhớ dùng các thuật ngữ ẩn dụ thân thiện và giữ câu ngắn cho công nghệ Đọc giọng nói (TTS).`;

    const models = getModelFallbackList(userModel);
    let lastError: any = null;
    let feedback = "";
    let success = false;

    for (const model of models) {
      try {
        console.log(`[Backend] Attempting analyze using model: ${model}`);
        const response = await ai.models.generateContent({
          model: model,
          contents: analysisPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });
        feedback = response.text || "";
        success = true;
        break;
      } catch (err: any) {
        console.error(`[Backend] Error with model ${model}:`, err.message || err);
        lastError = err;
      }
    }

    if (!success) {
      const rawErrorMsg = lastError?.message || lastError?.status || String(lastError);
      return res.status(502).json({ 
        error: `Không thể kết nối với Người Hướng dẫn AI. Chi tiết lỗi từ hệ thống: ${rawErrorMsg}` 
      });
    }

    res.json({ feedback });
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    res.status(500).json({ error: "Lỗi hệ thống trong quá trình phân tích." });
  }
});

// Endpoint 2: Full interactive chat with AI Safety Guide
app.post("/api/cyber-guide/chat", async (req, res) => {
  try {
    const userApiKey = req.headers["x-gemini-key"] as string;
    const userModel = req.headers["x-gemini-model"] as string;

    let ai;
    try {
      ai = getGeminiClient(userApiKey);
    } catch (e) {
      return res.status(401).json({ error: "Yêu cầu cấu hình API Key. Vui lòng nhấp vào nút Cài đặt để thiết lập." });
    }

    const { message, history } = req.body;

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const models = getModelFallbackList(userModel);
    let lastError: any = null;
    let reply = "";
    let success = false;

    for (const model of models) {
      try {
        console.log(`[Backend] Attempting chat using model: ${model}`);
        const chat = ai.chats.create({
          model: model,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
          history: formattedHistory,
        });

        const response = await chat.sendMessage({ message });
        reply = response.text || "";
        success = true;
        break;
      } catch (err: any) {
        console.error(`[Backend] Error with model ${model} during chat:`, err.message || err);
        lastError = err;
      }
    }

    if (!success) {
      const rawErrorMsg = lastError?.message || lastError?.status || String(lastError);
      return res.status(502).json({ 
        error: `Người Hướng dẫn AI đang bận. Chi tiết lỗi từ hệ thống: ${rawErrorMsg}` 
      });
    }

    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    res.status(500).json({ error: "Lỗi hệ thống trong phòng chat." });
  }
});

// Mount Vite middleware or static files (Only when not running on Vercel as serverless function)
if (!process.env.VERCEL) {
  async function startServer() {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }

  startServer();
}

export default app;
