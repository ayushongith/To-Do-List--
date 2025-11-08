# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable **Email/Password**
   - Enable **Google**
4. Create **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Deploy security rules (see step 5)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Web" icon to add a web app
   - Copy the config values

### 3. Configure Environment Variables

Create `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Deploy Firestore Security Rules

Install Firebase CLI if you haven't:
```bash
npm install -g firebase-tools
```

Login and initialize:
```bash
firebase login
firebase init firestore
```

Select your project and use the existing `firestore.rules` file.

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 What's Included

### Core Features
- ✅ User authentication (Email/Password + Google OAuth)
- ✅ Real-time cloud sync with Firestore
- ✅ Dark/Light/System theme toggle
- ✅ Task management with subtasks
- ✅ Priority levels (low, medium, high)
- ✅ Due dates and color labels
- ✅ Drag-and-drop task reordering
- ✅ Custom lists with colors
- ✅ Search and advanced filters
- ✅ Archive functionality
- ✅ Statistics dashboard with charts
- ✅ Offline support (PWA)
- ✅ Mobile-responsive design
- ✅ Glassmorphism UI with smooth animations

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **UI**: Radix UI + Lucide Icons
- **Backend**: Firebase (Auth, Firestore)
- **Charts**: Chart.js
- **Drag & Drop**: dnd-kit
- **PWA**: vite-plugin-pwa

## 🎨 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CreateListDialog.tsx
│   ├── CreateTaskDialog.tsx
│   ├── FilterPanel.tsx
│   ├── StatsPanel.tsx
│   ├── TaskCard.tsx
│   └── TaskList.tsx
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   ├── TaskContext.tsx
│   ├── ThemeContext.tsx
│   └── ToastContext.tsx
├── lib/               # Utilities and configs
│   └── firebase.ts
├── pages/             # Page components
│   ├── Dashboard.tsx
│   └── LoginPage.tsx
├── routes/            # Routing
│   └── AppRouter.tsx
├── types/             # TypeScript types
│   └── index.ts
├── App.tsx            # Root component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🔥 Firebase Setup Details

### Firestore Collections

The app uses these collections:

1. **users/{userId}**
   - Stores user profiles and preferences

2. **lists/{listId}**
   - Custom task lists with colors

3. **tasks/{taskId}**
   - Tasks with all metadata (priority, labels, subtasks, etc.)

### Security Rules

The `firestore.rules` file ensures:
- Users can only read/write their own data
- All operations require authentication
- Data validation at the database level

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Netlify

1. Build: `npm run build`
2. Deploy the `dist` folder
3. Add environment variables in Netlify dashboard

### Firebase Hosting

```bash
npm run build
firebase init hosting
firebase deploy --only hosting
```

## 🔧 Customization

### Change Theme Colors

Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        // ... other shades
      }
    }
  }
}
```

### Add More Features

The codebase is modular and easy to extend:
- Add new contexts in `src/contexts/`
- Create new components in `src/components/`
- Add new pages in `src/pages/`

## 🐛 Troubleshooting

### "Module not found" errors
Run `npm install` to install all dependencies.

### Firebase errors
- Check your `.env.local` file has correct values
- Ensure Firebase project is properly configured
- Verify Firestore security rules are deployed

### Build errors
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version (requires 18+)

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Support

For issues or questions:
1. Check the README.md
2. Review Firebase console for backend issues
3. Check browser console for frontend errors

## 📝 License

MIT License - Free to use for personal and commercial projects.
