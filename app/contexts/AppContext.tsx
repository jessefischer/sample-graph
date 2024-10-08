import { createContext, useContext } from "react";

type TAppContext = {
  playing?: boolean;
  setPlaying?: (playing: boolean) => void;
  cachedImageUrls?: Record<string, string>;
};

export const AppContext = createContext<TAppContext>({
  playing: false,
  setPlaying: () => {},
  cachedImageUrls: {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};
