import type { MetaFunction } from "@remix-run/node";

import { useState } from "react";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Sample Graph Explorer" },
    { name: "description", content: "Sample Graph Explorer" },
  ];
};

export default function Index() {
  const [id, setId] = useState("");
  return (
    <div className="app">
      <div className="form">
        <input
          className="input"
          type="text"
          placeholder="Enter a MusicBrainz Recording ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Link to={`/recording/${id}`} className="button">
          Search
        </Link>
      </div>
    </div>
  );
}
