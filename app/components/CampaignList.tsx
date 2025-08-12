'use client'

import { useState } from 'react'
import { 
  PlayIcon, 
  PauseIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface Campaign {
  id: string
  name: string
  platform: 'google-ads' | 'dv360'
  status: 'active' | 'paused' | 'completed'
  budget: number
  spend: number
  startDate: string
  endDate: string
  pacing: number
  impressions: number
  clicks: number
  conversions: number
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Brand Awareness Campaign',
    platform: 'google-ads',
    status: 'active',
    budget: 5000,
    spend: 3200,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    pacing: 64,
    impressions: 150000,
    clicks: 2500,
    conversions: 45
  },
  {
    id: '2',
    name: 'Display Remarketing Q1',
    platform: 'dv360',
    status: 'active',
    budget: 8000,
    spend: 7200,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    pacing: 90,
    impressions: 200000,
    clicks: 1800,
    conversions: 32
  },
  {
    id: '3',
    name: 'Search Conversion Q1',
    platform: 'google-ads',
    status: 'paused',
    budget: 3000,
    spend: 1500,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    pacing: 50,
    impressions: 75000,
    clicks: 1200,
    conversions: 28
  },
  {
    id: '4',
    name: 'Video Awareness Q1',
    platform: 'dv360',
    status: 'active',
    budget: 12000,
    spend: 13500,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    pacing: 112.5,
    impressions: 300000,
    clicks: 4500,
    conversions: 67
  }
]

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    const matchesPlatform = platformFilter === 'all' || campaign.platform === platformFilter
    return matchesSearch && matchesStatus && matchesPlatform
  })

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <PlayIcon className="h-4 w-4 text-green-600" />
      case 'paused':
        return <PauseIcon className="h-4 w-4 text-yellow-600" />
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-blue-600" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPacingColor = (pacing: number) => {
    if (pacing > 100) return 'text-red-600'
    if (pacing > 90) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getPacingIcon = (pacing: number) => {
    if (pacing > 100) return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
    if (pacing > 90) return <ClockIcon className="h-4 w-4 text-yellow-600" />
    return <CheckCircleIcon className="h-4 w-4 text-green-600" />
  }

  const handleStatusToggle = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active'
        return { ...campaign, status: newStatus }
      }
      return campaign
    }))
  }

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0)
  const overallPacing = (totalSpend / totalBudget) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
          <p className="text-gray-600 mt-1">
            Monitor and manage your advertising campaigns across all platforms
          </p>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-green-600">
                {campaigns.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <PlayIcon className="h-6 w-6 text-green-600" />
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
              <CheckCircleIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Pacing</p>
              <p className={`text-2xl font-bold ${getPacingColor(overallPacing)}`}>
                {overallPacing.toFixed(1)}%
              </p>
            </div>
            {getPacingIcon(overallPacing)}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Platforms</option>
              <option value="google-ads">Google Ads</option>
              <option value="dv360">DV360</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pacing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">
                        {campaign.startDate} - {campaign.endDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {campaign.platform === 'google-ads' ? 'Google Ads' : 'DV360'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(campaign.status)}
                      <span className={`status-indicator ${getStatusColor(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${campaign.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${campaign.spend.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getPacingIcon(campaign.pacing)}
                      <span className={`text-sm font-medium ${getPacingColor(campaign.pacing)}`}>
                        {campaign.pacing.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Impr: {campaign.impressions.toLocaleString()}</div>
                    <div>Clicks: {campaign.clicks.toLocaleString()}</div>
                    <div>Conv: {campaign.conversions}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleStatusToggle(campaign.id)}
                      className={`btn-secondary text-sm ${
                        campaign.status === 'active' 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {campaign.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
