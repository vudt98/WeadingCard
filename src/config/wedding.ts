export type WeddingSide = "nhatrai" | "nhagai";
export interface WeddingEvent {
  title: string;
  dateTimeISO: string;
  venueName: string;
  address: string;
  mapsUrl: string;
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
      venueName: "The Reverie Saigon",
      address: "22–36 Nguyễn Huệ, phường Sài Gòn, TP. Hồ Chí Minh",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=The+Reverie+Saigon+22+36+Nguyen+Hue",
    },
    nhagai: {
      title: "Tiệc cưới nhà gái",
      dateTimeISO: "2027-01-09T11:00:00+07:00",
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
