import { computePickupKpiFromNotes, computeDeliveryKpiFromAmount } from "./kpi.ts";

let fails = 0;
function expectEqual(name: string, a: any, b: any) {
  if (a !== b) {
    console.error(`[FAIL] ${name}: expected ${b}, got ${a}`);
    fails++;
  } else {
    console.log(`[PASS] ${name}`);
  }
}

try {
  expectEqual("pickup houses only", computePickupKpiFromNotes("houses=3;parcels=0"), 3);
  expectEqual("pickup parcels only", computePickupKpiFromNotes("houses=0;parcels=10"), 1);
  expectEqual("pickup mixed", computePickupKpiFromNotes("houses=2;parcels=10"), 3);
  expectEqual("pickup missing notes", computePickupKpiFromNotes(null), 0);
  expectEqual("delivery amount numbers", computeDeliveryKpiFromAmount(5), 5);
  expectEqual("delivery amount zero", computeDeliveryKpiFromAmount(0), 0);
  expectEqual("delivery amount null", computeDeliveryKpiFromAmount(null), 0);
  console.log("KPI tests completed");
} catch (e) {
  console.error("Unexpected error during KPI tests", e);
  fails++;
}
if (fails > 0) {
  process.exit(1);
}
