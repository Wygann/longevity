# Longevity AI MVP Specification

## Product Vision

Longevity AI is a digital AI platform designed for individuals who want to proactively manage their health to extend their lifespan. The platform provides easy, regular, structured guidance based on consolidated relevant health and habit data, integrated with the latest scientific research and applied through AI.

## MVP Scope

The MVP focuses on the core user journey: from uploading blood test results to receiving actionable health insights.

---

## Feature 1: Blood Test Results Upload

### User Story
As a user, I want to upload my blood test results as a PDF document or photo, so that the system can analyze my biomarkers automatically.

### Requirements
- **File Upload Component**
  - Support PDF file upload
  - Support image upload (JPG, PNG, WebP)
  - Drag-and-drop interface
  - File validation (size, format)
  - Visual feedback during upload
  - Progress indicator

### Acceptance Criteria
- [ ] User can upload PDF files up to 10MB
- [ ] User can upload image files up to 10MB
- [ ] Supported formats: PDF, JPG, PNG, WebP
- [ ] Drag-and-drop functionality works
- [ ] File validation with clear error messages
- [ ] Upload progress is visible
- [ ] Mobile-responsive upload interface

### Technical Implementation
- React file upload component
- File type validation
- File size validation
- Preview of uploaded file
- Integration with analysis service

---

## Feature 2: AI Analysis of Results

### User Story
As a user, I want my blood test results to be automatically analyzed by AI, so that I receive accurate health insights without manual data entry.

### Requirements
- **Analysis Service**
  - Extract biomarker data from uploaded files
  - Process and normalize biomarker values
  - Compare against optimal ranges
  - Identify patterns and correlations
  - Generate structured analysis data

### Acceptance Criteria
- [ ] System extracts biomarker values from uploaded files
- [ ] Analysis completes within 60 seconds
- [ ] Analysis handles common lab formats (ALAB, Diagnostyka, etc.)
- [ ] Error handling for unreadable files
- [ ] Clear feedback during analysis process

### Technical Implementation
- Mock AI service (for MVP - can be replaced with actual AI backend)
- PDF parsing capability (simulated)
- OCR/image recognition (simulated)
- Data extraction pipeline
- Analysis result structure

---

## Feature 3: Health Summary

### User Story
As a medical layperson, I want to receive a short, understandable summary of my health state highlighting up to 3 top positive aspects and 3 top priorities, so that I can quickly understand my health status.

### Requirements
- **Health Summary Component**
  - Display 3 top positive aspects
  - Display 3 top priorities/concerns
  - Plain language (non-medical terminology)
  - Visual indicators (colors, icons)
  - Easy to scan format

### Acceptance Criteria
- [ ] Summary is generated automatically after analysis
- [ ] Exactly 3 positive aspects are highlighted
- [ ] Exactly 3 priorities are identified
- [ ] Language is understandable for non-specialists
- [ ] Visual hierarchy makes information easy to scan
- [ ] Summary is displayed within 60 seconds of upload

### Technical Implementation
- Health summary generation logic
- Positive aspects extraction
- Priority identification algorithm
- Plain language translation
- UI component with visual indicators

---

## Feature 4: Biological Age Estimation

### User Story
As a goal-oriented user, I want to see my estimated biological age based on my blood test results, so that I have a measurable benchmark to track my health improvements.

### Requirements
- **Biological Age Component**
  - Calculate biological age from biomarkers
  - Display age prominently
  - Compare to chronological age (if provided)
  - Visual representation (gauge, number, comparison)

### Acceptance Criteria
- [ ] Biological age is calculated from blood test results
- [ ] Age is displayed clearly and prominently
- [ ] Comparison to chronological age is shown (if available)
- [ ] Visual representation is intuitive
- [ ] Calculation is based on validated biomarkers

### Technical Implementation
- Biological age calculation algorithm
- Age display component
- Comparison visualization
- Integration with biomarker data

---

## Feature 5: Recommended Actions

### User Story
As a busy user, I want to receive 3 recommended actions to improve my biomarkers and decrease my biological age, so that I can immediately start making positive changes.

### Requirements
- **Recommendations Component**
  - Display exactly 3 recommendations
  - Each recommendation is actionable
  - Recommendations are prioritized by impact
  - Clear action items (supplementation/habits)
  - Specific guidance for each recommendation

### Acceptance Criteria
- [ ] Exactly 3 recommendations are provided
- [ ] Recommendations are ranked by impact
- [ ] Each recommendation is specific and actionable
- [ ] Recommendations target biomarker improvements
- [ ] Actions are clear and require no additional research
- [ ] Recommendations include supplementation and/or habit changes

### Technical Implementation
- Recommendation engine
- Prioritization algorithm
- Action item generation
- UI component for displaying recommendations

---

## User Journey Flow

1. **Landing/Upload Page**
   - User sees upload interface
   - User uploads PDF or photo of blood test results
   - System validates and accepts file

2. **Processing State**
   - Loading indicator shows analysis in progress
   - User sees "Analyzing your results..." message
   - Progress feedback (estimated time)

3. **Results Display**
   - Health Summary (3 positives + 3 priorities)
   - Biological Age (prominent display)
   - Recommended Actions (3 items)

4. **Completion**
   - User can review all insights
   - User can download/share results (future)
   - User can upload new results for comparison (future)

---

## Technical Architecture

### Frontend Components
- `FileUpload` - File upload with drag-and-drop
- `AnalysisProgress` - Loading state during analysis
- `HealthSummary` - Summary with positives and priorities
- `BiologicalAge` - Age display and comparison
- `Recommendations` - Actionable recommendations list
- `ResultsPage` - Main results view combining all components

### Services
- `analysisService.js` - Mock AI analysis service
- `biomarkerService.js` - Biomarker data processing
- `ageCalculationService.js` - Biological age calculation
- `recommendationService.js` - Recommendation generation

### Data Structures
```javascript
// Analysis Result
{
  biomarkers: Array<Biomarker>,
  healthSummary: {
    positives: Array<string>, // 3 items
    priorities: Array<string> // 3 items
  },
  biologicalAge: number,
  chronologicalAge?: number,
  recommendations: Array<Recommendation> // 3 items
}

// Biomarker
{
  name: string,
  value: number,
  unit: string,
  optimalRange: { min: number, max: number },
  status: 'optimal' | 'suboptimal' | 'concerning',
  description: string
}

// Recommendation
{
  title: string,
  description: string,
  actionType: 'supplementation' | 'habit' | 'lifestyle',
  impact: 'high' | 'medium' | 'low',
  priority: number
}
```

---

## Success Metrics

- **Upload Success Rate**: >95% of valid files processed
- **Analysis Time**: <60 seconds from upload to results
- **User Comprehension**: Users understand summary without medical knowledge
- **Biological Age Accuracy**: Validated calculation method
- **Recommendation Relevance**: Actionable and specific recommendations

---

## Future Enhancements (Post-MVP)

- Historical tracking across multiple tests
- Comparison with previous results
- Detailed biomarker explanations
- Integration with wearable devices
- Personalized health plans
- Regular check-in reminders
- Community features
- Expert consultations

---

## Privacy & Security

- **Zero-Retention Model**: No permanent storage of medical data (for MVP)
- Clear privacy policy communication
- Secure file upload
- Data encryption in transit
- User consent for processing

---

## Design Principles

- **Mobile-First**: Optimized for mobile devices
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Fast load times, smooth interactions
- **Clarity**: Plain language, clear visual hierarchy
- **Trust**: Transparent about data handling and AI analysis
