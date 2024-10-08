import { useState, useEffect } from "react";
import { STAR_COUNT, STAR_MAX_RADIUS, STAR_BLUR_RADIUS } from "~/constants";
import { TStar } from "~/types";

export const BackgroundStars = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>();
  const [stars, setStars] = useState<TStar[]>();

  useEffect(
    () =>
      setStars(
        Array(STAR_COUNT)
          .fill(null)
          .map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * STAR_MAX_RADIUS,
            a: Math.random(),
          }))
      ),
    []
  );

  useEffect(() => {
    const updateWindowSize = () =>
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  return windowSize ? (
    <svg
      className="fullWidthSvg"
      width={windowSize.width}
      height={windowSize.height}
      viewBox={`0 0 ${windowSize.width} ${windowSize.height}`}
    >
      <filter id="blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation={STAR_BLUR_RADIUS} />
      </filter>
      {stars?.map((star, i) => (
        <circle
          key={i}
          fill={`rgb(255,255,255,${star.a}`}
          cx={star.x}
          cy={star.y}
          r={star.r}
          filter="url(#blur)"
        />
      ))}
    </svg>
  ) : null;
};
