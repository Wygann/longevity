# Testing Instructions

## Running Tests

Since npm is not available in this environment, here are instructions for running tests locally:

### Prerequisites

1. **Install Node.js and npm** (if not already installed):
   - Download from: https://nodejs.org/
   - Or use a version manager like nvm

2. **Install Dependencies**:
   ```bash
   cd /Users/radek/Desktop/Longevity_Repo/longevity
   npm install
   ```

### Running Tests

#### Run All Tests
```bash
npm test
```

#### Run Tests Once (No Watch Mode)
```bash
npm test -- --run
```

#### Run Tests with UI
```bash
npm run test:ui
```

#### Run Tests with Coverage Report
```bash
npm run test:coverage
```

#### Run Specific Test File
```bash
npm test -- HealthSummary.test.jsx
```

### Expected Test Results

After running tests, you should see:

**Component Tests**:
- ✅ HealthSummary.test.jsx - ~9 tests
- ✅ BiologicalAge.test.jsx - ~9 tests  
- ✅ Recommendations.test.jsx - ~10 tests
- ✅ AnalysisProgress.test.jsx - ~6 tests
- ✅ ErrorBoundary.test.jsx - Basic tests
- ✅ FileUpload.test.jsx - Existing tests
- ✅ Button.test.jsx - Existing tests

**Service Tests**:
- ✅ analysisService.test.js - ~20+ tests
- ✅ env.test.js - Existing tests

**Integration Tests**:
- ✅ App.integration.test.jsx - ~6 tests
- ✅ App.test.jsx - Existing tests

### Troubleshooting

#### If tests fail:

1. **Check for syntax errors**:
   ```bash
   npm run lint
   ```

2. **Check test setup**:
   - Verify `src/test/setup.js` exists
   - Verify `vitest.config.js` is configured correctly

3. **Check imports**:
   - All test files should import from correct paths
   - Mock functions should be set up correctly

4. **Common issues**:
   - Missing `afterEach` cleanup
   - Timer mocks not properly reset
   - Async/await not handled correctly

### Test Coverage Goals

- **Target**: >80% coverage for critical paths
- **Component tests**: >80% coverage
- **Service tests**: >90% coverage (business logic)
- **Integration tests**: Cover all user flows

### Manual Testing Checklist

After automated tests pass:

- [ ] Test file upload on desktop (drag-and-drop)
- [ ] Test file upload on mobile (touch)
- [ ] Test multiple file upload
- [ ] Test age input validation
- [ ] Test complete flow: Upload → Analysis → Results
- [ ] Test error scenarios
- [ ] Test reset functionality
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Verify responsive design on various screen sizes

---

**Note**: If you encounter any test failures, please share the error messages and I can help fix them.
