'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface BudgetData {
  totalSpend: number
  totalBudget: number
  pacing: number
  remaining: number
  dailyData: Array<{ date: string; spend: number; budget: number }>
  platformBreakdown: Array<{ platform: string; spend: number; budget: number }>
}

export default function BudgetOverview() {
  const [data, setData] = useState<BudgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBudgetData()
  }, [])

  const fetchBudgetData = async () => {
    try {
      setLoading(true)
      const spreadsheetId = localStorage.getItem('googleSheetsId')
      
      if (!spreadsheetId) {
        setError('No Google Sheets connected. Please connect your Google Sheets first.')
        setLoading(false)
        return
      }

      const response = await fetch('/api/google-sheets/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'fetchCampaignData',
          spreadsheetId: spreadsheetId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Sheets')
      }

      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBudgetData}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <ClockIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No Data Available</h3>
          <p className="text-yellow-600">Connect your Google Sheets to see your budget data.</p>
        </div>
      </div>
    )
  }

  const { totalSpend, totalBudget, pacing, remaining, dailyData, platformBreakdown } = data

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Spend</p>
              <p className="text-2xl font-semibold text-gray-900">${totalSpend.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Budget</p>
              <p className="text-2xl font-semibold text-gray-900">${totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {pacing >= 100 ? (
                <ArrowTrendingUpIcon className="h-8 w-8 text-red-600" />
              ) : (
                <ArrowTrendingDownIcon className="h-8 w-8 text-green-600" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pacing</p>
              <p className={`text-2xl font-semibold ${pacing >= 100 ? 'text-red-600' : 'text-green-600'}`}>
                {pacing.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Remaining</p>
              <p className="text-2xl font-semibold text-gray-900">${remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Spend vs Budget */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Spend vs Budget</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Line type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={2} name="Spend" />
              <Line type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={2} name="Budget" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Breakdown */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Bar dataKey="spend" fill="#3b82f6" name="Spend" />
              <Bar dataKey="budget" fill="#10b981" name="Budget" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Performance Details */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pacing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {platformBreakdown.map((platform, index) => {
                const platformPacing = (platform.spend / platform.budget) * 100
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{platform.platform}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${platform.spend.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${platform.budget.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{platformPacing.toFixed(1)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        platformPacing >= 100 
                          ? 'bg-red-100 text-red-800' 
                          : platformPacing >= 80 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {platformPacing >= 100 ? 'Over Budget' : platformPacing >= 80 ? 'Warning' : 'On Track'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
