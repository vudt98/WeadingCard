import { useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";
import { wedding } from "../config/wedding";
export function MusicPlayer() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  async function toggle() {
    if (!ref.current) return;
    if (playing) {
      ref.current.pause();
      setPlaying(false);
    } else {
      try {
        ref.current.volume = 0.28;
        await ref.current.play();
        setPlaying(true);
        setError("");
      } catch {
        setError("Chưa phát được nhạc. Bạn có thể thử lại.");
      }
    }
  }
  return (
    <div className="music-player">
      <audio
        ref={ref}
        src={wedding.music}
        loop
        preload="none"
        onError={() => {
          setPlaying(false);
          setError("Không tải được nhạc nền.");
        }}
      />
      <button
        className={`music-button ${playing ? "playing" : ""}`}
        onClick={toggle}
        aria-label={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
        aria-pressed={playing}
      >
        {playing ? <Music2 size={18} /> : <VolumeX size={18} />}
        <span>{playing ? "Đang ngân nga" : "Một chút nhạc"}</span>
        <span className="sound-bars">
          <i />
          <i />
          <i />
        </span>
      </button>
      {error && <p role="status">{error}</p>}
    </div>
  );
}
