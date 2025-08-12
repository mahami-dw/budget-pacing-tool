// Google Sheets Integration for Budget Pacing Tool
export interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
}

export interface CampaignData {
  accountName: string;
  campaignName: string;
  date: string;
  budget: string;
  dailyBudget: string;
  campaignType: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionValue: number;
}

export interface BudgetPacingData {
  campaigns: CampaignData[];
  totalSpend: number;
  totalBudget: number;
  lastSync: string;
  accountSummary: AccountSummary[];
}

export interface AccountSummary {
  accountName: string;
  totalBudget: number;
  totalSpend: number;
  pacing: number;
  campaignCount: number;
}

export class GoogleSheetsAPI {
  private config: GoogleSheetsConfig;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  async fetchCampaignData(): Promise<BudgetPacingData> {
    try {
      // Fetch data from the Campaigns tab
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/Campaigns?key=${this.config.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rows = data.values || [];

      if (rows.length < 2) {
        throw new Error('No campaign data found in sheet');
      }

      // Skip header row and parse data
      const campaigns: CampaignData[] = rows.slice(1).map((row: any[]) => ({
        accountName: row[0] || '',
        campaignName: row[1] || '',
        date: row[2] || '',
        budget: row[3] || '0',
        dailyBudget: row[4] || '0',
        campaignType: row[5] || '',
        impressions: parseInt(row[6]) || 0,
        clicks: parseInt(row[7]) || 0,
        cost: parseFloat(row[8]) || 0,
        conversions: parseFloat(row[9]) || 0,
        conversionValue: parseFloat(row[10]) || 0,
      }));

      // Calculate totals and account summaries
      const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.cost, 0);
      const totalBudget = campaigns.reduce((sum, campaign) => {
        const budget = parseFloat(campaign.budget) || 0;
        return sum + budget;
      }, 0);

      // Group by account for summary
      const accountMap = new Map<string, AccountSummary>();
      
      campaigns.forEach(campaign => {
        const accountName = campaign.accountName;
        const budget = parseFloat(campaign.budget) || 0;
        const cost = campaign.cost;

        if (accountMap.has(accountName)) {
          const existing = accountMap.get(accountName)!;
          existing.totalBudget += budget;
          existing.totalSpend += cost;
          existing.campaignCount += 1;
        } else {
          accountMap.set(accountName, {
            accountName,
            totalBudget: budget,
            totalSpend: cost,
            pacing: 0,
            campaignCount: 1,
          });
        }
      });

      // Calculate pacing for each account
      const accountSummary: AccountSummary[] = Array.from(accountMap.values()).map(account => ({
        ...account,
        pacing: account.totalBudget > 0 ? (account.totalSpend / account.totalBudget) * 100 : 0,
      }));

      return {
        campaigns,
        totalSpend,
        totalBudget,
        lastSync: new Date().toISOString(),
        accountSummary,
      };
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      throw error;
    }
  }

  async fetchAccountLinks(): Promise<any[]> {
    try {
      // Fetch data from the AccountIDs tab
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/AccountIDs?key=${this.config.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rows = data.values || [];

      if (rows.length < 2) {
        return [];
      }

      // Skip header row and parse data
      return rows.slice(1).map((row: any[]) => ({
        accountId: row[0] || '',
        accountName: row[1] || '',
        lastUpdated: row[2] || '',
        status: row[3] || '',
      }));
    } catch (error) {
      console.error('Error fetching account links:', error);
      return [];
    }
  }

  // Helper method to get spreadsheet metadata
  async getSpreadsheetInfo() {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}?key=${this.config.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        title: data.properties.title,
        sheets: data.sheets.map((sheet: any) => sheet.properties.title),
        lastModified: data.properties.modifiedTime,
      };
    } catch (error) {
      console.error('Error fetching spreadsheet info:', error);
      throw error;
    }
  }
}

// Mock data for development
export const mockGoogleSheetsData: BudgetPacingData = {
  campaigns: [
    {
      accountName: 'Main Account',
      campaignName: 'Q1 Brand Awareness Campaign',
      date: '2024-01-15',
      budget: '5000',
      dailyBudget: '166.67',
      campaignType: 'SEARCH',
      impressions: 150000,
      clicks: 2500,
      cost: 3200,
      conversions: 45,
      conversionValue: 4500,
    },
    {
      accountName: 'Main Account',
      campaignName: 'Display Remarketing Q1',
      date: '2024-01-15',
      budget: '8000',
      dailyBudget: '266.67',
      campaignType: 'DISPLAY',
      impressions: 200000,
      clicks: 1800,
      cost: 7200,
      conversions: 32,
      conversionValue: 3200,
    },
    {
      accountName: 'Secondary Account',
      campaignName: 'Search Conversion Q1',
      date: '2024-01-15',
      budget: '3000',
      dailyBudget: '100.00',
      campaignType: 'SEARCH',
      impressions: 75000,
      clicks: 1200,
      cost: 1500,
      conversions: 28,
      conversionValue: 2800,
    },
  ],
  totalSpend: 11900,
  totalBudget: 16000,
  lastSync: new Date().toISOString(),
  accountSummary: [
    {
      accountName: 'Main Account',
      totalBudget: 13000,
      totalSpend: 10400,
      pacing: 80.0,
      campaignCount: 2,
    },
    {
      accountName: 'Secondary Account',
      totalBudget: 3000,
      totalSpend: 1500,
      pacing: 50.0,
      campaignCount: 1,
    },
  ],
};
