import { TMusicBrainzEntity } from "./types";

import "./EntityCard.css";

export const EntityCard = ({ data }: { data: TMusicBrainzEntity }) => {
  return (
    <div className="Card">
      <div className="Title">{data.title}</div>
      <div className="Artists">
        {data["artist-credit"].map((credit) => (
          <div key={credit.artist.id}>{credit.artist.name}</div>
        ))}
      </div>
    </div>
  );
};
