# MCP Khải Hoàn Derma

Ứng dụng desktop (Electron + Node.js) chuyên biệt cho quy trình tự động hóa nội dung sản phẩm, tạo ảnh chuẩn e-commerce bằng ChatGPT, đồng bộ cơ sở dữ liệu Notion và chuẩn bị bài đăng Facebook cho **Khải Hoàn Derma**.

---

## 🌟 Tính Năng Cốt Lõi

1. **Sáng tạo nội dung Website Derma:**
   * Tích hợp sẵn 12 danh mục sản phẩm theo chuẩn phân loại Khải Hoàn Derma.
   * Tạo bài viết chi tiết, chuẩn SEO với OpenAI API, cho phép chỉnh sửa Markdown trực tiếp.
   * Đồng bộ tức thì lên Notion Database với đầy đủ thuộc tính, từ khóa và trạng thái.

2. **Chuẩn bị & Quản lý bài đăng Facebook:**
   * Quản lý thư viện Prompt bài đăng Facebook có thể chỉnh sửa và lưu trực tiếp trên máy.
   * Tự động lọc danh sách sản phẩm theo trạng thái: **Chưa đăng**, **Chờ đăng**, **Đã đăng**.
   * Chuyển đổi trạng thái Notion sau khi xác nhận đăng bài.

3. **Tự động hóa tạo ảnh ChatGPT (Chrome Debug CDP):**
   * Kết nối trình duyệt Chrome thật qua cổng Remote Debugging (`9222` / `9223`).
   * **Nhận diện chính xác lượt chat:** Chỉ nhận kết quả thuộc về prompt vừa gửi, tuyệt đối không lấy nhầm ảnh cũ, ảnh tham chiếu hay logo đính kèm.
   * **Chống lưu ảnh tạm/canvas giả:** Tự động lọc bỏ hiệu ứng đang vẽ (`Creating image`), thanh tiến độ, chỉ tải ảnh hoàn chỉnh ở độ phân giải gốc khi ChatGPT đã xử lý xong.
   * Tự động lưu 4 góc nhìn chuẩn e-commerce (`1.png` đến `4.png`) vào đúng thư mục sản phẩm:
     * *Ảnh 1:* Cover bán hàng & Insight khách hàng.
     * *Ảnh 2:* Infographic thành phần & hoạt chất.
     * *Ảnh 3:* Infographic công dụng & lợi ích.
     * *Ảnh 4:* Infographic hướng dẫn sử dụng / Routine.

4. **Tích hợp Google Drive & Logo thương hiệu:**
   * Tự động nhận diện thư mục sản phẩm theo mã `SP` trên máy và Google Drive for Desktop.
   * Tải và gắn logo Khải Hoàn Derma chuẩn xác lên ảnh sản phẩm theo tỷ lệ thẩm mỹ.

5. **Bảo mật & Ổn định (Security-First):**
   * Toàn bộ API Key (OpenAI, Notion, Google Drive) được mã hóa an toàn bằng **Electron SafeStorage** (Windows DPAPI).
   * **Cơ chế phục hồi linh hoạt:** Khi chuyển đổi máy tính hoặc người dùng, ứng dụng tự động xử lý an toàn mà không bị crash hay văng lỗi giải mã.

---

## 🚀 Cài Đặt & Chạy Từ Source

### Yêu cầu môi trường
* Node.js: `>= 18.x` (khuyến nghị 20+ hoặc 22.x).
* Google Chrome: phiên bản mới nhất.

### Các lệnh thực thi
```bash
# 1. Cài đặt dependencies chuẩn xác
npm ci

# 2. Chạy ứng dụng ở chế độ phát triển
npm start

# 3. Chạy toàn bộ kiểm thử tự động (120 test cases)
npm test

# 4. Tạo lại bộ icon ứng dụng từ ảnh gốc
npm run icons
```

---

## ⚙️ Hướng Dẫn Cấu Hình Lần Đầu

1. **Khóa API & Lưu trữ:**
   * Nhập **OpenAI API Key** và **Notion Access Token** tại khu vực *Cấu hình hệ thống*.
   * Dán đường dẫn thư mục đồng bộ Google Drive cục bộ (ví dụ: `G:\My Drive\Brief Khải Hoàn Derma\Ảnh đăng WEB`).
   * Bấm **Lưu API Keys trên máy này**.

2. **Thiết lập kết nối ChatGPT:**
   * Bấm **1. Mở Chrome đăng nhập** để mở cửa sổ Chrome riêng biệt của công cụ.
   * Đăng nhập tài khoản ChatGPT của bạn bình thường (hoàn tất xác minh Cloudflare nếu có).
   * Đóng cửa sổ Chrome đó lại (không đăng xuất).
   * Bấm **2. Kết nối Chrome Debug** để công cụ bắt đầu điều khiển tự động.
   * Khi tab ChatGPT tải xong ô nhập văn bản, bấm **Kiểm tra và khóa tab** cho đến khi trạng thái chuyển sang **ChatGPT: Sẵn sàng**.

3. **Kết nối Facebook:**
   * Mở kết nối Facebook Debug và đăng nhập Fanpage Khải Hoàn Derma để sẵn sàng soạn thảo.

---

## 📦 Đóng Gói Bộ Cài Đặt (Build Installers)

### 1. Build cho Windows (NSIS Setup)
```bash
npm run electron-build
```
* File cài đặt đầu ra: `dist-electron/MCP Khải Hoàn Derma Setup 1.0.0.exe`.
* Hỗ trợ cài đặt linh hoạt, tự tạo shortcut trên Desktop và Start Menu với nhận diện thương hiệu Khải Hoàn Derma.

### 2. Build cho macOS (Universal DMG)
```bash
npm run electron-build-mac
```
* File đầu ra: `dist-electron/MCP Khải Hoàn Derma-1.0.0.Universal.dmg` (hỗ trợ cả Apple Silicon và Intel).
* *Lưu ý:* Phải chạy lệnh này trên hệ điều hành macOS. Quy trình GitHub Actions cũng tự động build và đính kèm bản phát hành khi gắn thẻ `v*`.

---

## 🛡️ Bản Quyền & Phát Triển
* Dự án thuộc hệ thống tự động hóa nội dung của **Khải Hoàn Derma**.
* Repository chính thức: [https://github.com/datdtpl-maker/MCPKhaihoanderma](https://github.com/datdtpl-maker/MCPKhaihoanderma).
