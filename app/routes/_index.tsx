import type { MetaFunction } from "@remix-run/node";

import { useState } from "react";
import { Link } from "@remix-run/react";
import { BackgroundStars } from "~/components/BackgroundStars";

export const meta: MetaFunction = () => {
  return [
    { title: "Sample Graph Explorer" },
    { name: "description", content: "Sample Graph Explorer" },
  ];
};

export default function Index() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  return (
    <div className="app">
      <BackgroundStars />
      <div className="form">
        <input
          className="input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <Link to={`/search/${title}/${artist}`} className="button">
          Search
        </Link>
      </div>
    </div>
  );
}
