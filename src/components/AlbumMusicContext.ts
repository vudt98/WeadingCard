import { createContext } from "react";

export const AlbumMusicContext = createContext<{
  setVisible: (visible: boolean) => void;
  navigate: () => void;
} | null>(null);
