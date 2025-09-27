# VenueSync - Music Ven

VenueSync is a comprehensive B2B SaaS platform that connects artists with venue managers for live event bookings. Built with Next.js 14, Supabase, and modern web technologies.

## 🚀 Features

### For Artists
- **Artist Profiles**: Create detailed profiles with Spotify integration
- **Venue Discovery**: Browse and search venues by location, capacity, and type
- **Booking Requests**: Submit booking requests to venues
- **Analytics Dashboard**: Track performance metrics and fan demographics
- **Real-time Notifications**: Get notified about booking status changes

### For Venue Managers
- **Venue Management**: Create and manage venue profiles with images
- **Artist Discovery**: Find artists by genre, popularity, and location
- **Booking Management**: Review and manage booking requests
- **Calendar Integration**: Track availability and prevent conflicts
- **Revenue Analytics**: Monitor booking performance and revenue

### For Administrators
- **User Management**: Manage users, roles, and permissions
- **Platform Analytics**: Monitor platform health and usage
- **Content Moderation**: Review and approve content
- **System Monitoring**: Track performance and errors

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS 4.1.9, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Deployment**: Azure Static Web Apps
- **Integrations**: Spotify API, Google OAuth
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Spotify Developer account
- Google Cloud Console account (for OAuth)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/venuesync.git
cd venuesync
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Spotify Configuration
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# OAuth Redirect URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000/auth/callback

# Production URLs (for deployment)
# NEXT_PUBLIC_SITE_URL=https://venuesync.live
# NEXT_PUBLIC_REDIRECT_URL=https://venuesync.live/auth/callback
```

### 4. Database Setup

Run the SQL scripts in the `scripts/` directory to set up your database:

```sql
-- Run these in your Supabase SQL editor
\i scripts/001_create_tables.sql
\i scripts/002_seed_data.sql
\i scripts/003_add_notifications.sql
```

### 5. Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄 Database Schema

### Core Tables

- **profiles**: User profiles with role-based access
- **venues**: Venue information and details
- **artists**: Artist profiles with Spotify integration
- **bookings**: Booking requests and management
- **notifications**: Real-time notification system

### Key Features

- **Row Level Security (RLS)**: Secure data access
- **Real-time Subscriptions**: Live updates
- **Automated Notifications**: Database triggers
- **Audit Logging**: Track all changes

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Authentication with Google and Spotify providers
3. Set up OAuth redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://venuesync.live/auth/callback`
4. Run the database migration scripts
5. Configure RLS policies

### Spotify Integration

1. Create a Spotify app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://venuesync.live/auth/callback`
3. Configure scopes: `user-read-email user-read-private user-top-read`
4. Add your client ID and secret to environment variables

### Google OAuth

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs
5. Configure in Supabase Auth settings

## 🚀 Deployment

### Azure Static Web Apps

1. **Fork the repository** to your GitHub account
2. **Create Azure Static Web App**:
   - Go to Azure Portal
   - Create Static Web App resource
   - Connect to your GitHub repository
   - Configure build settings

3. **Configure Environment Variables**:
   - Add production environment variables
   - Update OAuth redirect URLs
   - Configure Supabase for production

4. **Deploy**:
   - Push to main branch triggers deployment
   - Monitor deployment in Azure Portal

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
venuesync/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── venues/            # Venue pages
│   ├── artists/           # Artist pages
│   └── bookings/          # Booking pages
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── analytics/         # Analytics components
│   ├── artist/            # Artist components
│   ├── booking/           # Booking components
│   ├── navigation/        # Navigation components
│   ├── notifications/    # Notification components
│   ├── ui/               # UI components
│   └── venue/            # Venue components
├── lib/                   # Utility libraries
│   └── supabase/         # Supabase client configuration
├── scripts/              # Database scripts
├── public/               # Static assets
└── styles/              # Global styles
```

## 🔐 Security Features

- **Authentication**: Supabase Auth with OAuth providers
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row Level Security (RLS)
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Built-in Next.js protection
- **Rate Limiting**: API rate limiting
- **Content Security Policy**: Strict CSP headers

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

## 📊 Performance

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Supabase query caching
- **CDN**: Azure Static Web Apps CDN
- **Bundle Analysis**: Built-in Next.js analyzer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.venuesync.live](https://docs.venuesync.live)
- **Issues**: [GitHub Issues](https://github.com/your-username/venuesync/issues)
- **Discord**: [VenueSync Community](https://discord.gg/venuesync)

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Payment integration (Stripe)
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Advanced search filters
- [ ] Real-time chat system
- [ ] Video call integration

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icons
- [Vercel](https://vercel.com/) - Deployment platform

---

**Built with ❤️ for the music industry**
