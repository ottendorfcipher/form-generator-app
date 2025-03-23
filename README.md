# Form Generator App

A powerful, cross-platform desktop application built with Electron and Vue.js that allows users to create, manage, and export custom forms with various input types. Designed for businesses and organizations that need a flexible, offline-capable form creation solution.

![Form Generator App Screenshot](https://via.placeholder.com/800x400?text=Form+Generator+App)

## Overview

Form Generator App simplifies the process of creating custom forms, collecting responses, and exporting data. Whether you're conducting surveys, creating application forms, or gathering customer feedback, this desktop application provides a complete solution that works even without an internet connection.

## Features

- **Intuitive Form Builder**
  - Create custom forms with multiple question types
  - Drag-and-drop interface for rearranging questions
  - Real-time form preview as you build

- **Multiple Question Types**
  - Text inputs
  - Long-text areas
  - Number inputs
  - Email inputs with validation
  - Checkboxes (multiple choice)
  - Radio buttons (single choice)
  - Select dropdowns
  - Date pickers

- **Advanced Configuration**
  - Mark questions as required or optional
  - Add custom validation rules
  - Configure question order and appearance
  - Set conditional logic between questions

- **Form Management**
  - Export form configuration to JSON
  - Import form configuration from JSON
  - Save multiple form templates
  - Organize forms with tagging and categories

- **Data Export Options**
  - Export form responses to Excel spreadsheets
  - Generate PDF documents of completed forms
  - Save form results locally
  - Batch export multiple form responses

- **Desktop Application Benefits**
  - Works offline - no internet connection required
  - Enhanced security with local data storage
  - Native desktop notifications
  - Cross-platform compatibility (Windows, macOS, Linux)
  - Automatic updates

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/form-generator-app.git
cd form-generator-app

# Install dependencies
npm install

# Run the app in development mode
npm run electron:serve

# Or build the app for your platform
npm run electron:build
```

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- npm or [Yarn](https://yarnpkg.com/)

### Available Scripts

```bash
# Start the Electron app with hot-reload
npm run electron:serve

# Compile and minify for production
npm run electron:build

# Run unit tests
npm run test:unit

# Run end-to-end tests
npm run test:e2e

# Lint and fix files
npm run lint
```

## Building and Distribution

### Building for Different Platforms

The app can be built for Windows, macOS, and Linux:

```bash
# Build for your current platform
npm run electron:build

# Build for specific platforms
npm run electron:build -- --win --mac --linux

# Build for macOS
npm run electron:build -- --mac

# Build for Windows
npm run electron:build -- --win

# Build for Linux
npm run electron:build -- --linux
```

### Installer Output

After running the build command, you'll find platform-specific installers in the `dist_electron/` directory:

- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage`, `.deb`, and `.rpm` packages

## Using the App

### Creating Forms

1. Launch the application
2. Navigate to the "Create Form" section
3. Add questions using the question type toolbar
4. Configure each question's properties
5. Save your form template

### Exporting Data

The app supports exporting form data in multiple formats:

- **Excel (.xlsx)**: Perfect for data analysis and reporting
- **JSON (.json)**: For data interchange and backup

To export:
1. Navigate to the "Forms" section
2. Select a form with responses
3. Click the "Export" button
4. Choose your preferred format
5. Select a save location

## Project Structure

```
.
├── public/                  # Static assets
├── src/                     # Source code
│   ├── assets/              # Image and style assets
│   ├── background.js        # Electron main process
│   ├── components/          # Vue components
│   ├── views/               # Vue views/pages
│   ├── router/              # Vue Router configuration
│   ├── store/               # Vuex store modules
│   ├── App.vue              # Root component
│   └── main.js              # Vue application entry point
├── tests/                   # Test files
├── .electron-vue/           # Electron build configuration
└── package.json             # Project dependencies and scripts
```

## Contributing

Contributions are welcome and appreciated! Here's how you can contribute:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

Please make sure your code follows the existing style and includes appropriate tests.

### Coding Standards

- Follow the Vue.js style guide
- Write meaningful commit messages
- Update documentation for any new features
- Add tests for new functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/form-generator-app/issues) on GitHub.
