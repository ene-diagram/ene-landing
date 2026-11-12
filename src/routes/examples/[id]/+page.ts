import { error } from "@sveltejs/kit";
import { examples, byId } from "#lib/examples";
export const entries = () => examples.map((e) => ({ id: e.slug }));
export const load = ({ params }) => {
  const ex = byId(params.id);
  if (!ex) error(404, "Not found");
  const i = examples.indexOf(ex);
  return { ex, prev: examples[i - 1] ?? null, next: examples[i + 1] ?? null };
};
