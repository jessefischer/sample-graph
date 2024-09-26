export type TMusicBrainzEntity = {
    id: string;
    title: string;
    "artist-credit": {
      artist: {
        id: string;
        name: string;
      };
    }[];
    relations: {
      type: string;
      direction: string;
      recording: Omit<TMusicBrainzEntity, "relations">;
    }[];
  };
  