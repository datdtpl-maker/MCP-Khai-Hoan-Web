const assert = require("node:assert/strict");
const test = require("node:test");
const http = require("node:http");

const {
  DEFAULT_GEMINI_MODEL,
  generateContentWithGemini,
  checkGeminiApiKey
} = require("../lib/gemini-api");

test("mô hình mặc định phải là gemini-3.8-flash", () => {
  assert.equal(DEFAULT_GEMINI_MODEL, "gemini-3.8-flash");
});

test("báo lỗi nếu chưa cung cấp Gemini API Key", async () => {
  await assert.rejects(
    () => generateContentWithGemini({ apiKey: "", userPrompt: "Test" }),
    /Chưa cấu hình Gemini API Key/
  );

  await assert.rejects(
    () => checkGeminiApiKey(""),
    /Vui lòng nhập Gemini API Key/
  );
});

test("gửi đúng payload và nhận nội dung văn bản từ Gemini API", async () => {
  const originalFetch = global.fetch;
  let interceptedUrl = null;
  let interceptedBody = null;

  global.fetch = async (url, options) => {
    interceptedUrl = url;
    interceptedBody = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: "Đây là bài viết tạo bởi Gemini 3.8 Flash." }]
            },
            finishReason: "STOP"
          }
        ]
      })
    };
  };

  try {
    const result = await generateContentWithGemini({
      apiKey: "test-gemini-key",
      systemInstruction: "Bạn là dược sĩ",
      userPrompt: "Tên sản phẩm: Serum B5",
      model: "gemini-3.8-flash",
      temperature: 0.7
    });

    assert.equal(result, "Đây là bài viết tạo bởi Gemini 3.8 Flash.");
    assert.match(interceptedUrl, /models\/gemini-3\.8-flash:generateContent\?key=test-gemini-key/);
    assert.equal(interceptedBody.system_instruction.parts[0].text, "Bạn là dược sĩ");
    assert.equal(interceptedBody.contents[0].parts[0].text, "Tên sản phẩm: Serum B5");
    assert.equal(interceptedBody.generationConfig.temperature, 0.7);
  } finally {
    global.fetch = originalFetch;
  }
});

test("báo lỗi chi tiết khi Gemini API trả về lỗi", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 400,
    statusText: "Bad Request",
    json: async () => ({
      error: {
        code: 400,
        message: "API key not valid. Please pass a valid API key."
      }
    })
  });

  try {
    await assert.rejects(
      () => generateContentWithGemini({ apiKey: "invalid-key", userPrompt: "Hello" }),
      /API key not valid/
    );
  } finally {
    global.fetch = originalFetch;
  }
});
