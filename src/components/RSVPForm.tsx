import { Heart, Mail } from "lucide-react";
import { Reveal } from "./Reveal";
import { Botanical } from "./Botanical";
export function RSVPForm() {
  return (
    <section className="rsvp-section" id="hoi-am">
      <Reveal className="rsvp-inner">
        <Botanical />
        <Heart size={24} strokeWidth={1} />
        <span className="eyebrow">HẠNH PHÚC KHI CÓ BẠN</span>
        <h2>
          Hẹn bạn trong
          <br />
          <em>ngày thật đẹp.</em>
        </h2>
        <p>
          Một cái ôm, một lời chúc, một nụ cười của bạn.
          <br />
          Thế là ngày vui của chúng mình đã trọn vẹn.
        </p>
        <div className="rsvp-demo">
          <Mail size={18} />
          <div>
            <strong>Xác nhận tham dự sẽ sớm mở</strong>
            <span>
              Thiệp mẫu chưa nhận hoặc lưu phản hồi.
              <br />
              Thông tin liên hệ sẽ được bổ sung khi có thiệp chính thức.
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
