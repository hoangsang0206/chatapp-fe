import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  let aiClient: GoogleGenAI | null = null;

  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        throw new Error("HỆ THỐNG PHÁT HIỆN: THIẾU KHÓA BẢO MẬT GEMINI_API_KEY. VUI LÒNG CẤU HÌNH TRONG TAB SETTINGS > SECRETS CỦA AI STUDIO ĐỂ PHÂN KHU AI HOẠT ĐỘNG.");
      }
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // Healthcheck point
  app.get("/api/health", (req, res) => {
    res.json({ status: "up", mode: process.env.NODE_ENV || "development" });
  });

  // API endpoint for Gemini chat on Server-Side to protect API key
  app.post("/api/gemini/chat", async (req, res, next) => {
    try {
      const { userMessage, history } = req.body;
      
      if (!userMessage) {
        return res.status(400).json({ error: "Thanh đầu vào trống. Không thể khởi động phân khu biên dịch." });
      }

      // Initialize client lazily to handle missing key gracefully
      const ai = getGeminiClient();

      // Convert history to Gemini contents structure
      // Format: { role: 'user' | 'model', parts: [{ text: string }] }
      const contents: any[] = [];
      if (Array.isArray(history)) {
        history.forEach((h: any) => {
          // Map user/gemini sender to user/model roles expected by API
          const role = h.sender === 'user' ? 'user' : 'model';
          contents.push({
            role: role,
            parts: [{ text: h.text }]
          });
        });
      }

      // Build system prompt and prompt sequence
      contents.push({
        role: "user",
        parts: [{ text: userMessage }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: "Mật danh trợ lý: GEMINI CODENAME AI. Bạn là một trí tuệ nhân tạo tích hợp trực tiếp vào hạ tầng mạng Cyber Chat Hub (Việt Nam). Hãy phản hồi bằng tiếng Việt với phong cách Cyberpunk độc đáo - cá tính, chuyên nghiệp nhưng lạnh lùng, mang đặc trưng hacker/cybernet, thường dùng các từ như 'Mạng lưới', 'Matrix', 'Giải mã', 'An ninh', 'Giao thức'. Định dạng câu trả lời gọn gàng, rõ ràng, có cấu trúc tốt, sử dụng markdown nếu cần thiết. Không xạo ngôn hệ thống, tập trung hỗ trợ người dùng giải mã và xử lý vấn đề.",
        }
      });

      // Extract generated text cleanly via the response.text property
      const responseText = response.text || "Giao thức trống. Không nhận được phản hồi giải mật từ Gemini Core.";
      res.json({ text: responseText });

    } catch (error: any) {
      console.error("Gemini Proxy Error:", error);
      res.status(500).json({ 
        error: "Mất kết nối với Trung tâm Giải mã Gemini.", 
        details: error?.message || String(error)
      });
    }
  });

  // Vite middleware setup
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
    console.log(`Server fully operational on http://0.0.0.0:${PORT}`);
  });
}

startServer();
