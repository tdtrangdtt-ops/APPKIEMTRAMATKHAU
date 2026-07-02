import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint for Gemini generation (lesson plans, activities)
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      if (!apiKey) {
        return res.status(400).json({ error: "GEMINI_API_KEY is not configured in Secrets." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "Bạn là một Chuyên gia Thiết kế Hệ thống Học thuật Tương tác AR về thiên văn học và khoa học vũ trụ.",
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi tạo nội dung với Gemini API." });
    }
  });

  // API endpoint for generating quizzes dynamically
  app.post("/api/gemini/quiz", async (req, res) => {
    try {
      const { topic, grade } = req.body;
      if (!apiKey) {
        return res.status(400).json({ error: "GEMINI_API_KEY is not configured." });
      }

      const prompt = `Hãy tạo 3 câu hỏi trắc nghiệm (multiple choice quiz) bằng Tiếng Việt về chủ đề thiên văn: "${topic}" dành cho học sinh tiểu học lớp ${grade || 3}. Mỗi câu hỏi phải có 4 phương án lựa chọn (A, B, C, D), chỉ ra phương án đúng và có phần giải thích khoa học ngắn gọn, sinh động cho trẻ em. Trả về kết quả JSON chính xác.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Bạn là chuyên gia sư phạm tiểu học. Hãy xuất dữ liệu dưới dạng JSON thuần túy theo schema yêu cầu. Không thêm ký tự markdown như ```json hay ``` hay bất kỳ chữ nào ngoài JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "Danh sách các câu hỏi trắc nghiệm",
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "Nội dung câu hỏi" },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Danh sách 4 phương án lựa chọn"
                },
                correctIndex: { type: Type.INTEGER, description: "Chỉ số của câu trả lời đúng (0-3)" },
                explanation: { type: Type.STRING, description: "Lời giải thích khoa học ngắn gọn và sinh động" }
              },
              required: ["question", "options", "correctIndex", "explanation"]
            }
          }
        }
      });

      const text = response.text;
      res.json(JSON.parse(text || "[]"));
    } catch (error: any) {
      console.error("Gemini Quiz API Error:", error);
      res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi tạo bộ câu hỏi." });
    }
  });

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
