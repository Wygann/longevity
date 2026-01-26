# Longevity AI MVP - Development Plan

**Target Deadline**: January 29, 2026  
**Team Size**: Small team (2-3 people)  
**Development Approach**: Phased development (3 phases)  
**Testing Strategy**: Comprehensive testing

---

## Phase 1: Core UI & Basic Functionality (HIGHEST PRIORITY)

**Goal**: Functional UI with file upload and results presentation using mock data  
**Timeline Estimate**: 4-6 weeks  
**Must Complete Before**: Moving to Phase 2

### Task Breakdown

#### 1.1 File Upload Component
**Priority**: Critical  
**Estimated Time**: 3-5 days  
**Dependencies**: None

**Tasks**:
- [ ] Create FileUpload component with drag-and-drop
- [ ] Implement file validation (type, size - 10MB limit)
- [ ] Add support for multiple file selection
- [ ] Add visual feedback during drag operations
- [ ] Implement error messages for invalid files
- [ ] Add file preview/confirmation display
- [ ] Write unit tests for FileUpload component
- [ ] Test on mobile devices

**Acceptance Criteria**:
- User can upload PDF, JPG, PNG, WebP files
- Multiple files can be selected/uploaded
- Clear error messages for invalid files
- Mobile-responsive interface

---

#### 1.2 Optional Chronological Age Input
**Priority**: High  
**Estimated Time**: 1 day  
**Dependencies**: 1.1 (needs upload page)

**Tasks**:
- [ ] Add optional age input field to upload page
- [ ] Implement age validation (1-120 years)
- [ ] Style input field consistently with design
- [ ] Add helper text explaining optional nature
- [ ] Write tests for age validation

**Acceptance Criteria**:
- Optional age field appears on upload page
- Validation works correctly
- Age is passed to analysis service

---

#### 1.3 Mock Analysis Service
**Priority**: Critical  
**Estimated Time**: 3-4 days  
**Dependencies**: None (can work in parallel)

**Tasks**:
- [ ] Create analysisService.js structure
- [ ] Implement mock biomarker generation
  - Include common Polish biomarkers (CBC, lipids, metabolic, inflammation, liver, kidney, thyroid, vitamins)
- [ ] Implement health summary generation (3 positives, 3 priorities)
- [ ] Implement biological age calculation (simplified scoring)
- [ ] Implement recommendation generation (3 prioritized actions)
- [ ] Add file parameter handling (for future AI integration)
- [ ] Add chronological age parameter handling
- [ ] Simulate processing time (1-3 seconds)
- [ ] Write unit tests for all service functions

**Acceptance Criteria**:
- Service returns structured JSON response
- All required data fields present
- Processing time simulation works
- Tests pass with good coverage

---

#### 1.4 Results Display Components
**Priority**: Critical  
**Estimated Time**: 5-7 days  
**Dependencies**: 1.3 (needs data structure)

**Tasks**:
- [ ] Create HealthSummary component
  - Display 3 positive aspects
  - Display 3 priorities
  - Visual indicators (colors, icons)
  - Plain language formatting
- [ ] Create BiologicalAge component
  - Prominent age display
  - Comparison with chronological age (if provided)
  - Visual representation
- [ ] Create Recommendations component
  - Display 3 recommendations
  - Show priority, action type, impact
  - Plain text examples format
- [ ] Create AnalysisProgress component
  - Simple spinner with message
  - Estimated time display
- [ ] Write component tests for all components
- [ ] Test responsive design on mobile

**Acceptance Criteria**:
- All components render correctly
- Data displays in correct format
- Mobile-responsive layout
- Tests pass

---

#### 1.5 Main Application Flow
**Priority**: Critical  
**Estimated Time**: 4-5 days  
**Dependencies**: 1.1, 1.2, 1.3, 1.4

**Tasks**:
- [ ] Integrate FileUpload into App.jsx
- [ ] Integrate AnalysisProgress for loading state
- [ ] Integrate all results components
- [ ] Implement state management for analysis flow
- [ ] Add error handling and error display
- [ ] Implement "Analyze Another Test" reset functionality
- [ ] Add minimal medical disclaimer
- [ ] Implement results display order (Summary → Age → Recommendations)
- [ ] Add success message after analysis
- [ ] Write integration tests for full flow

**Acceptance Criteria**:
- Complete user flow works: Upload → Analysis → Results
- Error states handled gracefully
- Reset functionality works
- All states transition correctly

---

#### 1.6 Styling & Mobile Optimization
**Priority**: High  
**Estimated Time**: 3-4 days  
**Dependencies**: 1.5 (needs components)

**Tasks**:
- [ ] Ensure mobile-first responsive design
- [ ] Test on various screen sizes
- [ ] Optimize touch targets (minimum 44x44px)
- [ ] Ensure readable text without zooming
- [ ] Test on real mobile devices
- [ ] Fix any layout issues

**Acceptance Criteria**:
- Works perfectly on mobile devices
- Responsive on all screen sizes
- Touch-friendly interactions

---

#### 1.7 Testing Phase 1
**Priority**: Critical  
**Estimated Time**: 5-7 days  
**Dependencies**: All Phase 1 tasks

**Tasks**:
- [ ] Write comprehensive unit tests
- [ ] Write integration tests for user flows
- [ ] Write component tests
- [ ] Manual testing on multiple devices
- [ ] Cross-browser testing
- [ ] Fix bugs found during testing
- [ ] Achieve target test coverage (>80% for critical paths)

**Acceptance Criteria**:
- All tests pass
- No critical bugs
- Good test coverage
- Works on major browsers

---

### Phase 1 Milestones

**Milestone 1.1**: File Upload Working (Week 1)
- File upload component complete
- Age input working

**Milestone 1.2**: Mock Analysis Complete (Week 2)
- Mock service returns correct data structure
- All components display data correctly

**Milestone 1.3**: End-to-End Flow Working (Week 3)
- Complete user journey functional
- Error handling in place

**Milestone 1.4**: Testing Complete (Week 4)
- All tests passing
- Ready for Phase 2

---

## Phase 2: AI Integration (HIGH PRIORITY)

**Goal**: Replace mock analysis with real AI integration for parsing and analysis  
**Timeline Estimate**: 6-8 weeks  
**Dependencies**: Phase 1 complete

### Task Breakdown

#### 2.1 Document Anonymization Pipeline
**Priority**: Critical  
**Estimated Time**: 5-7 days  
**Dependencies**: None (can start early)

**Tasks**:
- [ ] Research document parsing libraries (PDF.js, Tesseract.js, etc.)
- [ ] Create anonymization service
- [ ] Implement extraction of biomarkers only
- [ ] Implement extraction of demographics (age, weight, gender, test dates)
- [ ] Implement removal of personal identifiers
  - Remove names (patient, doctor, technician)
  - Remove ID numbers
  - Remove addresses (patient, institution)
- [ ] Create validation to ensure no personal data leaks
- [ ] Write tests for anonymization
- [ ] Document anonymization process

**Acceptance Criteria**:
- Personal data completely removed
- Only medical data extracted
- Validation catches any leaks
- Tests confirm anonymization

---

#### 2.2 AI Service Architecture Setup
**Priority**: Critical  
**Estimated Time**: 3-4 days  
**Dependencies**: None

**Tasks**:
- [ ] Set up OpenAI API integration
- [ ] Create API service layer
- [ ] Implement environment variable configuration
- [ ] Create error handling for API failures
- [ ] Implement retry logic for API calls
- [ ] Set up API key management (secure)
- [ ] Create fallback mechanism to mock service
- [ ] Write tests for API integration

**Acceptance Criteria**:
- API integration works
- Secure key management
- Graceful fallback to mock
- Error handling robust

---

#### 2.3 AI-Powered Biomarker Extraction
**Priority**: Critical  
**Estimated Time**: 8-10 days  
**Dependencies**: 2.1, 2.2

**Tasks**:
- [ ] Research best approach for PDF/image parsing
- [ ] Create prompt template for biomarker extraction
- [ ] Implement PDF text extraction
- [ ] Implement image OCR (if needed)
- [ ] Create structured prompt for OpenAI
- [ ] Implement JSON response parsing
- [ ] Handle common Polish lab formats (ALAB, Diagnostyka)
- [ ] Implement biomarker validation
- [ ] Handle missing biomarkers gracefully
- [ ] Test with various file formats and qualities
- [ ] Write tests for extraction

**Acceptance Criteria**:
- Extracts biomarkers from PDF files
- Extracts biomarkers from images
- Handles common Polish formats
- Validates extracted data
- Proceeds with available biomarkers

---

#### 2.4 AI-Powered Analysis & Recommendations
**Priority**: Critical  
**Estimated Time**: 7-9 days  
**Dependencies**: 2.3 (needs extracted biomarkers)

**Tasks**:
- [ ] Create structured prompt template for analysis
- [ ] Design prompt for health summary generation
  - 3 positives
  - 3 priorities
  - Plain language output
- [ ] Design prompt for biological age calculation
- [ ] Design prompt for recommendations
  - 3 prioritized actions
  - Moderately specific guidance
  - Active substance names (no brands)
  - 2 example products (if applicable)
- [ ] Implement JSON response structure
- [ ] Implement response parsing and validation
- [ ] Handle AI response errors
- [ ] Test with various biomarker combinations
- [ ] Refine prompts based on results
- [ ] Write tests for analysis service

**Acceptance Criteria**:
- AI generates accurate health summaries
- Biological age calculation works
- Recommendations are relevant
- Response format consistent
- Handles edge cases

---

#### 2.5 Biological Age Calculation Enhancement
**Priority**: High  
**Estimated Time**: 3-4 days  
**Dependencies**: 2.4

**Tasks**:
- [ ] Research validated biological age algorithms (PhenoAge, DunedinPACE)
- [ ] Implement hybrid approach
  - Start with simplified scoring
  - Switch to validated algorithm if biomarkers available
- [ ] Use all extracted biomarkers for calculation
- [ ] Test calculation accuracy
- [ ] Write tests for age calculation

**Acceptance Criteria**:
- Hybrid approach works
- Uses all available biomarkers
- Calculation is reasonable

---

#### 2.6 Integration & Fallback Testing
**Priority**: Critical  
**Estimated Time**: 5-7 days  
**Dependencies**: 2.3, 2.4, 2.5

**Tasks**:
- [ ] Integrate AI services into main app flow
- [ ] Test fallback to mock when AI fails
- [ ] Test with various file types and qualities
- [ ] Test error scenarios
- [ ] Performance testing (<60 seconds requirement)
- [ ] Test anonymization in real scenarios
- [ ] Fix integration issues
- [ ] Write integration tests

**Acceptance Criteria**:
- AI integration works end-to-end
- Fallback works seamlessly
- Performance meets requirements
- Error handling robust

---

#### 2.7 Testing Phase 2
**Priority**: Critical  
**Estimated Time**: 7-10 days  
**Dependencies**: All Phase 2 tasks

**Tasks**:
- [ ] Test with real blood test files (various formats)
- [ ] Test anonymization thoroughly
- [ ] Test AI response parsing
- [ ] Test fallback mechanisms
- [ ] Performance testing
- [ ] Load testing (if applicable)
- [ ] Security testing (data leaks)
- [ ] Fix bugs found
- [ ] Update documentation

**Acceptance Criteria**:
- All tests pass
- Real files processed correctly
- No data leaks
- Performance acceptable
- Ready for Phase 3

---

### Phase 2 Milestones

**Milestone 2.1**: Anonymization Working (Week 1)
- Personal data removed
- Medical data extracted

**Milestone 2.2**: AI Extraction Working (Week 3)
- Biomarkers extracted from files
- Validation working

**Milestone 2.3**: AI Analysis Working (Week 5)
- Health summary generated
- Recommendations generated

**Milestone 2.4**: Integration Complete (Week 7)
- End-to-end AI flow working
- Fallback tested

---

## Phase 3: Polish & Export Features (LOWER PRIORITY)

**Goal**: Complete MVP with translations and export functionality  
**Timeline Estimate**: 3-4 weeks  
**Dependencies**: Phase 2 complete (or can start in parallel if Phase 2 is stable)

### Task Breakdown

#### 3.1 Internationalization Setup
**Priority**: High  
**Estimated Time**: 2-3 days  
**Dependencies**: None (can start early)

**Tasks**:
- [ ] Choose i18n library (react-i18next recommended)
- [ ] Set up i18n configuration
- [ ] Create translation file structure
- [ ] Set up language detection
- [ ] Create language context/provider
- [ ] Write tests for i18n setup

**Acceptance Criteria**:
- i18n infrastructure ready
- Can switch between languages
- Tests pass

---

#### 3.2 Polish Translation
**Priority**: High  
**Estimated Time**: 5-7 days  
**Dependencies**: 3.1

**Tasks**:
- [ ] Translate all UI text to Polish
- [ ] Translate error messages
- [ ] Translate analysis results
- [ ] Translate recommendations
- [ ] Get medical terminology reviewed (if possible)
- [ ] Test translations for accuracy
- [ ] Ensure consistent terminology

**Acceptance Criteria**:
- All text translated
- Medical terms accurate
- Consistent language

---

#### 3.3 Language Selector Component
**Priority**: High  
**Estimated Time**: 2-3 days  
**Dependencies**: 3.1, 3.2

**Tasks**:
- [ ] Create language selector component
- [ ] Add to header/navigation (visible on all pages)
- [ ] Implement language switching
- [ ] Persist language preference (localStorage)
- [ ] Style language selector
- [ ] Test language switching

**Acceptance Criteria**:
- Language selector visible
- Switching works instantly
- Preference persists

---

#### 3.4 PDF Export Functionality
**Priority**: Medium  
**Estimated Time**: 5-7 days  
**Dependencies**: Phase 2 (needs results data)

**Tasks**:
- [ ] Choose PDF generation library (jsPDF, react-pdf, etc.)
- [ ] Design PDF layout
- [ ] Implement export of all results:
  - Health Summary
  - Biological Age
  - All 3 Recommendations
- [ ] Add professional formatting
- [ ] Add minimal disclaimer to PDF
- [ ] Implement export button
- [ ] Test PDF generation
- [ ] Test PDF on various devices

**Acceptance Criteria**:
- PDF exports correctly
- All results included
- Professional appearance
- Works on mobile

---

#### 3.5 Print Functionality
**Priority**: Medium  
**Estimated Time**: 2-3 days  
**Dependencies**: 3.4 (can reuse PDF styling)

**Tasks**:
- [ ] Create print stylesheet
- [ ] Optimize layout for printing
- [ ] Add print button
- [ ] Test print functionality
- [ ] Ensure all content prints correctly

**Acceptance Criteria**:
- Print works correctly
- Layout optimized for print
- All content visible

---

#### 3.6 Testing Phase 3
**Priority**: High  
**Estimated Time**: 3-4 days  
**Dependencies**: All Phase 3 tasks

**Tasks**:
- [ ] Test translations in both languages
- [ ] Test language switching
- [ ] Test PDF export
- [ ] Test print functionality
- [ ] Cross-browser testing
- [ ] Fix bugs
- [ ] Final polish

**Acceptance Criteria**:
- All features work
- No bugs
- Ready for launch

---

### Phase 3 Milestones

**Milestone 3.1**: Translations Complete (Week 1)
- Polish translation done
- Language switching works

**Milestone 3.2**: Export Working (Week 2)
- PDF export functional
- Print functional

**Milestone 3.3**: MVP Complete (Week 3-4)
- All features working
- Testing complete

---

## Risk Mitigation Tasks

### Risk A: AI Integration Complexity

**Mitigation Tasks**:
- [ ] Start with small scope AI integration (just biomarker extraction)
- [ ] Build robust mock fallback first (Phase 1)
- [ ] Test AI integration early with simple cases
- [ ] Document API requirements clearly
- [ ] Create detailed error handling
- [ ] Plan for API rate limits and costs
- [ ] Have backup plan if AI integration fails

**Timeline**: Throughout Phase 2

---

### Risk B: File Parsing Accuracy

**Mitigation Tasks**:
- [ ] Research best parsing libraries early
- [ ] Test with various file qualities early
- [ ] Start with most common Polish formats
- [ ] Implement comprehensive validation
- [ ] Allow users to retry with different files
- [ ] Test with real-world files
- [ ] Plan for edge cases

**Timeline**: Throughout Phase 2

---

## Testing Strategy

### Unit Tests
- All utility functions
- Service functions (analysis, biomarker processing)
- Component logic
- **Target Coverage**: >80% for critical paths

### Integration Tests
- File upload → analysis → results flow
- Multiple file upload and merging
- Error handling scenarios
- AI integration flow
- Fallback mechanisms

### Component Tests
- React components with React Testing Library
- User interactions
- Accessibility
- Language switching

### Manual Testing
- End-to-end user flows
- Mobile device testing
- Cross-browser testing
- Real file testing

### AI Testing
- Test with various file formats
- Validate anonymization
- Test response parsing
- Test fallback mechanisms
- Performance testing

---

## Timeline Summary

**Total Estimated Time**: 13-18 weeks

- **Phase 1**: 4-6 weeks
- **Phase 2**: 6-8 weeks
- **Phase 3**: 3-4 weeks
- **Buffer**: 2-3 weeks for unexpected issues

**Target Deadline**: January 29, 2026  
**Start Date**: Should begin by early October 2025 to have buffer

---

## Critical Path

1. Phase 1 must complete before Phase 2
2. Phase 2 AI integration is critical path (highest risk)
3. Phase 3 can start in parallel with Phase 2 if Phase 2 is stable
4. Testing is critical at end of each phase

---

## Dependencies

### External Dependencies
- OpenAI API access and credentials
- PDF parsing libraries
- i18n library
- PDF generation library

### Internal Dependencies
- Phase 1 → Phase 2 (must complete first)
- Phase 2 → Phase 3 (can start in parallel if stable)
- Anonymization → AI extraction
- AI extraction → AI analysis

---

## Success Metrics

### Phase 1 Success
- ✅ File upload works
- ✅ Mock analysis returns correct data
- ✅ All results display correctly
- ✅ Mobile-responsive

### Phase 2 Success
- ✅ Real AI extracts biomarkers
- ✅ AI generates accurate summaries
- ✅ Biological age calculation works
- ✅ Recommendations are relevant
- ✅ Fallback works

### Phase 3 Success
- ✅ Polish translation complete
- ✅ Language switching works
- ✅ PDF export works
- ✅ Print functionality works

### Overall MVP Success
- ✅ Functional end-to-end flow
- ✅ Real AI working (ideally)
- ✅ All features complete
- ✅ Ready for users

---

## Next Steps

1. Review and approve this plan
2. Set up project management tool (if using)
3. Assign team members to phases
4. Set up development environment
5. Begin Phase 1 tasks
6. Schedule regular checkpoints

---

**Plan Created**: Based on planning instructions  
**Status**: Ready for execution
