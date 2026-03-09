export interface KPIPoints {
  delivery: number;  // 1 point per waybill
  pickupLocations: number; // 1 point per location
  pickupWaybills: number; // 0.1 point per waybill
  total: number;
}

export function calculateDailyPoints(deliveries: number, pickupLocations: number, pickupWaybills: number): KPIPoints {
  return {
    delivery: deliveries * 1,
    pickupLocations: pickupLocations * 1,
    pickupWaybills: pickupWaybills * 0.1,
    total: (deliveries * 1) + (pickupLocations * 1) + (pickupWaybills * 0.1)
  };
}

export function calculateGrade(totalPoints: number, branch: string): { grade: number, monthlyTarget: number, dailyTarget: number } {
  // Get targets from database based on branch
  // This will be called from API route
  // For now, returning placeholder as requested, but we can make it better if we have the data
  return { grade: 3, monthlyTarget: 1500, dailyTarget: 58 };
}

export function applyWarningPenalty(currentGrade: number, warningCount: number): number {
  return Math.max(1, currentGrade - warningCount);
}

// Keep the old ones for compatibility if needed, but the user requested a specific update
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
