import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One entry per visualization. Required fields are what the flagship and the
// index consume; the rest are optional-with-defaults until pages 2-3 prove
// their shape (then promote).
const latex = z.string().brand<'LaTeX'>();

const term = z.object({
  symbol: latex,
  role: z.string(), // plain-language role, not a glossary definition
  effect: z.string(), // direction of effect on the output
  unit: z.string().optional(),
});

const preset = z.object({
  label: z.string(),
  caption: z.string().optional(),
  values: z.record(z.string(), z.number()),
});

const limit = z.object({
  label: z.string(), // e.g. "v → 0"
  collapse: z.string(), // what the equation collapses to, in plain language
  values: z.record(z.string(), z.number()),
});

const viz = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/viz' }),
  schema: z.object({
    title: z.string(),
    category: z.enum([
      'relativity',
      'classical-mechanics',
      'electromagnetism',
      'quantum',
      'thermodynamics',
      'waves-optics',
      'foundations',
    ]),
    equationLatex: latex,
    equationPlain: z.string(), // Unicode rendering for OG/social cards
    claim: z.string(), // one-sentence plain-language claim
    layoutArchetype: z.enum(['field-space', 'time-series', 'comparison', 'distribution']),
    status: z.enum(['live', 'coming-soon']).default('coming-soon'),
    order: z.number(),
    defaults: z.record(z.string(), z.number()),
    terms: z.array(term).default([]),
    presets: z.array(preset).default([]),
    limits: z.array(limit).default([]),
    prerequisites: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { viz };
