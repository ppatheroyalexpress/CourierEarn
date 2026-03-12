"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.greeting = exports.formatDate = exports.formatCurrency = void 0;
exports.calculateDailyPoints = calculateDailyPoints;
exports.calculateGrade = calculateGrade;
exports.applyWarningPenalty = applyWarningPenalty;
exports.computePickupKpiFromNotes = computePickupKpiFromNotes;
exports.computeDeliveryKpiFromAmount = computeDeliveryKpiFromAmount;
/**
 * KPI Calculations for CourierEarn
 */
function calculateDailyPoints(deliveries, pickupLocations, pickupWaybills) {
    return {
        delivery: deliveries * 1,
        pickupLocations: pickupLocations * 1,
        pickupWaybills: pickupWaybills * 0.1,
        total: (deliveries * 1) + (pickupLocations * 1) + (pickupWaybills * 0.1)
    };
}
function calculateGrade(totalPoints, branch) {
    // Placeholder logic, can be enhanced with branch specific data
    return { grade: 3, monthlyTarget: 1500, dailyTarget: 58 };
}
function applyWarningPenalty(currentGrade, warningCount) {
    return Math.max(1, currentGrade - warningCount);
}
function computePickupKpiFromNotes(notes) {
    var _a, _b, _c, _d;
    const txt = String(notes || "");
    const houses = Number((_b = (_a = txt.match(/houses=(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0);
    const parcels = Number((_d = (_c = txt.match(/parcels=(\d+)/)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 0);
    return houses + parcels * 0.1;
}
function computeDeliveryKpiFromAmount(amount) {
    const v = Number(amount || 0);
    return isNaN(v) ? 0 : v;
}
/**
 * Formatters for CourierEarn
 */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MM', { style: 'currency', currency: 'MMK' }).format(amount);
};
exports.formatCurrency = formatCurrency;
const formatDate = (date) => {
    return date.toLocaleDateString();
};
exports.formatDate = formatDate;
const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12)
        return "Good morning";
    if (hour < 18)
        return "Good afternoon";
    return "Good evening";
};
exports.greeting = greeting;
// Export all calculation functions
__exportStar(require("./calculations"), exports);
