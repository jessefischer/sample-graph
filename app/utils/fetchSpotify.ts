export const fetchSpotify = async ({
  title,
  artist,
}: {
  title: string;
  artist: string;
}) => {
  // Request access token from Spotify
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Response("Failed to fetch access token", { status: 500 });
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  console.log({accessToken});

  // Make an authenticated request to the Spotify API
  const spotifyResponse = await fetch(
    "https://api.spotify.com/v1/search?q=" +
      encodeURIComponent(`track:"${title}" artist:${artist}`) +
      "&type=track&limit=1&market=US",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  if (!spotifyResponse.ok) {
    throw new Response("Failed to fetch data from Spotify", { status: 500 });
  }

  const spotifyData = await spotifyResponse.json();

  return spotifyData;
};
