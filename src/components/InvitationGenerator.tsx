import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import type { WeddingSide } from "../config/wedding";
import { createInvitationUrl } from "../utils/invitation";

export function InvitationGenerator() {
  const [guest, setGuest] = useState("Bạn Long và gia đình nhỏ");
  const [side, setSide] = useState<WeddingSide>("nhatrai");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  return (
    <details className="invitation-generator">
      <summary>
        <Link2 size={15} /> Tạo lời mời riêng cho khách
      </summary>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setResult(createInvitationUrl(window.location.href, guest, side));
          setCopied(false);
          setStatus("");
        }}
      >
        <p>Mỗi vị khách, một lời mời thật riêng.</p>
        <div className="generator-fields">
          <label>
            Tên khách mời
            <input
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              maxLength={100}
              required
            />
          </label>
          <label>
            Tiệc cưới
            <select
              value={side}
              onChange={(e) => setSide(e.target.value as WeddingSide)}
            >
              <option value="nhatrai">Nhà trai</option>
              <option value="nhagai">Nhà gái</option>
            </select>
          </label>
          <button type="submit" className="button primary">
            Tạo link <Link2 size={16} />
          </button>
        </div>
        {result && (
          <div className="generator-result">
            <label>
              Link thiệp cá nhân hóa
              <input
                readOnly
                value={result}
                onFocus={(e) => e.currentTarget.select()}
              />
            </label>
            <button
              type="button"
              className="icon-button"
              aria-label="Sao chép link"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(result);
                  setCopied(true);
                  setStatus("Đã sao chép link mời.");
                } catch {
                  setStatus("Hãy chọn và sao chép link trong ô phía trên.");
                }
              }}
            >
              {copied ? <Check size={19} /> : <Copy size={19} />}
            </button>
          </div>
        )}
        <span role="status">{status}</span>
      </form>
    </details>
  );
}
