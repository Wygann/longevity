# MVP Specification Clarifications

This document addresses potential ambiguities and provides clarifications for the Longevity AI MVP specification.

## 1. Biological Age Calculation

### Clarification Needed
**Question**: What algorithm or methodology should be used to calculate biological age?

**Clarification**:
- **MVP Approach**: Use a simplified scoring system based on biomarker status
  - Optimal biomarkers: -0.5 years per marker
  - Suboptimal biomarkers: +1 year per marker
  - Concerning biomarkers: +2 years per marker
  - Base age: 45 years (adjustable based on user input)
  - Final age clamped between 30-80 years for reasonable range

- **Future Enhancement**: Integrate validated algorithms (e.g., PhenoAge, DunedinPACE) when available

### Implementation Details
- Calculation happens server-side during analysis
- Uses all extracted biomarkers, not just a subset
- Result is a single integer representing biological age

---

## 2. Biomarker Extraction and Support

### Clarification Needed
**Question**: Which biomarkers are supported? How does extraction work for different lab formats?

**Clarification**:
- **MVP Approach**: Mock extraction that simulates common biomarkers:
  - Lipid panel: Total Cholesterol, HDL, LDL, Triglycerides
  - Metabolic: HbA1c, Glucose
  - Vitamins: Vitamin D, B12
  - Inflammation: C-Reactive Protein (CRP)
  - Hormones: Testosterone, Cortisol
  - Liver function: ALT, AST
  - Kidney function: Creatinine, eGFR

- **Lab Format Support**:
  - MVP: Simulated extraction (mock data)
  - Production: OCR/PDF parsing for common formats (ALAB, Diagnostyka, LabCorp, Quest)
  - Fallback: Manual entry option if extraction fails

### Implementation Details
- Extraction happens automatically during file upload
- Unsupported formats show error with guidance
- Missing biomarkers don't block analysis (use available data)

---

## 3. Recommendation Generation Logic

### Clarification Needed
**Question**: How are recommendations generated and prioritized?

**Clarification**:
- **Priority Ranking**:
  1. **Priority 1 (Highest Impact)**: Addresses concerning biomarkers (status: 'concerning')
  2. **Priority 2 (High Impact)**: Addresses suboptimal biomarkers with high health impact
  3. **Priority 3 (Medium Impact)**: Addresses suboptimal biomarkers or preventive actions

- **Recommendation Types**:
  - **Supplementation**: Specific supplements with dosages (e.g., "Take 2000-4000 IU Vitamin D3 daily")
  - **Habit**: Daily/weekly habit changes (e.g., "Add 15 minutes of daily walking")
  - **Lifestyle**: Broader lifestyle modifications (e.g., "Reduce processed foods, increase omega-3 intake")

- **Selection Criteria**:
  - Must directly address identified biomarker issues
  - Must be actionable (specific, measurable)
  - Must be evidence-based
  - Must be achievable for average user

### Implementation Details
- Recommendations generated based on biomarker analysis results
- Each recommendation includes: title, description, action type, impact level, priority
- Exactly 3 recommendations always provided (fills with general health tips if needed)

---

## 4. Chronological Age Input

### Clarification Needed
**Question**: How does the user provide their chronological age?

**Clarification**:
- **MVP Approach**: Optional input field (not required for MVP)
  - Can be added to upload page as optional field
  - If provided, shows comparison with biological age
  - If not provided, only biological age is shown

- **Future Enhancement**: 
  - Store in user profile
  - Use for personalized recommendations
  - Track age progression over time

### Implementation Details
- Optional input field on upload page
- Stored in analysis results if provided
- Used only for comparison display, not calculation

---

## 5. Error Handling Scenarios

### Clarification Needed
**Question**: What happens in various error scenarios?

**Clarification**:

#### File Upload Errors
- **Invalid file type**: Show clear error message with supported formats
- **File too large**: Show error with max size (10MB)
- **Corrupted file**: Show error with suggestion to try another file
- **Network error**: Show retry option

#### Analysis Errors
- **Unreadable file**: Show error with option to upload different file
- **No biomarkers extracted**: Show error with manual entry option (future)
- **Analysis timeout**: Show error with retry option
- **Server error**: Show generic error with support contact

#### Data Validation Errors
- **Missing critical biomarkers**: Proceed with available data, note limitations
- **Out-of-range values**: Flag as concerning, proceed with analysis
- **Invalid biomarker values**: Use default ranges, proceed with warning

### Implementation Details
- All errors show user-friendly messages
- Retry options available where applicable
- Error states don't break the application flow
- Logging for debugging (not shown to user)

---

## 6. Health Summary Generation

### Clarification Needed
**Question**: How are the 3 positives and 3 priorities selected?

**Clarification**:
- **Positive Aspects Selection**:
  - Top 3 biomarkers with "optimal" status
  - Prioritize biomarkers with highest health impact
  - Use plain language descriptions
  - Highlight health benefits (e.g., "reducing diabetes risk")

- **Priorities Selection**:
  - Top 3 biomarkers with "suboptimal" or "concerning" status
  - Prioritize by health impact (concerning > suboptimal)
  - Prioritize by modifiability (can be improved through actions)
  - Include specific values and context

### Implementation Details
- Selection happens during analysis
- Always exactly 3 of each (fills with general statements if needed)
- Plain language conversion from medical terms
- Visual indicators (colors, icons) for quick scanning

---

## 7. Analysis Accuracy and Validation

### Clarification Needed
**Question**: What's the expected accuracy of the mock analysis? How is it validated?

**Clarification**:
- **MVP Approach**: 
  - Mock analysis uses realistic but simulated data
  - Not validated against real medical standards (MVP limitation)
  - Clearly labeled as "for demonstration purposes"

- **Production Requirements**:
  - Validate against medical reference ranges
  - Use evidence-based biomarker interpretations
  - Include disclaimers about medical advice
  - Require medical professional review for production

### Implementation Details
- MVP: Mock data with realistic patterns
- Clear disclaimers in UI about demo nature
- Future: Integration with validated medical databases

---

## 8. User Experience Flow Details

### Clarification Needed
**Question**: What happens after results are displayed? Can users save or share?

**Clarification**:
- **MVP**: 
  - Results displayed on same page
  - "Analyze Another Test" button to reset
  - No saving/sharing (Zero-Retention model)
  - Results lost on page refresh

- **Future Enhancements**:
  - Save to user account (with consent)
  - Export as PDF
  - Share with healthcare provider
  - Historical tracking

### Implementation Details
- Single-page application flow
- No backend storage (Zero-Retention)
- Results only in browser memory
- Clear messaging about data handling

---

## 9. Mobile Experience Specifics

### Clarification Needed
**Question**: Are there mobile-specific considerations?

**Clarification**:
- **File Upload**:
  - Camera integration for photo capture (future)
  - Mobile-optimized drag-and-drop (touch-friendly)
  - File picker works on mobile browsers

- **Results Display**:
  - Scrollable sections for long content
  - Touch-friendly buttons and interactions
  - Readable text sizes on small screens
  - Optimized images and assets

### Implementation Details
- Mobile-first responsive design
- Touch targets minimum 44x44px
- Text readable without zooming
- Fast loading on mobile networks

---

## 10. Privacy and Data Handling

### Clarification Needed
**Question**: What exactly does "Zero-Retention" mean in practice?

**Clarification**:
- **Zero-Retention Model**:
  - No server-side storage of uploaded files
  - No database storage of analysis results
  - No persistent cookies or tracking
  - Analysis happens in-memory, results returned, data discarded
  - Files processed and immediately deleted

- **What IS Stored** (if any):
  - MVP: Nothing (true zero-retention)
  - Future (with consent): User accounts, preferences, historical data

### Implementation Details
- Clear privacy notice on upload page
- No analytics tracking of health data
- Files processed and discarded immediately
- Results only in browser session

---

## 11. Performance Requirements

### Clarification Needed
**Question**: What are the specific performance targets?

**Clarification**:
- **Analysis Time**: <60 seconds from upload to results
- **Page Load**: <3 seconds initial load
- **File Upload**: Progress indicator for files >1MB
- **Mobile Performance**: Works on 3G networks (graceful degradation)

### Implementation Details
- Optimistic UI updates
- Loading states for all async operations
- Error boundaries for graceful failures
- Performance monitoring (future)

---

## 12. Accessibility Requirements

### Clarification Needed
**Question**: What level of accessibility is required?

**Clarification**:
- **WCAG 2.1 AA Compliance**:
  - Keyboard navigation for all features
  - Screen reader support
  - Color contrast ratios (4.5:1 for text)
  - Alt text for images
  - ARIA labels for interactive elements

### Implementation Details
- Semantic HTML
- Proper heading hierarchy
- Focus management
- Accessible form controls
- Screen reader testing

---

## Summary of Key Decisions

1. **Biological Age**: Simplified scoring system for MVP, validated algorithms for production
2. **Biomarkers**: Mock extraction with common biomarkers, expandable list
3. **Recommendations**: Priority-based, always 3, evidence-based actions
4. **Chronological Age**: Optional input, used only for comparison
5. **Error Handling**: User-friendly messages, retry options, graceful degradation
6. **Health Summary**: Top 3 positives/priorities based on biomarker status and impact
7. **Accuracy**: Mock data for MVP, clearly labeled, validated for production
8. **Data Retention**: True zero-retention in MVP, optional storage with consent later
9. **Mobile**: Mobile-first design, camera integration future enhancement
10. **Performance**: <60s analysis, <3s page load, works on 3G
11. **Accessibility**: WCAG 2.1 AA compliance required

---

## Open Questions for Product Team

1. Should we support multiple file uploads in one session?
2. Should users be able to compare multiple test results?
3. What disclaimers/legal text is required for medical information?
4. Should there be a "contact support" option for errors?
5. Do we need multi-language support in MVP?
6. Should recommendations include links to products/supplements?
7. What's the plan for transitioning from mock to real AI analysis?
