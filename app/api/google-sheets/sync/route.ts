import { NextRequest, NextResponse } from 'next/server'
import { GoogleSheetsAPI } from '@/lib/google-sheets'

const googleSheetsAPI = new GoogleSheetsAPI()

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

    switch (action) {
      case 'fetchCampaignData':
        const campaignData = await fetchCampaignData(spreadsheetId)
        return NextResponse.json({ success: true, data: campaignData })

      case 'getSpreadsheetInfo':
        const spreadsheetInfo = await googleSheetsAPI.getSpreadsheetInfo(spreadsheetId)
        return NextResponse.json({ success: true, data: spreadsheetInfo })

      case 'fetchAccountLinks':
        const accountLinks = await googleSheetsAPI.fetchAccountLinks(spreadsheetId)
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

async function fetchCampaignData(spreadsheetId: string) {
  try {
    // Fetch campaign data from Google Sheets
    const campaignData = await googleSheetsAPI.fetchCampaignData(spreadsheetId)
    
    // Process the data to create budget overview
    const processedData = processCampaignData(campaignData)
    
    return processedData
  } catch (error) {
    console.error('Error fetching campaign data:', error)
    throw new Error('Failed to fetch campaign data from Google Sheets')
  }
}

function processCampaignData(campaignData: any[]) {
  // Calculate totals
  const totalSpend = campaignData.reduce((sum, campaign) => sum + (campaign.spend || 0), 0)
  const totalBudget = campaignData.reduce((sum, campaign) => sum + (campaign.budget || 0), 0)
  const pacing = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0
  const remaining = Math.max(0, totalBudget - totalSpend)

  // Group by platform
  const platformData = campaignData.reduce((acc, campaign) => {
    const platform = campaign.platform || 'Unknown'
    if (!acc[platform]) {
      acc[platform] = { spend: 0, budget: 0 }
    }
    acc[platform].spend += campaign.spend || 0
    acc[platform].budget += campaign.budget || 0
    return acc
  }, {} as Record<string, { spend: number; budget: number }>)

  const platformBreakdown = Object.entries(platformData).map(([platform, data]) => ({
    platform,
    spend: data.spend,
    budget: data.budget
  }))

  // Create daily data (last 7 days)
  const dailyData = generateDailyData(campaignData)

  return {
    totalSpend,
    totalBudget,
    pacing,
    remaining,
    dailyData,
    platformBreakdown,
    campaignCount: campaignData.length
  }
}

function generateDailyData(campaignData: any[]) {
  const days = 7
  const dailyData = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Calculate spend for this day (simplified - in reality you'd have daily breakdown)
    const daySpend = campaignData.reduce((sum, campaign) => {
      const dailySpend = (campaign.spend || 0) / days
      return sum + dailySpend
    }, 0)
    
    const dayBudget = campaignData.reduce((sum, campaign) => {
      const dailyBudget = (campaign.budget || 0) / days
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
