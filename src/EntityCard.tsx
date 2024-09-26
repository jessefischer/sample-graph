import { useEffect, useState } from "react";
import { TMusicBrainzEntity } from "./types";

import "./EntityCard.css";

export const EntityCard = ({ data }: { data: TMusicBrainzEntity }) => {
  const [coverArtSrc, setCoverArtSrc] = useState<string | null>(null);

  console.log( 'EntityCard data', data );

  useEffect(() => {
    if (data?.releases?.length > 0) {
      const firstUSRelease = data.releases.find(
        (release) => release.country === "US"
      );
      if (!firstUSRelease) {
        return;
      }
      fetch(`https://coverartarchive.org/release/${firstUSRelease.id}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to fetch cover art");
        })
        .then((data) => {
          console.log( 'coverArtArchive data', data );
          if (data.images.length > 0) {
            setCoverArtSrc(data.images[0].thumbnails.large);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

  return (
    <div className="Card">
      {coverArtSrc && <img className="CoverArt" src={coverArtSrc} alt="Cover art" />}
      <div className="Title">{data.title}</div>
      <div className="Artists">
        {data["artist-credit"].map((credit) => (
          <div key={credit.artist.id}>{credit.artist.name}</div>
        ))}
      </div>
    </div>
  );
};
