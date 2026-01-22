# Longevity AI

A digital AI platform for people who want to take care of their health to live longer, with easy, regular, structured guidance based on consolidated health data and the latest science, integrated and applied by AI.

## 🎯 MVP Features

- **📤 Blood Test Upload**: Upload PDF or photo of your blood test results
- **🤖 AI Analysis**: Automatic extraction and analysis of biomarkers
- **📊 Health Summary**: Get 3 top positive aspects and 3 priorities in plain language
- **⏰ Biological Age**: See your estimated biological age based on biomarkers
- **💡 Actionable Recommendations**: Receive 3 prioritized actions to improve your health

## 🚀 Technical Features

- **Modular Architecture**: Clean separation of concerns with organized folder structure
- **Mobile-First Design**: Responsive UI built with Tailwind CSS
- **Comprehensive Testing**: Vitest and React Testing Library for strict testing standards
- **Code Quality**: ESLint and Prettier for consistent code style
- **Performance Optimized**: Built with Vite for fast development and optimized production builds
- **Developer Experience**: Clear documentation and examples for junior developers
- **Privacy-First**: Zero-Retention model for sensitive health data

## 📋 Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Modern code editor (VS Code recommended)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd longevity
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
longevity/
├── public/
│   └── assets/          # Static assets (images, icons, fonts)
├── src/
│   ├── components/      # React components
│   │   ├── common/      # Shared/common components
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature-specific components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services and external integrations
│   ├── utils/           # Utility functions
│   ├── test/            # Test setup and utilities
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc          # Prettier configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies
```

## 🧪 Testing

Run tests with:
```bash
npm test              # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

## 📝 Code Quality

- **Linting**: `npm run lint` - Check for code issues
- **Formatting**: `npm run format` - Format code with Prettier
- **Type Checking**: `npm run type-check` - Check TypeScript types (if using TS)

## 🏗️ Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

Preview the production build:
```bash
npm run preview
```

## 📚 Documentation

- [MVP Specification](./docs/MVP_SPECIFICATION.md) - Complete MVP feature specification
- [Architecture Guide](./docs/ARCHITECTURE.md) - Detailed architecture documentation
- [Contributing Guidelines](./docs/CONTRIBUTING.md) - How to contribute to the project
- [Component Guidelines](./src/components/README.md) - Component development guidelines
- [Testing Guide](./docs/TESTING.md) - Testing standards and best practices
- [Quick Start Guide](./docs/QUICK_START.md) - Get started quickly
- [Performance Guide](./docs/PERFORMANCE.md) - Performance best practices

## 🎨 Styling

This project uses **Tailwind CSS** with a mobile-first approach. All styles should be written using Tailwind utility classes. Custom styles should be added to `src/index.css` using Tailwind's `@layer` directive.

## 🔐 Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the client code. Use the `env.js` utility module to access environment variables:

```javascript
import { getEnv, API_BASE_URL } from '@/utils/env'
```

See `env.example` for available environment variables.

## 📦 Assets

All static assets should be placed in `/public/assets/`:
- Images: `/public/assets/images/`
- Icons: `/public/assets/icons/`
- Fonts: `/public/assets/fonts/`

## 🤝 Contributing

Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues, please open an issue in the repository.
