# 🚀 Budget Pacing Tool - Quick Start Guide

## 🎯 **What We've Built**

A professional budget pacing tool with:
- ✅ Beautiful, responsive UI
- ✅ Google Sheets integration (via your Google Ads script)
- ✅ Campaign management
- ✅ Automated rules engine
- ✅ Platform connections
- ✅ Real-time budget tracking

---

## 🚀 **Deploy to Production in 5 Steps**

### **Step 1: Google Sheets API Setup (5 minutes)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Sheets API
3. Create API key
4. Get your spreadsheet ID from the script URL

### **Step 2: Deploy to Vercel (5 minutes)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts
```

### **Step 3: Set Up Supabase (10 minutes)**
1. Create project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `DEPLOYMENT.md`
3. Copy your project URL and keys

### **Step 4: Configure Environment Variables (5 minutes)**
In Vercel Dashboard > Settings > Environment Variables:
```
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Step 5: Test & Launch (5 minutes)**
1. Visit your Vercel URL
2. Test Google Sheets connection
3. Verify data sync from your script
4. Share with your team!

---

## 🔧 **Local Development**

```bash
# Clone and setup
git clone <your-repo>
cd budgetpacer-frontend

# Run setup script
./scripts/setup.sh

# Start development
npm run dev
```

---

## 📚 **Key Files Created**

- `lib/google-sheets.ts` - Google Sheets API integration
- `app/api/google-sheets/sync/route.ts` - API endpoint for syncing data
- `DEPLOYMENT.md` - Detailed deployment guide
- `vercel.json` - Vercel configuration
- `env.example` - Environment variables template

---

## 🌟 **Features Ready to Use**

1. **Budget Overview Dashboard** - Real-time pacing visualization
2. **Campaign Management** - Pause/activate campaigns
3. **Platform Connections** - Google Sheets integration
4. **Automated Rules** - Custom budget management rules
5. **Performance Metrics** - Impressions, clicks, conversions

---

## 🔗 **How It Works**

1. **Your Google Ads Script** runs and exports data to Google Sheets
2. **Our App** reads the sheet via Google Sheets API
3. **Real-time Updates** show budget pacing and performance
4. **Automated Rules** can trigger actions based on conditions

---

## 🆘 **Need Help?**

- 📖 **Full Guide**: See `DEPLOYMENT.md`
- 🔧 **Setup Script**: Run `./scripts/setup.sh`
- 🌐 **Deploy**: Use `vercel` command
- 📧 **Support**: Check the troubleshooting section in `DEPLOYMENT.md`

---

**🎉 Your Budget Pacing Tool is production-ready with Google Sheets integration! Deploy today and start managing your advertising budgets like a pro!**
