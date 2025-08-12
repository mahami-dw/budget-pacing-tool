'use client'

import { useState } from 'react'

interface GoogleSheetsConnectionProps {
  onConnected: () => void
}

export default function GoogleSheetsConnection({ onConnected }: GoogleSheetsConnectionProps) {
  const [sheetUrl, setSheetUrl] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const extractSpreadsheetId = (url: string) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    return match ? match[1] : null
  }

  const handleConnect = async () => {
    if (!sheetUrl.trim()) {
      setErrorMessage('Please enter a Google Sheets URL')
      return
    }

    const spreadsheetId = extractSpreadsheetId(sheetUrl)
    if (!spreadsheetId) {
      setErrorMessage('Invalid Google Sheets URL. Please make sure it\'s a valid Google Sheets link.')
      return
    }

    setIsConnecting(true)
    setConnectionStatus('connecting')
    setErrorMessage('')

    try {
      // Simulate API call to test connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store the spreadsheet ID (in a real app, you'd save this to your backend)
      localStorage.setItem('googleSheetsId', spreadsheetId)
      
      setConnectionStatus('success')
      setTimeout(() => {
        onConnected()
      }, 1500)
    } catch (error) {
      setConnectionStatus('error')
      setErrorMessage('Failed to connect. Please check your URL and try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">How to connect:</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Open your Google Sheets with Google Ads campaign data</li>
          <li>Copy the URL from your browser's address bar</li>
          <li>Paste it below and click "Connect Google Sheets"</li>
        </ol>
      </div>

      {/* Connection Form */}
      <div className="space-y-4">
        <div>
          <label htmlFor="sheetUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Google Sheets URL
          </label>
          <input
            type="url"
            id="sheetUrl"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isConnecting}
          />
        </div>

        {errorMessage && (
          <div className="text-red-600 text-sm">{errorMessage}</div>
        )}

        <button
          onClick={handleConnect}
          disabled={isConnecting || !sheetUrl.trim()}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
            isConnecting || !sheetUrl.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isConnecting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            'Connect Google Sheets'
          )}
        </button>
      </div>

      {/* Status Messages */}
      {connectionStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium">Successfully connected! Loading your data...</span>
          </div>
        </div>
      )}

      {connectionStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 font-medium">Connection failed. Please try again.</span>
          </div>
        </div>
      )}
    </div>
  )
}
