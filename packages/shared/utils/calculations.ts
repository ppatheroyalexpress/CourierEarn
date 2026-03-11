 // Transaction and Pickup calculation functions for CourierEarn

export interface Transaction {
  cash_collect: number;
  not_cash: number;
  ec: number;
  amount?: number;
}

export interface Pickup {
  houses: number;
  parcels: number;
}

/**
 * Calculate daily commission based on cash, non-cash, and parcels
 */
export function calculateDailyCommission(cash: number, notCash: number, parcels: number): number {
  return cash + notCash + (parcels * 0.1);
}

/**
 * Calculate delivery display string based on cash and non-cash amounts
 */
export function calculateDeliveryDisplay(cash: number, notCash: number): string {
  const total = cash + notCash;
  if (total === 0) return 'MMK 0';
  
  const parts = [];
  if (cash > 0) parts.push(`Cash: ${cash}`);
  if (notCash > 0) parts.push(`Non-Cash: ${notCash}`);
  
  return parts.length > 1 ? `${parts.join(' + ')} = MMK ${total}` : `MMK ${total}`;
}

/**
 * Calculate pickup display string based on houses and parcels
 */
export function calculatePickupDisplay(houses: number, parcels: number): string {
  const parts = [];
  if (houses > 0) parts.push(`${houses} houses`);
  if (parcels > 0) parts.push(`${parcels} parcels`);
  
  return parts.length > 0 ? parts.join(' + ') : 'No pickups';
}

/**
 * Calculate MTD (Month-to-Date) earnings from transactions
 */
export function calculateMTDEarnings(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => {
    return total + (transaction.cash_collect || 0) + (transaction.not_cash || 0);
  }, 0);
}

/**
 * Calculate total EC from transactions
 */
export function calculateTotalEC(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => {
    return total + (transaction.ec || 0);
  }, 0);
}

/**
 * Calculate KPI points including pickup parcels (0.1 point each)
 */
export function calculateKPIPoints(deliveries: number, pickupLocations: number, pickupParcels: number) {
  return {
    delivery: deliveries * 1,
    pickupLocations: pickupLocations * 1,
    pickupParcels: pickupParcels * 0.1,
    total: (deliveries * 1) + (pickupLocations * 1) + (pickupParcels * 0.1)
  };
}
