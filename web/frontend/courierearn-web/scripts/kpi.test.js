function computePickupKpiFromNotes(notes) {
  const txt = String(notes || "");
  const houses = Number((txt.match(/houses=(\d+)/) || [])[1] || 0);
  const parcels = Number((txt.match(/parcels=(\d+)/) || [])[1] || 0);
  return houses + parcels * 0.1;
}
function computeDeliveryKpiFromAmount(amount) {
  const v = Number(amount || 0);
  return isNaN(v) ? 0 : v;
}
let fails = 0;
function expectEqual(name, a, b) {
  if (a !== b) {
    console.error(`[FAIL] ${name}: expected ${b}, got ${a}`);
    fails++;
  } else {
    console.log(`[PASS] ${name}`);
  }
}
expectEqual("pickup houses only", computePickupKpiFromNotes("houses=3;parcels=0"), 3);
expectEqual("pickup parcels only", computePickupKpiFromNotes("houses=0;parcels=10"), 1);
expectEqual("pickup mixed", computePickupKpiFromNotes("houses=2;parcels=10"), 3);
expectEqual("pickup missing notes", computePickupKpiFromNotes(null), 0);
expectEqual("delivery amount numbers", computeDeliveryKpiFromAmount(5), 5);
expectEqual("delivery amount zero", computeDeliveryKpiFromAmount(0), 0);
expectEqual("delivery amount null", computeDeliveryKpiFromAmount(null), 0);
console.log("KPI tests completed");
if (fails > 0) process.exit(1);
