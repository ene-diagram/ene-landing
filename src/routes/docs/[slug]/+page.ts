import { error } from "@sveltejs/kit";
import { docSlugs, getDocs } from "#lib/docs";
export const entries = () => docSlugs.map((slug) => ({ slug }));
export const load = ({ params }) => {
  const docs = getDocs();
  const i = docs.findIndex((d) => d.slug === params.slug);
  if (i < 0) error(404, "Not found");
  return { doc: docs[i], prev: docs[i - 1] ?? null, next: docs[i + 1] ?? null };
};
