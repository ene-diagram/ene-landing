import { error } from "@sveltejs/kit";
import { examples, getExamples } from "#lib/examples";
export const entries = () => examples.map((e) => ({ id: e.slug }));
export const load = ({ params }) => {
  const all = getExamples();
  const i = all.findIndex((e) => e.id === params.id || e.slug === params.id);
  if (i < 0) error(404, "Not found");
  return { ex: all[i], prev: all[i - 1] ?? null, next: all[i + 1] ?? null };
};
