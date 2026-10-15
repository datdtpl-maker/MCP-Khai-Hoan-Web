const DEFAULT_IMAGE_PROMPTS = [
  {
    title: "Ảnh 1: Cover Bán Hàng & Insight",
    content: `Tạo ảnh kích thước 1:1 dạng cover bán hàng, thu hút, dễ đọc trên điện thoại và có cảm xúc đúng với insight sản phẩm.

Dùng A1 làm sản phẩm chính. Nếu có A2 thì chỉ tham khảo vibe tổng thể, chất lượng thẩm mỹ, ánh sáng và cảm giác thiết kế; không sao chép bố cục, màu sắc hay chi tiết y nguyên. Nếu không có A2 thì tự thiết kế.

Dựa vào {{selected_keywords}} và {{selected_notion_content}}, hãy tự phân tích để xác định:
- vấn đề hoặc nhu cầu chính của khách hàng
- cảm giác khách hàng mong muốn sau khi dùng sản phẩm
- thông điệp bán hàng quan trọng nhất
- vibe thiết kế phù hợp nhất với nội dung sản phẩm
- bảng màu phù hợp với insight, cảm xúc và concept truyền tải
- bố cục phù hợp nhất để làm nổi bật sản phẩm và thông điệp

Yêu cầu về màu sắc:
- Ưu tiên sự đa dạng màu giữa các lần tạo ảnh.
- Không mặc định lấy màu bao bì sản phẩm làm màu chủ đạo cho toàn bộ thiết kế.
- Chỉ giữ nguyên màu gốc trên chính sản phẩm; background, badge, icon, khối nội dung và hiệu ứng phải được tự chọn theo concept.
- Hãy chọn bảng màu dựa trên insight, cảm xúc và nội dung truyền tải, không dựa máy móc vào các tone quen thuộc của các thiết kế trước.
- Ưu tiên những bảng màu có tính bán hàng tốt, dễ đọc, nổi bật trên Shopee, nhưng vẫn khác biệt và có chủ đích.

Yêu cầu về layout và vibe:
- Không dùng bố cục rập khuôn.
- Mỗi lần tạo ảnh, hãy chọn một layout phù hợp nhất với nội dung sản phẩm, có thể theo hướng premium, problem-solution, clinical clean, lifestyle, fresh, minimal hoặc infographic-lite tùy insight.
- Vibe thiết kế phải bám theo nội dung sản phẩm, không chỉ đẹp mà còn phải truyền đúng cảm giác mà khách hàng cần.

Yêu cầu nội dung hiển thị:
- Sản phẩm phải nổi bật, rõ, sắc nét, giữ nguyên bao bì, tên sản phẩm, logo, màu sắc, hình dáng và chữ trên sản phẩm gốc.
- Có title lớn đánh thẳng vào insight hoặc nhu cầu chính của khách hàng.
- Có subtitle nêu tên sản phẩm hoặc công dụng chính.
- Có 2-3 ý ngắn dạng lợi ích nổi bật, dễ đọc, dễ quét mắt.
- Có badge nhấn mạnh dung tích, hoạt chất hoặc điểm bán chính nếu có.
- Có footer nhỏ: "Đọc kỹ hướng dẫn sử dụng trước khi dùng."

Yêu cầu chung:
- Thiết kế hiện đại, bắt mắt, rõ ràng, dễ đọc trên điện thoại.
- Ngôn từ an toàn, dùng các từ như: hỗ trợ, giúp, dùng theo hướng dẫn.
- Không cam kết quá mức.
- Không dùng logo, watermark, chữ hay sản phẩm từ ảnh mẫu A2.`
  },
  {
    title: "Ảnh 2: Infographic Thành Phần",
    content: `Tiếp tục trong đúng cuộc trò chuyện hiện tại. Dùng lại ảnh sản phẩm đã được đính kèm ở Prompt 1 làm ảnh tham chiếu; không cần tải lại ảnh. Nếu sản phẩm xuất hiện trong thiết kế, giữ đúng bao bì, logo, tên, màu sắc và chữ trên sản phẩm.

Tạo ảnh tạo hình 1:1 dạng infographic thành phần cho sản phẩm.

Dựa vào nội dung sản phẩm trong thread để xác định hoạt chất hoặc nhóm thành phần nổi bật. Ảnh này là ảnh phụ giải thích thành phần, không phải ảnh cover bán hàng, nên không dùng layout giống cover.

Yêu cầu bố cục:
- Sản phẩm không được chiếm vị trí chính; nếu có dùng sản phẩm thì chỉ đặt nhỏ ở góc hoặc cạnh dưới để nhận diện.
- Trọng tâm ảnh là hoạt chất/thành phần, visual phân tử, giọt lotion, texture chất kem, icon nguyên liệu hoặc sơ đồ thành phần.
- Dùng layout riêng như: vòng tròn hoạt chất trung tâm, 3 card thông tin, sơ đồ phân tử, bảng thành phần tối giản hoặc glassmorphism card.
- Không đặt sản phẩm bự ở trung tâm.
- Không lặp lại bố cục cover.

Nội dung:
- Title lớn về thành phần nổi bật.
- Subtitle ngắn nêu tên hoạt chất hoặc vai trò thành phần.
- 2-3 ý ngắn giải thích đặc điểm/thông tin chính.
- Có footer nhỏ: "Đọc kỹ hướng dẫn sử dụng trước khi dùng."

Thiết kế rõ, sạch, hiện đại, dễ đọc trên điện thoại, màu sắc có thể liên hệ nhẹ với bộ ảnh nhưng không cần giống cover.`
  },
  {
    title: "Ảnh 3: Infographic Công Dụng",
    content: `Tiếp tục trong đúng cuộc trò chuyện hiện tại. Dùng lại ảnh sản phẩm đã được đính kèm ở Prompt 1 làm ảnh tham chiếu; không cần tải lại ảnh. Nếu sản phẩm xuất hiện trong thiết kế, giữ đúng bao bì, logo, tên, màu sắc và chữ trên sản phẩm.

Tạo ảnh Shopee 1:1 dạng infographic công dụng cho sản phẩm.

Dựa vào nội dung sản phẩm trong thread để rút ra 3-4 công dụng hoặc điểm nổi bật chính. Ảnh này dùng để giải thích lợi ích, không phải cover, nên không đặt sản phẩm quá lớn và không dùng lại bố cục cover.

Yêu cầu bố cục:
- Trọng tâm là các khối công dụng, icon và thông tin dễ quét mắt.
- Sản phẩm chỉ là yếu tố nhận diện nhỏ/vừa ở góc, cạnh dưới hoặc có thể không cần đặt nếu layout infographic đã đủ rõ.
- Dùng layout riêng như: 4 card bo góc, sơ đồ 3 lợi ích, checklist công dụng, icon grid, vòng tròn lợi ích hoặc infographic dạng split panel.
- Không dùng layout sản phẩm lớn + chữ lớn giống cover.
- Không sao chép bố cục cover.

Nội dung:
- Title lớn về công dụng nổi bật.
- Subtitle ngắn nêu nhóm công dụng chính.
- 3-4 ý ngắn, mỗi ý có icon riêng.
- Có footer nhỏ: "Đọc kỹ hướng dẫn sử dụng trước khi dùng."

Thiết kế hiện đại, rõ ràng, dễ đọc trên điện thoại, ngôn từ an toàn như hỗ trợ, giúp, dùng theo hướng dẫn.`
  },
  {
    title: "Ảnh 4: Infographic Hướng Dẫn/Routine",
    content: `Tiếp tục trong đúng cuộc trò chuyện hiện tại. Dùng lại ảnh sản phẩm đã được đính kèm ở Prompt 1 làm ảnh tham chiếu; không cần tải lại ảnh. Nếu sản phẩm xuất hiện trong thiết kế, giữ đúng bao bì, logo, tên, màu sắc và chữ trên sản phẩm.

Tạo ảnh 1:1 dạng infographic công dụng cho sản phẩm.

Dựa vào nội dung sản phẩm trong thread để rút ra 3-4 công dụng hoặc điểm nổi bật chính. Ảnh này dùng để giải thích lợi ích, không phải cover, nên không đặt sản phẩm quá lớn và không dùng lại bố cục cover.

Yêu cầu bố cục:
- Trọng tâm là các khối công dụng, icon và thông tin dễ quét mắt.
- Sản phẩm chỉ là yếu tố nhận diện nhỏ/vừa ở góc, cạnh dưới hoặc có thể không cần đặt nếu layout infographic đã đủ rõ.
- Dùng layout riêng như: 4 card bo góc, sơ đồ 3 lợi ích, checklist công dụng, icon grid, vòng tròn lợi ích hoặc infographic dạng split panel.
- Không dùng layout sản phẩm lớn + chữ lớn giống cover.
- Không sao chép bố cục cover.

Nội dung:
- Title lớn về công dụng nổi bật.
- Subtitle ngắn nêu nhóm công dụng chính.
- 3-4 ý ngắn, mỗi ý có icon riêng.
- Có footer nhỏ: "Đọc kỹ hướng dẫn sử dụng trước khi dùng."

Thiết kế hiện đại, rõ ràng, dễ đọc trên điện thoại, ngôn từ an toàn như hỗ trợ, giúp, dùng theo hướng dẫn.`
  }
];

function normalizeImagePrompts(prompts) {
  const result = [];
  const list = Array.isArray(prompts) ? prompts : [];
  for (let i = 0; i < 4; i++) {
    const raw = list[i];
    const defaultPrompt = DEFAULT_IMAGE_PROMPTS[i];
    if (typeof raw === "string") {
      result.push({
        title: defaultPrompt.title,
        content: raw.trim() || defaultPrompt.content
      });
    } else if (raw && typeof raw === "object") {
      const title = typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : defaultPrompt.title;
      const content = typeof raw.content === "string" && raw.content.trim() ? raw.content.trim() : defaultPrompt.content;
      result.push({ title, content });
    } else {
      result.push({ ...defaultPrompt });
    }
  }
  return result;
}

module.exports = {
  DEFAULT_IMAGE_PROMPTS,
  normalizeImagePrompts
};
