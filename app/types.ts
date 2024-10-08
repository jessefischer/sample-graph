export type TMusicBrainzEntity = {
  id: string;
  title: string;
  "first-release-date": string;
  "artist-credit": {
    artist: {
      id: string;
      name: string;
    };
  }[];
  releases?: {
    id: string;
    country: string;
  }[];
  relations?: (
    | {
        type: "samples material";
        direction: string;
        recording: Omit<TMusicBrainzEntity, "relations">;
      }
    | {
        type: "free streaming";
        url: {
          resource: string;
        };
      }
  )[];
};

export type TEnrichedMusicBrainzEntity = TMusicBrainzEntity & {
  imageUrl?: string;
  audioUrl?: string;
  year?: string;
  backwardLinks?: TEnrichedMusicBrainzEntity[];
  forwardLinks?: TEnrichedMusicBrainzEntity[];
};

export type TStar = {
  x: number;
  y: number;
  r: number;
  a: number;
};

export type TCoords = {
  x: number;
  y: number;
};
