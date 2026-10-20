const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";

async function generateContentWithGemini({
  apiKey,
  systemInstruction,
  userPrompt,
  model = DEFAULT_GEMINI_MODEL,
  temperature = 0.7
}) {
  const cleanKey = String(apiKey || "").trim();
  if (!cleanKey) {
    throw new Error("Chưa cấu hình Gemini API Key trong ứng dụng.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(cleanKey)}`;

  const bodyPayload = {
    contents: [
      {
        role: "user",
        parts: [{ text: String(userPrompt || "").trim() }]
      }
    ],
    generationConfig: {
      temperature
    }
  };

  if (systemInstruction) {
    bodyPayload.system_instruction = {
      parts: [{ text: String(systemInstruction).trim() }]
    };
  }

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyPayload)
    });
  } catch (err) {
    throw new Error(`Lỗi kết nối tới Gemini API: ${err.message}`);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`Gemini API (${model}) lỗi: ${errorMsg}`);
  }

  const candidate = data?.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  const text = parts.map((p) => p.text).filter(Boolean).join("\n").trim();

  if (!text) {
    const finishReason = candidate?.finishReason;
    if (finishReason && finishReason !== "STOP") {
      throw new Error(`Gemini (${model}) dừng sớm với lý do: ${finishReason}`);
    }
    throw new Error(`Gemini (${model}) không trả về nội dung văn bản hợp lệ.`);
  }

  return text;
}

async function checkGeminiApiKey(apiKey, model = DEFAULT_GEMINI_MODEL) {
  const cleanKey = String(apiKey || "").trim();
  if (!cleanKey) {
    throw new Error("Vui lòng nhập Gemini API Key để kiểm tra.");
  }
  await generateContentWithGemini({
    apiKey: cleanKey,
    userPrompt: "Xin chào, hãy trả lời đúng một từ: OK",
    model,
    temperature: 0.1
  });
  return { success: true, message: `Kết nối thành công! Gemini API Key (mô hình ${model}) hoạt động bình thường.` };
}

module.exports = {
  DEFAULT_GEMINI_MODEL,
  generateContentWithGemini,
  checkGeminiApiKey
};
