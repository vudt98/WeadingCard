# Thiệp cưới — giao diện tạp chí và album 3D

Website thiệp cưới tiếng Việt bằng React, TypeScript, Vite, Tailwind CSS, Motion và Lucide. Giao diện tạp chí nền kem, album card 3D và hiệu ứng mở thiệp hai cánh. Tài nguyên được phục vụ local.

Khung thiệp giới hạn 480px trên màn hình nhỏ và 900px từ 768px; album rộng tối đa 432/600px, cao 340/520px. Nội dung chữ được giới hạn riêng để dễ đọc. Album chuyển mỗi 4,2 giây (`wedding.galleryCards.autoAdvanceMs`); đóng ảnh lớn sẽ tự chạy lại sau một nhịp đầy đủ, giữ nguyên Pause nếu bạn đã chọn. Reduced motion vẫn tắt tự chuyển.

Tên, gia đình, ngày giờ, địa điểm, ảnh và lịch trình hiện là **dữ liệu minh họa**. RSVP đã có mã kết nối Google Sheets, cần thiết lập bảng và Apps Script trước khi tiếp nhận thật; xem [hướng dẫn Google Sheets RSVP](GOOGLE_SHEETS_RSVP.md). Sổ lưu bút chưa tiếp nhận/lưu dữ liệu. Quà mừng chưa cấu hình tài khoản.

## Chạy local

Dùng Node.js 22.13+ trong nhánh 22, sau đó:

```sh
npm ci
npm run dev
```

Mở địa chỉ localhost do Vite in ra. Dừng server bằng Ctrl+C trước khi cài lại dependencies trên Windows để tránh lỗi khóa native module.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

## Nội dung và giao diện

- `src/config/wedding-content.json`: resource nội dung thiệp. Sửa trực tiếp tên, gia đình, ngày giờ, địa điểm, lời mời, câu chuyện, RSVP, lời cảm ơn và nhãn điều khiển tại đây. Giao diện đọc resource qua `src/config/wedding.ts`; Vite cập nhật khi lưu file trong chế độ dev, bản phát hành cần build lại.
- `src/config/wedding.ts`: cấu hình tổng hợp nội dung JSON với ảnh, nhạc, hiệu ứng và tùy chọn hiển thị. Nội dung form mới nằm ở `wedding.rsvp`; mục quà tặng và thông báo chờ bổ sung nằm ở `wedding.giftSettings`.
- `copy`: lời thơ, đếm ngược, RSVP, lưu bút, quà mừng và lời cảm ơn. `crimsonCopy`: tiêu đề hiển thị của bố cục Crimson. `story`: các đoạn câu chuyện. `ui`, `autoScrollLabels`, `musicLabels`: nhãn giao diện.
- `families`: cha mẹ, tên đầy đủ, vai vế và địa chỉ hiển thị.
- `ceremonies`: lễ thành hôn/vu quy riêng theo bên; ngày âm là chuỗi được cung cấp, để trống thì không hiển thị.
- `events`: ISO có múi giờ, giờ đón khách và lịch trình riêng cho nhà trai/nhà gái.
- `countdown.nhatrai.dateTimeISO`, `countdown.nhagai.dateTimeISO`: mốc ngày giờ đếm ngược riêng cho mỗi bên.
- `calendar.nhatrai.dateTimeISO`, `calendar.nhagai.dateTimeISO`: ngày được đánh dấu trên lịch, tháng/năm hiển thị và thời điểm bắt đầu của nút “Thêm vào lịch”. Dùng ISO có múi giờ, ví dụ `2026-11-28T09:00:00+07:00`. Đếm ngược và lịch có thể khác ngày tiệc; ngày ở đầu thiệp và thẻ tiệc vẫn lấy từ `events`.
- `dressCode`: tên màu và mã màu; để mảng rỗng để ẩn phần này.
- `gifts` trong JSON: mặc định mảng rỗng. Khi có thông tin chính thức, thêm `label`, `bank`, `accountName`, `accountNumber`, `qrImage` (ví dụ `"images/your-qr.png"`, không có dấu `/` đầu đường dẫn). `wedding.ts` tự áp dụng `asset()` cho QR local. QR cần là file do chủ thiệp cung cấp; xác minh QR khớp tài khoản trước khi phát hành.
- `src/styles.css`, `src/crimson.css`, `src/magazine.css`: token, typography, khung và responsive. `src/rsvp-gifts.css`: form RSVP và hộp quà tông kem–olive.
- `public/images/anh-cuoi/`: ảnh theo từng vị trí; xem [PHOTO_GUIDE.md](PHOTO_GUIDE.md) để thay ảnh và cấu hình album.
- `public/images/opening/`: hình con dấu và nền mở thiệp.
- `public/crimson/`: font, stylesheet font, hình lịch và manifest nguồn tài nguyên; `public/audio/`: nhạc local. Font dự phòng được đóng gói bằng Fontsource.
- `public/images/music/music-4.png`: icon nhạc gốc của demo, cấu hình bằng `wedding.musicSettings.icon` qua `asset()`.
- `index.html`: tiêu đề, mô tả chia sẻ và màu trình duyệt. Cập nhật cùng dữ liệu thật.

Bản này sử dụng `CrimsonInvitation.tsx`; các component và ảnh của giao diện cũ đã được loại bỏ.

Resource JSON dùng UTF-8, chuỗi đặt trong dấu nháy kép, xuống dòng bằng `\n`, không hỗ trợ comment hoặc dấu phẩy cuối. Giữ nguyên tên các khóa; ngày giờ có định dạng như `2027-01-10T17:00:00+07:00`. Một số nội dung lưu sẵn chỉ hiển thị khi bật mục tương ứng trong `wedding.crimson.sections`. File `NOI_DUNG_THIEP.md` là bản tham khảo, không tự đồng bộ với resource. Tiêu đề và mô tả chia sẻ tĩnh vẫn chỉnh tại `index.html`.

## Thiệp cá nhân hóa

Ví dụ: `/?guest=Gia+đình+Long&ben=nhagai`.

`ben=nhagai` chọn nhà gái; giá trị khác dùng nhà trai. Tên được chuẩn hóa Unicode, bỏ ký tự điều khiển, giới hạn 100 code point và hiển thị dưới dạng text. Thiếu tên dùng “Quý khách”. Đổi bên trên trang cập nhật URL để tải lại giữ lựa chọn. Công cụ tạo/sao chép link có thể bật bằng `wedding.crimson.sections.showInvitationTools`.

Lễ cưới, tiệc, ngày trên hero, lịch tháng, đếm ngược, chỉ đường, link Google Calendar và lịch trình đều theo bên đã chọn. Thời gian hiển thị theo `Asia/Ho_Chi_Minh`; lịch tháng bắt đầu từ Thứ hai. Ngày đã qua hiển thị đếm ngược bằng 0.

## Tương tác

- Hiệu ứng theo `preview_Elegance .html`: hiện dần theo bốn hướng, zoom, fade và pulse nút chỉ đường. Các phần dưới chạy một lần khi xuất hiện.
- Phần đầu dùng hiệu ứng gốc: tên đôi/thông báo `fadeInUp`, Save the date/ngày `fadeInLeft`/`fadeInRight` (1,5 giây, không trễ). Animation chạy khi bố cục sẵn sàng và phần tử vào vùng nhìn, kể cả khi bìa còn đóng. Bấm mở không chạy lại chữ. Ba ảnh đầu hiển thị sẵn; ảnh giữa giữ tỷ lệ 163×279 so với 151×233 của hai ảnh bên.
- Countdown chạy riêng từng lớp khi vào vùng nhìn thấy: ảnh nền/lớp màu `fadeIn` và lời trích dẫn `fadeInUp` (1,5 giây, trễ 0,5 giây); đồng hồ `fadeIn` (1,5 giây, không trễ). Cơ chế quan sát độc lập với cửa như demo.
- `wedding.animation` trong `src/config/wedding.ts` cấu hình thời lượng, độ trễ và thứ tự hiệu ứng album. Reduced motion bỏ chuyển động; điều khiển nhận focus được hiện ngay.
- `useInvitationReady` chờ tối thiểu 1 giây và font sẵn sàng (timeout font 2,5 giây) trước khi bật observer cho toàn bộ thiệp. Từng phần chạy một lần khi vào vùng nhìn: threshold 0,1 và mép dưới thu vào 50px. Có thể chỉnh `visibleAmount` và `viewportInsetPx` trong `wedding.animation`. Nhạc và auto-scroll vẫn dùng mốc cửa mở hoàn tất.
- Keyframe trong `src/reveal.css` đã đối chiếu CSS gốc: trượt theo 100% kích thước phần tử, zoom rõ hoàn toàn tại 50%, pulse nhịp 1 giây. Xem `ANIMATION_REFERENCE.md` cho nguồn và cách kiểm chứng.
- Nút Play/Pause góc trên trái bật/tắt cuộn tự động đến cuối thiệp. Cuộn chỉ bắt đầu khi khách bấm Play; mở thiệp hay bật hiệu ứng không tự bắt đầu cuộn.
- `wedding.autoScroll` cấu hình bật/tắt điều khiển, tốc độ (px/giây) và nhãn nút. Mặc định 60px/giây; cuộn tay, chạm, dùng phím cuộn, tương tác điều khiển hoặc chuyển tab sẽ dừng. Với reduced motion chưa được khách ghi đè, nút chỉ đưa ngay xuống cuối khi được nhấn.
- Nút cuộn ẩn trong khi trang di chuyển và hiện lại sau 800ms đứng yên (`controlIdleDelayMs`). Khi đang được focus bằng bàn phím, nút vẫn hiện để có thể dừng cuộn. Cột Chủ nhật của lịch dùng màu vàng template, chỉnh tại `wedding.calendar.sundayColor`.

- Enter/Space mở thiệp; focus chuyển vào nội dung sau hiệu ứng.
- Thiệp là vùng cuộn riêng cao bằng màn hình, rộng tối đa 500px; thanh cuộn mảnh nằm sát mép phải của card. Trang bên ngoài đứng yên; nút cuộn và nhạc bám theo card. Animation, auto-scroll và khóa cuộn album cùng dùng vùng cuộn này.
- Phần cuối: form xác nhận tham dự, hộp quà yêu thương mở dialog, ảnh và lời cảm ơn phủ gradient đen. Sổ lưu bút, lịch trình bổ sung và công cụ tạo link mặc định ẩn; có thể bật lại trong `wedding.crimson.sections`.
- Nhạc nền local `public/audio/background_music.mp3` được chọn qua `wedding.music` bằng `asset()`, tự phát ngay khi nhấn mở thiệp (`musicSettings.autoPlayAfterOpen`), tăng âm lượng từ 0 lên mức cấu hình trong 2,5 giây (`musicSettings.openingFadeInMs`). Khi hai cánh mở hoàn tất, nhạc tiếp tục liền mạch. Nút nhạc dùng để bật/tắt toàn bộ nhạc, chỉ báo đang phát khi audio thực sự chạy. `musicSettings.volume` mặc định 0,28; reduced motion tắt vòng xoay. Nếu trình duyệt chặn phát, nút cho phép thử lại.
- Sugar (`wedding.albumMusic`, `public/audio/sugar.mp3`) bắt đầu khi mở ảnh giữa để xem chi tiết hoặc bấm nút trước/sau trong album/trình xem toàn màn hình. Cuộn đến album riêng không tự kích hoạt Sugar. Bấm liên tục không phát lại từ đầu. Trong lúc xem chi tiết, Sugar tiếp tục; khi đóng bằng nút X, Escape hoặc nền trống, thiệp kiểm tra vị trí album: còn hiển thị thì giữ Sugar, ra khỏi màn hình thì chuyển về nhạc nền tại vị trí đã dừng. Quay lại album phải mở ảnh hoặc bấm nút chuyển ảnh để chọn Sugar lại; Sugar cũng giữ vị trí đã dừng. Tắt nhạc thủ công được giữ qua các lần mở/đóng ảnh, chuyển ảnh và cuộn. Sugar lỗi sẽ thử quay về nhạc nền và báo lỗi; lỗi phát không được hiển thị như phát thành công.
- Ảnh album trên card và thumbnail dùng `galleryImages.src` (bản web 1333 × 2000px); ảnh chi tiết dùng `galleryImages.fullSrc` (bản gốc 5504 × 8256px). Chỉ tải bản gốc khi mở/chọn ảnh đó, có thông báo đang tải và lỗi tải. Mỗi ảnh gốc khoảng 18–22 MB nên lần tải đầu có thể lâu hơn trên mạng di động.
- Hai bài chuyển bằng crossfade: 1200ms sang Sugar (`musicSettings.albumFadeInMs`), 1500ms về nhạc nền (`backgroundFadeInMs`). Bài mới bắt đầu ở âm lượng 0 khi bài cũ đang phát; chỉ fade sau khi bài mới sẵn sàng. Bài cũ giảm về 0 rồi mới tạm dừng, nên vị trí tiếp tục bao gồm cả đoạn fade. Hai bài chồng nhẹ trong quá trình chuyển, tổng mức âm lượng không vượt mức cấu hình. Cuộn đảo chiều tiếp tục từ âm lượng hiện tại; bấm chuyển ảnh liên tục không đặt lại fade. Tắt nhạc hủy fade và dừng cả hai ngay. Nếu bài mới bị chặn, giữ bài cũ còn phát được và hiển thị lỗi. Cơ chế này dùng âm lượng của media element; chưa xác minh trên iPhone/Safari thực tế.
- Không gian thanh cuộn được giữ ổn định khi mở/đóng thiệp hoặc album; chuyển focus không tự cuộn trang. Vị trí cuộn được trình duyệt khôi phục sẽ được đưa về đầu khi hai cánh còn đóng.
- Album hỗ trợ phím trái/phải, Escape và focus trap; đóng trả focus về nút mở.
- Nhạc chỉ phát sau khi nhấn nút. Tôn trọng reduced motion.
- Nút mở luôn giữ chữ “Mở thiệp”. Chỉ khi hệ thống yêu cầu giảm chuyển động, bìa mới hiện checkbox “Bật hiệu ứng cho thiệp”, mặc định tắt. Khách bật lựa chọn này để xem hiệu ứng hai cánh, nội dung xuất hiện, chuyển ảnh album/lightbox và đĩa nhạc. Lựa chọn dùng chung qua `InvitationMotionProvider` cho Motion và CSS, có hiệu lực trong lần xem hiện tại và được đặt lại khi tải trang. Khi chưa bật, thiệp theo reduced motion; thay đổi thiết lập hệ thống được cập nhật ngay. Cuộn vẫn chỉ bắt đầu bằng nút Play. Các nhãn nằm trong `wedding.opening`.
- Form RSVP cho phép điền họ tên, chọn tham dự/từ chối, số người khi tham dự (tính cả người điền) và lời nhắn. Tên từ link thiệp được điền sẵn, cho phép sửa; tên khách mặc định không được điền vào form. Bên mời cập nhật theo lựa chọn nhà trai/nhà gái. Sau khi cấu hình `VITE_RSVP_SCRIPT_URL`, form gửi tới Apps Script để lưu Google Sheets, chỉ báo thành công khi nhận xác nhận lưu khớp mã gửi và nonce. Lỗi giữ nguyên dữ liệu để thử lại; không cấu hình endpoint thì nút gửi vẫn khóa. Thiết lập và kiểm tra ghi thật theo [GOOGLE_SHEETS_RSVP.md](GOOGLE_SHEETS_RSVP.md).
- Form RSVP dùng hai ô radio ngắn có nền đánh dấu lựa chọn, nhãn bên mời dạng pill và lời nhắn hai dòng có thể kéo rộng. Các trường nhập vẫn dùng chữ 16px và vùng bấm tối thiểu 44px.
- Hộp quà luôn mở được bằng nút “Gửi chút yêu thương”. Dưới 640px, dialog dùng tab người nhận, mỗi lần hiện một tài khoản; chuyển bằng chuột, ArrowLeft/ArrowRight hoặc Home/End. Từ 640px hiển thị hai thẻ bằng nhau cạnh nhau. Header/nút đóng đứng ngoài vùng nội dung cuộn. Khi `gifts` rỗng, dùng tên cô dâu/chú rể trong cấu hình với khung chờ QR thu gọn; nút sao chép bị vô hiệu hóa. Thêm tài khoản bằng các trường đã mô tả ở trên; QR là file local trong `public/`. QR lỗi có thông báo thay thế; chỉ báo sao chép thành công sau khi clipboard thực sự thành công. Sao chép STK là nút chính, lưu QR là liên kết phụ khi có ảnh. Dialog giữ Escape, bấm nền trống, focus trap và trả focus về nút mở.

## GitHub Pages

Workflow `.github/workflows/deploy.yml` chạy typecheck/lint/test/build và phát hành `dist` khi push `main`, sau khi repository bật Pages với nguồn GitHub Actions.

Vite dùng `base: './'` và mọi public asset qua `asset()`; hoạt động ở đường dẫn gốc hoặc subpath repository. Điều hướng nội bộ dùng hash. Build local không đồng nghĩa đã phát hành công khai.

Xem `PLAN.md`, `LONG_PHUNG_REDESIGN_PLAN.md` và `QA.md` cho tiến độ và kết quả kiểm tra thực tế.
# Giao diện hiện tại — 05/11/2026

Album ngoài trang dùng **card carousel 3D** với 6 ảnh: chuyển thủ công bằng hai nút trước/sau luôn hiển thị hoặc bàn phím; chọn ảnh giữa để mở lightbox. Không tự chuyển ảnh, không có chấm chỉ báo hay nút phát/tạm dừng album. Cấu hình nhãn/thời gian chuyển cảnh tại `wedding.galleryCards`; CSS tại `src/coverflow.css`.

Album hiện có trình xem ảnh toàn màn hình theo mẫu Mai Lan Trắng: chọn thumbnail, phím trái/phải, vuốt ngang, chạm đúp để zoom, pinch và kéo ảnh khi zoom. Component: `src/components/WeddingLightbox.tsx`; nhãn cấu hình tại `wedding.photoViewer`. Nhấn Escape hoặc nút X để đóng. Mở preview, cuộn tới album và chọn một ảnh để đánh giá bản thử.

Phần nội dung thiệp dùng bố cục tạp chí nền kem theo `wedding-local-temp.html` (C141). Component đang dùng là `src/components/MagazineInvitation.tsx`, CSS riêng tại `src/magazine.css`. Ảnh, nhạc I Do, thông tin cưới, phần mở cửa và con dấu giữ từ thiệp hiện tại. Cấu hình riêng của giao diện nằm ở `wedding.magazine` trong `src/config/wedding.ts`; nội dung cưới vẫn được nạp từ `wedding-content.json` như trước. Font thiếu trong mẫu được thay bằng font local có sẵn. Xem `QA.md` để biết các kiểm tra đã chạy.


## Source package for deployment — 09/11/2026

GitHub Pages builds the committed source using `.github/workflows/deploy.yml`. Commit application code in `src/`, configured images and fonts in `public/`, `background_music.mp3`, `sugar.mp3`, package/TypeScript/Vite/ESLint configuration and the workflow. Album originals are required for zoom; responsive derivatives are required for the detail viewer.

Saved reference HTML and `_files` folders, local audits, `node_modules/`, `dist/`, temporary manifests and unused assets are excluded by `.gitignore`. They are not needed by CI. The current entry point renders `MagazineInvitation`; the older `CrimsonInvitation` remains in source with its configured assets. Local font source records are described in `ASSET_CREDITS.md`; the historical local resource manifest is excluded from the deployment package.

## RSVP with Google Forms

The RSVP section supports a published Google Form embedded directly in the invitation, with an external responder link as fallback. Configure `wedding.rsvp.formUrl` and `embedHeight` in `src/config/wedding.ts`. Until a real responder URL is configured, the unavailable state remains. Google handles submissions and displays its own confirmation; the application never simulates a successful submission. See [RSVP_SETUP.md](RSVP_SETUP.md) for form questions, private response Sheet setup, and verification before deployment.

## GitHub Pages setup

Before running the deploy workflow, open repository Settings → Pages → Build and deployment → Source and select **GitHub Actions**. This requires repository administrator or maintainer access. Then re-run the failed workflow from Actions (Re-run all jobs) or run Deploy wedding invitation to GitHub Pages manually. A 404 at Configure Pages means the Pages site is missing or inaccessible; updating application code does not enable the site.

For a private repository, GitHub Pages requires an eligible paid plan. If Pages settings are unavailable, check the account plan and repository/organization policy. Keep the repository visibility unchanged unless explicitly requested.

The workflow uses Ubuntu 24.04 and Node 24 action runtimes (`checkout@v5`, `setup-node@v5`, `configure-pages@v6`); application commands continue to use Node 22. Automatic Pages enablement is not configured because it requires a separate privileged token.
