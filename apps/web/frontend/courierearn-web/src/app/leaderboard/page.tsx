"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Award, User, Building2 } from "lucide-react";

interface LeaderboardUser {
  id: string;
  username: string;
  branch: string;
  totalKpi: number;
  deliveryKpi: number;
  pickupKpi: number;
  rank: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardUser[];
  currentUserRank: LeaderboardUser | null;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("/api/kpi/leaderboard");
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        const leaderboardData = await response.json();
        setData(leaderboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-semibold text-gray-600">{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">KPI Leaderboard</h1>
          <p className="text-gray-600">Top performers based on Key Performance Indicators</p>
        </div>

        {data?.currentUserRank && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Your Ranking</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-blue-600">#{data.currentUserRank.rank}</span>
                <div className="text-right">
                  <p className="text-sm text-blue-700">{data.currentUserRank.totalKpi.toFixed(1)} total KPI</p>
                  <p className="text-xs text-blue-600">
                    {data.currentUserRank.deliveryKpi.toFixed(1)} delivery • {data.currentUserRank.pickupKpi.toFixed(1)} pickup
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
            <h2 className="text-xl font-semibold text-white">Top Performers</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {data?.leaderboard.map((user) => (
              <div
                key={user.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  data.currentUserRank?.id === user.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getRankBadgeColor(user.rank)}`}>
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{user.username}</h3>
                        {data.currentUserRank?.id === user.id && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">You</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Building2 className="w-4 h-4" />
                        <span>{user.branch}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{user.totalKpi.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium text-green-600">{user.deliveryKpi.toFixed(1)} delivery</span>
                      <span className="mx-1">•</span>
                      <span className="font-medium text-blue-600">{user.pickupKpi.toFixed(1)} pickup</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>KPI Points Calculation:</p>
          <p>Cash/Not Cash Collect: 1 point each • EC: 1 point each • Pickup House: 1 point each • Pickup Parcel: 0.1 point each</p>
        </div>
      </div>
    </div>
  );
}
