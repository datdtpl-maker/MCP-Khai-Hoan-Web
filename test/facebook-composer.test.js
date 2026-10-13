const assert = require("node:assert/strict");
const test = require("node:test");
const { existsSync } = require("node:fs");
const { chromium } = require("playwright");

const { ensureFacebookPageComposer, getFacebookPostEditor } = require("../lib/facebook-composer");

function createFacebookPage({ composerVisible = false, switchVisible = false, composerVisibleAfterSwitch = false } = {}) {
  const calls = [];
  let switched = false;

  const composer = {
    first() { return this; },
    async isVisible() { return composerVisible || (switched && composerVisibleAfterSwitch); },
    async waitFor() {
      calls.push("wait-composer");
      if (!(composerVisible || (switched && composerVisibleAfterSwitch))) {
        throw new Error("Timeout waiting for composer");
      }
    }
  };

  const switchButton = {
    first() { return this; },
    async isVisible() { return switchVisible; },
    async click() {
      calls.push("click-switch");
      switched = true;
    }
  };

  return {
    calls,
    locator() {
      return {
        filter() { return composer; }
      };
    },
    getByRole() { return switchButton; }
  };
}

test("tự chuyển sang danh tính Page trước khi mở khung tạo bài", async () => {
  const page = createFacebookPage({ switchVisible: true, composerVisibleAfterSwitch: true });

  const result = await ensureFacebookPageComposer(page, { timeoutMs: 10 });

  assert.equal(result.switched, true);
  assert.deepEqual(page.calls, ["click-switch", "wait-composer"]);
});

test("không chuyển tài khoản khi khung tạo bài đã sẵn sàng", async () => {
  const page = createFacebookPage({ composerVisible: true, switchVisible: true });

  const result = await ensureFacebookPageComposer(page, { timeoutMs: 10 });

  assert.equal(result.switched, false);
  assert.deepEqual(page.calls, []);
});

test("trả lỗi dễ hiểu khi tài khoản không thể mở khung tạo bài", async () => {
  const page = createFacebookPage();

  await assert.rejects(
    ensureFacebookPageComposer(page, { timeoutMs: 10 }),
    /quyền quản trị Page.*danh tính Page/i
  );
});

test("nhận diện đúng ô nhập Tạo bài viết có aria-label và bỏ qua ô bình luận", async (t) => {
  const browser = await chromium.launch({ ...(existsSync(chromium.executablePath()) ? {} : { channel: "chrome" }), headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage();

  await page.setContent(`
    <div id="feed">
      <div contenteditable="true" role="textbox" aria-label="Bình luận dưới tên Dược mỹ phẩm Khải Hoàn Derma" data-box="comment">Bình luận</div>
    </div>
    <div role="dialog" aria-label="Tạo bài viết">
      <div contenteditable="true" role="textbox" aria-label="Bạn đang nghĩ gì?" aria-placeholder="Bạn đang nghĩ gì?" data-box="post-composer">Bạn đang nghĩ gì?</div>
    </div>
  `);

  const editor = getFacebookPostEditor(page);
  await editor.waitFor({ state: "visible", timeout: 2000 });
  assert.equal(await editor.getAttribute("data-box"), "post-composer");
});
