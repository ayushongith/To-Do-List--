<div align="center">
  <h1>✨ TaskFlow ✨</h1>
  <p><strong>Your Modern, Intuitive Task Management Solution</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![GitHub stars](https://img.shields.io/github/stars/yourusername/taskflow?style=social)](https://github.com/yourusername/taskflow/stargazers)

  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Firebase-9-FFCA28?logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwind-css" alt="TailwindCSS" />

  <p align="center">
    <img src="./public/logo192.png" alt="TaskFlow Logo" width="120" />
  </p>
</div>

## 🚀 Features

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
  <div>
    <h3>📱 Task Management</h3>
    <ul>
      <li>✅ Create, edit, and delete tasks</li>
      <li>📅 Set due dates and priorities</li>
      <li>🏷️ Add labels and categories</li>
      <li>📝 Subtasks support</li>
    </ul>
  </div>
  
  <div>
    <h3>🌐 Cloud Sync</h3>
    <ul>
      <li>☁️ Real-time updates with Firebase</li>
      <li>🔒 Secure authentication</li>
      <li>📱 Access from any device</li>
      <li>🔄 Offline support</li>
    </ul>
  </div>
  
  <div>
    <h3>🎨 Beautiful UI</h3>
    <ul>
      <li>🌓 Dark/Light mode</li>
      <li>📱 Fully responsive design</li>
      <li>🎨 Modern glassmorphism UI</li>
      <li>⚡ Smooth animations</li>
    </ul>
  </div>
</div>

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore)
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Drag & Drop**: dnd-kit

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account ([Get Started for Free](https://firebase.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Create a Firestore database

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the values in `.env.local` with your Firebase config.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view in your browser.

## 📦 Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Ftaskflow)

1. Push your code to GitHub
2. Import the repository to Vercel
3. Add your Firebase environment variables
4. Deploy! 🚀

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tooling
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS
- [Firebase](https://firebase.google.com/) for the backend services
- [Lucide](https://lucide.dev/) for the beautiful icons
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
