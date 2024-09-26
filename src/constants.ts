export const MB_API_ROOT = "https://musicbrainz.org/ws/2/";
export const ENTITY_LOOKUP_PATH = (entity_type: string) => `${entity_type}/`;
export const ADDITIONAL_PARAMS = {
  fmt: "json",
  inc: "url-rels+recording-rels+artist-credits",
};