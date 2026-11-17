import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { NAVIGATION_ID_PATTERN } from './lib/navigation/index.mjs';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        navigation: z.object({
          id: z.string().regex(NAVIGATION_ID_PATTERN),
          parent: z.string().regex(NAVIGATION_ID_PATTERN).nullable(),
          order: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
        }).strict(),
      }),
    }),
  }),
};
