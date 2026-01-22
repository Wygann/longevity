# Contributing Guidelines

Thank you for your interest in contributing to the Longevity project! This document provides guidelines and standards for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the project's coding standards

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the project standards
4. Write or update tests
5. Ensure all tests pass: `npm test`
6. Ensure linting passes: `npm run lint`
7. Format your code: `npm run format`
8. Commit your changes (see commit message guidelines)
9. Push to your fork: `git push origin feature/your-feature-name`
10. Create a Pull Request

## Development Workflow

### Before Starting

1. Read the [Architecture Guide](./ARCHITECTURE.md)
2. Check existing issues and PRs
3. Discuss major changes in an issue first

### During Development

1. **Write Clean Code**
   - Follow the existing code style
   - Write self-documenting code
   - Add JSDoc comments for functions and components
   - Keep functions small and focused

2. **Write Tests**
   - Write tests for new features
   - Maintain or improve test coverage
   - Test user interactions, not implementation

3. **Follow Mobile-First**
   - Design for mobile first
   - Test on mobile devices or emulators
   - Ensure responsive behavior

4. **Documentation**
   - Update README if needed
   - Add comments for complex logic
   - Update architecture docs for structural changes

## Code Standards

### JavaScript/React

- Use functional components with hooks
- Use descriptive variable and function names
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Keep custom CSS to a minimum
- Use semantic class names when needed

### File Naming

- Components: `PascalCase.jsx` (e.g., `UserProfile.jsx`)
- Utilities: `camelCase.js` (e.g., `formatDate.js`)
- Hooks: `camelCase.js` with "use" prefix (e.g., `useLocalStorage.js`)
- Tests: `ComponentName.test.jsx`

### Comments

- Write comments in English
- Explain "why", not "what"
- Use JSDoc for functions and components
- Keep comments up to date

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(components): add Button component with variants

Add a reusable Button component with primary, secondary, and outline variants.
Includes comprehensive tests and documentation.

fix(utils): correct date formatting for edge cases

test(hooks): add tests for useLocalStorage hook
```

## Pull Request Process

1. **Title**: Clear, descriptive title
2. **Description**: 
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots (if UI changes)

3. **Checklist**:
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] All tests pass
   - [ ] Linting passes
   - [ ] No console errors or warnings

4. **Review**: 
   - Address review comments
   - Keep PR focused and small when possible
   - Respond to feedback promptly

## Testing Requirements

- All new features must have tests
- Bug fixes must include regression tests
- Maintain or improve test coverage
- Tests should be readable and maintainable

## Documentation

- Update README for user-facing changes
- Update architecture docs for structural changes
- Add JSDoc comments for new functions/components
- Keep examples up to date

## Questions?

If you have questions:
1. Check existing documentation
2. Search existing issues
3. Create a new issue with the "question" label

Thank you for contributing! 🎉
