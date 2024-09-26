import { useState } from "react";

import "./App.css";

const MB_API_ROOT = "https://musicbrainz.org/ws/2/";
const ENTITY_LOOKUP_PATH = (entity_type: string) => `${entity_type}/`;
const ADDITIONAL_PARAMS = {
  fmt: "json",
  inc: "url-rels+recording-rels+artist-credits",
};

type TAppState = "idle" | "loading" | "success" | "error";

type TMusicBrainzEntity = {
  id: string;
  title: string;
  "artist-credit": {
    artist: {
      id: string;
      name: string;
    };
  }[];
  relations: {
    type: string;
    direction: string;
    recording: Omit<TMusicBrainzEntity, "relations">;
  }[];
};

const additionalParamsString = Object.entries(ADDITIONAL_PARAMS)
  .map(([key, value]) => `${key}=${value}`)
  .join("&");

function App() {
  const [state, setState] = useState<TAppState>("idle");
  const [entityId, setEntityId] = useState("");
  const [data, setData] = useState<TMusicBrainzEntity>();
  const [error, setError] = useState<unknown>(null);
  const [backwardLinks, setBackwardLinks] = useState<TMusicBrainzEntity[]>([]);
  const [forwardLinks, setForwardLinks] = useState<TMusicBrainzEntity[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e?.preventDefault();
    setState("loading");
    fetchEntity(entityId);
  };

  console.log({data})

  const fetchEntity = async (entityId: string) => {
    try {
      const response = await fetch(
        `${MB_API_ROOT}${ENTITY_LOOKUP_PATH(
          "recording"
        )}${entityId}?${additionalParamsString}`
      );
      const data = await response.json();
      setData(data);
      setState("success");
      const backwardLinks = [];
      const forwardLinks = [];
      for (let i = 0; i < data.relations.length; i++) {
        if (data.relations[i].type === "samples material") {
          if (data.relations[i].direction === "backward") {
            backwardLinks.push(data.relations[i].recording);
          } else if (data.relations[i].direction === "forward") {
            forwardLinks.push(data.relations[i].recording);
          }
        }
      }
      setBackwardLinks(backwardLinks);
      setForwardLinks(forwardLinks);
    } catch (error) {
      setError(error);
      setState("error");
    }
  };

  return (
    <div className="App">
      {state === "idle" && (
        <form className="Form">
          <input
            type="text"
            placeholder="Enter a MusicBrainz Recording ID"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
          />
          <input type="submit" value="Submit" onClick={handleSubmit} />
        </form>
      )}
      {state === "success" && !!data && (
        <>
          <div className="ForwardLinks">
            {forwardLinks.map((link) => (
              <button
                onClick={() => {
                  setEntityId(link.id);
                  fetchEntity(link.id);
                }}
              >
                <div className="Card Link" key={link.id}>
                  <div className="Title">{link.title}</div>
                  <div className="Artists">
                    {link["artist-credit"].map((credit) => (
                      <div key={credit.artist.id}>{credit.artist.name}</div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="Card">
            <div className="Title">{data.title}</div>
            <div className="Artists">
              {data["artist-credit"].map((artist) => (
                <div key={artist.artist.id}>{artist.artist.name}</div>
              ))}
            </div>
          </div>
          <div className="BackwardLinks">
            {backwardLinks.map((link) => (
              <button
                onClick={() => {
                  setEntityId(link.id);
                  fetchEntity(link.id);
                }}
              >
                <div className="Card Link" key={link.id}>
                  <div className="Title">{link.title}</div>
                  <div className="Artists">
                    {link["artist-credit"].map((credit) => (
                      <div key={credit.artist.id}>{credit.artist.name}</div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
      {state === "error" && (
        <div className="Error">{JSON.stringify(error)}</div>
      )}
    </div>
  );
}

export default App;
