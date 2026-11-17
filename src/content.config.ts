import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { NAVIGATION_ID_PATTERN, normalizeNavigationDate } from './lib/navigation/index.mjs';

// Astro may parse an unquoted YAML timestamp as Date; the raw-source loader also
// validates its authored format, so precision is never inferred from a file timestamp.
const navigationDate = z.union([z.string(), z.date()])
  .transform(value => value instanceof Date ? value.toISOString() : value)
  .refine(value => {
    try { normalizeNavigationDate(value); return true; } catch { return false; }
  }, 'Fecha ISO con tres cifras de milisegundos y zona horaria requerida.');

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        navigation: z.object({
          id: z.string().regex(NAVIGATION_ID_PATTERN),
          parent: z.string().regex(NAVIGATION_ID_PATTERN).nullable(),
          order: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).optional(),
          created: navigationDate.optional(),
          modified: navigationDate.optional(),
        }).strict(),
      }),
    }),
  }),
};
