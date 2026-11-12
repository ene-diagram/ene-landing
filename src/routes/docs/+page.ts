import { redirect } from "@sveltejs/kit";
import { href } from "#lib/href";
export const load = () => { redirect(308, href("/docs/introduction/")); };
