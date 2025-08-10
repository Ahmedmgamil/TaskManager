# Task Manager App

A React Native + Expo task management application with productivity features and cross-platform support.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (for mobile testing)

### Installation & Setup
```bash
# Clone and navigate to project
cd TaskManagerApp

# Install dependencies
npm install

# Start development server
npm start

# Run on specific platforms
npm run android  # Android device/emulator
npm run ios      # iOS device/simulator  
npm run web      # Web browser
```

## 📱 Features

### Core Functionality
- **Task Management**: Create, edit, delete tasks with status tracking (To Do, In Progress, Done)
- **Organization**: Priority levels (Low/Medium/High), categories, tags, due dates
- **Views**: Task list with search/filter + Calendar view with task visualization
- **Productivity**: Time tracking, recurring tasks

### Cross-Platform Support
- **Mobile**: Native Android & iOS experience
- **Web**: Responsive web interface
- **Data Persistence**: Local storage with AsyncStorage

## 🛠️ Third-Party Libraries

| Library | Purpose |
|---------|---------|
| `expo` | Development platform and build tools |
| `@expo/vector-icons` | Icon library for UI elements |
| `@react-native-async-storage/async-storage` | Local data persistence |
| `react-native-web` | Web platform support |

## 📖 Usage Notes

- **Sample Data**: App loads with demo tasks on first launch
- **Calendar**: Tap dates to view/add tasks for specific days
- **Recurring Tasks**: Automatically creates new instances when completed

---

**Happy Task Managing! 🎯**