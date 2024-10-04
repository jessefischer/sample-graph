// import { useState } from "react";
import { TEnrichedMusicBrainzEntity } from "../types";

import cx from "classnames";

import styles from "./RecordingCard.module.css";

interface IRecordingCardProps {
  data: TEnrichedMusicBrainzEntity;
  size?: "large" | "small";
}

export const RecordingCard = ({
  data,
  size = "large",
}: IRecordingCardProps) => {
  // const [coverArtSrc, setCoverArtSrc] = useState<string | null>(null);

  // console.log( 'EntityCard data', data );

  // useEffect(() => {
  //   if (data?.releases?.length > 0) {
  //     const firstUSRelease = data.releases.find(
  //       (release) => release.country === "US"
  //     );
  //     if (!firstUSRelease) {
  //       return;
  //     }
  //     fetch(`https://coverartarchive.org/release/${firstUSRelease.id}`)
  //       .then((response) => {
  //         if (response.ok) {
  //           return response.json();
  //         }
  //         throw new Error("Failed to fetch cover art");
  //       })
  //       .then((data) => {
  //         console.log( 'coverArtArchive data', data );
  //         if (data.images.length > 0) {
  //           setCoverArtSrc(data.images[0].thumbnails.large);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // });

  return (
    <div className={cx(styles.card, { [styles.small]: size === "small" })}>
      {data.imageUrl && (
        <img
          className={styles["cover-art"]}
          src={data.imageUrl}
          alt="Cover art"
        />
      )}
      <div className={styles.mainMetaData}>
        <div className={styles.title}>{data.title}</div>
        <div className={styles.artists}>
          {data["artist-credit"].map((credit) => (
            <span key={credit.artist.id}>{credit.artist.name}</span>
          ))}
        </div>
      </div>
      {data.year && <div className={styles.year}>{data.year}</div>}
    </div>
  );
};
