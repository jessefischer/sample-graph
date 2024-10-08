// import { useState } from "react";
import { TEnrichedMusicBrainzEntity } from "../types";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import cx from "classnames";

import styles from "./RecordingCard.module.css";
import { useAppContext } from "~/contexts/AppContext";

interface IRecordingCardProps {
  data: TEnrichedMusicBrainzEntity;
  size?: "large" | "small";
}

export const RecordingCard = ({
  data,
  size = "large",
}: IRecordingCardProps) => {
  const { playing, setPlaying } = useAppContext();

  return (
    <div className={cx(styles.card, { [styles.small]: size === "small" })}>
      {data.imageUrl && (
        <img
          className={styles["cover-art"]}
          src={data.imageUrl}
          alt="Cover art"
        />
      )}
      {data.audioUrl && setPlaying && (
        <div className={styles.controls}>
          <button
            onClick={() => {
              if (playing) {
                setPlaying(false);
              } else {
                setPlaying(true);
              }
            }}
          >
            {playing ? (
              <BsFillPauseFill size={96} />
            ) : (
              <BsFillPlayFill size={96} />
            )}
          </button>
        </div>
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
