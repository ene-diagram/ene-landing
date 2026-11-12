import type { Handle } from "@sveltejs/kit/hooks";
import { getTextDirection } from "#lib/paraglide/runtime";
import { paraglideMiddleware } from "#lib/paraglide/server";

export const handle: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) =>
    resolve({ ...event, request }, {
      transformPageChunk: ({ html }) => html.replaceAll("%lang%", locale).replaceAll("%dir%", getTextDirection(locale))
    })
  );
