 import { getSupabaseServerClient } from "@/lib/supabase/server";
 
 function greeting() {
   const hour = new Date().getHours();
   if (hour < 12) return "Good morning";
   if (hour < 18) return "Good afternoon";
   return "Good evening";
 }
 
 function formatDateISO(d: Date) {
   return d.toISOString().slice(0, 10);
 }
 
 export default async function DashboardPage() {
   const supabase = await getSupabaseServerClient();
   const {
     data: { user },
   } = await supabase.auth.getUser();
 
   let todayCommission = 0;
   let todayPickupTotal = 0;
   let todayDeliveryTotal = 0;
   let mtdEarnings = 0;
   let mtdEc = 0;
   let tickerText = "No data for yesterday";
 
   if (user) {
     const { data: rows } = await supabase
       .from("users")
       .select("id")
       .eq("auth_user_id", user.id)
       .limit(1);
     const userRowId = rows?.[0]?.id;
 
    if (userRowId) {
      const todayStr = formatDateISO(new Date());
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yesterdayStr = formatDateISO(y);
 
       const { data: txToday } = await supabase
         .from("transactions")
         .select("amount, dropoff_location")
         .eq("user_id", userRowId)
         .eq("pickup_location", "daily-delivery")
         .eq("dropoff_location", todayStr);
 
      todayCommission = ((txToday ?? []) as Array<{ amount: number }>).reduce(
        (acc, cur) => acc + Number(cur.amount || 0),
        0
      );
       todayDeliveryTotal = (txToday ?? []).length;
 
       const { data: puToday } = await supabase
         .from("pickups")
         .select("notes")
         .eq("user_id", userRowId)
         .eq("location", "daily-pickup")
         .gte("scheduled_at", `${todayStr}T00:00:00Z`)
         .lte("scheduled_at", `${todayStr}T23:59:59Z`);
      todayPickupTotal = ((puToday ?? []) as Array<{ notes: string | null }>).reduce((acc, cur) => {
         const notes = String(cur.notes || "");
         const houses = Number(notes.match(/houses=(\d+)/)?.[1] ?? 0);
         const parcels = Number(notes.match(/parcels=(\d+)/)?.[1] ?? 0);
         return acc + houses + parcels;
       }, 0);
 
       const monthStart = new Date();
       monthStart.setDate(1);
       const monthStartStr = formatDateISO(monthStart);
 
       const { data: txMonth } = await supabase
         .from("transactions")
         .select("amount, dropoff_location")
         .eq("user_id", userRowId)
         .eq("pickup_location", "daily-delivery")
         .gte("dropoff_location", monthStartStr);
      mtdEarnings = ((txMonth ?? []) as Array<{ amount: number }>).reduce(
        (acc, cur) => acc + Number(cur.amount || 0),
        0
      );
       mtdEc = (txMonth ?? []).length;
 
       const { data: txYesterday } = await supabase
         .from("transactions")
         .select("amount")
         .eq("user_id", userRowId)
         .eq("pickup_location", "daily-delivery")
         .eq("dropoff_location", yesterdayStr);
       const { data: puYesterday } = await supabase
         .from("pickups")
         .select("notes")
         .eq("user_id", userRowId)
         .eq("location", "daily-pickup")
         .gte("scheduled_at", `${yesterdayStr}T00:00:00Z`)
         .lte("scheduled_at", `${yesterdayStr}T23:59:59Z`);
      const yEarnings = ((txYesterday ?? []) as Array<{ amount: number }>).reduce(
        (acc, cur) => acc + Number(cur.amount || 0),
        0
      );
      const yPickup = ((puYesterday ?? []) as Array<{ notes: string | null }>).reduce((acc, cur) => {
         const notes = String(cur.notes || "");
         const houses = Number(notes.match(/houses=(\d+)/)?.[1] ?? 0);
         const parcels = Number(notes.match(/parcels=(\d+)/)?.[1] ?? 0);
         return acc + houses + parcels;
       }, 0);
       tickerText =
         yEarnings || yPickup
           ? `Yesterday — Earnings: ${yEarnings.toFixed(2)} | Pickups: ${yPickup}`
           : "No data for yesterday";
     }
   }
 
   return (
     <main className="min-h-screen p-6">
       <style>{`
         @keyframes tickerMove {
           0% { transform: translateX(100%); }
           100% { transform: translateX(-100%); }
         }
       `}</style>
       <div className="max-w-5xl mx-auto">
         <header className="mb-6">
           <h1 className="text-2xl font-semibold">{greeting()}, {user ? user.email ?? "Courier" : "Guest"}</h1>
         </header>
 
         <div className="overflow-hidden rounded border mb-6">
           <div
             style={{ animation: "tickerMove 12s linear infinite", whiteSpace: "nowrap" }}
             className="px-4 py-2"
           >
             {tickerText}
           </div>
         </div>
 
         <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="md:col-start-2 p-6 rounded border text-center">
            <div className="text-sm text-zinc-600 mb-1">Today’s Commission</div>
             <div className="text-3xl font-semibold">{todayCommission.toFixed(2)}</div>
           </div>
           <div className="p-6 rounded border">
            <div className="text-sm text-zinc-600 mb-1">Today’s Pickup</div>
             <div className="text-2xl font-semibold">{todayPickupTotal}</div>
           </div>
           <div className="p-6 rounded border">
            <div className="text-sm text-zinc-600 mb-1">Today’s Delivery</div>
             <div className="text-2xl font-semibold">{todayDeliveryTotal}</div>
           </div>
         </section>
 
         <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
           <div className="p-6 rounded border">
             <div className="text-sm text-zinc-600 mb-1">Month to Date Earnings</div>
             <div className="text-2xl font-semibold">{mtdEarnings.toFixed(2)}</div>
           </div>
           <div className="p-6 rounded border">
             <div className="text-sm text-zinc-600 mb-1">Month to Date EC (entries)</div>
             <div className="text-2xl font-semibold">{mtdEc}</div>
           </div>
         </section>
       </div>
     </main>
   );
 }
