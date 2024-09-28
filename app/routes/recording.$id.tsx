import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import { RecordingCard } from "~/components/RecordingCard";
import { fetchMusicBrainzEntity } from "~/utils/fetchMusicBrainzEntity";

export async function loader({ params }: LoaderFunctionArgs) {
  const entityId = params.id;
  if (!entityId) return;
  try {
    const { data } = await fetchMusicBrainzEntity(entityId);
    return json({ data });
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
}

export default function Recording() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <motion.div className="app">
      <LayoutGroup>
        <div className="forwardLinks">
          <AnimatePresence>
            {data.forwardLinks?.map((link) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layoutId={link.id}
                layout="position"
                key={link.id}
              >
                <Link to={`/recording/${link.id}`}>
                  <RecordingCard data={link} size="small" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <motion.div layoutId={data.id} key={data.id} layout="position">
          <RecordingCard data={data} />
        </motion.div>
        <div className="backwardLinks">
          <AnimatePresence>
            {data.backwardLinks?.map((link) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layoutId={link.id}
                layout="position"
                key={link.id}
              >
                <Link to={`/recording/${link.id}`}>
                  <RecordingCard data={link} size="small" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </motion.div>
  );
}
