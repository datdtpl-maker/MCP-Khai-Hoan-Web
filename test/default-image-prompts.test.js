const assert = require("node:assert/strict");
const test = require("node:test");

const {
  DEFAULT_IMAGE_PROMPTS,
  normalizeImagePrompts
} = require("../lib/default-image-prompts");

test("hiển thị đầy đủ 4 prompt mặc định khi config rỗng hoặc null", () => {
  const resultEmpty = normalizeImagePrompts([]);
  assert.equal(resultEmpty.length, 4);
  assert.deepEqual(resultEmpty, DEFAULT_IMAGE_PROMPTS);

  const resultNull = normalizeImagePrompts(null);
  assert.equal(resultNull.length, 4);
  assert.deepEqual(resultNull, DEFAULT_IMAGE_PROMPTS);
});

test("giữ nguyên nội dung và tiêu đề tùy chỉnh của người dùng", () => {
  const custom = [
    { title: "Ảnh 1 tùy biến", content: "Nội dung tạo ảnh 1 đặc biệt" },
    { title: "Ảnh 2 tùy biến", content: "Nội dung tạo ảnh 2 đặc biệt" }
  ];
  const result = normalizeImagePrompts(custom);
  assert.equal(result.length, 4);
  assert.equal(result[0].title, "Ảnh 1 tùy biến");
  assert.equal(result[0].content, "Nội dung tạo ảnh 1 đặc biệt");
  assert.equal(result[1].title, "Ảnh 2 tùy biến");
  assert.equal(result[1].content, "Nội dung tạo ảnh 2 đặc biệt");
  // Index 2 and 3 should fallback to defaults
  assert.equal(result[2].title, DEFAULT_IMAGE_PROMPTS[2].title);
  assert.equal(result[2].content, DEFAULT_IMAGE_PROMPTS[2].content);
  assert.equal(result[3].title, DEFAULT_IMAGE_PROMPTS[3].title);
  assert.equal(result[3].content, DEFAULT_IMAGE_PROMPTS[3].content);
});

test("tự khôi phục prompt mặc định nếu người dùng để trống tiêu đề hoặc nội dung", () => {
  const blankItems = [
    { title: "", content: "" },
    { title: "   ", content: "   " },
    null,
    undefined
  ];
  const result = normalizeImagePrompts(blankItems);
  assert.equal(result.length, 4);
  for (let i = 0; i < 4; i++) {
    assert.equal(result[i].title, DEFAULT_IMAGE_PROMPTS[i].title);
    assert.equal(result[i].content, DEFAULT_IMAGE_PROMPTS[i].content);
  }
});

test("hỗ trợ định dạng chuỗi mảng kiểu cũ (legacy string array)", () => {
  const legacy = ["Prompt 1 dạng text", "Prompt 2 dạng text"];
  const result = normalizeImagePrompts(legacy);
  assert.equal(result.length, 4);
  assert.equal(result[0].title, DEFAULT_IMAGE_PROMPTS[0].title);
  assert.equal(result[0].content, "Prompt 1 dạng text");
  assert.equal(result[1].title, DEFAULT_IMAGE_PROMPTS[1].title);
  assert.equal(result[1].content, "Prompt 2 dạng text");
  assert.equal(result[2].title, DEFAULT_IMAGE_PROMPTS[2].title);
  assert.equal(result[2].content, DEFAULT_IMAGE_PROMPTS[2].content);
});
