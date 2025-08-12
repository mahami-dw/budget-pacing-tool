'use client'

import { useState } from 'react'
import { XMarkIcon, PlusIcon, XMarkIcon as RemoveIcon } from '@heroicons/react/24/outline'

interface Rule {
  id: string
  name: string
  applyTo: string
  action: string
  conditions: Condition[]
  timeRange: string
  schedule: string
  notification: boolean
}

interface Condition {
  id: string
  metric: string
  operator: string
  value: string
}

const applyToOptions = [
  'All active campaigns',
  'All active ad sets',
  'All active ads',
  'Specific campaigns',
  'Specific ad sets'
]

const actionOptions = [
  'Pause campaign',
  'Reduce budget by percentage',
  'Increase budget by percentage',
  'Send notification',
  'Adjust bids',
  'Change status'
]

const metricOptions = [
  'Spent',
  'Budget',
  'Impressions',
  'Clicks',
  'Conversions',
  'CTR',
  'CPC',
  'CPA'
]

const operatorOptions = [
  'is greater than',
  'is less than',
  'equals',
  'is between',
  'has increased by',
  'has decreased by'
]

const timeRangeOptions = [
  '7 days',
  '30 days',
  '90 days',
  'Custom range'
]

const scheduleOptions = [
  'Continuously',
  'Daily',
  'Custom'
]

export default function CreateRuleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [rule, setRule] = useState<Partial<Rule>>({
    name: '',
    applyTo: 'All active ad sets',
    action: '',
    conditions: [{ id: '1', metric: 'Spent', operator: 'is greater than', value: '' }],
    timeRange: '30 days',
    schedule: 'Continuously',
    notification: true
  })

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      metric: 'Spent',
      operator: 'is greater than',
      value: ''
    }
    setRule(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), newCondition]
    }))
  }

  const handleRemoveCondition = (conditionId: string) => {
    if (rule.conditions && rule.conditions.length > 1) {
      setRule(prev => ({
        ...prev,
        conditions: prev.conditions?.filter(c => c.id !== conditionId)
      }))
    }
  }

  const handleConditionChange = (conditionId: string, field: keyof Condition, value: string) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions?.map(c => 
        c.id === conditionId ? { ...c, [field]: value } : c
      )
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the rule to the backend
    console.log('Creating rule:', rule)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create a custom rule</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Introduction */}
          <div className="text-gray-600">
            Automatically update the settings of selected campaigns, ad sets or ads by creating a rule.{' '}
            <a href="#" className="text-blue-600 hover:underline">Learn more</a>
          </div>

          {/* Rule Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rule name
            </label>
            <input
              type="text"
              placeholder="Rule name"
              value={rule.name}
              onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              required
            />
          </div>

          {/* Apply Rule to / Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apply rule to
              </label>
              <select
                value={rule.applyTo}
                onChange={(e) => setRule(prev => ({ ...prev, applyTo: e.target.value }))}
                className="input-field"
              >
                {applyToOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <select
                value={rule.action}
                onChange={(e) => setRule(prev => ({ ...prev, action: e.target.value }))}
                className="input-field"
                required
              >
                <option value="">Select an option</option>
                {actionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Your rule will apply to ad sets that are active at the time the rule runs.
            </p>
          </div>

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Conditions
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">ALL of the following match</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {rule.conditions?.map((condition, index) => (
                <div key={condition.id} className="flex items-center space-x-3">
                  <select
                    value={condition.metric}
                    onChange={(e) => handleConditionChange(condition.id, 'metric', e.target.value)}
                    className="input-field w-32"
                  >
                    {metricOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  
                  <select
                    value={condition.operator}
                    onChange={(e) => handleConditionChange(condition.id, 'operator', e.target.value)}
                    className="input-field w-40"
                  >
                    {operatorOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      placeholder="0.00"
                      value={condition.value}
                      onChange={(e) => handleConditionChange(condition.id, 'value', e.target.value)}
                      className="input-field pl-8"
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-lg">⋯</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleAddCondition()}
                    className="btn-primary"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add
                  </button>
                  
                  {rule.conditions && rule.conditions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(condition.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <RemoveIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time range
            </label>
            <select
              value={rule.timeRange}
              onChange={(e) => setRule(prev => ({ ...prev, timeRange: e.target.value }))}
              className="input-field"
            >
              {timeRangeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule
            </label>
            <div className="space-y-3">
              {scheduleOptions.map(option => (
                <label key={option} className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="schedule"
                    value={option}
                    checked={rule.schedule === option}
                    onChange={(e) => setRule(prev => ({ ...prev, schedule: e.target.value }))}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{option}</span>
                    <p className="text-sm text-gray-600">
                      {option === 'Continuously' && 'Rule runs as often as possible (usually every 30-60 minutes).'}
                      {option === 'Daily' && 'between 12:00 and 01:00 Eastern Time'}
                      {option === 'Custom' && 'Adjust rule schedule to run on specific days and specific times of the day. If the start and end time are the same, then the rule will run once per day within 30-60 minutes after the set time. All times are in Eastern Time'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notification */}
          <div>
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={rule.notification}
                onChange={(e) => setRule(prev => ({ ...prev, notification: e.target.checked }))}
                className="mt-1"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">On Facebook</span>
                <p className="text-sm text-gray-600">
                  You'll receive a notification when conditions for this rule have been met.
                </p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
