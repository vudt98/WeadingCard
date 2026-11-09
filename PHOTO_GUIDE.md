# Hướng dẫn thay ảnh thiệp cưới

## Ảnh đầu trang đang thử — 09/11/2026

`magazine.heroImage` hiện dùng `dau-thiep/o-giua-2.jpg?v=d0e1f36751e5` (1376 × 2064px, khoảng 1,31 MB). Bản gốc `o-giua.jpg` (5504 × 8256px, khoảng 20,48 MB) vẫn được giữ. Điện thoại DPR 3 và desktop DPR 1 hiển thị ổn trong kiểm tra; desktop DPR 2 có độ mềm hơn bản gốc khi so vùng chi tiết. Tỷ lệ ảnh không đổi. Chi tiết phương án tiếp theo trong UI_UX_IMPROVEMENT_PLAN.md.

Ảnh cá nhân của thiệp hiện tại nằm trong `public/images/anh-cuoi/`.
Tất cả đường dẫn và thứ tự hiển thị được cấu hình trong `src/config/wedding.ts`.

## Kiểm tra chất lượng ảnh — 9/11/2026

- Album gốc: 5504 × 8256px, khoảng 18–22 MB/ảnh. Bản `album/web/`: 1333 × 2000px, JPEG chất lượng 88, khoảng 188–284 KB/ảnh. Trước đây cả ảnh nhỏ và ảnh chi tiết đều dùng bản web nên khi phóng to bị mất chi tiết so với ảnh gốc.
- Hiện ảnh nhỏ và thumbnail vẫn dùng `galleryImages.src`; trình xem chi tiết dùng `galleryImages.fullSrc` trỏ tới ảnh gốc, chỉ tải từng ảnh khi được chọn. Có trạng thái đang tải/lỗi tải. Thay ảnh cần cập nhật cả bản gốc lẫn bản web cùng tên.
- Chân dung `co-dau-chu-re/web/`: 1333 × 2000px, chất lượng 88; bản gốc là 5504 × 8256px. Phần giữa không áp dụng blur; mask chỉ làm mờ dần độ trong suốt ở mép trên/dưới theo thiết kế. Chưa thay bản chân dung trong lần cập nhật này.
- Ảnh đầu thiệp đang dùng trực tiếp `dau-thiep/o-giua.jpg` gốc 5504 × 8256px. Ảnh cuối thiệp dùng trực tiếp file được cung cấp `cuoi-thiep/loi-cam-on.jpg` 1667 × 1250px. Vite sao chép asset trong `public/`, không nén lại các file này.

| Thư mục | Tên file hiện tại | Cấu hình |
| --- | --- | --- |
| `dau-thiep/` | `ben-trai.webp`, `o-giua.webp`, `ben-phai.webp` | `crimson.heroImages` |
| `dem-nguoc/` | `anh-nen.webp` | `crimson.countdownImage` |
| `co-dau-chu-re/web/` | `chu-re.jpg`, `co-dau.jpg` | `crimson.storyImages` |
| `co-dau-chu-re/web/` | `co-dau.jpg` (ảnh trung tâm) | `magazine.coupleImage` |
| `album/web/` | 6 ảnh `anh_1.jpg` đến `anh_6.jpg` | `galleryImages` |
| `cuoi-thiep/` | `loi-cam-on.jpg` | `crimson.footerImage` |

## Thay ảnh

Phần giới thiệu cô dâu/chú rể hiện dùng **một ảnh chung** tại `magazine.coupleImage`, tên cô dâu trên phải và tên chú rể dưới trái. Thay đường dẫn này để đổi ảnh trung tâm; ưu tiên ảnh dọc tỷ lệ 2:3 và cập nhật kích thước ảnh trong component nếu tỷ lệ mới khác. Hai ảnh `crimson.storyImages` chỉ còn dùng cho bố cục Crimson cũ.

Chân dung cô dâu/chú rể dùng bản JPEG tối ưu trong `co-dau-chu-re/web/` (cạnh dài tối đa 2000px, chất lượng 88, áp dụng hướng EXIF). Hai file gốc không được ứng dụng hoặc script sử dụng ở `co-dau-chu-re/` đã được xóa trong đợt dọn ảnh ngày 09/11/2026. Khi thay chân dung, tạo bản web từ ảnh nguồn mới trước khi cập nhật cấu hình.

1. Chép ảnh của bạn vào thư mục đúng vị trí.
2. Nếu giữ nguyên tên và định dạng file hiện tại, không cần sửa cấu hình.
3. Nếu dùng tên hoặc định dạng khác, sửa đường dẫn tương ứng trong `src/config/wedding.ts`. Ví dụ với ảnh JPEG:

```ts
countdownImage: asset("images/anh-cuoi/dem-nguoc/anh-cua-minh.jpg"),
```

Không thêm `public/` hoặc dấu `/` ở đầu đường dẫn trong `asset()`.
Tên file cần khớp cả chữ hoa/chữ thường. Nên đặt tên không dấu, không khoảng trắng.
Không đổi đuôi `.jpg` thành `.webp` nếu chưa chuyển đổi định dạng ảnh.

## Thêm và sắp xếp album

Ảnh album gốc `anh_1.jpg` đến `anh_6.jpg` được giữ trong `public/images/anh-cuoi/album/`. Bản dùng trên web nằm trong `album/web/`, cạnh dài tối đa 2000px, JPEG chất lượng 88, đã áp dụng hướng xoay EXIF. Bộ 6 ảnh web có tổng dung lượng khoảng 1,43 MB thay vì khoảng 120 MB ảnh gốc. Album hiển thị một ảnh giữa và hai ảnh bên cạnh; chỉ chuyển thủ công bằng hai nút trước/sau luôn hiển thị hoặc bàn phím. Không tự chuyển ảnh, không có chấm chỉ báo hay nút phát/tạm dừng. Chọn ảnh giữa để xem toàn màn hình.

Chép bản ảnh đã tối ưu vào `public/images/anh-cuoi/album/web/`, rồi chỉnh danh sách tên file tại `galleryImages`:

```ts
galleryImages: [
  "anh_1.jpg",
  "anh_2.jpg",
  "anh_3.jpg",
  "anh_4.jpg",
  "anh_5.jpg",
  "anh_6.jpg",
].map((filename, position) => ({
  src: asset(`images/anh-cuoi/album/web/${filename}`),
  fullSrc: asset(`images/anh-cuoi/album/${filename}`),
  alt: `Ảnh cưới của chúng mình, khoảnh khắc ${position + 1}`,
})),
```

Thứ tự danh sách là thứ tự hiển thị. Giữ ít nhất một ảnh và không lặp tên file.
Ảnh đầu thiệp và chân dung nên dùng ảnh dọc; ảnh đếm ngược và cuối thiệp nên dùng ảnh ngang.
Giao diện có cắt ảnh theo khung, nên để khuôn mặt gần giữa ảnh và xem lại sau khi thay.

Album hiện dùng ảnh mới do người dùng cung cấp. Các ảnh mẫu còn lại có nguồn trong `public/crimson/asset-sources.json` và `ASSET_CREDITS.md`.
`public/images/opening/` chứa ảnh trang trí mở thiệp. Các ảnh và component giao diện cũ đã được loại bỏ.
