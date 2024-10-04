import ogs  from 'open-graph-scraper';

export const fetchOpenGraph = async (url: string) => {
  const options = { url };
  const data = await ogs(options);
  const { result } = data;

  const imageUrl = result?.ogImage?.[0]?.url;
  const audioUrl = result.ogAudio;

  return { imageUrl, audioUrl };
};