import { getCollection, type CollectionEntry } from 'astro:content';

// Shared catalog data for the landing-page variants. The variants differ only in
// layout and framing; they all read the same collection through here so the data
// logic lives in one place.
export type VizEntry = CollectionEntry<'viz'>;

export const categoryLabels: Record<string, string> = {
  foundations: 'Foundations',
  relativity: 'Relativity',
  'classical-mechanics': 'Classical mechanics',
  electromagnetism: 'Electromagnetism',
  quantum: 'Quantum',
  thermodynamics: 'Thermodynamics',
  'waves-optics': 'Waves & optics',
};

// Presentation order of the domains, foundations first.
export const categoryOrder = [
  'foundations',
  'relativity',
  'classical-mechanics',
  'electromagnetism',
  'quantum',
  'thermodynamics',
  'waves-optics',
];

// Each layout archetype has an accent token (defined in tokens.css). Landing
// cards tint themselves by archetype so the catalog reads as a set of families.
export const archetypeAccent: Record<string, string> = {
  'field-space': 'var(--accent-field-space)',
  'time-series': 'var(--accent-time-series)',
  comparison: 'var(--accent-comparison)',
  distribution: 'var(--accent-distribution)',
};

// The registered landing-page styles, in switcher order. Add an entry here when a
// new variant page ships; the LandingSwitcher renders exactly this list, so a
// design only appears in the nav once its page exists.
export interface LandingVariant {
  slug: string; // path under BASE_URL; '' is the original list at '/'
  label: string;
  blurb: string;
}

export const landingVariants: LandingVariant[] = [
  { slug: '', label: 'List', blurb: 'The full catalog, by domain' },
  { slug: 'home/spotlight', label: 'Spotlight', blurb: 'A few curated picks' },
  { slug: 'home/chooser', label: 'Curious?', blurb: 'Pick a plain-language question' },
  { slug: 'home/map', label: 'Map', blurb: 'The whole field at a glance' },
];

export interface Catalog {
  all: VizEntry[];
  live: VizEntry[];
  byCategory: { category: string; label: string; entries: VizEntry[] }[];
}

// Sorted-by-order catalog, plus a live-only view grouped by domain in the
// presentation order above (empty domains dropped).
export async function getCatalog(): Promise<Catalog> {
  const all = (await getCollection('viz')).sort((a, b) => a.data.order - b.data.order);
  const live = all.filter((e) => e.data.status === 'live');
  const byCategory = categoryOrder
    .map((category) => ({
      category,
      label: categoryLabels[category] ?? category,
      entries: all.filter((e) => e.data.category === category),
    }))
    .filter((group) => group.entries.some((e) => e.data.status === 'live'));
  return { all, live, byCategory };
}

export function vizHref(base: string, entry: VizEntry): string {
  return `${base}viz/${entry.id}/`;
}
