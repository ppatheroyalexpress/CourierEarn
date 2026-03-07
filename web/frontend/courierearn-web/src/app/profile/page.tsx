 "use client";
 import { useEffect, useMemo, useState } from "react";
 import { getSupabaseBrowserClient } from "@/lib/supabase/client";
 
 type Profile = {
   id: string;
   auth_user_id: string;
   email: string | null;
   full_name: string | null;
   avatar_url: string | null;
   branch: string | null;
   phone: string | null;
 };
 
 export default function ProfilePage() {
   const supabase = useMemo(() => getSupabaseBrowserClient(), []);
   const [userId, setUserId] = useState<string | null>(null);
   const [profile, setProfile] = useState<Profile | null>(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
   const [kpi, setKpi] = useState<number>(0);
   const [totalEarnings, setTotalEarnings] = useState<number>(0);
 
   useEffect(() => {
     (async () => {
       const { data } = await supabase.auth.getUser();
       const uid = data.user?.id ?? null;
       setUserId(uid);
       if (uid) {
         const { data: rows } = await supabase
           .from("users")
           .select("*")
           .eq("auth_user_id", uid)
           .limit(1);
         const p = rows?.[0] ?? null;
         setProfile(p);
         setAvatarPreview(p?.avatar_url ?? null);
 
         const { data: txSum } = await supabase
           .from("transactions")
           .select("amount")
           .eq("user_id", p?.id ?? "")
           .eq("pickup_location", "daily-delivery");
        const earnings =
          ((txSum ?? []) as Array<{ amount: number }>).reduce(
            (acc, cur) => acc + Number(cur.amount || 0),
            0
          ) || 0;
         setTotalEarnings(earnings);
 
         const { data: pickups } = await supabase
           .from("pickups")
           .select("notes")
           .eq("user_id", p?.id ?? "")
           .eq("location", "daily-pickup");
        const pickupKpi = ((pickups ?? []) as Array<{ notes: string | null }>).reduce((acc, cur) => {
           const notes = String(cur.notes || "");
           const houses = Number(notes.match(/houses=(\d+)/)?.[1] ?? 0);
           const parcels = Number(notes.match(/parcels=(\d+)/)?.[1] ?? 0);
           return acc + houses + parcels * 0.1;
         }, 0);
         const txCount = (txSum ?? []).length;
         setKpi(txCount + pickupKpi);
       }
       setLoading(false);
     })();
   }, [supabase]);
 
   const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
     const reader = new FileReader();
     reader.onload = () => {
       const result = reader.result as string;
       setAvatarPreview(result);
     };
     reader.readAsDataURL(file);
   };
 
   const saveProfile = async () => {
     if (!userId) return;
     setSaving(true);
     try {
       const lower = (v: string | null) => (v ? v.toLowerCase() : v);
      const payload = {
         auth_user_id: userId,
         email: profile?.email ?? null,
        full_name: lower(profile?.full_name ?? null),
        branch: lower(profile?.branch ?? null),
        phone: lower(profile?.phone ?? null),
         avatar_url: avatarPreview,
       };
       if (profile?.id) {
         await supabase.from("users").update(payload).eq("id", profile.id);
       } else {
         const { data } = await supabase.from("users").insert(payload).select("*").limit(1);
         const p = data?.[0] ?? null;
         setProfile(p);
       }
       alert("Profile saved");
     } finally {
       setSaving(false);
     }
   };
 
   const removeAvatar = () => {
     setAvatarPreview(null);
   };
 
   if (loading) {
     return (
       <main className="min-h-screen flex items-center justify-center">
         <div className="animate-pulse">Loading profile…</div>
       </main>
     );
   }
 
   if (!userId) {
     return (
       <main className="min-h-screen flex items-center justify-center">
         <div>You need to sign in to view your profile.</div>
       </main>
     );
   }
 
   return (
     <main className="max-w-3xl mx-auto p-6">
       <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
       <div className="flex items-center gap-4 mb-6">
         <div className="w-20 h-20 rounded-full border overflow-hidden">
           {avatarPreview ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-sm text-zinc-500">
               No avatar
             </div>
           )}
         </div>
         <div className="flex flex-col gap-2">
           <input
             type="file"
             accept="image/*"
             title="Upload a square image for best results"
             onChange={onAvatarChange}
           />
           <div className="flex gap-2">
             <button onClick={removeAvatar} className="px-3 py-1 rounded border" title="Remove the current avatar">
               Remove
             </button>
             <button
               onClick={saveProfile}
               disabled={saving}
               className="px-3 py-1 rounded bg-black text-white disabled:opacity-50"
               title="Save profile changes to database"
             >
               {saving ? "Saving…" : "Save"}
             </button>
           </div>
         </div>
       </div>
 
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
         <label className="flex flex-col gap-1">
           <span className="text-sm text-zinc-600" title="Your display name, stored in lowercase">Username</span>
           <input
             className="px-3 py-2 rounded border"
             value={profile?.full_name ?? ""}
             onChange={(e) =>
               setProfile((p) => (p ? { ...p, full_name: e.target.value.toLowerCase() } : p))
             }
           />
         </label>
         <label className="flex flex-col gap-1">
           <span className="text-sm text-zinc-600" title="Your branch code, stored in lowercase">Branch</span>
           <input
             className="px-3 py-2 rounded border"
             value={profile?.branch ?? ""}
             onChange={(e) =>
               setProfile((p) => (p ? { ...p, branch: e.target.value.toLowerCase() } : p))
             }
           />
         </label>
         <label className="flex flex-col gap-1">
           <span className="text-sm text-zinc-600" title="Your phone number, stored in lowercase">Phone</span>
           <input
             className="px-3 py-2 rounded border"
             value={profile?.phone ?? ""}
             onChange={(e) =>
               setProfile((p) => (p ? { ...p, phone: e.target.value.toLowerCase() } : p))
             }
           />
         </label>
         <label className="flex flex-col gap-1">
           <span className="text-sm text-zinc-600" title="Your email from Supabase Auth">Email</span>
           <input className="px-3 py-2 rounded border bg-zinc-100" value={profile?.email ?? ""} readOnly />
         </label>
       </div>
 
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <div className="p-4 rounded border">
           <div className="text-sm text-zinc-600 mb-1" title="Sum of all recorded delivery entries">Total Earnings</div>
           <div className="text-2xl font-semibold">{totalEarnings.toFixed(2)}</div>
         </div>
         <div className="p-4 rounded border">
           <div className="text-sm text-zinc-600 mb-1" title="Estimated KPI points based on entries">Estimated KPI Points</div>
           <div className="text-2xl font-semibold">{kpi.toFixed(1)}</div>
         </div>
       </div>
     </main>
   );
 }
