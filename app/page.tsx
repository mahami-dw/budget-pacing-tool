'use client'

import { useState } from 'react'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  CogIcon, 
  PlusIcon,
  PlayIcon,
  PauseIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import BudgetOverview from './components/BudgetOverview'
import PlatformConnections from './components/PlatformConnections'
import CampaignList from './components/CampaignList'
import CreateRuleModal from './components/CreateRuleModal'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateRule, setShowCreateRule] = useState(false)

  const tabs = [
    { id: 'overview', name: 'Budget Overview', icon: ChartBarIcon },
    { id: 'campaigns', name: 'Campaigns', icon: CurrencyDollarIcon },
    { id: 'connections', name: 'Platform Connections', icon: CogIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Budget Pacing Tool</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateRule(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Rule</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <BudgetOverview />}
        {activeTab === 'campaigns' && <CampaignList />}
        {activeTab === 'connections' && <PlatformConnections />}
      </main>

      {/* Create Rule Modal */}
      {showCreateRule && (
        <CreateRuleModal
          isOpen={showCreateRule}
          onClose={() => setShowCreateRule(false)}
        />
      )}
    </div>
  )
}
