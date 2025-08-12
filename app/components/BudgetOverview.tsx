'use client'

import { useState } from 'react'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const mockData = {
  dailySpend: [
    { date: '2024-01-01', spend: 1200, budget: 1500 },
    { date: '2024-01-02', spend: 1350, budget: 1500 },
    { date: '2024-01-03', spend: 1100, budget: 1500 },
    { date: '2024-01-04', spend: 1600, budget: 1500 },
    { date: '2024-01-05', spend: 1400, budget: 1500 },
    { date: '2024-01-06', spend: 1300, budget: 1500 },
    { date: '2024-01-07', spend: 1250, budget: 1500 },
  ],
  platformBreakdown: [
    { platform: 'Google Ads', spend: 4500, budget: 6000, percentage: 75 },
    { platform: 'DV360', spend: 3200, budget: 4000, percentage: 80 },
    { platform: 'Facebook Ads', spend: 1800, budget: 2000, percentage: 90 },
  ]
}

export default function BudgetOverview() {
  const [timeRange, setTimeRange] = useState('7d')

  const totalSpend = mockData.dailySpend.reduce((sum, day) => sum + day.spend, 0)
  const totalBudget = mockData.dailySpend.reduce((sum, day) => sum + day.budget, 0)
  const pacingPercentage = (totalSpend / totalBudget) * 100

  const getStatusColor = (percentage: number) => {
    if (percentage > 100) return 'text-red-600'
    if (percentage > 90) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage > 100) return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
    if (percentage > 90) return <ClockIcon className="h-5 w-5 text-yellow-600" />
    return <CheckCircleIcon className="h-5 w-5 text-green-600" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Budget Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field w-auto"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spend</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpend.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <ArrowTrendingDownIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pacing</p>
              <p className={`text-2xl font-bold ${getStatusColor(pacingPercentage)}`}>
                {pacingPercentage.toFixed(1)}%
              </p>
            </div>
            {getStatusIcon(pacingPercentage)}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.max(0, totalBudget - totalSpend).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Spend Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Spend vs Budget</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.dailySpend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} name="Spend" />
              <Line type="monotone" dataKey="budget" stroke="#10b981" strokeWidth={2} name="Budget" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.platformBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spend" fill="#3b82f6" name="Spend" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
        <div className="space-y-4">
          {mockData.platformBreakdown.map((platform) => (
            <div key={platform.platform} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{platform.platform}</span>
                  <span className="text-sm text-gray-600">
                    ${platform.spend.toLocaleString()} / ${platform.budget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      platform.percentage > 100 ? 'bg-red-500' : 
                      platform.percentage > 90 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(platform.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Pacing</span>
                  <span className={`text-xs font-medium ${
                    platform.percentage > 100 ? 'text-red-600' : 
                    platform.percentage > 90 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {platform.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
