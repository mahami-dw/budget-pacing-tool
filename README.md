# Budget Pacing Tool

A comprehensive web application for monitoring and managing advertising budgets across Google Ads and DV360 platforms. This tool provides real-time budget pacing, automated rule creation, and campaign management capabilities.

## Features

### 🎯 Budget Overview
- Real-time budget pacing visualization
- Daily spend vs budget tracking
- Platform breakdown charts
- Performance metrics dashboard

### 🔗 Platform Connections
- Google Ads integration via Google Ads Scripts API
- DV360 integration via Display & Video 360 API
- OAuth 2.0 authentication
- Real-time data synchronization

### 📊 Campaign Management
- Campaign performance monitoring
- Budget pacing alerts
- Status management (active/paused)
- Search and filtering capabilities

### ⚡ Automated Rules
- Custom rule creation for budget management
- Conditional logic for automated actions
- Scheduled rule execution
- Notification system

## Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts for data visualization
- **Icons**: Heroicons
- **Forms**: React Hook Form
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd budgetpacer-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

### Google Ads
- Uses Google Ads Scripts API for data access
- Supports campaign, ad set, and ad level data
- Real-time budget and performance metrics

### DV360 (Display & Video 360)
- Integrates with DV360 API
- Instant reporting for real-time data
- Campaign and line item management

## Project Structure

```
app/
├── components/
│   ├── BudgetOverview.tsx      # Budget dashboard and charts
│   ├── PlatformConnections.tsx # Platform connection management
│   ├── CampaignList.tsx        # Campaign listing and management
│   └── CreateRuleModal.tsx     # Automated rule creation
├── globals.css                 # Global styles and Tailwind config
├── layout.tsx                  # Root layout component
└── page.tsx                    # Main application page
```

## Key Components

### BudgetOverview
- Displays key metrics (total spend, budget, pacing)
- Interactive charts for spend vs budget
- Platform performance breakdown
- Time range selection

### PlatformConnections
- Platform connection status
- OAuth integration setup
- Data synchronization controls
- Connection troubleshooting

### CampaignList
- Campaign performance table
- Search and filtering
- Status management
- Performance metrics

### CreateRuleModal
- Automated rule creation
- Conditional logic builder
- Scheduling options
- Action configuration

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- Component-based architecture
- Responsive design principles

## Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-account management
- [ ] API rate limiting
- [ ] Data export functionality
- [ ] Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
