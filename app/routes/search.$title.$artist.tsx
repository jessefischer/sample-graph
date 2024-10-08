import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Link, useLoaderData } from "@remix-run/react";
import { fetchSpotify } from "~/utils/fetchSpotify";
import { fetchMusicBrainzEntityByISRC } from "~/utils/fetchMusicBrainzEntityByISRC";
import { BackgroundStars } from "~/components/BackgroundStars";

export async function loader({ params }: LoaderFunctionArgs) {
  const { title, artist } = params;

  if (!title || !artist) return null;

  try {
    const spotifyData = await fetchSpotify({
      title,
      artist,
    });
    if (spotifyData?.tracks?.items.length > 0) {
      const isrcs = spotifyData.tracks.items.map(
        (item) => item.external_ids?.isrc
      );
      const promises = isrcs.map((isrc) => fetchMusicBrainzEntityByISRC(isrc));
      const data = await Promise.all(promises);

      const filteredData = data.filter(
        (datum) => !datum.data.error
        // datum.recordings &&
        // datum.recordings.find(
        //   (recording) => recording.relations && recording.relations.length > 0
        // )
      );

      return json(filteredData ?? []);
    }
  } catch (error) {
    console.error(error);
    throw new Response("Unexpected Error: " + error, { status: 500 });
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: "Sample Graph Explorer" },
    { name: "description", content: "Sample Graph Explorer" },
  ];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="app">
      <BackgroundStars />
      {data?.map((datum, index) => {
        const firstRecordingWithRelations = datum.data.recordings.find(
          (recording) => recording.relations && recording.relations.length > 0
        );
        if (!firstRecordingWithRelations) return null;
        return (
          <Link key={index} to={`/recording/${firstRecordingWithRelations.id}`}>
            <div className="queryResultRow">
              <div className="title">{firstRecordingWithRelations.title}</div>
              <div className="artist">
                {firstRecordingWithRelations["artist-credit"]?.[0].artist.name}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
