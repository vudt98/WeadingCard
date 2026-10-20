export type WeddingSide = "nhatrai" | "nhagai";
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

// All names, dates, venues and stories are illustrative. Replace before sending.
export const wedding = {
  isDemo: true,
  groomName: "Minh Anh",
  brideName: "Khánh Linh",
  monogram: "A & L",
  signature: "Anh & Linh",
  hashtag: "#AnhLinhWedding",
  copy: {
    invitation: "Trân trọng kính mời",
    opening: "Một lời hẹn, một đời bên nhau",
    invitationText:
      "đến chung vui cùng gia đình chúng mình trong ngày nên duyên.",
    heroQuote: "Từ đây, hai tiếng chúng mình\nđã thành một tiếng trăm năm.",
    albumTitle: "Ngày mình có nhau",
    albumSubtitle: "Gói ghém một chút yêu thương",
    albumNote:
      "Ảnh minh họa cho một câu chuyện chờ được viết bằng kỷ niệm của bạn.",
    galleryCaption: "Một chút kỷ niệm, một đời thương",
    eventIntro: "Sự hiện diện của bạn là niềm hạnh phúc của chúng mình.",
    countdown: "Cùng đếm từng khoảnh khắc",
    countdownPassed: "Ngày vui đã đến, cảm ơn bạn vì đã ở đây.",
    rsvpTitle: "Hẹn bạn ngày chung đôi",
    rsvpText:
      "Một cái ôm, một lời chúc, một nụ cười của bạn. Thế là ngày vui của chúng mình đã trọn vẹn.",
    rsvpStatus: "Xác nhận tham dự sẽ sớm mở",
    rsvpNote:
      "Thiệp mẫu chưa nhận hoặc lưu phản hồi. Thông tin liên hệ sẽ được bổ sung khi có thiệp chính thức.",
    guestbookTitle: "Đôi lời thương gửi",
    guestbookText: "Có những lời chúc sẽ theo chúng mình suốt một đời.",
    guestbookStatus: "Sổ lưu bút sẽ sớm mở",
    guestbookNote: "Chúng mình chưa tiếp nhận lời chúc trên bản thiệp mẫu này.",
    giftTitle: "Gửi chút yêu thương",
    giftText: "Bạn đến chung vui đã là món quà quý giá nhất.",
    giftEmpty: "Thông tin quà mừng sẽ được cập nhật trên thiệp chính thức.",
    thankYou: "Cảm ơn vì đã là một phần\ntrong ngày hạnh phúc của chúng mình.",
    demoNote: "Thiệp mẫu · Thông tin & hình ảnh minh họa",
    dressCodeText:
      "Một chút đồng điệu, cho ngày vui thêm trọn vẹn. Bạn có thể chọn trang phục với những sắc màu dưới đây.",
  },
  families: {
    nhatrai: {
      label: "Nhà trai",
      father: "Ông Nguyễn Minh Đức",
      mother: "Bà Trần Ngọc Mai",
      address: "TP. Hồ Chí Minh",
      fullName: "Nguyễn Minh Anh",
      role: "Trưởng nam",
    },
    nhagai: {
      label: "Nhà gái",
      father: "Ông Phạm Quốc Hưng",
      mother: "Bà Lê Thanh Hương",
      address: "TP. Hồ Chí Minh",
      fullName: "Phạm Khánh Linh",
      role: "Trưởng nữ",
    },
  },
  ceremonies: {
    nhatrai: {
      title: "Lễ thành hôn",
      dateTimeISO: "2027-01-10T09:00:00+07:00",
      venue: "Tư gia nhà trai",
      lunarDate: "",
    },
    nhagai: {
      title: "Lễ vu quy",
      dateTimeISO: "2027-01-09T09:00:00+07:00",
      venue: "Tư gia nhà gái",
      lunarDate: "",
    },
  },
  dressCode: [
    { name: "Đỏ rượu", color: "#741b27" },
    { name: "Kem ngà", color: "#fff2d5" },
    { name: "Vàng champagne", color: "#c9a45c" },
  ],
  gifts: [] as WeddingGiftAccount[],
  heroImage: asset("images/hero.webp"),
  detailImage: asset("images/details.webp"),
  galleryImages: [
    {
      src: asset("images/couple.webp"),
      alt: "Ảnh minh họa cặp đôi trong ngày cưới",
    },
    {
      src: asset("images/hero.webp"),
      alt: "Ảnh minh họa cặp đôi cầm hoa cưới trong ánh nắng",
    },
    {
      src: asset("images/details.webp"),
      alt: "Ảnh minh họa những chi tiết hoa trong lễ cưới",
    },
    {
      src: asset("images/celebration.webp"),
      alt: "Ảnh minh họa khoảnh khắc trong ngày chung đôi",
    },
  ],
  music: asset("audio/a-little-forever.wav"),
  events: {
    nhatrai: {
      title: "Tiệc cưới nhà trai",
      dateTimeISO: "2027-01-10T17:00:00+07:00",
      welcomeTime: "16:30",
      schedule: [
        {
          time: "16:30",
          title: "Đón khách",
          description: "Gặp gỡ, chụp hình & lưu giữ kỷ niệm",
        },
        {
          time: "17:00",
          title: "Khai tiệc",
          description: "Chào đón cô dâu và chú rể",
        },
        {
          time: "17:15",
          title: "Khoảnh khắc nên duyên",
          description: "Trao nhẫn, rót rượu & cắt bánh",
        },
        {
          time: "17:30",
          title: "Chung vui",
          description: "Dùng tiệc và nâng ly chúc mừng",
        },
        {
          time: "20:00",
          title: "Lời cảm ơn",
          description: "Hẹn gặp lại trong những ngày vui",
        },
      ],
      venueName: "The Reverie Saigon",
      address: "22–36 Nguyễn Huệ, phường Sài Gòn, TP. Hồ Chí Minh",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=The+Reverie+Saigon+22+36+Nguyen+Hue",
    },
    nhagai: {
      title: "Tiệc cưới nhà gái",
      dateTimeISO: "2027-01-09T11:00:00+07:00",
      welcomeTime: "10:30",
      schedule: [
        {
          time: "10:30",
          title: "Đón khách",
          description: "Gặp gỡ, chụp hình & lưu giữ kỷ niệm",
        },
        {
          time: "11:00",
          title: "Khai tiệc",
          description: "Chào đón cô dâu và chú rể",
        },
        {
          time: "11:15",
          title: "Khoảnh khắc nên duyên",
          description: "Trao nhẫn, rót rượu & cắt bánh",
        },
        {
          time: "11:30",
          title: "Chung vui",
          description: "Dùng tiệc và nâng ly chúc mừng",
        },
        {
          time: "14:00",
          title: "Lời cảm ơn",
          description: "Hẹn gặp lại trong những ngày vui",
        },
      ],
      venueName: "Park Hyatt Saigon",
      address: "2 Công trường Lam Sơn, phường Sài Gòn, TP. Hồ Chí Minh",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Park+Hyatt+Saigon+2+Lam+Son+Square",
    },
  } satisfies Record<WeddingSide, WeddingEvent>,
  story: [
    {
      year: "2021",
      title: "Một lần gặp, một đời nhớ",
      text: "Một buổi chiều bình thường, một cuộc gặp thật tình cờ. Chúng mình không biết rằng, từ hôm ấy, những điều bình thường đã trở nên đặc biệt.",
    },
    {
      year: "2024",
      title: "Cùng nhau qua những mùa",
      text: "Từ những cuộc hẹn nhỏ đến những chuyến đi xa, điều đẹp nhất vẫn là có một người để cùng chia sẻ mọi khoảnh khắc.",
    },
    {
      year: "2027",
      title: "Và rồi, mình có nhau",
      text: "Sau tất cả, chúng mình chọn nắm tay nhau. Bắt đầu một chương mới, ở nơi có hai người và một mái nhà.",
    },
  ],
};
