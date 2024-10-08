import { createContext, useContext } from "react";

type TAppContext = {
  playing?: boolean;
  setPlaying?: (playing: boolean) => void;
};

export const AppContext = createContext<TAppContext>({
  playing: false,
  setPlaying: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};
