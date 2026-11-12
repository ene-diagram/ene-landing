import { error } from "@sveltejs/kit";
import { docs } from "#lib/docs";
export const entries = () => docs.map((d) => ({ slug: d.slug }));
export const load = ({ params }) => {
  const i = docs.findIndex((d) => d.slug === params.slug);
  if (i < 0) error(404, "Not found");
  return { doc: docs[i], prev: docs[i - 1] ?? null, next: docs[i + 1] ?? null };
};
