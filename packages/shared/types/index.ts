/**
 * Shared Type Definitions for CourierEarn
 */

export interface KPIPoints {
  delivery: number;  // 1 point per waybill
  pickupLocations: number; // 1 point per location
  pickupWaybills: number; // 0.1 point per waybill
  total: number;
}

export interface UserSummary {
  todayCommission: number;
  todayPickupTotal: number;
  todayDeliveryTotal: number;
  mtdEarnings: number;
  mtdEc: number;
}
