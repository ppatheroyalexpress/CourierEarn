// Test file for calculation functions
import {
  calculateDailyCommission,
  calculateDeliveryDisplay,
  calculatePickupDisplay,
  calculateMTDEarnings,
  calculateTotalEC,
  calculateKPIPoints
} from './calculations';

// Sample data for testing
const sampleTransactions = [
  { cash_collect: 5000, not_cash: 3000, ec: 2 },
  { cash_collect: 7500, not_cash: 1500, ec: 1 },
  { cash_collect: 2000, not_cash: 0, ec: 3 }
];

const samplePickups = [
  { houses: 5, parcels: 3 },
  { houses: 8, parcels: 2 },
  { houses: 3, parcels: 7 }
];

// Test calculations
console.log('=== Testing Calculation Functions ===\n');

// Test calculateDailyCommission
const commission1 = calculateDailyCommission(5000, 3000, 3);
const commission2 = calculateDailyCommission(7500, 1500, 2);
console.log('Daily Commission Tests:');
console.log(`Cash: 5000, Non-Cash: 3000, Parcels: 3 => ${commission1}`);
console.log(`Cash: 7500, Non-Cash: 1500, Parcels: 2 => ${commission2}`);

// Test calculateDeliveryDisplay
const display1 = calculateDeliveryDisplay(5000, 3000);
const display2 = calculateDeliveryDisplay(7500, 0);
const display3 = calculateDeliveryDisplay(0, 1500);
console.log('\nDelivery Display Tests:');
console.log(`Cash: 5000, Non-Cash: 3000 => "${display1}"`);
console.log(`Cash: 7500, Non-Cash: 0 => "${display2}"`);
console.log(`Cash: 0, Non-Cash: 1500 => "${display3}"`);

// Test calculatePickupDisplay
const pickupDisplay1 = calculatePickupDisplay(5, 3);
const pickupDisplay2 = calculatePickupDisplay(8, 0);
const pickupDisplay3 = calculatePickupDisplay(0, 7);
console.log('\nPickup Display Tests:');
console.log(`Houses: 5, Parcels: 3 => "${pickupDisplay1}"`);
console.log(`Houses: 8, Parcels: 0 => "${pickupDisplay2}"`);
console.log(`Houses: 0, Parcels: 7 => "${pickupDisplay3}"`);

// Test calculateMTDEarnings
const mtdEarnings = calculateMTDEarnings(sampleTransactions);
console.log('\nMTD Earnings Test:');
console.log(`Sample transactions => ${mtdEarnings}`);

// Test calculateTotalEC
const totalEC = calculateTotalEC(sampleTransactions);
console.log('\nTotal EC Test:');
console.log(`Sample transactions => ${totalEC}`);

// Test calculateKPIPoints
const kpiPoints1 = calculateKPIPoints(10, 5, 12);
const kpiPoints2 = calculateKPIPoints(8, 3, 7);
console.log('\nKPI Points Tests:');
console.log(`Deliveries: 10, Pickup Locations: 5, Pickup Parcels: 12 =>`, kpiPoints1);
console.log(`Deliveries: 8, Pickup Locations: 3, Pickup Parcels: 7 =>`, kpiPoints2);

console.log('\n=== All Tests Completed ===');
