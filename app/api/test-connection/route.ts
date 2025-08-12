import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY
    const hasApiKey = !!apiKey
    
    return NextResponse.json({
      success: true,
      hasApiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      message: hasApiKey 
        ? 'API key is configured' 
        : 'API key is missing - please add GOOGLE_SHEETS_API_KEY to Vercel environment variables'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
