# Tài nguyên — giao diện Long Phụng

## Story font trial from Thiệp Cưới 67 Pre — 9 November 2026

Marmelad Regular was tested for the story body from the user-supplied saved `Xem trước Thiệp Cưới 67 Pre – Thiệp cưới online _ ZenLove_files/font.css`. The trial was reverted at the user's request; the story body again uses Cormorant Garamond. The font file is retained for provenance but is no longer declared or used by the invitation.

- Local file: `public/crimson/fonts/marmelad-regular.woff2`.
- Source: `https://cdn-resource.zenlove.me/fonts/webfonts/marmelad-regular/marmelad-regular-1771225078105-ki07np.woff2`.
- During the trial it was served locally through `public/crimson/fonts.css`; no runtime request to the source CDN.

## C141 calendar and event decorations — 6 November 2026

Copied the two decorative images referenced by the user-supplied `wedding-local-temp.html` into local public assets. They are used as design-reference artwork; ownership remains with the original rights holders.

- `public/images/magazine/calendar-background.png`: [original cropped calendar frame](https://img.cinelove.me/templates/assets/d76a805f-3365-43a2-881a-b80af3a87674/59de1bb5-d62e-460e-962c-f474130e1c91.png?crop=176,139,450,324).
- `public/images/magazine/events-divider.png`: [original cropped swan pair](https://img.cinelove.me/templates/assets/d76a805f-3365-43a2-881a-b80af3a87674/a1ffb539-5f3e-4549-ab61-1ef16d05535c.png?crop=0,114,533,355).

Paths are configured through `asset()` in `src/config/wedding.ts`; the running site makes no request to these source URLs.

Cập nhật 20/10/2026.

Animation đã được đối chiếu lại từ `preview_Elegance .html` và CSS/runtime công khai có cùng hash tài nguyên của trang ZenLove. `src/reveal.css` chỉ chứa các keyframe entrance được tái tạo tương ứng; không nhập runtime của nhà cung cấp. Nguồn cụ thể và bảng ánh xạ trong [ANIMATION_REFERENCE.md](ANIMATION_REFERENCE.md).

Sau đợt dọn project ngày 20/10/2026, bản HTML tham chiếu và thư mục đi kèm đã được xóa; các ảnh mẫu Unsplash và SVG rồng/phượng/Song Hỷ của giao diện cũ cũng đã được loại bỏ. Các mục tương ứng bên dưới được giữ làm lịch sử nguồn. Tài nguyên đang dùng gồm ảnh trong `public/images/anh-cuoi/`, ảnh mở thiệp, chim én, font, hình lịch và nhạc local.

## Nội dung Crimson Elegance từ bản HTML lưu của chủ project

Nguồn tham chiếu được cung cấp trong workspace: `Xem trước Crimson Elegance – Thiệp cưới online _ ZenLove.html` và thư mục `_files` tương ứng. Đã đọc DOM/CSS sau render; chuyển bố cục sang React và CSS responsive trong `src/components/CrimsonInvitation.tsx` và `src/crimson.css`.

- Tái sử dụng các khai báo `@font-face` từ 7 file `font*.css` của bản lưu, đổi URL sang local trong `public/crimson/fonts.css`. Font local: VIP Brisca, Ergisa, Alisheia, Lora Regular, Luxurious Script, UTM Edwardian, HoaTay1. Nguồn từng file trong `public/crimson/asset-sources.json`.
- 16 ảnh WebP được URL nền ảnh trong HTML tham chiếu đã tải về `public/images/anh-cuoi/` (phân theo vị trí hiển thị; xem `PHOTO_GUIDE.md`). Đây là ảnh minh họa gốc của mẫu Crimson Elegance, không phải ảnh của cặp đôi được cấu hình trong project. Manifest ghi ánh xạ node/URL/file.
- `public/crimson/heart-calendar.png` chép từ `heart-calendar-none.png` trong thư mục người dùng cung cấp.
- Màu `#7d1f2a`, khung feed 500px, khối thông tin bo góc 20px, font/kích thước chữ, ảnh ba khung và phong cách album được điều chỉnh từ CSS/inline style gốc. Dùng luồng bố cục responsive thay cho các tọa độ tuyệt đối cố định của bản lưu.
- Nguồn và quyền của ảnh/font thuộc nhà cung cấp tương ứng; chưa có xác nhận giấy phép tái sử dụng độc lập. Import theo yêu cầu của chủ project. Giữ thông tin nguồn trong manifest này để đối chiếu.

Ảnh/font chỉ phục vụ từ local qua `asset()`; stylesheet font dùng đường dẫn tương đối cùng thư mục để hỗ trợ subpath. Không nhúng JavaScript runtime, API, tracking, nội dung lời chúc của demo hoặc bản nhạc Lover. Nhạc hiện dùng là file I Do do người dùng cung cấp, phát sau thao tác mở thiệp. Các tài nguyên Unsplash và Long Phụng ở mục dưới là tài nguyên của giao diện trước, không còn là ảnh/họa tiết của nội dung đang hiển thị.

## Hiệu ứng mở hai cánh — Crimson Elegance

Áp dụng theo yêu cầu của chủ project từ mẫu https://zenlove.me/template/crimson-elegance/preview?layout=feed ngày 20/10/2026. Hai PNG được tải thành công, lưu local và sử dụng qua `asset()`; không hotlink:

| File local | Nguồn |
| --- | --- |
| `public/images/opening/seal-10.png` | https://cdn.zenlove.me/assets/opening-effects/door-seals/seal-10.png |
| `public/images/opening/dark-linen.png` | https://cdn.zenlove.me/assets/opening-effects/door-bgs/dark-linen.png |

Đây là tài nguyên gốc của mẫu, thay cho con dấu và texture tự dựng ở phiên bản trước. Chưa xác nhận giấy phép tái sử dụng độc lập từ nhà cung cấp. Không tải font VIP Brisca; nút dùng font Cormorant Garamond local hiện có. Hiệu ứng được triển khai trong React/CSS của project, không nhúng runtime hoặc dịch vụ của mẫu.

## Trang trí Long Phụng

Tham chiếu: https://chungdoi.com/vi/mau-thiep/long-phung-v3-do

Đã thử tải ảnh toàn cảnh và bốn họa tiết công khai của mẫu. Server trả HTTP 403 cho các lần tải ngày 20/10/2026, nên bản triển khai không chứa file ảnh, mã nguồn, font, nhạc hoặc QR lấy từ Chung Đôi. Chưa xác nhận giấy phép sử dụng lại các tài nguyên gốc.

| File được dùng | Nguồn / quyền sử dụng |
| --- | --- |
| `public/images/long-phung/dragon.svg` | Hình rồng nét vàng tự dựng cho project |
| `public/images/long-phung/phoenix.svg` | Hình phượng nét vàng tự dựng cho project |
| `public/images/long-phung/double-happiness.svg` | Chữ Song Hỷ dựng bằng các nét hình học cho project |
| `public/images/long-phung/swallow.svg` | Chim én tự dựng cho project |
| Khung vòm, viền, hoa văn phân cách và bìa | CSS/SVG tự dựng cho project |

Các họa tiết là phương án thay thế, không phải bản sao chính xác của mẫu. Ảnh trang trí được phục vụ local qua `asset()`; không hotlink.

Nguồn gốc đã thử tải:
- https://chungdoi.com/images/themes/longphung-v3-red/rong.webp
- https://chungdoi.com/images/themes/longphung-v3-red/phung.webp
- https://chungdoi.com/images/themes/longphung-v3-red/chu-hy.webp
- https://chungdoi.com/images/themes/longphung-v3-red/chim-en.webp
- https://assets.chungdoi.com/template-showcase/vi/dragon_phoenix_v3_red.2f0a683f.webp

## Ảnh mẫu hiện có

Sample photography downloaded from Unsplash under https://unsplash.com/license on 15 October 2026. These images illustrate a fictional wedding; they are not photographs of the sample names in the invitation. Replace with the couple's own photographs before sending real invitations.

- `hero.webp`: https://images.unsplash.com/photo-1519741497674-611481863552
- `couple.webp`: https://images.unsplash.com/photo-1511285560929-80b456fea0bc
- `details.webp`: https://images.unsplash.com/photo-1519225421980-715cb0215aed
- `celebration.webp`: https://images.unsplash.com/photo-1532712938310-34cb3982ef74

Fonts: Cormorant Garamond and Be Vietnam Pro, distributed locally through Fontsource under their bundled SIL Open Font License. Icons: Lucide (ISC).

The current soundtracks are user-provided `public/audio/background_music.mp3` and `public/audio/sugar.mp3`, configured through `wedding.music` / `wedding.albumMusic` and the local `asset()` helper. Playback starts after the user opens the invitation; album navigation can crossfade to Sugar. The previous `i-do.mp3` remains local and is excluded from the deployment source. The earlier procedural `a-little-forever.wav` has been removed from deployment resources. No external music request is made.

The reference music control uses `music-4.png`, a 30px disc at top/right 10px, with a 5s rotation and a white pause slash. The full source path was recovered from its caller: `https://cdn-resource.zenlove.me/assets/mp3/icons/music-4.png`. The earlier 404 requests omitted `mp3/icons/`; they did not establish that the original icon was unavailable. The original PNG is now stored at `public/images/music/music-4.png` and configured through `asset()`, replacing the interim Lucide Disc3 approximation. No remote icon or music is requested at runtime. Independent reuse licensing has not been confirmed.
## Responsive photo derivatives — 9 November 2026

Local hero `images/anh-cuoi/dau-thiep/responsive/hero-{480,960,1440,2700}.jpg` and album `images/anh-cuoi/album/responsive/anh_{1..6}-{960,1920}.jpg` are resized from the existing user-supplied originals, with EXIF orientation applied, using `scripts/create-responsive-photos.ps1`. JPEG quality 88, bicubic sampling, no upscaling; original files are retained. No external image service is used.
