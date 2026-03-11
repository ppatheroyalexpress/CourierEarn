/**
 * Shared Type Definitions for CourierEarn
 */
export interface KPIPoints {
    delivery: number;
    pickupLocations: number;
    pickupWaybills: number;
    total: number;
}
export interface UserSummary {
    todayCommission: number;
    todayPickupTotal: number;
    todayDeliveryTotal: number;
    mtdEarnings: number;
    mtdEc: number;
}
