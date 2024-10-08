import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

import { RecordingCard } from "~/components/RecordingCard";
import { fetchMusicBrainzEntity } from "~/utils/fetchMusicBrainzEntity";
import { TStar } from "~/types";

export async function loader({ params }: LoaderFunctionArgs) {
  const entityId = params.id;
  if (!entityId) return;
  try {
    const { data } = await fetchMusicBrainzEntity(entityId);
    return json({ data });
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = `${data?.data.title} - ${data?.data["artist-credit"][0].artist.name} | Sample Graph Explorer`;
  return [
    { title },
    {
      property: "og:title",
      content: title,
    },
    {
      name: "description",
      content: "Sample Graph Explorer",
    },
  ];
};

export default function Recording() {
  const { data } = useLoaderData<typeof loader>();
  const soundRef = useRef<Howl | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>();
  const [stars, setStars] = useState<TStar[]>();

  useEffect(
    () =>
      setStars(
        Array(35)
          .fill(null)
          .map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 5,
            a: Math.random(),
          }))
      ),
    []
  );

  useEffect(() => {
    if (data.audioUrl && initialized) {
      soundRef.current = new Howl({
        src: [data.audioUrl],
        preload: true,
        loop: true,
        html5: true,
      });
      soundRef.current.play();
      setPlaying(true);
    }
    return () => {
      setPlaying(false);
      soundRef.current?.stop();
      soundRef.current?.unload();
    };
  }, [data.audioUrl, initialized]);

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

  return (
    <motion.div className="app">
      {windowSize && (
        <svg
          style={{ position: "absolute", top: 0, left: 0 }}
          width={windowSize.width}
          height={windowSize.height}
          viewBox={`0 0 ${windowSize.width} ${windowSize.height}`}
        >
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
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
      )}
      <LayoutGroup>
        <div className="forwardLinks">
          <AnimatePresence>
            {data.forwardLinks?.map((link) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layoutId={link.id}
                layout="position"
                key={link.id}
              >
                <Link to={`/recording/${link.id}`}>
                  <RecordingCard data={link} size="small" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <motion.div layoutId={data.id} key={data.id} layout="position">
          <RecordingCard
            data={data}
            playing={playing}
            setPlaying={(playing) => {
              if (!initialized) {
                setInitialized(true);
              } else {
                if (playing) {
                  soundRef.current?.play();
                  setPlaying(true);
                } else {
                  soundRef.current?.pause();
                  setPlaying(false);
                }
              }
            }}
          />
        </motion.div>
        <div className="backwardLinks">
          <AnimatePresence>
            {data.backwardLinks?.map((link) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layoutId={link.id}
                layout="position"
                key={link.id}
              >
                <Link to={`/recording/${link.id}`}>
                  <RecordingCard data={link} size="small" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </motion.div>
  );
}
