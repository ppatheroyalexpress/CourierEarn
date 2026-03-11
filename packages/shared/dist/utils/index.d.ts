import { KPIPoints } from "../types";
/**
 * KPI Calculations for CourierEarn
 */
export declare function calculateDailyPoints(deliveries: number, pickupLocations: number, pickupWaybills: number): KPIPoints;
export declare function calculateGrade(totalPoints: number, branch: string): {
    grade: number;
    monthlyTarget: number;
    dailyTarget: number;
};
export declare function applyWarningPenalty(currentGrade: number, warningCount: number): number;
export declare function computePickupKpiFromNotes(notes: string | null): number;
export declare function computeDeliveryKpiFromAmount(amount: number | null | undefined): number;
/**
 * Formatters for CourierEarn
 */
export declare const formatCurrency: (amount: number) => string;
export declare const formatDate: (date: Date) => string;
export declare const greeting: () => "Good morning" | "Good afternoon" | "Good evening";
