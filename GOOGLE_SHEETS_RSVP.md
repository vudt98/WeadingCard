# Kết nối xác nhận tham dự với một bảng Google Sheets

Form trên thiệp → Apps Script của bạn → tab `RSVP` trong bảng riêng của gia đình.
Không cần Google Form, API key, tài khoản dịch vụ hoặc công khai bảng dữ liệu.

## 1. Tạo bảng và dán mã tiếp nhận

1. Đăng nhập tài khoản Google sẽ quản lý phản hồi, mở <https://sheets.new>, đặt tên bảng **Xác nhận tham dự – Vũ & Mai**.
2. Trong bảng, chọn **Tiện ích mở rộng → Apps Script**.
3. Thay nội dung `Code.gs` bằng toàn bộ mã trong [google-apps-script/Code.gs](google-apps-script/Code.gs).
4. Mở **Cài đặt dự án → Thuộc tính tập lệnh (Script properties)**, thêm:

   | Thuộc tính | Giá trị |
   | --- | --- |
   | `ALLOWED_ORIGINS` | Origin của website, ví dụ `https://vudt98.github.io` |

   Origin chỉ gồm giao thức + tên miền (+ cổng nếu có), **không có đường dẫn repo hoặc dấu `/` cuối**. Nếu dùng tên miền riêng, điền origin của tên miền đó. Để thử local cùng lúc, dùng danh sách phân cách bằng dấu phẩy: `https://vudt98.github.io,http://127.0.0.1:5173`.

5. Lưu, chọn hàm **`setupRSVP`** trên thanh công cụ rồi bấm **Chạy**. Chấp thuận quyền quản lý bảng tính khi Google yêu cầu. Chỉ chạy sau khi đã đọc và kiểm tra mã trong dự án của chính bạn.
6. Hàm tạo tab `RSVP`, tiêu đề cột, múi giờ Việt Nam và lưu `SPREADSHEET_ID` vào Script properties. Không cần tự điền ID vào mã nguồn. Tab trống đầu tiên được đổi tên; dữ liệu sẵn có không bị xóa. Hai cột kỹ thuật cuối được ẩn.

Tệp [appsscript.json](google-apps-script/appsscript.json) là manifest tham khảo với V8, múi giờ và quyền Sheets; có thể bật hiển thị manifest trong cài đặt dự án và thay bằng tệp này. Khi không thay manifest, trình soạn thảo tự suy luận quyền từ mã.

## 2. Triển khai Apps Script

1. Chọn **Triển khai → Bản triển khai mới → Ứng dụng web (Web app)**.
2. **Thực thi với tư cách:** tài khoản của bạn (**Me**).
3. **Ai có quyền truy cập:** **Bất kỳ ai (Anyone)**, để khách không phải đăng nhập Google. Đây là quyền gọi endpoint gửi phản hồi; bảng Sheets vẫn để riêng tư. Nếu tài khoản công ty không cho phép, cần quản trị viên cho phép hoặc tài khoản Google cá nhân phù hợp.
4. Bấm **Triển khai** và sao chép URL ứng dụng web, dạng:

   ```text
   https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   ```

   Dùng URL `/exec`, không dùng `/dev`, link bảng Sheets hay link trình soạn thảo script. Mở URL trực tiếp chỉ hiện thông báo endpoint; việc đó chưa phải kiểm tra lưu RSVP.

## 3. Cấu hình website

### Local

Tạo `.env.local` ở thư mục gốc (đã được Git bỏ qua):

```dotenv
VITE_RSVP_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Khởi động lại `npm run dev`. Port phải trùng origin local đã cho phép ở bước 1. Không điền mật khẩu Google, access token hoặc thông tin đăng nhập vào biến này. URL endpoint là thông tin công khai trong website.

### GitHub Pages

Trong repo, mở **Settings → Secrets and variables → Actions → Variables → New repository variable**:

- **Name:** `RSVP_SCRIPT_URL`
- **Value:** URL `/exec` vừa triển khai.

Workflow đã truyền biến này vào bước build qua `VITE_RSVP_SCRIPT_URL`. Chạy lại workflow triển khai hoặc push thay đổi để build lại. Không phải sửa mã để bật nút gửi. Khi biến trống hoặc URL không đúng định dạng, form tiếp tục hiển thị chưa mở tiếp nhận.

## 4. Kiểm tra trước khi gửi thiệp

1. Dùng trình duyệt ẩn danh, mở website đã triển khai; điền một phản hồi thử với tên dễ nhận biết, chọn tham dự và số người.
2. Bấm gửi: nút chuyển sang đang gửi, chỉ báo thành công sau khi Apps Script ghi và kiểm tra dòng đã lưu. Kiểm tra tab `RSVP` có dòng tương ứng.
3. Thử phản hồi không tham dự: số người phải bằng `0`.
4. Thử trên điện thoại/Chrome/Safari thực tế. Nếu mất mạng hoặc thông báo chưa xác nhận được, nội dung form còn nguyên để gửi lại. Gửi lại **cùng nội dung trong lần mở trang đó** dùng cùng mã gửi để tránh thêm dòng trùng.
5. Chỉ xóa các dòng thử do bạn vừa tạo sau khi kiểm tra xong. Giữ nguyên tên tab `RSVP` và thứ tự/tên các cột.

Các cột: thời gian nhận, họ tên, bên mời, tham dự, số người, lời nhắn, mã gửi, dấu kiểm tra. Mỗi phản hồi mới là một dòng. Các lần gửi mới sau khi tải lại trang hoặc thay đổi nội dung có mã mới; hệ thống không tự gộp hai khách trùng tên hoặc coi lần gửi sau là sửa lần trước.

## Xử lý khi chưa nhận phản hồi

- Nút gửi bị khóa: kiểm tra biến môi trường và build/khởi động lại sau khi đổi biến.
- Chưa có tab/dòng: chạy `setupRSVP`, kiểm tra `SPREADSHEET_ID`, tên tab và tiêu đề; xem mục **Executions** trong Apps Script để biết lần chạy thất bại.
- Không nhận được xác nhận: kiểm tra đúng URL `/exec`, quyền **Anyone**, origin website trong `ALLOWED_ORIGINS`, phiên bản triển khai và việc trình duyệt chặn iframe/script. Phản hồi có thể đã lưu nhưng mất thông báo; thử lại cùng nội dung sẽ được kiểm tra mã gửi trước khi ghi.
- Sau khi sửa `Code.gs`, chọn **Manage deployments → Edit → New version → Deploy**. Chỉ lưu mã trong editor chưa cập nhật bản `/exec`.
- Apps Script có giới hạn thực thi/đồng thời của Google. Đây là giải pháp cho RSVP quy mô gia đình, không có cam kết sẵn sàng của một dịch vụ đặt chỗ chuyên dụng.

## Cách xác nhận và bảo vệ dữ liệu

Website gửi POST qua một iframe ẩn. Apps Script trả kết quả bằng `postMessage` đến đúng origin website; phía thiệp kiểm tra origin Google, mã gửi và nonce ngẫu nhiên của từng lần thử. Vì Apps Script có iframe sandbox lồng nhau, kết quả được gửi lên các frame cha đến origin đã cho phép. Không dùng `no-cors` hoặc sự kiện iframe tải xong để giả định đã lưu thành công.

Phía tiếp nhận kiểm tra dữ liệu, dùng khóa khi ghi, kiểm tra mã gửi/dấu kiểm tra khi retry và chuyển nội dung có thể là công thức thành văn bản. Không có endpoint đọc danh sách khách. Giữ bảng riêng tư, chỉ chia sẻ cho người phụ trách; không bật công khai trên web.

`ALLOWED_ORIGINS` và trường bẫy bot chỉ là bộ lọc cơ bản, **không phải xác thực hay giải pháp chống spam hoàn chỉnh**: endpoint gửi RSVP là công khai và có thể bị gọi ngoài trình duyệt. Không đặt khóa bí mật trong frontend. Nếu cần chống lạm dụng mạnh hơn, cần bổ sung giải pháp xác minh ở phía máy chủ.

Mã và test local không thay thế việc kiểm tra ghi thật ở bước 4. Khi chưa triển khai Apps Script/tạo bảng trong tài khoản Google và cấu hình URL, dự án chưa thể tiếp nhận RSVP thực tế.

Tài liệu Google: [Web apps](https://developers.google.com/apps-script/guides/web), [HTML sandbox](https://developers.google.com/apps-script/guides/html/restrictions), [iframe embedding](https://developers.google.com/apps-script/reference/html/x-frame-options-mode), [LockService](https://developers.google.com/apps-script/reference/lock/lock-service), [hạn mức](https://developers.google.com/apps-script/guides/services/quotas).
