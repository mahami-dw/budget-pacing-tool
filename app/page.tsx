'use client'

import { useState } from 'react'
import BudgetOverview from './components/BudgetOverview'
import PlatformConnections from './components/PlatformConnections'
import CampaignList from './components/CampaignList'
import CreateRuleModal from './components/CreateRuleModal'
import GoogleSheetsConnection from './components/GoogleSheetsConnection'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isCreateRuleModalOpen, setIsCreateRuleModalOpen] = useState(false)
  const [hasConnectedGoogleSheets, setHasConnectedGoogleSheets] = useState(false)

  const tabs = [
    { id: 'overview', name: 'Budget Overview', icon: '📊' },
    { id: 'connections', name: 'Platform Connections', icon: '🔗' },
    { id: 'campaigns', name: 'Campaigns', icon: '📋' },
  ]

  const handleGoogleSheetsConnected = () => {
    setHasConnectedGoogleSheets(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Budget Pacing Tool</h1>
              <p className="text-gray-600">Monitor and manage your advertising budgets</p>
            </div>
            <button
              onClick={() => setIsCreateRuleModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Create Rule
            </button>
          </div>
        </div>
      </header>

      {/* Google Sheets Connection - Show prominently if not connected */}
      {!hasConnectedGoogleSheets && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connect Your Google Sheets</h2>
            <p className="text-gray-600 mb-6">
              To get started, connect your Google Sheets that contains your Google Ads campaign data.
            </p>
            <GoogleSheetsConnection onConnected={handleGoogleSheetsConnected} />
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <BudgetOverview />}
        {activeTab === 'connections' && <PlatformConnections />}
        {activeTab === 'campaigns' && <CampaignList />}
      </main>

      {/* Create Rule Modal */}
      <CreateRuleModal
        isOpen={isCreateRuleModalOpen}
        onClose={() => setIsCreateRuleModalOpen(false)}
      />
    </div>
  )
}
