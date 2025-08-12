// Google Ads API Integration
export interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  developerToken: string;
  refreshToken: string;
  customerId: string;
}

export interface GoogleAdsData {
  campaigns: Campaign[];
  totalSpend: number;
  totalBudget: number;
  lastSync: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'ENABLED' | 'PAUSED' | 'REMOVED';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
}

export class GoogleAdsAPI {
  private config: GoogleAdsConfig;

  constructor(config: GoogleAdsConfig) {
    this.config = config;
  }

  async getAccessToken(): Promise<string> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.config.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();
    return data.access_token;
  }

  async fetchCampaignData(): Promise<GoogleAdsData> {
    try {
      const accessToken = await this.getAccessToken();
      
      // Google Ads Query Language (GAQL) query
      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.campaign_budget,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions,
          metrics.cost_micros
        FROM campaign 
        WHERE segments.date DURING LAST_30_DAYS
      `;

      const response = await fetch(
        `https://googleads.googleapis.com/v14/customers/${this.config.customerId}/googleAds:searchStream`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'developer-token': this.config.developerToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Ads API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the response to our format
      const campaigns: Campaign[] = data.results?.map((result: any) => ({
        id: result.campaign.id,
        name: result.campaign.name,
        status: result.campaign.status,
        budget: result.campaign.campaignBudget ? parseFloat(result.campaign.campaignBudget) : 0,
        spend: result.metrics.costMicros ? parseFloat(result.metrics.costMicros) / 1000000 : 0,
        impressions: parseInt(result.metrics.impressions) || 0,
        clicks: parseInt(result.metrics.clicks) || 0,
        conversions: parseFloat(result.metrics.conversions) || 0,
        startDate: new Date().toISOString().split('T')[0], // You can get this from campaign.startDate if available
        endDate: new Date().toISOString().split('T')[0], // You can get this from campaign.endDate if available
      })) || [];

      const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
      const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);

      return {
        campaigns,
        totalSpend,
        totalBudget,
        lastSync: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching Google Ads data:', error);
      throw error;
    }
  }

  async updateCampaignStatus(campaignId: string, status: 'ENABLED' | 'PAUSED'): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(
        `https://googleads.googleapis.com/v14/customers/${this.config.customerId}/campaigns:mutate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'developer-token': this.config.developerToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operations: [{
              update: {
                resourceName: `customers/${this.config.customerId}/campaigns/${campaignId}`,
                status: status,
              },
              updateMask: 'status',
            }],
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error updating campaign status:', error);
      return false;
    }
  }
}

// Mock data for development
export const mockGoogleAdsData: GoogleAdsData = {
  campaigns: [
    {
      id: '123456789',
      name: 'Q1 Brand Awareness Campaign',
      status: 'ENABLED',
      budget: 5000,
      spend: 3200,
      impressions: 150000,
      clicks: 2500,
      conversions: 45,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    },
    {
      id: '987654321',
      name: 'Search Conversion Q1',
      status: 'PAUSED',
      budget: 3000,
      spend: 1500,
      impressions: 75000,
      clicks: 1200,
      conversions: 28,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    },
  ],
  totalSpend: 4700,
  totalBudget: 8000,
  lastSync: new Date().toISOString(),
};
