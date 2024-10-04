import { USER_AGENT } from "~/constants";

export const COVER_ART_ARCHIVE_API_ROOT =
  "https://coverartarchive.org/release/";

export const fetchCoverArt = async (mbid: string) => {
  try {
    const response = await fetch(`${COVER_ART_ARCHIVE_API_ROOT}${mbid}`, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
