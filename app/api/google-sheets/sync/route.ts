import { NextRequest, NextResponse } from 'next/server'
import { GoogleSheetsAPI, GoogleSheetsConfig } from '@/lib/google-sheets'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'test') {
      return NextResponse.json({ success: true, message: 'Google Sheets API is working' })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
  } catch (error) {
    console.error('Google Sheets API GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, spreadsheetId } = body

    if (!spreadsheetId) {
      return NextResponse.json(
        { success: false, error: 'Spreadsheet ID is required' },
        { status: 400 }
      )
    }

    // Create a new instance with the provided spreadsheet ID
    const config: GoogleSheetsConfig = {
      apiKey: process.env.GOOGLE_SHEETS_API_KEY || '',
      spreadsheetId: spreadsheetId
    }

    const googleSheetsAPI = new GoogleSheetsAPI(config)

    switch (action) {
      case 'fetchCampaignData':
        const campaignData = await fetchCampaignData(googleSheetsAPI)
        return NextResponse.json({ success: true, data: campaignData })

      case 'getSpreadsheetInfo':
        const spreadsheetInfo = await googleSheetsAPI.getSpreadsheetInfo()
        return NextResponse.json({ success: true, data: spreadsheetInfo })

      case 'fetchAccountLinks':
        const accountLinks = await googleSheetsAPI.fetchAccountLinks()
        return NextResponse.json({ success: true, data: accountLinks })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Google Sheets API POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function fetchCampaignData(googleSheetsAPI: GoogleSheetsAPI) {
  try {
    // Fetch campaign data from Google Sheets
    const budgetData = await googleSheetsAPI.fetchCampaignData()
    
    // Process the data to create budget overview
    const processedData = processCampaignData(budgetData)
    
    return processedData
  } catch (error) {
    console.error('Error fetching campaign data:', error)
    throw new Error('Failed to fetch campaign data from Google Sheets')
  }
}

function processCampaignData(budgetData: any) {
  const { campaigns, totalSpend, totalBudget } = budgetData
  
  // Calculate pacing and remaining
  const pacing = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0
  const remaining = Math.max(0, totalBudget - totalSpend)

  // Group by platform (using account name as platform for now)
  const platformData = campaigns.reduce((acc: any, campaign: any) => {
    const platform = campaign.accountName || 'Unknown'
    if (!acc[platform]) {
      acc[platform] = { spend: 0, budget: 0 }
    }
    acc[platform].spend += campaign.cost || 0
    acc[platform].budget += parseFloat(campaign.budget) || 0
    return acc
  }, {})

  const platformBreakdown = Object.entries(platformData).map(([platform, data]: [string, any]) => ({
    platform,
    spend: data.spend,
    budget: data.budget
  }))

  // Create daily data (last 7 days)
  const dailyData = generateDailyData(campaigns)

  return {
    totalSpend,
    totalBudget,
    pacing,
    remaining,
    dailyData,
    platformBreakdown,
    campaignCount: campaigns.length
  }
}

function generateDailyData(campaigns: any[]) {
  const days = 7
  const dailyData = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Calculate spend for this day (simplified - in reality you'd have daily breakdown)
    const daySpend = campaigns.reduce((sum, campaign) => {
      const dailySpend = (campaign.cost || 0) / days
      return sum + dailySpend
    }, 0)
    
    const dayBudget = campaigns.reduce((sum, campaign) => {
      const dailyBudget = (parseFloat(campaign.budget) || 0) / days
      return sum + dailyBudget
    }, 0)

    dailyData.push({
      date: date.toISOString().split('T')[0],
      spend: Math.round(daySpend),
      budget: Math.round(dayBudget)
    })
  }

  return dailyData
}
