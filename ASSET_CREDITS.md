# Tài nguyên — giao diện Long Phụng

Cập nhật 20/10/2026.

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

`a-little-forever.wav` is an original procedurally synthesized piano miniature created for this project by `scripts/generate-music.mjs`. No commercial song or sampled recording is used. It plays only after pressing the music control.
