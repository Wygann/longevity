# Quick Start Guide

Get up and running with the Longevity project in minutes.

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp env.example .env
```

Edit `.env` with your configuration values.

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Check code for issues |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |

## Project Structure Overview

```
src/
├── components/     # React components
│   ├── common/     # Reusable components (Button, Input, etc.)
│   ├── layout/     # Layout components
│   └── features/   # Feature-specific components
├── hooks/          # Custom React hooks
├── services/       # API services
├── utils/          # Utility functions
└── test/           # Test setup
```

## Next Steps

1. Read the [Architecture Guide](./ARCHITECTURE.md) to understand the project structure
2. Check out [Contributing Guidelines](./CONTRIBUTING.md) for development standards
3. Review [Testing Guide](./TESTING.md) for testing practices
4. Explore example components in `src/components/common/`

## Common Tasks

### Creating a New Component

1. Create component file: `src/components/common/MyComponent.jsx`
2. Create test file: `src/components/common/MyComponent.test.jsx`
3. Add JSDoc comments
4. Write tests
5. Use in your app

### Adding a New Utility Function

1. Create utility file: `src/utils/myUtility.js`
2. Add JSDoc comments
3. Create test file: `src/utils/myUtility.test.js`
4. Export from utility file

### Adding Environment Variables

1. Add to `env.example`
2. Add to `.env` (local)
3. Use via `src/utils/env.js`:

```javascript
import { getEnv } from '@/utils/env'
const apiUrl = getEnv('API_BASE_URL', 'http://localhost:3000')
```

## Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will automatically try the next available port.

### Module Not Found

Run `npm install` to ensure all dependencies are installed.

### Linting Errors

Run `npm run lint:fix` to automatically fix most issues.

## Getting Help

- Check existing documentation in `/docs`
- Review example code in `/src/components/common`
- Open an issue for bugs or questions

Happy coding! 🚀
