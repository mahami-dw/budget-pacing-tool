'use client'

import { useState } from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface GoogleSheetsConnectionProps {
  onConnect: (spreadsheetId: string) => void
}

export default function GoogleSheetsConnection({ onConnect }: GoogleSheetsConnectionProps) {
  const [spreadsheetId, setSpreadsheetId] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleConnect = async () => {
    if (!spreadsheetId.trim()) return

    setIsConnecting(true)
    setConnectionStatus('idle')

    try {
      // Test the connection
      const response = await fetch('/api/google-sheets/sync', {
        method: 'POST',
        body: JSON.stringify({ action: 'getSpreadsheetInfo' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setConnectionStatus('success')
        onConnect(spreadsheetId)
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      setConnectionStatus('error')
    } finally {
      setIsConnecting(false)
    }
  }

  const extractSpreadsheetId = (url: string) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    return match ? match[1] : ''
  }

  const handleUrlInput = (url: string) => {
    const id = extractSpreadsheetId(url)
    setSpreadsheetId(id)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Budget Pacing Tool</h1>
          <p className="text-gray-600">Connect your Google Sheets to get started</p>
        </div>

        <div className="space-y-6">
          {/* Connection Status */}
          {connectionStatus === 'success' && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-green-800">Successfully connected to Google Sheets!</span>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <span className="text-red-800">Failed to connect. Please check your configuration.</span>
            </div>
          )}

          {/* Spreadsheet URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Sheets URL
            </label>
            <input
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              onChange={(e) => handleUrlInput(e.target.value)}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste the URL from your Google Ads script spreadsheet
            </p>
          </div>

          {/* Spreadsheet ID Display */}
          {spreadsheetId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spreadsheet ID
              </label>
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                className="input-field bg-gray-50"
                readOnly
              />
            </div>
          )}

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={!spreadsheetId.trim() || isConnecting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-orange-500 font-bold text-sm">G</span>
                </div>
                <span>Select Google Sheet</span>
              </>
            )}
          </button>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Make sure your Google Sheet is shared with "Anyone with the link can view"
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">© 2025 Budget Pacing Tool</p>
        </div>
      </div>
    </div>
  )
}
