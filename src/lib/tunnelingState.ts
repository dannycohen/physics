export const TUNNEL_ENERGY_STEP_EV = 0.05;

/** Keep the interactive state inside the sub-barrier regime shown by the page. */
export function constrainTunnelingState(
  values: Record<string, number>,
): Record<string, number> {
  const energy = values['energy'];
  const barrier = values['barrier'];
  if (energy === undefined || barrier === undefined || energy < barrier) return values;

  return { ...values, energy: barrier - TUNNEL_ENERGY_STEP_EV };
}
