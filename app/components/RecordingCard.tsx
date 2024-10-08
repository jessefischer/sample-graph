import { motion } from "framer-motion";
import { TEnrichedMusicBrainzEntity } from "../types";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import cx from "classnames";

import styles from "./RecordingCard.module.css";
import { useAppContext } from "~/contexts/AppContext";
import { useEffect, useRef, useState } from "react";

interface IRecordingCardProps {
  data: TEnrichedMusicBrainzEntity;
  size?: "large" | "small";
}

export const RecordingCard = ({
  data,
  size = "large",
}: IRecordingCardProps) => {
  const { playing, setPlaying, cachedImageUrls } = useAppContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const cachedImageUrl = cachedImageUrls?.[data.id] ?? data.imageUrl;

  useEffect(() => {
    const imgEl = imgRef.current;
    if (!imgEl || !cachedImageUrl) return;
    imgEl.src = cachedImageUrl;
  }, [cachedImageUrl]);

  return (
    <div className={cx(styles.card, { [styles.small]: size === "small" })}>
      {cachedImageUrl && (
        <motion.img
          ref={imgRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          className={styles["cover-art"]}
          onLoad={() => setImageLoaded(true)}
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
          {data["artist-credit"].map((credit) => credit.artist.name).join(", ")}
        </div>
      </div>
      {data.year && <div className={styles.year}>{data.year}</div>}
    </div>
  );
};
