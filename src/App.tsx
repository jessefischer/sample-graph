import { useState } from "react";

import { EntityCard } from "./EntityCard";
import { TMusicBrainzEntity } from "./types";
import { ADDITIONAL_PARAMS, MB_API_ROOT, ENTITY_LOOKUP_PATH } from "./constants";

import "./App.css";

type TAppState = "idle" | "loading" | "success" | "error";

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

  console.log({ data });

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
                key={link.id}
                onClick={() => {
                  setEntityId(link.id);
                  fetchEntity(link.id);
                }}
              >
                <EntityCard data={link} />
              </button>
            ))}
          </div>

          <EntityCard data={data} />
          <div className="BackwardLinks">
            {backwardLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setEntityId(link.id);
                  fetchEntity(link.id);
                }}
              >
                <EntityCard data={link} />
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
