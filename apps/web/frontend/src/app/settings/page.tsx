"use client";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { AlertTriangle, RefreshCw, User, Bell, Database, Download, Upload, Trash2, ChevronRight } from "lucide-react";

interface NotificationPreferences {
  daily_reminder_enabled: boolean;
  daily_reminder_time: string;
  day_off_enabled: boolean;
  day_off_day: number | null;
  sound_enabled: boolean;
  vibration_enabled: boolean;
}

interface DataBackup {
  id: string;
  backup_name: string;
  backup_type: string;
  file_size: number;
  created_at: string;
}

export default function SettingsPage() {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<{ id: string; branch: string } | null>(null);
    const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null);
    const [backups, setBackups] = useState<DataBackup[]>([]);
    const [resettingWarnings, setResettingWarnings] = useState(false);
    const [managingData, setManagingData] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: rows } = await supabase
                    .from("users")
                    .select("id, branch")
                    .eq("auth_user_id", user.id)
                    .limit(1);
                if (rows?.[0]) {
                    setProfile({
                        id: rows[0].id,
                        branch: rows[0].branch || 'C'
                    });

                    // Fetch notification preferences
                    const { data: prefs } = await supabase
                        .from("user_notification_preferences")
                        .select("*")
                        .eq("user_id", rows[0].id)
                        .single();
                    
                    if (prefs) {
                        setNotificationPrefs(prefs);
                    }

                    // Fetch data backups
                    const { data: backupData } = await supabase
                        .from("user_data_backups")
                        .select("id, backup_name, backup_type, file_size, created_at")
                        .eq("user_id", rows[0].id)
                        .order("created_at", { ascending: false });
                    
                    setBackups(backupData || []);
                }
            }
            setLoading(false);
        }
        fetchData();
    }, [supabase]);

    const saveSettings = async (newBranch: string) => {
        if (!profile) return;
        setSaving(true);
        try {
            setProfile(p => p ? { ...p, branch: newBranch } : null);
            const { error } = await supabase
                .from("users")
                .update({ branch: newBranch })
                .eq("id", profile.id);

            if (error) throw error;
            alert("Settings updated!");
        } catch (err) {
            console.error("Error saving branch:", err);
            alert("Failed to save branch");
        } finally {
            setSaving(false);
        }
    };

    const updateNotificationPrefs = async (prefs: Partial<NotificationPreferences>) => {
        if (!profile) return;
        try {
            const response = await fetch('/api/notifications/preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prefs)
            });

            if (response.ok) {
                const { preferences } = await response.json();
                setNotificationPrefs(preferences);
            }
        } catch (err) {
            console.error("Error updating notification preferences:", err);
        }
    };

    const createBackup = async () => {
        if (!profile) return;
        setManagingData(true);
        try {
            const response = await fetch('/api/data/backup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ backupName: `Backup ${new Date().toLocaleString()}` })
            });

            if (response.ok) {
                const { backup } = await response.json();
                setBackups(prev => [backup, ...prev]);
                alert("Backup created successfully!");
            }
        } catch (err) {
            console.error("Error creating backup:", err);
            alert("Failed to create backup");
        } finally {
            setManagingData(false);
        }
    };

    const restoreBackup = async (backupId: string) => {
        if (!confirm("This will replace all your current data. Are you sure?")) return;
        
        setManagingData(true);
        try {
            const response = await fetch('/api/data/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ backupId })
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Data restored successfully! ${result.restoredItems.transactions} transactions, ${result.restoredItems.pickups} pickups restored.`);
            }
        } catch (err) {
            console.error("Error restoring backup:", err);
            alert("Failed to restore backup");
        } finally {
            setManagingData(false);
        }
    };

    const clearAllData = async () => {
        if (!confirm("This will permanently delete ALL your data. This action cannot be undone. Type 'DELETE_ALL_MY_DATA' to confirm.")) return;
        
        const confirmation = prompt("Please type 'DELETE_ALL_MY_DATA' to proceed:");
        if (confirmation !== "DELETE_ALL_MY_DATA") return;

        setManagingData(true);
        try {
            const response = await fetch('/api/data/clear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmation })
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Data cleared successfully! Deleted ${result.deletedCounts.map((d: any) => `${d.count} ${d.table}`).join(', ')}`);
                setBackups([]);
            }
        } catch (err) {
            console.error("Error clearing data:", err);
            alert("Failed to clear data");
        } finally {
            setManagingData(false);
        }
    };

    const resetWarnings = async () => {
        if (!profile) return;
        if (!confirm("Are you sure you want to reset all your warnings? This action cannot be undone.")) {
            return;
        }
        
        setResettingWarnings(true);
        try {
            const response = await fetch('/api/warnings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetUserId: profile.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to reset warnings');
            }

            const result = await response.json();
            alert(`Successfully reset ${result.resetCount} warnings!`);
        } catch (err) {
            console.error("Error resetting warnings:", err);
            alert("Failed to reset warnings");
        } finally {
            setResettingWarnings(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="animate-pulse text-zinc-500 font-medium">Loading settings…</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
            <div className="max-w-xl mx-auto p-6 md:p-12">
                <header className="flex items-center gap-4 mb-12">
                    <Link
                        href="/dashboard"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 transition-colors"
                    >
                        <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Settings</h1>
                </header>

                <div className="space-y-8">
                    {/* General Section */}
                    <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-8 md:p-12">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-3">
                                <User className="w-4 h-4" />
                                <span className="w-8 h-[2px] bg-black dark:bg-white rounded-full"></span>
                                General
                            </h2>
                            
                            <div className="space-y-6">
                                {/* Edit Profile */}
                                <Link
                                    href="/profile"
                                    className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                        <div>
                                            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Edit Profile</div>
                                            <div className="text-sm text-zinc-500">Update your personal information</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                                </Link>

                                {/* Branch Selection */}
                                <div>
                                    <label className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-4 block">Operation Branch</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {['A', 'B', 'C', 'D', 'E'].map((b) => (
                                            <button
                                                key={b}
                                                onClick={() => saveSettings(b)}
                                                disabled={saving || profile?.branch === b}
                                                className={`h-14 rounded-2xl font-black text-xl transition-all duration-300 ring-offset-2 dark:ring-offset-zinc-900 ${profile?.branch === b
                                                    ? "bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/20"
                                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                    } disabled:cursor-default`}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-6 text-sm text-zinc-500 font-medium bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                                        Note: Your KPI targets and grade thresholds are determined by your branch assignment.
                                    </p>
                                </div>

                                {/* Warning Reset */}
                                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800">
                                    <div className="flex items-center space-x-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        <div>
                                            <div className="font-semibold text-red-700 dark:text-red-300">Warning Penalty</div>
                                            <div className="text-sm text-red-600">Reset all active warnings</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={resetWarnings}
                                        disabled={resettingWarnings}
                                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                                            resettingWarnings
                                                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 cursor-wait"
                                                : "bg-red-500 hover:bg-red-600 text-white"
                                        }`}
                                    >
                                        <RefreshCw className={`w-4 h-4 ${resettingWarnings ? 'animate-spin' : ''}`} />
                                        <span>{resettingWarnings ? 'Resetting...' : 'Reset'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-8 md:p-12">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-3">
                                <Bell className="w-4 h-4" />
                                <span className="w-8 h-[2px] bg-black dark:bg-white rounded-full"></span>
                                Notifications
                            </h2>
                            
                            <div className="space-y-6">
                                {/* Daily Reminder */}
                                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                                    <div>
                                        <div className="font-semibold text-zinc-700 dark:text-zinc-300">Daily Reminder</div>
                                        <div className="text-sm text-zinc-500">Get reminded to log your daily activities</div>
                                    </div>
                                    <button
                                        onClick={() => updateNotificationPrefs({ daily_reminder_enabled: !notificationPrefs?.daily_reminder_enabled })}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            notificationPrefs?.daily_reminder_enabled
                                                ? 'bg-blue-500'
                                                : 'bg-zinc-300 dark:bg-zinc-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            notificationPrefs?.daily_reminder_enabled ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                {/* Reminder Time */}
                                {notificationPrefs?.daily_reminder_enabled && (
                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                                        <div className="font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Reminder Time</div>
                                        <input
                                            type="time"
                                            value={notificationPrefs?.daily_reminder_time || '20:00'}
                                            onChange={(e) => updateNotificationPrefs({ daily_reminder_time: e.target.value })}
                                            className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                        />
                                    </div>
                                )}

                                {/* Day Off */}
                                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                                    <div>
                                        <div className="font-semibold text-zinc-700 dark:text-zinc-300">Day Off</div>
                                        <div className="text-sm text-zinc-500">Skip reminders on your day off</div>
                                    </div>
                                    <button
                                        onClick={() => updateNotificationPrefs({ day_off_enabled: !notificationPrefs?.day_off_enabled })}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            notificationPrefs?.day_off_enabled
                                                ? 'bg-blue-500'
                                                : 'bg-zinc-300 dark:bg-zinc-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            notificationPrefs?.day_off_enabled ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                {/* Day Selection */}
                                {notificationPrefs?.day_off_enabled && (
                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                                        <div className="font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Select Day Off</div>
                                        <div className="grid grid-cols-7 gap-2">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                                <button
                                                    key={day}
                                                    onClick={() => updateNotificationPrefs({ day_off_day: index })}
                                                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                                                        notificationPrefs?.day_off_day === index
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                                                    }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sound & Vibration */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Sound</span>
                                        <button
                                            onClick={() => updateNotificationPrefs({ sound_enabled: !notificationPrefs?.sound_enabled })}
                                            className={`w-10 h-5 rounded-full transition-colors ${
                                                notificationPrefs?.sound_enabled
                                                    ? 'bg-blue-500'
                                                    : 'bg-zinc-300 dark:bg-zinc-600'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                                notificationPrefs?.sound_enabled ? 'translate-x-5' : 'translate-x-0.5'
                                            }`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Vibration</span>
                                        <button
                                            onClick={() => updateNotificationPrefs({ vibration_enabled: !notificationPrefs?.vibration_enabled })}
                                            className={`w-10 h-5 rounded-full transition-colors ${
                                                notificationPrefs?.vibration_enabled
                                                    ? 'bg-blue-500'
                                                    : 'bg-zinc-300 dark:bg-zinc-600'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                                notificationPrefs?.vibration_enabled ? 'translate-x-5' : 'translate-x-0.5'
                                            }`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Data Management Section */}
                    <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-8 md:p-12">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-3">
                                <Database className="w-4 h-4" />
                                <span className="w-8 h-[2px] bg-black dark:bg-white rounded-full"></span>
                                Data Management
                            </h2>
                            
                            <div className="space-y-6">
                                {/* Backup */}
                                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center space-x-3">
                                        <Download className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <div className="font-semibold text-blue-700 dark:text-blue-300">Backup Data</div>
                                            <div className="text-sm text-blue-600">Create a backup of all your data</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={createBackup}
                                        disabled={managingData}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                    >
                                        {managingData ? 'Creating...' : 'Backup'}
                                    </button>
                                </div>

                                {/* Restore */}
                                <div className="space-y-3">
                                    <div className="font-semibold text-zinc-700 dark:text-zinc-300">Restore from Backup</div>
                                    {backups.length > 0 ? (
                                        <div className="space-y-2">
                                            {backups.map((backup) => (
                                                <div key={backup.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                                    <div>
                                                        <div className="font-medium text-zinc-700 dark:text-zinc-300">{backup.backup_name}</div>
                                                        <div className="text-xs text-zinc-500">
                                                            {new Date(backup.created_at).toLocaleDateString()} • {(backup.file_size / 1024).toFixed(1)} KB
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => restoreBackup(backup.id)}
                                                        disabled={managingData}
                                                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        Restore
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-zinc-500">No backups available</div>
                                    )}
                                </div>

                                {/* Clear Data */}
                                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800">
                                    <div className="flex items-center space-x-3">
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                        <div>
                                            <div className="font-semibold text-red-700 dark:text-red-300">Clear All Data</div>
                                            <div className="text-sm text-red-600">Permanently delete all your data</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearAllData}
                                        disabled={managingData}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                    >
                                        {managingData ? 'Clearing...' : 'Clear'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-center opacity-40">
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Version 1.0 "Yam"</span>
                        <span className="text-xs font-medium text-zinc-400">CourierEarn KPI Engine</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
