import { describe, expect, it } from 'vitest';
import { transmission } from '../src/lib/physics/tunneling';
import {
  constrainTunnelingState,
  TUNNEL_ENERGY_STEP_EV,
} from '../src/lib/tunnelingState';
import { getVizStore } from '../src/lib/vizStore';

const defaults = { energy: 1, barrier: 2, width: 0.5 };
let storeId = 0;

function createStore() {
  storeId += 1;
  return getVizStore(`test/tunneling-${storeId}`, defaults, constrainTunnelingState);
}

function transmissionFromVisibleState(values: Record<string, number>) {
  return transmission(values['energy']!, values['barrier']!, values['width']!);
}

describe('tunneling interactive state', () => {
  it('uses a visible energy below V0 without changing it', () => {
    const store = createStore();
    store.set('energy', 1.5);

    expect(store.values.get()).toEqual({ energy: 1.5, barrier: 2, width: 0.5 });
    expect(transmissionFromVisibleState(store.values.get())).toBe(transmission(1.5, 2, 0.5));
  });

  it('moves a visible energy equal to V0 one control step below it', () => {
    const store = createStore();
    store.set('energy', 1.5);
    store.set('barrier', 1.5);

    const values = store.values.get();
    expect(values['energy']).toBe(1.5 - TUNNEL_ENERGY_STEP_EV);
    expect(transmissionFromVisibleState(values)).toBe(
      transmission(values['energy']!, values['barrier']!, values['width']!),
    );
  });

  it('constrains E > V0 before subscribers render and reset restores defaults', () => {
    const store = createStore();
    const observed: Record<string, number>[] = [];
    const unsubscribe = store.values.subscribe((values) => observed.push(values));
    store.set('energy', 1.9);
    // Presets publish through the same set method as sliders.
    store.set('barrier', 1.5);

    expect(store.values.get()).toEqual({ energy: 1.45, barrier: 1.5, width: 0.5 });
    expect(observed.every(({ energy, barrier }) => energy! < barrier!)).toBe(true);
    expect(transmissionFromVisibleState(store.values.get())).toBe(
      transmission(1.45, 1.5, 0.5),
    );

    store.reset();
    expect(store.values.get()).toEqual(defaults);
    unsubscribe();
  });
});
