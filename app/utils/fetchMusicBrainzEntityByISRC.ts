import { USER_AGENT } from "~/constants";
import { TEnrichedMusicBrainzEntity } from "~/types";

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

export const fetchMusicBrainzEntityByISRC = async (isrc: string) => {
  try {
    const response = await fetch(
      `${MB_API_ROOT}${ENTITY_LOOKUP_PATH(
        "isrc"
      )}${isrc}?${additionalParamsString}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
      }
    );
    const data: TEnrichedMusicBrainzEntity = await response.json();

    return { data };
  } catch {
    return null;
  }
};
