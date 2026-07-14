import { map, type MapStore } from 'nanostores';

export interface VizStore {
  values: MapStore<Record<string, number>>;
  set(key: string, value: number): void;
  reset(): void;
  onSettled(cb: (values: Record<string, number>) => void, delayMs?: number): () => void;
}

interface SettledListener {
  cb: (values: Record<string, number>) => void;
  delayMs: number;
  timer: ReturnType<typeof setTimeout> | undefined;
}

// Module-level registry so every island on a page shares one store per slug.
const registry = new Map<string, VizStore>();

export function getVizStore(slug: string, defaults?: Record<string, number>): VizStore {
  const existing = registry.get(slug);
  if (existing) return existing;

  const initial: Record<string, number> = { ...(defaults ?? {}) };
  const values = map<Record<string, number>>({ ...initial });
  const listeners = new Set<SettledListener>();

  const store: VizStore = {
    values,
    set(key, value) {
      values.setKey(key, value);
      for (const l of listeners) {
        if (l.timer !== undefined) clearTimeout(l.timer);
        l.timer = setTimeout(() => {
          l.timer = undefined;
          l.cb(values.get());
        }, l.delayMs);
      }
    },
    reset() {
      values.set({ ...initial });
    },
    onSettled(cb, delayMs = 350) {
      const listener: SettledListener = { cb, delayMs, timer: undefined };
      listeners.add(listener);
      return () => {
        if (listener.timer !== undefined) clearTimeout(listener.timer);
        listeners.delete(listener);
      };
    },
  };

  registry.set(slug, store);
  return store;
}
