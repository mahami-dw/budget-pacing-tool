import { NextRequest, NextResponse } from 'next/server'
import { GoogleSheetsAPI, GoogleSheetsConfig } from '../../../../lib/google-sheets'

export async function GET(request: NextRequest) {
  try {
    // Get configuration from environment variables
    const config: GoogleSheetsConfig = {
      apiKey: process.env.GOOGLE_SHEETS_API_KEY!,
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID!,
    }

    // Validate configuration
    if (!config.apiKey || !config.spreadsheetId) {
      return NextResponse.json(
        { error: 'Google Sheets configuration missing' },
        { status: 500 }
      )
    }

    // Initialize Google Sheets API
    const googleSheetsAPI = new GoogleSheetsAPI(config)

    // Fetch campaign data
    const data = await googleSheetsAPI.fetchCampaignData()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error syncing Google Sheets data:', error)
    return NextResponse.json(
      { error: 'Failed to sync Google Sheets data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action parameter' },
        { status: 400 }
      )
    }

    // Get configuration from environment variables
    const config: GoogleSheetsConfig = {
      apiKey: process.env.GOOGLE_SHEETS_API_KEY!,
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID!,
    }

    // Initialize Google Sheets API
    const googleSheetsAPI = new GoogleSheetsAPI(config)

    let result: any

    switch (action) {
      case 'getAccountLinks':
        result = await googleSheetsAPI.fetchAccountLinks()
        break
      case 'getSpreadsheetInfo':
        result = await googleSheetsAPI.getSpreadsheetInfo()
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing Google Sheets request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
