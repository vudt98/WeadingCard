import content from "./wedding-content.json";

export type WeddingSide = "nhatrai" | "nhagai";
export type WeddingAnimation = "none" | "fadeIn" | "fadeInUp" | "fadeInUpSmall" | "fadeInDown" | "fadeInLeft" | "fadeInRight" | "zoomIn" | "flipIn" | "pulse";
export interface WeddingEvent {
  title: string;
  dateTimeISO: string;
  venueName: string;
  address: string;
  mapsUrl: string;
  welcomeTime: string;
  lunarDate?: string;
  schedule: { time: string; title: string; description: string }[];
}
export interface WeddingGiftAccount {
  label: string;
  bank: string;
  accountName: string;
  accountNumber: string;
  qrImage: string;
}
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// Editable wedding information and copy are loaded from wedding-content.json.
const giftAccounts: WeddingGiftAccount[] = content.gifts;
export const wedding = {
  autoScroll: {
    enabled: true,
    autoStartAfterOpen: false,
    pixelsPerSecond: 60,
    startDelayMs: 2000,
    controlIdleDelayMs: 800,
    ...content.autoScrollLabels,
  },
  calendar: {
    sundayColor: "#ffc300",
    ...content.calendar,
  },
  countdown: content.countdown,
  musicSettings: {
    albumErrorMessage: "Chưa phát được nhạc album. Thiệp đang thử tiếp tục nhạc nền; bạn có thể dùng nút nhạc để phát lại.",
    icon: asset("images/music/music-4.png"),
    autoPlayAfterOpen: true,
    volume: 0.28,
    openingFadeInMs: 2500,
    albumFadeInMs: 1200,
    backgroundFadeInMs: 1500,
    ...content.musicLabels,
  },
  // Hiệu ứng từ preview_Elegance .html; thời gian tính bằng giây.
  animation: {
    duration: 1.5,
    delay: 0.5,
    viewportInsetPx: 50,
    visibleAmount: 0.1,
    gallery: ["fadeInUp", "fadeInLeft", "fadeInRight", "fadeInLeft", "fadeInRight", "fadeInUp", "fadeInDown", "fadeInUp", "fadeInDown"] as WeddingAnimation[],
  },
  ui: content.ui,
  isDemo: content.isDemo,
  groomName: content.groomName,
  brideName: content.brideName,
  monogram: content.monogram,
  signature: content.signature,
  hashtag: content.hashtag,
  rsvp: {
    // Paste the full responder URL (https://docs.google.com/forms/d/e/.../viewform).
    // Leave empty until a real form is published and connected to its response Sheet.
    formUrl: "",
    embedHeight: 1100,
    introText: content.copy.rsvpText,
    frameTitle: "Xác nhận tham dự đám cưới Tuấn Vũ và Tuyết Mai",
    fallbackText: "Nếu biểu mẫu không hiển thị hoặc khó thao tác, bạn có thể mở riêng tại đây.",
    openLabel: "Mở form xác nhận",
    newTabLabel: "mở trong tab mới",
    privacyNote: "Phản hồi được gửi qua Google Forms. Gia đình sử dụng thông tin để chuẩn bị đón tiếp khách mời.",
  },
  copy: {
    ...content.copy,
    rsvpText: "",
    rsvpStatus: "Xác nhận trực tuyến chưa mở",
    rsvpNote: "Thiệp hiện chưa tiếp nhận hoặc lưu phản hồi tham dự.",
  },
  families: content.families,
  ceremonies: content.ceremonies,
  dressCode: content.dressCode,
  gifts: giftAccounts.map(account => ({ ...account, qrImage: asset(account.qrImage) })),
  opening: {
    backgroundColor: "#f7f3ed",
    textureOverlay: "rgb(247 243 237 / 88%)",
    buttonColor: "#77764f",
    buttonTextColor: "#fffdf7",
    sealImage: asset("images/opening/seal-10.png"),
    textureImage: asset("images/opening/dark-linen.png"),
  },
  crimson: {
    sections: {
      showGuestbook: false,
      showExtraDetails: false,
      showInvitationTools: false,
    },
    fontStylesheet: asset("crimson/fonts.css"),
    // Thứ tự hiển thị: trái, giữa, phải. Xem PHOTO_GUIDE.md để thay ảnh.
    heroImages: [
      asset("images/anh-cuoi/dau-thiep/ben-trai.webp"),
      asset("images/anh-cuoi/dau-thiep/o-giua.jpg"),
      asset("images/anh-cuoi/dau-thiep/ben-phai.webp"),
    ],
    countdownImage: asset("images/anh-cuoi/dem-nguoc/anh-nen.webp"),
    // Thứ tự: chú rể, cô dâu.
    storyImages: [
      asset("images/anh-cuoi/co-dau-chu-re/web/chu-re.jpg"),
      asset("images/anh-cuoi/co-dau-chu-re/web/co-dau.jpg?v=13594f6389e4"),
    ],
    footerImage: asset("images/anh-cuoi/cuoi-thiep/loi-cam-on.jpg?v=2cf7b9d68fdd"),
    calendarHeart: asset("crimson/heart-calendar.png"),
    copy: content.crimsonCopy,
  },
  // Thêm, bớt hoặc đổi thứ tự tên file dưới đây để cấu hình album.
  galleryImages: [
    "anh_1.jpg",
    "anh_2.jpg",
    "anh_3.jpg",
    "anh_4.jpg",
    "anh_5.jpg",
    "anh_6.jpg",
  ].map((filename, position) => ({
    src: asset(`images/anh-cuoi/album/web/${filename}`),
    previewSrc: asset(`images/anh-cuoi/album/responsive/${filename.replace('.jpg', '-960.jpg')}`),
    previewSrcSet: [960, 1920].map(width => `${asset(`images/anh-cuoi/album/responsive/${filename.replace('.jpg', `-${width}.jpg`)}`)} ${width}w`).join(', '),
    fullSrc: asset(`images/anh-cuoi/album/${filename}`),
    alt: `Ảnh cưới của chúng mình, khoảnh khắc ${position + 1}`,
  })),
  music: asset("audio/background_music.mp3"),
  albumMusic: asset("audio/sugar.mp3"),
  photoViewer: {
    panHint: "Kéo ảnh hoặc dùng phím mũi tên để xem vùng khác",
    zoomIn: "Phóng to ảnh gốc",
    zoomOut: "Thu nhỏ ảnh",
    loadingImage: "Đang tải ảnh…",
    title: "Album ảnh cưới",
    close: "Đóng album",
    previous: "Ảnh trước",
    next: "Ảnh tiếp theo",
    thumbnails: "Chọn ảnh trong album",
    viewImage: "Xem ảnh",
    loadError: "Chưa tải được ảnh. Bạn có thể chọn ảnh khác hoặc mở lại album.",
  },
  // Manual album navigation; transition time is in milliseconds.
  galleryCards: {
    visibleHint: "Chọn ảnh giữa để xem lớn",
    transitionMs: 1100,
    carouselLabel: "Trình chiếu ảnh 3D",
    openImage: "Mở ảnh",
    instructions: "Dùng nút ảnh trước, ảnh tiếp theo hoặc phím mũi tên để chuyển ảnh. Chọn ảnh giữa để xem toàn màn hình.",
  },
  magazine: {
    portraitAnimation: { effect: "fadeInUp" as WeddingAnimation, duration: 1.5, delay: 0.2 },
    coupleImage: asset("images/anh-cuoi/co-dau-chu-re/web/co-dau.jpg?v=13594f6389e4"),
    calendarBackground: asset("images/magazine/calendar-background.png"),
    eventsDivider: asset("images/magazine/events-divider.png"),
    heroImage: asset("images/anh-cuoi/dau-thiep/o-giua-2.jpg?v=d0e1f36751e5"),
    heroSrcSet: [480, 960, 1440, 2700].map(width => `${asset(`images/anh-cuoi/dau-thiep/responsive/hero-${width}.jpg`)} ${width}w`).join(', '),
    copy: {
      eventShortcut: "Thời gian & địa điểm",
      receptionCalendar: "Lưu lịch bữa tiệc",
      ceremonyCalendar: "Lưu lịch buổi lễ",
      eventTimePrefix: "Được tổ chức vào lúc",
      heroEyebrow: "the wedding of",
      heroAlt: "Khoảnh khắc bên nhau của cô dâu và chú rể",
      footerAlt: "Ảnh cưới kết thiệp",
      storyTitle: "Hai Trái Tim, Một Hành Trình",
      coupleLabel: "Cô dâu và chú rể",
      sideLabel: "Chọn bên mời",
      rsvpLabel: "R.S.V.P.",
      reminder: "Đừng quên mình có hẹn nhé!",
    },
  },
  events: content.events satisfies Record<WeddingSide, WeddingEvent>,
  story: content.story,
};
