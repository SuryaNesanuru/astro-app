# AstroSuite Pro - Professional Astrology Software

A comprehensive, production-ready web-based astrology platform supporting Vedic, KP, and Western systems with advanced calculations, beautiful charts, and professional features.

## 🌟 Features

### Core Astrology Systems
- **Vedic Astrology**: Complete Vedic calculations with multiple ayanamshas
- **Krishnamurti Paddhati (KP)**: Advanced KP system with sub-lords and significators
- **Western Astrology**: Traditional Western calculations with modern house systems
- **Multiple Ayanamshas**: Lahiri, Raman, Krishnamurti, Yukteshwar, Pushya

### Chart Types & Visualizations
- **North Indian Charts**: Traditional diamond-shaped Vedic charts
- **South Indian Charts**: Grid-based Vedic charts
- **Western Wheel Charts**: Circular natal charts with aspect lines
- **Divisional Charts**: D1, D2, D3, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60
- **Enhanced Chart Wheel**: Interactive SVG charts with zoom, rotation, and planet selection

### Advanced Calculations
- **Ephemeris**: High-accuracy planetary positions (Swiss Ephemeris ready)
- **House Systems**: Placidus, Whole House, Koch, Porphyrius, Equal
- **Aspects**: Western aspects (0°, 60°, 90°, 120°, 180°) with orbs
- **Vedic Aspects**: Traditional Vedic aspect calculations
- **Vimshottari Dasha**: 4-level dasha system with tree visualization
- **Transits & Progressions**: Current planetary influences and secondary progressions

### Specialized Tools
- **Panchang Calculator**: Daily tithi, nakshatra, yoga, karana, auspicious timings
- **Dosha Calculators**: Sade Sati, Kuja Dosha, Kalasarpa Dosha, Mangal Dosha
- **KP Significators**: House and planet significators for KP system
- **Aspect Tables**: Comprehensive aspect analysis with applying/separating indicators

### User Experience
- **Multi-language Support**: English, Hindi, Tamil, Telugu, Kannada, Malayalam
- **Theme System**: Light, dark, and system theme with persistent preferences
- **Responsive Design**: Mobile-first design with touch-friendly interactions
- **Keyboard Shortcuts**: Power user features for efficient navigation
- **Print & Export**: Professional chart layouts for printing and sharing

### Technical Features
- **Real-time Calculations**: Instant chart generation with caching
- **Timezone Handling**: Automatic DST detection and IANA timezone resolution
- **Geocoding**: Place search with automatic coordinate resolution
- **Data Persistence**: Save charts, user preferences, and calculation history
- **API Integration**: RESTful API for external integrations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/astro-suite-pro.git
   cd astro-suite-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/astrosuite"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **State Management**: Zustand for client state
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **Charts**: SVG-based with D3 utilities
- **Internationalization**: next-intl for multi-language support

### Project Structure
```
astro-app/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── chart/             # Chart creation and viewing
│   ├── dashboard/         # Main dashboard
│   ├── calculators/       # Astrological calculators
│   ├── transits/          # Transit analysis
│   └── panchang/          # Daily panchang
├── components/            # React components
│   ├── chart/            # Chart visualization components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── calculators/      # Calculator components
├── lib/                  # Utility libraries
│   ├── calculations/     # Astrological calculations
│   ├── store/           # State management
│   └── utils/           # Helper functions
└── prisma/               # Database schema and migrations
```

## 📊 Usage Guide

### Creating a New Chart

1. **Navigate to Dashboard**
   - Click "New Chart" from the main dashboard
   - Or use the `/chart/new` route

2. **Enter Birth Details**
   - Person information (name, gender, notes)
   - Birth date and time (with timezone)
   - Birth location (place name or coordinates)

3. **Select System & Options**
   - Choose astrology system (Vedic, Western, KP)
   - Select ayanamsha (for Vedic/KP)
   - Choose house system
   - Pick chart style

4. **Generate Chart**
   - Click "Generate Chart" to calculate
   - View results in the chart workspace

### Chart Analysis

1. **Chart Visualization**
   - Switch between North Indian, South Indian, and Western styles
   - Use zoom and rotation controls
   - Click planets for detailed information
   - Toggle aspects and house divisions

2. **Data Tables**
   - Planetary positions with degrees and houses
   - Aspect analysis with orbs and influences
   - House cusps and lords
   - KP significators (for KP system)

3. **Dasha Analysis**
   - View Vimshottari dasha periods
   - Navigate through mahadasha, bhukti, antar, and sukshma
   - Jump to current period or specific dates

### Using Calculators

1. **Sade Sati Calculator**
   - Enter birth details
   - View current Saturn transit status
   - See upcoming Sade Sati periods

2. **Dosha Calculators**
   - Check for Kuja, Kalasarpa, and Mangal doshas
   - View severity levels and remedies
   - Get personalized recommendations

3. **Panchang Calculator**
   - Select any date for daily panchang
   - View tithi, nakshatra, yoga, and karana
   - Check auspicious and inauspicious timings

### Transit Analysis

1. **Current Transits**
   - View planetary positions for any date
   - Analyze transit aspects to natal chart
   - Check progression calculations

2. **Transit Timeline**
   - See upcoming major transits
   - Plan important events accordingly
   - Track planetary movements

## 🔧 Configuration

### Ayanamsha Settings
```typescript
const ayanamshas = {
  lahiri: 23.85,      // Most commonly used
  raman: 22.5,        // Raman's calculation
  krishnamurti: 23.9, // KP system standard
  yukteshwar: 22.4,   // Yukteshwar's calculation
  pushya: 23.9        // Pushya paksha based
}
```

### House Systems
- **Placidus**: Most popular Western system
- **Whole House**: Equal house divisions
- **Koch**: Topocentric house system
- **Porphyrius**: Equal house divisions
- **Equal**: 30° house divisions

### Aspect Orbs
```typescript
const aspectOrbs = {
  conjunction: 8,    // 0° ± 8°
  sextile: 6,        // 60° ± 6°
  square: 8,         // 90° ± 8°
  trine: 8,          // 120° ± 8°
  opposition: 8      // 180° ± 8°
}
```

## 🌐 Internationalization

### Supported Languages
- **English** (en): Primary language
- **Hindi** (hi): हिंदी
- **Tamil** (ta): தமிழ்
- **Telugu** (te): తెలుగు
- **Kannada** (kn): ಕನ್ನಡ
- **Malayalam** (ml): മലയാളം

### Adding New Languages
1. Add language code to `lib/internationalization/messages.ts`
2. Create message translations
3. Update language selector in components
4. Test RTL support if needed

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Calculation functions and utilities
- **Component Tests**: React component rendering
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Complete user workflows

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```env
# Production
NODE_ENV=production
DATABASE_URL="your-production-db-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative deployment option
- **Self-hosted**: Docker container deployment

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write comprehensive tests
- Document new features
- Follow atomic design principles

## 📚 API Documentation

### Chart Calculation Endpoint
```http
POST /api/compute/natal
Content-Type: application/json

{
  "birthDateTime": "1990-01-01T12:00:00Z",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "timezone": "Asia/Kolkata",
  "system": "vedic",
  "ayanamsha": "lahiri",
  "houseSystem": "placidus",
  "placeName": "New Delhi, India"
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "planets": [...],
    "houses": [...],
    "aspects": [...],
    "ascendant": {...}
  },
  "metadata": {
    "system": "vedic",
    "ayanamsha": "lahiri",
    "calculatedAt": "2024-01-01T12:00:00Z"
  }
}
```

## 🔒 Security & Privacy

### Data Protection
- User data encryption at rest
- Secure API endpoints with rate limiting
- Input validation and sanitization
- CORS protection and security headers

### Authentication
- NextAuth.js with multiple providers
- JWT token management
- Session security
- Password hashing with bcrypt

## 📈 Performance

### Optimization Features
- Server-side calculations for accuracy
- Client-side caching for responsiveness
- Lazy loading of chart components
- Optimized SVG rendering
- Database query optimization

### Monitoring
- Performance metrics tracking
- Error logging and reporting
- User analytics (anonymized)
- Cache hit rate monitoring

## 🆘 Support

### Documentation
- [User Guide](docs/user-guide.md)
- [API Reference](docs/api-reference.md)
- [Calculation Methods](docs/calculations.md)
- [Troubleshooting](docs/troubleshooting.md)

### Community
- [GitHub Issues](https://github.com/yourusername/astro-suite-pro/issues)
- [Discussions](https://github.com/yourusername/astro-suite-pro/discussions)
- [Wiki](https://github.com/yourusername/astro-suite-pro/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Swiss Ephemeris for astronomical calculations
- Traditional Vedic and Western astrology texts
- Open source community contributions
- Beta testers and user feedback

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core chart calculations
- ✅ Basic chart visualizations
- ✅ User authentication
- ✅ Multi-language support

### Phase 2 (Next)
- 🔄 Advanced transit calculations
- 🔄 Compatibility matching
- 🔄 Mobile app development
- 🔄 API rate limiting

### Phase 3 (Future)
- 📋 Machine learning predictions
- 📋 Social features
- 📋 Professional tools
- 📋 Enterprise features

---

**AstroSuite Pro** - Empowering astrologers with professional-grade tools and calculations.

*Built with ❤️ for the astrology community*
#   a s t r o - a p p  
 