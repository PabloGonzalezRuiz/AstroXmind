import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getNavigationIndex } from 'virtual:astroxmind/navigation';
import { getNavigationContext } from './lib/navigation/context.mjs';

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const id = route.entry.data.navigation?.id;
  // Generated error pages and unpublished drafts are outside the public tree.
  if (!id) return;
  const index = getNavigationIndex();
  if (!index.nodes[id]) return;
  context.locals.documentNavigation = getNavigationContext(index, id);
  // The home page also participates, even with Starlight's splash template.
  route.hasSidebar = true;
});
