import { KPIPoints } from "../types";
import * as Calculations from "./calculations";

/**
 * KPI Calculations for CourierEarn
 */

export function calculateDailyPoints(deliveries: number, pickupLocations: number, pickupWaybills: number): KPIPoints {
    return {
        delivery: deliveries * 1,
        pickupLocations: pickupLocations * 1,
        pickupWaybills: pickupWaybills * 0.1,
        total: (deliveries * 1) + (pickupLocations * 1) + (pickupWaybills * 0.1)
    };
}

export function calculateGrade(totalPoints: number, branch: string): { grade: number, monthlyTarget: number, dailyTarget: number } {
    // Placeholder logic, can be enhanced with branch specific data
    return { grade: 3, monthlyTarget: 1500, dailyTarget: 58 };
}

export function applyWarningPenalty(currentGrade: number, warningCount: number): number {
    return Math.max(1, currentGrade - warningCount);
}

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

/**
 * Formatters for CourierEarn
 */

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MM', { style: 'currency', currency: 'MMK' }).format(amount);
};

export const formatDate = (date: Date) => {
    return date.toLocaleDateString();
};

export const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

// Export all calculation functions
export * from "./calculations";
