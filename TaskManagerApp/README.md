# Task Manager App

A comprehensive task management application built with React Native and Expo, featuring advanced productivity tools and an intuitive user interface.

## 🚀 Features

### Core Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Task Status Tracking**: To Do, In Progress, Done status management
- **Priority Levels**: Low, Medium, High priority with visual indicators
- **Due Dates**: Set deadlines with overdue highlighting
- **Categories & Tags**: Organize tasks with colored categories and custom tags
- **Task Descriptions**: Add detailed descriptions to tasks

### Advanced Features
- **Search & Filter**: Find tasks quickly with search and advanced filtering
- **Sorting Options**: Sort by priority, due date, creation date, or title
- **Recurring Tasks**: Set up daily, weekly, or monthly recurring tasks
- **Time Tracking**: Estimate and track actual time spent on tasks
- **Pomodoro Timer**: Integrated timer for focused work sessions

### Views & Navigation
- **Task List View**: Comprehensive list with all task details
- **Calendar View**: Monthly calendar with task visualization
- **Bottom Tab Navigation**: Easy switching between views
- **Modal Interfaces**: Smooth task creation and editing experience

### User Experience
- **Clean UI**: Modern, intuitive interface with visual feedback
- **Responsive Design**: Optimized for different screen sizes
- **Pull to Refresh**: Easy data refreshing
- **Empty States**: Helpful guidance when no tasks are present
- **Error Handling**: Graceful error management with user feedback

## 📱 Screenshots

The app features a clean, modern interface with:
- Task cards with status indicators and priority levels
- Calendar view with task dots for quick overview
- Comprehensive task creation form with all options
- Integrated Pomodoro timer with statistics
- Search and filter functionality

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Expo CLI (install globally: `npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone or download the project**
   ```bash
   cd TaskManagerApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on your device**
   - Install the Expo Go app on your phone
   - Scan the QR code displayed in the terminal or browser
   - The app will load on your device

### Alternative Running Methods

- **iOS Simulator**: `npm run ios` (requires macOS and Xcode)
- **Android Emulator**: `npm run android` (requires Android Studio)
- **Web Browser**: `npm run web`

## 📦 Dependencies

### Core Dependencies
- **expo**: ~51.0.0 - React Native framework
- **react**: 18.2.0 - Core React library
- **react-native**: 0.74.0 - React Native framework

### UI & Navigation
- **@expo/vector-icons**: Icon library for React Native
- **react-native-modal**: Enhanced modal component
- **react-native-calendars**: Calendar component for date selection
- **@react-native-community/datetimepicker**: Date and time picker
- **@react-native-picker/picker**: Picker component for selections

### Storage & State Management
- **@react-native-async-storage/async-storage**: Local storage solution
- Custom hooks for state management (useTasks)

### Additional Features
- **react-native-paper**: Material Design components (optional)
- **expo-notifications**: Push notifications support (for future implementation)

## 🏗️ Project Structure

```
TaskManagerApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── TaskItem.js     # Individual task display
│   │   ├── TaskForm.js     # Task creation/editing form
│   │   ├── PomodoroTimer.js # Pomodoro timer component
│   │   └── Navigation.js    # Bottom tab navigation
│   ├── screens/            # Main app screens
│   │   ├── TaskListScreen.js # Main task list view
│   │   └── CalendarScreen.js # Calendar view
│   ├── hooks/              # Custom React hooks
│   │   └── useTasks.js     # Task management hook
│   ├── utils/              # Utility functions
│   │   └── taskUtils.js    # Task-related helper functions
│   └── constants/          # App constants
│       └── taskConstants.js # Task status, priorities, categories
├── App.js                  # Main app component
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🎯 How to Use

### Creating Tasks
1. Tap the "+" button in the header or on the calendar
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Priority level
   - Category
   - Due date
   - Tags
   - Estimated time
   - Recurring options

### Managing Tasks
- **Change Status**: Tap the status icon to cycle through To Do → In Progress → Done
- **Edit Task**: Tap the pencil icon to modify task details
- **Delete Task**: Tap the trash icon (with confirmation)

### Using Filters
1. Tap the filter icon in the task list
2. Choose sorting options (priority, due date, etc.)
3. Filter by status, priority, or other criteria
4. Use the search bar for text-based filtering

### Calendar View
- Switch to the calendar tab to see tasks by date
- Tap on dates to view tasks for that day
- Add tasks directly to specific dates
- See task indicators as colored dots

### Pomodoro Timer
1. Tap the red timer button (floating action button)
2. Start a 25-minute work session
3. Take 5-minute breaks between sessions
4. After 4 sessions, take a longer 15-minute break
5. Time is automatically logged to tasks when available

## 🔧 Customization

### Adding New Categories
Edit `src/constants/taskConstants.js` to add new task categories:
```javascript
TASK_CATEGORIES: {
  YOUR_CATEGORY: { id: 'your_category', name: 'Your Category', color: '#color' }
}
```

### Modifying Colors
Update the color constants in `taskConstants.js` to match your preferred theme.

### Extending Functionality
The app uses a modular structure, making it easy to add new features:
- Add new screens in the `screens/` directory
- Create reusable components in `components/`
- Extend the `useTasks` hook for new task operations

## 🚧 Future Enhancements

- **Push Notifications**: Remind users of upcoming due dates
- **Task Dependencies**: Link tasks that depend on each other
- **Team Collaboration**: Share tasks with team members
- **Data Export**: Export tasks to CSV or other formats
- **Dark Mode**: Toggle between light and dark themes
- **Drag & Drop**: Reorder tasks with drag and drop
- **Subtasks**: Break down large tasks into smaller ones

## 🐛 Troubleshooting

### Common Issues

1. **App won't start**
   - Ensure all dependencies are installed: `npm install`
   - Clear Expo cache: `expo start -c`

2. **Calendar not displaying**
   - Check that `react-native-calendars` is properly installed
   - Restart the development server

3. **Storage issues**
   - Clear app data in Expo Go
   - Check AsyncStorage permissions

### Getting Help
- Check the Expo documentation: https://docs.expo.dev/
- React Native documentation: https://reactnative.dev/
- File issues or questions in the project repository

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with Expo and React Native
- Icons provided by @expo/vector-icons
- Calendar functionality by react-native-calendars
- UI inspiration from modern task management apps

---

**Happy Task Managing! 🎯**