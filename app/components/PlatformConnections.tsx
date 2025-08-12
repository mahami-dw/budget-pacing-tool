'use client'

import { useState } from 'react'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  PlusIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface Platform {
  id: string
  name: string
  type: 'google-ads' | 'dv360'
  status: 'connected' | 'disconnected' | 'error'
  accountName: string
  lastSync: string
  budget: number
  spend: number
}

const mockPlatforms: Platform[] = [
  {
    id: '1',
    name: 'Google Ads',
    type: 'google-ads',
    status: 'connected',
    accountName: 'Main Account (123456789)',
    lastSync: '2 minutes ago',
    budget: 10000,
    spend: 7500
  },
  {
    id: '2',
    name: 'DV360',
    type: 'dv360',
    status: 'connected',
    accountName: 'Display Account (987654321)',
    lastSync: '5 minutes ago',
    budget: 15000,
    spend: 12000
  },
  {
    id: '3',
    name: 'Google Ads',
    type: 'google-ads',
    status: 'error',
    accountName: 'Secondary Account (456789123)',
    lastSync: '1 hour ago',
    budget: 5000,
    spend: 0
  }
]

export default function PlatformConnections() {
  const [platforms, setPlatforms] = useState<Platform[]>(mockPlatforms)
  const [showConnectModal, setShowConnectModal] = useState(false)

  const getStatusIcon = (status: Platform['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'disconnected':
        return <XCircleIcon className="h-5 w-5 text-gray-400" />
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = (status: Platform['status']) => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'disconnected':
        return 'Disconnected'
      case 'error':
        return 'Connection Error'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: Platform['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'disconnected':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDisconnect = (platformId: string) => {
    setPlatforms(platforms.map(p => 
      p.id === platformId ? { ...p, status: 'disconnected' as const } : p
    ))
  }

  const handleReconnect = (platformId: string) => {
    setPlatforms(platforms.map(p => 
      p.id === platformId ? { ...p, status: 'connected' as const } : p
    ))
  }

  const handleSync = (platformId: string) => {
    // In a real app, this would trigger an API call to sync data
    setPlatforms(platforms.map(p => 
      p.id === platformId ? { ...p, lastSync: 'Just now' } : p
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Connections</h2>
          <p className="text-gray-600 mt-1">
            Connect your advertising platforms to automatically sync budget and performance data
          </p>
        </div>
        <button
          onClick={() => setShowConnectModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Connect Platform</span>
        </button>
      </div>

      {/* Connection Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connected Platforms</p>
              <p className="text-2xl font-bold text-green-600">
                {platforms.filter(p => p.status === 'connected').length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                ${platforms.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <InformationCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Sync</p>
              <p className="text-2xl font-bold text-gray-900">
                {platforms.filter(p => p.status === 'connected').length > 0 ? '2 min ago' : 'Never'}
              </p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <InformationCircleIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Platform List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Platforms</h3>
        <div className="space-y-4">
          {platforms.map((platform) => (
            <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(platform.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{platform.name}</h4>
                      <p className="text-sm text-gray-600">{platform.accountName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Budget: ${platform.budget.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Spend: ${platform.spend.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`status-indicator ${getStatusColor(platform.status)}`}>
                      {getStatusText(platform.status)}
                    </span>
                    
                    <div className="flex space-x-2">
                      {platform.status === 'connected' ? (
                        <>
                          <button
                            onClick={() => handleSync(platform.id)}
                            className="btn-secondary text-sm"
                          >
                            Sync Now
                          </button>
                          <button
                            onClick={() => handleDisconnect(platform.id)}
                            className="btn-secondary text-sm text-red-600 hover:bg-red-50"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleReconnect(platform.id)}
                          className="btn-primary text-sm"
                        >
                          Reconnect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Last sync: {platform.lastSync}</span>
                  {platform.status === 'error' && (
                    <span className="text-red-600">
                      Authentication failed. Please reconnect your account.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Setup Instructions</h3>
            <div className="mt-2 text-blue-800 space-y-2">
              <p><strong>Google Ads:</strong> Use Google Ads Scripts API or Google Ads API for data access.</p>
              <p><strong>DV360:</strong> Use Display & Video 360 API with instant reporting for real-time data.</p>
              <p><strong>Authentication:</strong> OAuth 2.0 flow required for secure access to your accounts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Platform Modal Placeholder */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Platform</h3>
            <p className="text-gray-600 mb-4">
              This modal would contain the platform connection form with OAuth integration.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConnectModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConnectModal(false)}
                className="btn-primary"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
