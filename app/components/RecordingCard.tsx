// import { useState } from "react";
import { TEnrichedMusicBrainzEntity } from "../types";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import cx from "classnames";

import styles from "./RecordingCard.module.css";
import { useEffect, useRef } from "react";

interface IRecordingCardProps {
  data: TEnrichedMusicBrainzEntity;
  size?: "large" | "small";
  playing?: boolean;
  setPlaying?: (playing: boolean) => void;
  registerCardRect?: (rect: DOMRect) => void;
}

export const RecordingCard = ({
  data,
  size = "large",
  playing,
  setPlaying,
  registerCardRect,
}: IRecordingCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (svgRef.current) {
        const svg = svgRef.current;
        const svgNS = svg.namespaceURI;
        const line = document.createElementNS(svgNS, "line");

        const rectCenterX = rect.left + rect.width / 2;
        const rectCenterY = rect.top + rect.height / 2;

        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;

        line.setAttribute("x1", rectCenterX.toString());
        line.setAttribute("y1", rectCenterY.toString());
        line.setAttribute("x2", viewportCenterX.toString());
        line.setAttribute("y2", viewportCenterY.toString());
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");

        svg.appendChild(line);
      }
    }
  }, []);

  // useEffect(() => {
  //   if (ref.current && registerCardRect) {
  //     const rect = ref.current.getBoundingClientRect();
  //     registerCardRect(rect);
  //   }
  // }, []);
  
  return (
    <div ref={ref} className={cx(styles.card, { [styles.small]: size === "small" })}>
      {/* <svg ref={svgRef} className={styles.svg} viewBox="0 0 1000 1000" /> */}
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
            {playing ? <BsFillPauseFill size={96}/> : <BsFillPlayFill size={96}/>}
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
