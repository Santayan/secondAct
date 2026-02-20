# SecondAct

> **The stage is yours. Again.**
> A mid-career mentorship platform connecting career changers with mentors who made the exact same transition.

---

## About

SecondAct helps mid-career professionals navigate industry transitions by matching them with personalised mentor personas and providing curated expert resources. The app is built with privacy, accessibility, and a premium user experience in mind.

**Core features:**
- 🤝 Personalised mentor matching based on your career transition
- 💬 Mentor chat with realistic, contextual responses
- 🌐 Community forum — share posts, like, and comment with peers
- 📚 Curated expert resources + a personalised career guide generator
- 👤 Editable user profile with bio and career preferences
- 🔒 GDPR/CCPA-compliant Privacy Policy
- ♿ WCAG 2.1 AA accessible (axe audit: 1 violation resolved)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (custom design system) |
| Database & Auth | [Supabase](https://supabase.com) |
| Mentor Chat | [MiniMax API](https://api.minimax.io) |
| Routing | React Router v6 |
| Icons | Lucide React |
| Password Security | bcryptjs |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/secondAct.git
cd secondAct
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root (this file is gitignored and **must never be committed**):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MINIMAX_API_KEY=your_minimax_api_key
VITE_MINIMAX_API_BASE=https://api.minimax.io/v1
VITE_MINIMAX_MODEL=MiniMax-M2.5
```

You can get your Supabase credentials from your [Supabase project dashboard](https://supabase.com/dashboard) and your MiniMax key from [MiniMax API console](https://api.minimax.io).

### 4. Set up the database

Run `update_profiles_schema.sql` in the **Supabase SQL Editor** to create all required tables and Row Level Security (RLS) policies:

```
supabase dashboard → SQL Editor → paste contents of update_profiles_schema.sql → Run
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable anon key |
| `VITE_MINIMAX_API_KEY` | MiniMax API key for mentor chat & guide generation |
| `VITE_MINIMAX_API_BASE` | MiniMax API base URL (default: `https://api.minimax.io/v1`) |
| `VITE_MINIMAX_MODEL` | MiniMax model name (default: `MiniMax-M2.5`) |

> ⚠️ **Important:** Never commit your `.env.local` file. It is already listed in `.gitignore`.

---

## Database Schema

The app uses the following Supabase tables:

- `profiles` — user account info, career transition details, bio
- `mentor_assignments` — links users to their matched mentor personas
- `messages` — persisted chat messages between users and mentors
- `posts` — community forum posts
- `comments` — comments on community posts
- `post_likes` — likes on community posts

Run `update_profiles_schema.sql` to create all tables, indexes, and RLS policies.

---

## Project Structure

```
src/
├── context/         # AppContext — global auth, user state, mentor matching
├── data/            # curatedResources.js — static expert content library
├── pages/
│   ├── Auth/        # Login & Signup pages
│   ├── Dashboard/
│   │   └── components/   # Matches, Messages, Community, Profile, Resources
│   ├── LandingPage.jsx
│   └── PrivacyPolicy.jsx
├── utils/
│   ├── minimaxClient.js  # MiniMax API calls (mentor gen, chat, career guide)
│   └── supabaseClient.js # Supabase client init
└── index.css        # Global design system
```

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## Deployment

This app can be deployed to **Vercel** or **Netlify** with zero configuration.

### Vercel (recommended)

1. Push the repo to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add each variable from `.env.local` in the Vercel **Environment Variables** settings
4. Deploy

**Build settings** (Vercel auto-detects these):
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

---

## Privacy & Security

- Passwords are hashed with **bcrypt** (saltRounds: 10)
- All database tables are protected with **Supabase Row Level Security (RLS)** policies
- A full **Privacy Policy** page is available in-app at `/privacy`
- WCAG 2.1 AA accessibility verified via axe audit

---

## License

MIT
