# Kế hoạch thiết kế lại thiệp — Long Phụng đỏ

Ngày lập và triển khai: 20/10/2026. Trạng thái: đã hoàn thành bản local Long Phụng; typecheck, lint, 13 tests, build và kiểm tra trình duyệt đạt. Xem `QA.md` cho kết quả thực tế.

Tài nguyên gốc trả HTTP 403 khi tải. Đã dùng bốn SVG tự dựng (rồng, phượng, Song Hỷ, chim én), ghi trong `ASSET_CREDITS.md`. Chưa xác minh độ giống từng pixel với ảnh chụp mẫu; hai mục đối chiếu trực quan nguồn bên dưới vẫn để mở. Các tên, gia đình, địa điểm và lịch trình đang là dữ liệu minh họa.

## 1. Mục tiêu và phạm vi

Tạo một phiên bản tương tự mẫu Long Phụng V3 Đỏ: nền đỏ thẫm, nét vàng đồng, Song Hỷ, long phụng, khung ảnh vòm và bố cục thiệp truyền thống. Ưu tiên độ tương đồng của màn hình mở thiệp, đầu trang và các khối thông tin trên điện thoại. Đây là thiết kế lại trên ứng dụng hiện có.

- Giữ React, TypeScript, Vite, Tailwind CSS, Motion và Lucide.
- Giữ link cá nhân hóa `guest`, chọn bên `ben`, album có lightbox, nhạc bật thủ công, chỉ đường và thêm vào lịch.
- Nội dung cưới, kể cả thông tin gia đình, lịch trình và dress code, đặt trong `src/config/wedding.ts`.
- Dùng tên, ngày cưới và ảnh mẫu hiện có cho đến khi có dữ liệu thật. Không chép thông tin ngân hàng hay QR của bản demo.
- Bản đầu chạy tĩnh, phù hợp GitHub Pages. RSVP và lưu bút chưa có nơi tiếp nhận thì hiển thị rõ chưa hoạt động, không báo gửi thành công.

## 2. Tham chiếu và mức độ xác minh

- Trang giới thiệu: https://chungdoi.com/vi/mau-thiep/long-phung-v3-do
- Bìa thiệp: https://chungdoi.com/vi/mau-thiep/long-phung-v3-do/demo
- Nội dung sau khi mở: https://chungdoi.com/vi/mau-thiep/long-phung-v3-do/demo?open=1
- Ảnh toàn cảnh: https://assets.chungdoi.com/template-showcase/vi/dragon_phoenix_v3_red.2f0a683f.webp
- Ảnh xem trước: https://assets.chungdoi.com/template-previews/vi/portrait/dragon_phoenix_v3_red.17204343.webp

Đã đọc nội dung trang giới thiệu và demo trong phiên khảo sát. Các đặc điểm khung vòm, đỏ thẫm, vàng đồng, lịch mini và chim én được mô tả trên trang giới thiệu. Chưa có ảnh chụp trình duyệt được kiểm tra trực quan trong lần lập kế hoạch này; chưa đo màu, kích thước, font hay thời lượng animation chính xác. Cần khảo sát trực quan ở bước 1 trước khi chốt bố cục. Không cam kết sao chép chính xác từng pixel khi chưa kiểm tra.

## 3. Kế hoạch tài nguyên

Ưu tiên sử dụng họa tiết của mẫu theo yêu cầu. Các đường dẫn dưới đây được trích từ liên kết ảnh của demo; chưa xác minh tải file thành công, kích thước, alpha hoặc giấy phép sử dụng lại.

| Tài nguyên tham chiếu | Nguồn | Đích dự kiến |
| --- | --- | --- |
| Rồng | https://chungdoi.com/images/themes/longphung-v3-red/rong.webp | `public/images/long-phung/dragon.webp` |
| Phượng | https://chungdoi.com/images/themes/longphung-v3-red/phung.webp | `public/images/long-phung/phoenix.webp` |
| Song Hỷ | https://chungdoi.com/images/themes/longphung-v3-red/chu-hy.webp | `public/images/long-phung/double-happiness.webp` |
| Chim én | https://chungdoi.com/images/themes/longphung-v3-red/chim-en.webp | `public/images/long-phung/swallow.webp` |

Quy trình triển khai tài nguyên:

1. Thử tải từng file công khai, kiểm tra đúng định dạng và xem ảnh thực tế trước khi đưa vào giao diện.
2. Ghi nguồn, trạng thái quyền sử dụng, tên file và mọi chỉnh sửa vào `ASSET_CREDITS.md`; đường dẫn công khai không tự xác nhận giấy phép.
3. Tài nguyên có thể sử dụng được lưu cục bộ và gọi qua `asset()`, không hotlink. Nếu tài nguyên không dùng được, thay bằng họa tiết SVG tự dựng hoặc tài nguyên có giấy phép phù hợp và ghi rõ sai khác.
4. Dựng khung vòm, viền, nền và phong bì bằng CSS/SVG của project khi phù hợp; không lấy ảnh chụp toàn trang làm giao diện.
5. Giữ ảnh mẫu Unsplash và nhạc gốc hiện có trong bản đầu. Giữ font local hỗ trợ tiếng Việt, chỉ đổi khi xác định được font phù hợp và quyền sử dụng.
6. Không nhập script, tracking, mã nguồn runtime, QR ngân hàng hoặc dữ liệu lời chúc của trang tham chiếu.

## 4. Hướng thiết kế

- Bảng màu khởi điểm đề xuất: đỏ nền `#560F19`, đỏ bề mặt `#741B27`, vàng đồng `#C9A45C`, chữ kem `#FFF2D5`. Đây là màu đề xuất, sẽ điều chỉnh sau khi xem ảnh tham chiếu và kiểm tra tương phản.
- Thiết kế từ màn hình điện thoại; nội dung căn giữa, bố cục thiệp dọc. Desktop mở rộng có kiểm soát, không kéo ảnh và dòng chữ quá rộng.
- Tên đôi uyên ương dùng serif có tiếng Việt; thông tin giờ/địa chỉ dùng font dễ đọc. Tên dài và tên khách phải xuống dòng được.
- Song Hỷ là điểm nhấn trung tâm; rồng/phượng đặt quanh khung ảnh và đầu thiệp. Họa tiết trang trí không che nội dung hoặc cản thao tác.
- Chuyển động nhẹ khi mở phong bì và cuộn đến từng phần; tắt chuyển động liên tục với reduced motion. Không tự bật nhạc.

## 5. Thứ tự nội dung bản mới

1. **Bìa/phong bì:** nền đỏ, long phụng, Song Hỷ, tên cặp đôi, ngày cưới, tên khách và nút mở thiệp.
2. **Đầu trang:** tên hai bên đối xứng, Song Hỷ ở giữa, ảnh khung vòm, lời mời ngắn.
3. **Thông tin lễ cưới:** hai gia đình, tên đầy đủ, vai vế, loại lễ, giờ/ngày dương và ngày âm nếu đã cấu hình.
4. **Album ảnh:** ảnh local, bố cục phù hợp điện thoại và lightbox dùng bàn phím.
5. **Thông tin tiệc:** chuyển nhà trai/nhà gái; giờ đón khách, giờ khai tiệc, ngày, địa điểm.
6. **Đếm ngược và lịch tháng:** đánh dấu ngày tiệc theo múi giờ Việt Nam; thêm vào lịch.
7. **Địa điểm và RSVP:** địa chỉ, nút chỉ đường; RSVP hiển thị đúng trạng thái chưa tiếp nhận. Dùng liên kết bản đồ như hiện tại để bản tĩnh không cần nhúng dịch vụ.
8. **Dress code:** các ô màu kèm tên màu bằng chữ.
9. **Lịch trình:** các mốc đón khách, khai tiệc, nghi lễ, dùng tiệc, kết thúc; chim én trang trí.
10. **Sổ lưu bút:** khối giao diện cùng phong cách; bản tĩnh giải thích chưa nhận lời chúc, không có nút gửi giả hoặc lời chúc mạo danh khách thật.
11. **Quà mừng:** hộp mở dialog; mặc định chưa cấu hình. Chỉ hiện QR/tài khoản khi có thông tin do chủ thiệp cung cấp, không dùng tài khoản của mẫu.
12. **Kết:** lời cảm ơn, tên cặp đôi, công cụ tạo link riêng và nút nhạc.

Timeline chuyện tình hiện tại có thể chuyển thành phần tùy chọn và mặc định ẩn để bố cục gần mẫu. Chuyển toàn bộ đoạn nội dung cưới đang viết trực tiếp trong `App.tsx` sang cấu hình khi chỉnh phần đó.

## 6. Ánh xạ mã nguồn

| File/component | Thay đổi dự kiến |
| --- | --- |
| `src/config/theme.ts`, `src/styles.css` | Đồng bộ token đỏ/vàng, typography, khung vòm, viền và responsive |
| `src/config/wedding.ts` | Thêm gia đình, thông tin lễ, giờ đón khách, lịch trình, dress code, quà mừng và các mục tùy chọn |
| `src/components/EnvelopeIntro.tsx` | Thiết kế lại bìa và phong bì, giữ tên khách và quản lý focus |
| `src/components/HeroSection.tsx` | Tên đối xứng, Song Hỷ và ảnh vòm |
| `src/components/LongPhungDecoration.tsx` (mới) | Gom họa tiết local và fallback; ảnh trang trí `alt=""`, không nhận focus |
| `src/components/CeremonyDetails.tsx` (mới) | Thông tin gia đình, lễ và ngày âm cấu hình sẵn |
| `src/components/EventDetails.tsx`, `Countdown.tsx` | Giao diện mới, đồng bộ dữ liệu theo bên được chọn |
| `src/components/WeddingCalendar.tsx` (mới) | Lịch tháng theo ngày tiệc, nhãn ngày được chọn cho người dùng trợ năng |
| `src/components/PhotoGallery.tsx` | Đổi trình bày, giữ lightbox và hành vi bàn phím |
| `src/components/DressCode.tsx`, `WeddingSchedule.tsx` (mới) | Các khối nội dung từ cấu hình |
| `src/components/RSVPForm.tsx`, `Guestbook.tsx` (mới) | Thông báo trạng thái bản tĩnh rõ ràng |
| `src/components/WeddingGift.tsx` (mới), `src/hooks/useModal.ts` | Dialog quà mừng khi có dữ liệu; focus trap, Escape, trả focus |
| `src/App.tsx` | Sắp xếp lại toàn trang, bỏ điều hướng cũ không phù hợp |
| `src/utils/invitation.ts` | Chỉ bổ sung logic lịch nếu cần; giữ chuẩn hóa tên và URL |
| `ASSET_CREDITS.md`, `README.md`, `QA.md`, `PLAN.md` | Nguồn tài nguyên, hướng dẫn và kết quả kiểm tra mới |

Ngày âm dùng chuỗi được cung cấp riêng cho từng sự kiện; chưa thêm thư viện chuyển đổi âm lịch. Các mục thiếu dữ liệu được ẩn hoặc có thông báo rõ. Mọi cấu hình quà mừng được đưa lên website đều là thông tin công khai; không đưa credentials vào source.

## 7. Các đợt triển khai

### Bước 1 — Khảo sát trực quan và chuẩn bị tài nguyên

- [ ] Chụp/xem bìa, đầu trang, nội dung giữa và cuối trang tham chiếu ở mobile và desktop.
- [x] Thử tải và phân loại tài nguyên: HTTP 403; tạo, kiểm tra trực quan SVG thay thế và ghi nguồn.
- [x] Chốt token màu/font và tỷ lệ khung ảnh sau khi kiểm tra trực quan bản local theo mô tả mẫu.

Đầu ra: danh sách tài nguyên thực sự dùng được và ghi chú thiết kế có bằng chứng; không ghi đạt cho file chưa tải được.

### Bước 2 — Dựng phần nhận diện chính

- [x] Mở rộng kiểu dữ liệu và giữ dữ liệu mẫu hiện tại.
- [x] Xây nền, họa tiết, phong bì, Song Hỷ và hero ảnh vòm.
- [x] Kiểm tra ngay tên khách dài, hai bên nhà và reduced motion trên mobile.

Đầu ra: bìa và màn hình đầu có thể xem chạy thực tế, thể hiện rõ phong cách mới.

### Bước 3 — Hoàn thiện nội dung chính

- [x] Thông tin hai gia đình và lễ cưới.
- [x] Album, tiệc, đếm ngược, lịch tháng và địa điểm.
- [x] Dress code, lịch trình và phần kết.
- [x] Chuyển toàn bộ nội dung cưới liên quan sang cấu hình.

Đầu ra: trang cuộn hoàn chỉnh, dữ liệu nhất quán giữa các phần khi chuyển nhà trai/nhà gái.

### Bước 4 — Các tương tác còn lại

- [x] RSVP và sổ lưu bút ở trạng thái chưa kết nối rõ ràng.
- [x] Quà mừng: trạng thái chưa cấu hình; dialog và QR local chỉ khi có dữ liệu hợp lệ.
- [x] Hoàn thiện focus, keyboard, nút nhạc, link cá nhân hóa và thông báo sao chép.

Đầu ra: thao tác chạy thật trong phạm vi bản tĩnh, không có báo thành công giả.

### Bước 5 — Đối chiếu và kiểm tra bàn giao

- [ ] Đối chiếu ảnh chụp cùng kích thước với mẫu: bìa, hero, thông tin lễ, lịch và footer.
- [x] Chạy `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` sau mỗi đợt có thay đổi chức năng.
- [x] Bổ sung test có ý nghĩa cho lịch: tháng bắt đầu Chủ nhật/Thứ hai, tháng 2 năm nhuận, biên múi giờ và đổi bên tiệc; giữ test tên khách, URL và countdown.
- [x] Kiểm tra 360, 390, 430, 768, 1440px; không tràn ngang, không méo ảnh, chữ/họa tiết không chồng lên nhau.
- [x] Kiểm tra mở thiệp bằng Enter/Space; Tab, Escape và trả focus ở dialog; album với phím trái/phải.
- [x] Kiểm tra reduced motion, tương phản và nhạc chỉ chạy khi người dùng bật.
- [x] Kiểm tra asset ở đường dẫn gốc và subpath GitHub Pages; không phát sinh hotlink hoặc tracking.
- [x] Ghi kết quả thực tế vào QA và cập nhật checklist; các kiểm tra thiết bị chưa chạy phải ghi rõ.

Đầu ra: bản build local hoàn chỉnh và báo cáo các sai khác còn lại. Phát hành công khai là bước riêng, phụ thuộc đích hosting và quyền truy cập; không coi kế hoạch hoặc build local là đã deploy.

## 8. Tiêu chí hoàn thành

- Nhìn vào bìa và hero nhận ra phong cách Long Phụng đỏ/vàng; có Song Hỷ, ảnh vòm và họa tiết rõ nét.
- Các phần chính đúng thứ tự đã thống nhất; nội dung đọc được trên điện thoại và desktop.
- Giữ được các chức năng hiện tại và đảm bảo chọn bên cập nhật đúng toàn bộ thông tin tiệc.
- Resource được phục vụ cục bộ, có nguồn rõ ràng; các thay thế được ghi lại.
- Không dùng QR/thông tin cá nhân của demo; không nhận phản hồi giả hoặc tự thêm backend/tracking.
- Bốn lệnh kiểm tra đều đạt và QA mới ghi đúng những gì đã thực sự kiểm tra.

## 9. Giả định để triển khai không cần chờ dữ liệu thật

Tiếp tục dùng Minh Anh – Khánh Linh, các ngày/địa điểm, ảnh và nhạc mẫu hiện có. Các gia đình, lịch trình và dress code mới là dữ liệu minh họa, được đánh dấu rõ. Quà mừng để trống, RSVP/lưu bút chưa kết nối. Việc kết nối lưu trữ thực hoặc xuất bản không nằm trong thay đổi giao diện mặc định.
