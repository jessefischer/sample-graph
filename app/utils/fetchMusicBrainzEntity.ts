import { USER_AGENT } from "~/constants";
import { TEnrichedMusicBrainzEntity } from "~/types";
import { fetchOpenGraph } from "./fetchOpenGraph";
import { fetchCoverArt } from "./fetchCoverArt";

const MB_API_ROOT = "https://musicbrainz.org/ws/2/";
const ENTITY_LOOKUP_PATH = (entity_type: string) => `${entity_type}/`;
const INC_PARAMS = ["url-rels", "recording-rels", "artist-credits", "releases"];
const ADDITIONAL_PARAMS = {
  fmt: "json",
  inc: INC_PARAMS.join("+"),
};

const additionalParamsString = Object.entries(ADDITIONAL_PARAMS)
  .map(([key, value]) => `${key}=${value}`)
  .join("&");

export const fetchMusicBrainzEntity = async (entityId: string) => {
  const response = await fetch(
    `${MB_API_ROOT}${ENTITY_LOOKUP_PATH(
      "recording"
    )}${entityId}?${additionalParamsString}`,
    {
      headers: {
        "User-Agent": USER_AGENT,
      },
    }
  );
  const data: TEnrichedMusicBrainzEntity = await response.json();

  data.year = data["first-release-date"]?.split("-")[0];

  data.backwardLinks = [];
  data.forwardLinks = [];
  if (data.relations) {
    for (let i = 0; i < data.relations.length; i++) {
      const relation = data.relations[i];
      if (relation.type === "free streaming") {
        const { imageUrl, audioUrl } = await fetchOpenGraph(
          relation.url.resource
        );
        data.imageUrl = imageUrl;
        data.audioUrl = audioUrl;
      }
      if (relation.type === "samples material") {
        if (relation.direction === "backward") {
          data.backwardLinks.push(relation.recording);
        } else if (relation.direction === "forward") {
          data.forwardLinks.push(relation.recording);
        }
      }
    }
  }

  if (!data.imageUrl && data.releases && data.releases.length > 0) {
    const firstUSRelease = data.releases.find(
      (release) => release.country === "US"
    );
    const firstRelease = firstUSRelease ?? data.releases[0];
    if (firstRelease) {
      const coverArtResponse = await fetchCoverArt(firstRelease.id);
      if (coverArtResponse) {
        data.imageUrl = coverArtResponse.images?.[0]?.image;
      }
    }
  }

  // TODO: Once we resolve rate-limiting issues, we can fetch cover art for each link
  //
  // const backwardLinksPromises = backwardLinks.map(async (link) => {
  //   const coverArtData = await fetchCoverArt(link.id);
  //   link.coverArtUrl = coverArtData.images?.[0]?.image;
  //   return link;
  // });

  // const forwardLinksPromises = forwardLinks.map(async (link) => {
  //   const coverArtData = await fetchCoverArt(link.id);
  //   link.coverArtUrl = coverArtData.images?.[0]?.image;
  //   return link;
  // });
  // for (let i = 0; i < backwardLinks.length; i++) {
  //   // console.log({link: backwardLinks[i]})
  //   const releaseId = backwardLinks[i].releases?.[0]?.id;
  //   const coverArtData = await fetchCoverArt(releaseId);
  //   console.log({coverArtData})
  //   backwardLinks[i].coverArtUrl = coverArtData.images?.[0]?.image;
  // }
  // for (let i = 0; i < forwardLinks.length; i++) {
  //   const releaseId = forwardLinks[i].releases?.[0]?.id;
  //   const coverArtData = await fetchCoverArt(releaseId);
  //   console.log({coverArtData})
  //   forwardLinks[i].coverArtUrl = coverArtData.images?.[0]?.image;
  // }
  return { data };
};
