// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Deployed as a GitHub Pages project site: all URLs live under /physics.
// Test base-path behavior with `astro preview`, not `astro dev`.
export default defineConfig({
  site: 'https://dannycohen.github.io',
  base: '/physics',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { output: 'htmlAndMathml' }]],
  },
});
