export function computePickupKpiFromNotes(notes: string | null): number {
  const txt = String(notes || "");
  const houses = Number(txt.match(/houses=(\d+)/)?.[1] ?? 0);
  const parcels = Number(txt.match(/parcels=(\d+)/)?.[1] ?? 0);
  return houses + parcels * 0.1;
}

export function computeDeliveryKpiFromAmount(amount: number | null | undefined): number {
  const v = Number(amount || 0);
  return isNaN(v) ? 0 : v;
}
