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
 * Calculate daily commission based on Royal Express rates:
 * Cash × 200 + Not Cash × 100 + Pickup Parcels × 50
 */
export function calculateDailyCommission(cash: number, notCash: number, parcels: number): number {
  return (cash * 200) + (notCash * 100) + (parcels * 50);
}

/**
 * Calculate delivery display string in "Cash (Not Cash)" format
 */
export function calculateDeliveryDisplay(cash: number, notCash: number): string {
  return `${cash} (${notCash})`;
}

/**
 * Calculate pickup display string in "Houses (Parcels)" format
 */
export function calculatePickupDisplay(houses: number, parcels: number): string {
  return `${houses} (${parcels})`;
}

/**
 * Calculate MTD (Month-to-Date) earnings from daily commissions
 */
export function calculateMTDEarnings(transactions: Transaction[], pickups: Pickup[] = []): number {
  // Group by date and calculate daily commission for each day
  const dailyData = new Map<string, { cash: number; notCash: number; parcels: number }>();
  
  // Process transactions
  transactions.forEach(transaction => {
    const date = new Date(transaction.amount ? transaction.amount as any : new Date()).toISOString().slice(0, 10);
    const current = dailyData.get(date) || { cash: 0, notCash: 0, parcels: 0 };
    current.cash += transaction.cash_collect || 0;
    current.notCash += transaction.not_cash || 0;
    dailyData.set(date, current);
  });
  
  // Process pickups (add parcels to daily data)
  pickups.forEach(pickup => {
    const date = new Date(pickup.houses ? pickup.houses as any : new Date()).toISOString().slice(0, 10);
    const current = dailyData.get(date) || { cash: 0, notCash: 0, parcels: 0 };
    current.parcels += pickup.parcels || 0;
    dailyData.set(date, current);
  });
  
  // Calculate commission for each day and sum
  let total = 0;
  dailyData.forEach(({ cash, notCash, parcels }) => {
    total += calculateDailyCommission(cash, notCash, parcels);
  });
  
  return total;
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

export interface KPITarget {
  grade: string;
  delivery: number;
  pickup: number;
  ec: number;
  total: number;
}

export interface KPIScore {
  userId: string;
  month: string;
  delivery: number;
  pickup: number;
  ec: number;
  total: number;
  percentage: number;
  grade: number;
  warnings: number;
}

/**
 * Get KPI targets by branch grade
 */
export function getKPITargets(branchGrade: 'A' | 'B' | 'C'): KPITarget[] {
  const targets = {
    A: [
      { grade: '5', delivery: 121, pickup: 81, ec: 58, total: 46 },
      { grade: '4', delivery: 107, pickup: 73, ec: 46, total: 38 },
      { grade: '3', delivery: 93, pickup: 65, ec: 34, total: 30 },
      { grade: '2', delivery: 79, pickup: 57, ec: 22, total: 22 },
      { grade: '1', delivery: 65, pickup: 49, ec: 10, total: 14 }
    ],
    B: [
      { grade: '5', delivery: 107, pickup: 73, ec: 46, total: 38 },
      { grade: '4', delivery: 93, pickup: 65, ec: 34, total: 30 },
      { grade: '3', delivery: 79, pickup: 57, ec: 22, total: 22 },
      { grade: '2', delivery: 65, pickup: 49, ec: 10, total: 14 },
      { grade: '1', delivery: 51, pickup: 41, ec: 0, total: 6 }
    ],
    C: [
      { grade: '5', delivery: 93, pickup: 65, ec: 34, total: 30 },
      { grade: '4', delivery: 79, pickup: 57, ec: 22, total: 22 },
      { grade: '3', delivery: 65, pickup: 49, ec: 10, total: 14 },
      { grade: '2', delivery: 51, pickup: 41, ec: 0, total: 6 },
      { grade: '1', delivery: 37, pickup: 33, ec: 0, total: 0 }
    ]
  };
  
  return targets[branchGrade].map((target, index) => ({
    ...target,
    grade: (5 - index).toString()
  }));
}

/**
 * Calculate KPI grade and percentage based on achieved vs targets
 */
export function calculateKPIGrade(
  achieved: { delivery: number; pickup: number; ec: number; total: number },
  targets: KPITarget[],
  warnings: number = 0
): KPIScore {
  // Calculate percentage for each grade level
  let grade = 5;
  let percentage = 0;
  
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const deliveryPct = Math.min((achieved.delivery / target.delivery) * 100, 100);
    const pickupPct = Math.min((achieved.pickup / target.pickup) * 100, 100);
    const ecPct = Math.min((achieved.ec / target.ec) * 100, 100);
    const totalPct = Math.min((achieved.total / target.total) * 100, 100);
    
    const avgPercentage = (deliveryPct + pickupPct + ecPct + totalPct) / 4;
    
    if (avgPercentage >= 100) {
      grade = 5 - i;
      percentage = avgPercentage;
      break;
    } else if (i === targets.length - 1) {
      // If even the lowest grade isn't achieved
      percentage = avgPercentage;
      grade = 1;
    }
  }
  
  // Apply warning penalties (each warning reduces grade by 1, min grade 1)
  const finalGrade = Math.max(1, grade - warnings);
  
  return {
    userId: '',
    month: '',
    delivery: achieved.delivery,
    pickup: achieved.pickup,
    ec: achieved.ec,
    total: achieved.total,
    percentage,
    grade: finalGrade,
    warnings
  };
}

/**
 * Format MMK currency display
 */
export function formatMMK(amount: number): string {
  return `MMK ${amount.toLocaleString()}`;
}
