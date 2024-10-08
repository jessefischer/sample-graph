import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

import { RecordingCard } from "~/components/RecordingCard";
import { fetchMusicBrainzEntity } from "~/utils/fetchMusicBrainzEntity";
import { TEnrichedMusicBrainzEntity } from "~/types";
import { AppContext } from "~/contexts/AppContext";
import { fetchSpotify } from "~/utils/fetchSpotify";
import { fetchOpenGraph } from "~/utils/fetchOpenGraph";
import { BackgroundStars } from "~/components/BackgroundStars";

export async function loader({ params }: LoaderFunctionArgs) {
  const entityId = params.id;
  if (!entityId) return;
  try {
    const { data } = await fetchMusicBrainzEntity(entityId);

    const fetchSpotifyPromises = async (link: TEnrichedMusicBrainzEntity) => {
      if (!link.imageUrl) {
        const spotifyData = await fetchSpotify({
          title: link.title,
          artist: link["artist-credit"]?.[0].artist.name,
        });
        if (spotifyData?.tracks?.items.length > 0) {
          link.imageUrl = spotifyData.tracks.items[0]?.album?.images?.[0]?.url;
          link.audioUrl = spotifyData.tracks.items[0]?.preview_url;
          if (!link.audioUrl) {
            try {
              const { audioUrl } = await fetchOpenGraph(
                spotifyData.tracks.items[0]?.external_urls?.spotify
              );
              link.audioUrl = audioUrl;
            } catch {
              // TODO: Add fallback
            }
          }
        }
      }
    };

    await Promise.all([
      ...(data.backwardLinks ?? []).map(fetchSpotifyPromises),
      ...(data.forwardLinks ?? []).map(fetchSpotifyPromises),
    ]);
    return json({ data });
  } catch (error) {
    console.error(error);
    throw new Response("Error", { status: 500 });
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = `${data?.data.title} - ${data?.data["artist-credit"]?.[0].artist.name} | Sample Graph Explorer`;
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

  const [cachedImageUrls, setCachedImageUrls] = useState({});

  useEffect(() => {
    if (data.imageUrl) {
      setCachedImageUrls((cachedImageUrls) => ({
        ...cachedImageUrls,
        [data.id]: data.imageUrl,
      }));
    }
  }, [data.imageUrl, data.id]);

  useEffect(() => {
    if (data.audioUrl && playing) {
      soundRef.current?.unload();
      soundRef.current = new Howl({
        src: [data.audioUrl],
        preload: true,
        loop: true,
        html5: true,
      });
      soundRef.current.play();
      setPlaying(true);
    } else if (data.audioUrl && initialized) {
      soundRef.current = new Howl({
        src: [data.audioUrl],
        preload: true,
        loop: true,
        html5: true,
      });
    }
    return () => {
      setPlaying(false);
      soundRef.current?.stop();
      soundRef.current?.unload();
    };
  }, [data.audioUrl, initialized, playing]);

  return (
    <AppContext.Provider
      value={{
        cachedImageUrls,
        playing,
        setPlaying: (playing) => {
          if (!initialized) {
            setInitialized(true);
            soundRef.current?.play();
            setPlaying(true);
          } else {
            if (playing) {
              soundRef.current?.play();
              setPlaying(true);
            } else {
              soundRef.current?.pause();
              setPlaying(false);
            }
          }
        },
      }}
    >
      <motion.div className="app">
        <BackgroundStars />
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
                  <Link to={`/recording/${link.id}`} prefetch="intent">
                    <RecordingCard data={link} size="small" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.div layoutId={data.id} key={data.id} layout="position">
            <RecordingCard data={data} />
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
                  <Link to={`/recording/${link.id}`} prefetch="intent">
                    <RecordingCard data={link} size="small" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </motion.div>
    </AppContext.Provider>
  );
}
