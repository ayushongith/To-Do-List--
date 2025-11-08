# TaskFlow - Modern To-Do List App

A feature-rich, modern to-do list application built with React, TypeScript, Vite, Firebase, and TailwindCSS.

## Features

- **User Authentication**: Email/password and Google OAuth sign-in
- **Real-time Sync**: Cloud-based task synchronization with Firebase Firestore
- **Dark/Light Mode**: System-aware theme with manual toggle
- **Task Management**:
  - Create, edit, delete, and archive tasks
  - Subtasks support
  - Priority levels (low, medium, high)
  - Due dates
  - Color labels
  - Drag-and-drop reordering
- **Lists**: Organize tasks into custom lists with colors
- **Search & Filters**: Filter by priority, status, date, and labels
- **Statistics Dashboard**: Visual charts and productivity metrics
- **Offline Support**: PWA with offline-first architecture
- **Responsive Design**: Mobile-friendly with glassmorphism UI
- **Notifications**: Browser push notifications (FCM ready)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **UI Components**: Radix UI + Lucide Icons
- **Backend**: Firebase (Auth, Firestore, FCM)
- **Drag & Drop**: dnd-kit
- **Charts**: Chart.js + react-chartjs-2
- **PWA**: vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd "to do list  8 nov"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Create a Firebase project
   - Enable Authentication (Email/Password and Google providers)
   - Create a Firestore database
   - (Optional) Enable Firebase Cloud Messaging for push notifications

4. **Configure environment variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase configuration:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

5. **Deploy Firestore security rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```
   (See `firestore.rules` for the security rules)

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** and navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add environment variables in Vercel dashboard

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Firestore Data Structure

```
users/{userId}
  - email: string
  - displayName: string
  - photoURL: string
  - theme: 'light' | 'dark' | 'system'
  - notificationPreferences: object
  - createdAt: timestamp

lists/{listId}
  - userId: string
  - title: string
  - color: string
  - orderIndex: number
  - archived: boolean
  - createdAt: timestamp
  - updatedAt: timestamp

tasks/{taskId}
  - userId: string
  - listId: string
  - title: string
  - description: string
  - priority: 'low' | 'medium' | 'high'
  - dueAt: timestamp
  - labels: array
  - completed: boolean
  - archived: boolean
  - orderIndex: number
  - subtasks: array
  - createdAt: timestamp
  - updatedAt: timestamp
```

## PWA Installation

Users can install the app on their devices:
- **Desktop**: Click the install button in the browser address bar
- **Mobile**: Use "Add to Home Screen" from the browser menu

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.
