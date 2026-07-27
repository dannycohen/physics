import type { VizEntry } from '../catalog';

export interface Poster {
  /** Raw SVG child markup, injected inside the <svg> wrapper by VizPoster.astro. */
  body: string;
  /** One-line shape description for the <desc>, composed from the entry's claim. */
  desc: string;
}

export type PosterBuilder = (entry: VizEntry) => Poster;
