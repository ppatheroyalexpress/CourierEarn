"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Award, User, Building2, AlertTriangle, Crown } from "lucide-react";

interface LeaderboardUser {
  id: string;
  username: string;
  branch: string;
  grade: number;
  percentage: number;
  warnings: number;
  deliveryScore: number;
  pickupScore: number;
  ecScore: number;
  totalScore: number;
  rank: number;
}

interface MonthlyChampion {
  month: string;
  champion: { id: string; username: string } | null;
  runner_up: { id: string; username: string } | null;
  third_place: { id: string; username: string } | null;
  champion_grade: number;
  champion_percentage: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardUser[];
  currentUserRank: LeaderboardUser | null;
  monthlyChampions: MonthlyChampion | null;
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

  const getGradeColor = (grade: number) => {
    switch (grade) {
      case 5:
        return "bg-gradient-to-r from-green-400 to-green-600 text-white";
      case 4:
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
      case 3:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      case 1:
        return "bg-gradient-to-r from-red-400 to-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getWarningDisplay = (warnings: number) => {
    if (warnings > 0) {
      return (
        <div className="flex items-center space-x-2 text-sm text-red-500">
          <AlertTriangle className="w-4 h-4" />
          <span>{warnings} warning{warnings > 1 ? "s" : ""}</span>
        </div>
      );
    } else {
      return null;
    }
  };

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
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${getGradeColor(data.currentUserRank.grade)}`}>
                      Grade {data.currentUserRank.grade}
                    </span>
                    <span className="text-sm text-blue-700">{data.currentUserRank.percentage.toFixed(1)}%</span>
                  </div>
                  {getWarningDisplay(data.currentUserRank.warnings)}
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
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${getGradeColor(user.grade)}`}>
                        Grade {user.grade}
                      </span>
                      <span className="text-lg font-bold text-gray-900">{user.percentage.toFixed(1)}%</span>
                    </div>
                    {getWarningDisplay(user.warnings)}
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium text-green-600">{user.deliveryScore} delivery</span>
                      <span className="mx-1">•</span>
                      <span className="font-medium text-blue-600">{user.pickupScore} pickup</span>
                      <span className="mx-1">•</span>
                      <span className="font-medium text-purple-600">{user.ecScore} EC</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Champions Section */}
        {data?.monthlyChampions && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-900">Monthly Champions</h2>
              <span className="text-sm text-purple-600">
                ({new Date(data.monthlyChampions.month + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.monthlyChampions.champion && (
                <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{data.monthlyChampions.champion.username}</div>
                  <div className="text-sm text-purple-600">Champion</div>
                  <div className="text-xs text-gray-500 mt-1">Grade {data.monthlyChampions.champion_grade} • {data.monthlyChampions.champion_percentage.toFixed(1)}%</div>
                </div>
              )}
              
              {data.monthlyChampions.runner_up && (
                <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                  <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{data.monthlyChampions.runner_up.username}</div>
                  <div className="text-sm text-purple-600">Runner Up</div>
                </div>
              )}
              
              {data.monthlyChampions.third_place && (
                <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                  <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{data.monthlyChampions.third_place.username}</div>
                  <div className="text-sm text-purple-600">Third Place</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Royal Express KPI System:</p>
          <p>Commission: Cash × 200 + Not Cash × 100 + Pickup Parcels × 50 MMK</p>
          <p>Grading: Based on branch targets (A/B/C grades) with percentage-based achievement levels</p>
          <p>Warnings: Each active warning reduces grade by 1 level</p>
        </div>
      </div>
    </div>
  );
}
