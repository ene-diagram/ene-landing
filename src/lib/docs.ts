import { getLocale } from "#lib/paraglide/runtime";
import { docs as en, groups as enGroups } from "#lib/docs/en";
import { docs as ko, groups as koGroups } from "#lib/docs/ko";

export type { Block, Doc, Section } from "#lib/docs/shared";

const content = { en: { docs: en, groups: enGroups }, ko: { docs: ko, groups: koGroups } };

/** Page slugs, identical in every locale. */
export const docSlugs = en.map((d) => d.slug);
/** Docs pages in the current locale. Call per request or render, never at module load. */
export const getDocs = () => content[getLocale()].docs;
/** Sidebar group names in the current locale, in order. */
export const getGroups = () => content[getLocale()].groups;
