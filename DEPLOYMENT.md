# 🚀 Budget Pacing Tool - Deployment Guide

## 📋 **Prerequisites**

- Node.js 18+ installed
- Git repository set up
- Google Sheets API access
- Vercel account (free tier available)
- Supabase account (free tier available)

---

## 🔐 **Phase 1: Google Sheets API Setup**

### **Step 1: Enable Google Sheets API**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create API credentials

### **Step 2: Create API Key**
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key
4. (Optional) Restrict the API key to Google Sheets API only

### **Step 3: Get Spreadsheet ID**
1. From your Google Ads script, note the spreadsheet URL:
   ```
   https://docs.google.com/spreadsheets/d/1zCSe8nVCf5pKNZzCJVaSnqIEsxwDNCZie4dbz5P9xSo/edit
   ```
2. Extract the spreadsheet ID: `1zCSe8nVCf5pKNZzCJVaSnqIEsxwDNCZie4dbz5P9xSo`

### **Step 4: Share Spreadsheet**
1. Make sure your Google Sheet is accessible via API
2. Set sharing to "Anyone with the link can view" (for API access)
3. Or use service account authentication for more security

---

## 🌐 **Phase 2: Deploy to Vercel**

### **Step 1: Prepare for Deployment**
```bash
# Build the project locally
npm run build

# Test the build
npm run start
```

### **Step 2: Deploy to Vercel**
1. **Option A: Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Option B: Vercel Dashboard**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will auto-deploy on every push

### **Step 3: Configure Environment Variables**
In Vercel Dashboard > Your Project > Settings > Environment Variables:
```
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
```

---

## 🗄️ **Phase 3: Supabase Database Setup**

### **Step 1: Create Supabase Project**
1. Go to [Supabase](https://supabase.com/)
2. Create new project
3. Note your project URL and anon key

### **Step 2: Set Up Database Schema**
Run this SQL in Supabase SQL Editor:

```sql
-- Create tables for budget pacing data
CREATE TABLE platform_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_type VARCHAR(50) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'disconnected',
  config JSONB,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_id UUID REFERENCES platform_connections(id),
  external_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  spend DECIMAL(10,2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE budget_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  apply_to VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  conditions JSONB NOT NULL,
  time_range VARCHAR(50) NOT NULL,
  schedule VARCHAR(50) NOT NULL,
  notification BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_campaigns_platform_id ON campaigns(platform_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_budget_rules_active ON budget_rules(is_active);
```

### **Step 3: Configure Supabase Environment Variables**
In Vercel Dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🔧 **Phase 4: API Routes Setup**

### **Step 1: API Routes Created**
The following API routes are already set up:

1. **`app/api/google-sheets/sync/route.ts`** - Sync Google Sheets data
2. **`app/api/campaigns/route.ts`** - CRUD operations for campaigns
3. **`app/api/platforms/route.ts`** - Platform connection management
4. **`app/api/rules/route.ts`** - Automated rules management

### **Step 2: Test API Endpoints**
```bash
# Test locally
curl http://localhost:3000/api/google-sheets/sync

# Test in production
curl https://your-domain.vercel.app/api/google-sheets/sync
```

---

## 🚀 **Phase 5: Production Deployment**

### **Step 1: Final Build & Deploy**
```bash
# Commit all changes
git add .
git commit -m "Production ready with Google Sheets integration"
git push origin main

# Vercel will auto-deploy
```

### **Step 2: Verify Deployment**
1. Check Vercel deployment status
2. Test all functionality in production
3. Verify Google Sheets API integration
4. Check database connections

### **Step 3: Set Up Custom Domain (Optional)**
1. In Vercel Dashboard > Domains
2. Add your custom domain
3. Configure DNS records
4. Enable HTTPS

---

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Google Sheets API Errors**
   - Check API key is correct
   - Verify API is enabled in Google Cloud Console
   - Ensure spreadsheet is accessible via API
   - Check spreadsheet ID is correct

2. **Vercel Deployment Issues**
   - Check build logs
   - Verify environment variables
   - Check Node.js version compatibility

3. **Supabase Connection Issues**
   - Verify project URL and keys
   - Check database permissions
   - Ensure RLS policies are configured

### **Debug Commands:**
```bash
# Check build locally
npm run build

# Check environment variables
echo $GOOGLE_SHEETS_API_KEY

# Test database connection
npm run db:test
```

---

## 📚 **Next Steps**

1. **Monitor Performance**: Set up Vercel Analytics
2. **Error Tracking**: Integrate Sentry or similar
3. **Backup Strategy**: Set up Supabase backups
4. **Scaling**: Plan for increased usage
5. **Security**: Implement rate limiting and API key rotation

---

## 🆘 **Support**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Google Sheets API**: [developers.google.com/sheets/api](https://developers.google.com/sheets/api)

---

**🎉 Congratulations! Your Budget Pacing Tool is now production-ready with Google Sheets integration!**
