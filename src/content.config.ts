import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One entry per visualization. Required fields are what the flagship and the
// index consume; the rest are optional-with-defaults until pages 2-3 prove
// their shape (then promote).
const latex = z.string().brand<'LaTeX'>();

const term = z.object({
  symbol: latex,
  // REQUIRED: the spoken name of the symbol (e.g. 'Gamma: Greek lowercase gamma').
  // Renders as the hover tooltip + screen-reader text on the symbol in "Show the
  // math". Required so every equation's symbols are always explained; see AGENTS.md.
  name: z.string(),
  role: z.string(), // plain-language role, not a glossary definition
  effect: z.string(), // direction of effect on the output
  unit: z.string().optional(),
});

const preset = z.object({
  label: z.string(),
  icon: z.string().optional(), // decorative emoji, kept out of the accessible name
  caption: z.string().optional(),
  values: z.record(z.string(), z.number()),
});

const limit = z.object({
  label: z.string(), // e.g. "v → 0"
  icon: z.string().optional(), // decorative emoji, kept out of the accessible name
  collapse: z.string(), // what the equation collapses to, in plain language
  values: z.record(z.string(), z.number()),
});

// A single external reference for the "Historical background" section. Rendered
// by HistoryNote.astro as an external link (rel="noopener noreferrer").
const reference = z.object({
  label: z.string(), // human-readable source name, e.g. 'Wikipedia: Special relativity'
  url: z.string().url(),
});

// Optional per-equation history: who discovered it, when, and why it mattered.
// Rendered uniformly by HistoryNote.astro so references stay consistent and no
// page hand-rolls its own citation markup (AGENTS.md "Don't duplicate").
const history = z
  .object({
    summary: z.array(z.string()).min(1).max(3), // 1-3 short paragraphs
    people: z.array(z.string()).default([]), // discoverer(s) / key figures
    year: z.string(), // string to allow ranges, e.g. '1905' or '1900-1901'
    references: z.array(reference).min(2),
  })
  // Acceptance criterion, enforced at build time: at least one Wikipedia link
  // plus at least one other reputable source.
  .refine((h) => h.references.some((r) => /(\.|\/\/)wikipedia\.org\//.test(r.url)), {
    message: 'history.references must include at least one wikipedia.org link',
    path: ['references'],
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
    history: history.optional(),
  }),
});

export const collections = { viz };
