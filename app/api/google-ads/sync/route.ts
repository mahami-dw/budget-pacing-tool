import { NextRequest, NextResponse } from 'next/server'
import { GoogleAdsAPI, GoogleAdsConfig } from '../../../../lib/google-ads'

export async function GET(request: NextRequest) {
  try {
    // Get configuration from environment variables
    const config: GoogleAdsConfig = {
      clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
      customerId: process.env.GOOGLE_ADS_CUSTOMER_ID!,
    }

    // Validate configuration
    if (!config.clientId || !config.clientSecret || !config.developerToken || !config.refreshToken || !config.customerId) {
      return NextResponse.json(
        { error: 'Google Ads API configuration missing' },
        { status: 500 }
      )
    }

    // Initialize Google Ads API
    const googleAdsAPI = new GoogleAdsAPI(config)

    // Fetch campaign data
    const data = await googleAdsAPI.fetchCampaignData()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error syncing Google Ads data:', error)
    return NextResponse.json(
      { error: 'Failed to sync Google Ads data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { campaignId, status } = await request.json()

    if (!campaignId || !status) {
      return NextResponse.json(
        { error: 'Missing campaignId or status' },
        { status: 400 }
      )
    }

    // Get configuration from environment variables
    const config: GoogleAdsConfig = {
      clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
      customerId: process.env.GOOGLE_ADS_CUSTOMER_ID!,
    }

    // Initialize Google Ads API
    const googleAdsAPI = new GoogleAdsAPI(config)

    // Update campaign status
    const success = await googleAdsAPI.updateCampaignStatus(campaignId, status)

    if (success) {
      return NextResponse.json({ message: 'Campaign status updated successfully' })
    } else {
      return NextResponse.json(
        { error: 'Failed to update campaign status' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating campaign status:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign status' },
      { status: 500 }
    )
  }
}
