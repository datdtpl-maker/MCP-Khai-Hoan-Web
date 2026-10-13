const COMPOSER_TEXT = /Bạn đang nghĩ gì|What.?s on your mind|Tạo bài viết|Create post/i;
const SWITCH_TO_PAGE_TEXT = /^(?:Chuyển ngay|Switch now)$/i;
const POST_EDITOR_SELECTOR = [
  '[role="dialog"] div[contenteditable="true"][role="textbox"]:not([aria-label*="Bình luận" i]):not([aria-label*="comment" i]):not([aria-label*="Trả lời" i]):not([aria-label*="reply" i])',
  'div[contenteditable="true"][role="textbox"][aria-label*="Bạn đang nghĩ gì" i]',
  'div[contenteditable="true"][role="textbox"][aria-placeholder*="Bạn đang nghĩ gì" i]',
  'div[contenteditable="true"][role="textbox"][aria-label*="What\'s on your mind" i]',
  'div[contenteditable="true"][role="textbox"][aria-placeholder*="What\'s on your mind" i]',
  'div[contenteditable="true"][role="textbox"][aria-label*="Tạo bài viết" i]',
  'div[contenteditable="true"][role="textbox"][aria-label*="Create post" i]',
  'div[contenteditable="true"][role="textbox"]:not([aria-label])'
].join(", ");

function getFacebookComposer(page) {
  return page.locator('div[role="button"]')
    .filter({ hasText: COMPOSER_TEXT })
    .first();
}

function getFacebookPostEditor(page) {
  return page.locator(POST_EDITOR_SELECTOR).last();
}

function createComposerError(switched) {
  const message = switched
    ? "Đã chuyển sang danh tính Page nhưng Facebook chưa hiển thị khung tạo bài. Hãy tải lại Page rồi thử lại."
    : "Không tìm thấy khung tạo bài Facebook. Hãy chắc chắn tài khoản có quyền quản trị Page và đã chuyển sang danh tính Page.";
  const error = new Error(message);
  error.code = "FACEBOOK_COMPOSER_NOT_FOUND";
  return error;
}

async function ensureFacebookPageComposer(page, { timeoutMs = 45000 } = {}) {
  let composer = getFacebookComposer(page);
  if (await composer.isVisible().catch(() => false)) {
    return { composer, switched: false };
  }

  const switchButton = page.getByRole("button", { name: SWITCH_TO_PAGE_TEXT }).first();
  const shouldSwitch = await switchButton.isVisible().catch(() => false);
  if (shouldSwitch) {
    await switchButton.click();
    composer = getFacebookComposer(page);
  }

  try {
    await composer.waitFor({ state: "visible", timeout: timeoutMs });
  } catch {
    throw createComposerError(shouldSwitch);
  }

  return { composer, switched: shouldSwitch };
}

module.exports = {
  COMPOSER_TEXT,
  POST_EDITOR_SELECTOR,
  SWITCH_TO_PAGE_TEXT,
  ensureFacebookPageComposer,
  getFacebookComposer,
  getFacebookPostEditor
};
