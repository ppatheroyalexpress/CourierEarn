 "use client";
 import { useEffect, useMemo, useState } from "react";
 import { getSupabaseBrowserClient } from "@/lib/supabase/client";
 
 export default function PickupEntryPage() {
   const supabase = useMemo(() => getSupabaseBrowserClient(), []);
   const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
   const [houses, setHouses] = useState<number>(0);
   const [parcels, setParcels] = useState<number>(0);
   const [userRowId, setUserRowId] = useState<string | null>(null);
   const [saving, setSaving] = useState(false);
 
   useEffect(() => {
     (async () => {
       const { data } = await supabase.auth.getUser();
       const uid = data.user?.id ?? null;
       if (!uid) return;
       const { data: rows } = await supabase
         .from("users")
         .select("*")
         .eq("auth_user_id", uid)
         .limit(1);
       if (rows && rows[0]?.id) {
         setUserRowId(rows[0].id);
       } else {
         const { data: created } = await supabase
           .from("users")
           .insert({ auth_user_id: uid, email: data.user?.email ?? null })
           .select("*")
           .limit(1);
         setUserRowId(created?.[0]?.id ?? null);
       }
     })();
   }, [supabase]);
 
   const total = houses + parcels;
 
   const save = async () => {
     if (!userRowId) {
       alert("User not loaded. Please try again.");
       return;
     }
     setSaving(true);
     try {
       await supabase.from("pickups").insert({
         user_id: userRowId,
         scheduled_at: new Date(date).toISOString(),
         location: "daily-pickup",
         notes: `houses=${houses};parcels=${parcels}`,
       });
       alert("Saved pickup entry");
     } finally {
       setSaving(false);
     }
   };
 
   return (
     <main className="max-w-xl mx-auto p-6">
       <h1 className="text-2xl font-semibold mb-4">Pickup Entry</h1>
       <div className="grid grid-cols-1 gap-4 mb-4">
         <label className="flex flex-col gap-1">
           <span className="text-sm text-zinc-600" title="Select the date to record">Date</span>
           <input
             type="date"
             className="px-3 py-2 rounded border"
             value={date}
             onChange={(e) => setDate(e.target.value)}
           />
         </label>
         <label className="flex flex-col gap-1">
           <span className="text-sm text-zinc-600" title="Number of pickup houses">Pickup Houses</span>
           <input
             type="number"
             min={0}
             className="px-3 py-2 rounded border"
             value={houses}
             onChange={(e) => setHouses(Number(e.target.value || 0))}
           />
         </label>
         <label className="flex flex-col gap-1">
           <span className="text-sm text-zinc-600" title="Number of pickup parcels">Pickup Parcels</span>
           <input
             type="number"
             min={0}
             className="px-3 py-2 rounded border"
             value={parcels}
             onChange={(e) => setParcels(Number(e.target.value || 0))}
           />
         </label>
       </div>
       <div className="p-4 rounded border mb-4" title="Auto-calculated total">
         <div className="text-sm text-zinc-600 mb-1">Total</div>
         <div className="text-2xl font-semibold">{total}</div>
       </div>
       <button
         onClick={save}
         disabled={saving}
         className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
         title="Save to pickups table"
       >
         {saving ? "Saving…" : "Save"}
       </button>
     </main>
   );
 }
