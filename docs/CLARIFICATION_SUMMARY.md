# Clarification Summary - Longevity AI MVP

This document summarizes all clarification decisions made during the specification phase.

## Core Functionality Decisions

### 1. Chronological Age Input
**Decision**: Optional field on upload page
- User can optionally provide their chronological age
- Used only for comparison display with biological age
- Validated if provided (1-120 years)

### 2. Multiple File Upload
**Decision**: Support multiple file uploads with combined analysis
- Users can upload multiple PDF/image files
- All files are merged into one combined analysis
- Biomarkers from all files are intelligently merged (prioritizing concerning values)

### 3. Medical Disclaimers
**Decision**: Minimal disclaimer (Option C)
- Brief note that this is not medical advice
- Users should consult healthcare professionals
- No full legal text for MVP

### 4. Support Contact
**Decision**: Email only - simple mailto link (Option C)
- No contact form
- Simple mailto link for support/errors
- No complex support system

### 5. Multi-language Support
**Decision**: English + Polish (Option B)
- Full translation for both languages
- Language selector in header/navigation (visible on all pages)

### 6. Product/Supplement Links
**Decision**: No product placement, brand-agnostic (Option B)
- No brands, trading names, or product placement
- Recommendations name active substance (substancja czynna in Polish)
- May include 2 most common exemplary products as examples
- Clearly labeled as examples only

### 7. AI Integration Approach
**Decision**: Prepare architecture for real AI with easy mock fallback (Option B + C)
- Architecture supports real AI integration
- Easy to mock out if problematic
- Attempt real AI integration in MVP if available
- **Critical**: Documents must be anonymized before AI transfer
  - Extract only: biomarkers, demographics (age, weight, etc.), test dates
  - No names, ID numbers, addresses (patient or doctor/institution)

### 8. Data Anonymization
**Decision**: Biomarkers + demographics + test dates (Option C)
- Extract: biomarker values, age, gender, weight, test dates
- Exclude: names, ID numbers, addresses (patient/client and doctor/technician/institution)
- Temporal analysis enabled with test dates

### 9. Biological Age Calculation
**Decision**: Hybrid approach (Option C)
- Start with simplified scoring system
- Allow switching to validated algorithm (PhenoAge, DunedinPACE) if biomarkers available
- Use all extracted biomarkers for calculation

### 10. Error Handling - Unreadable Files
**Decision**: Show error with retry option (Option A)
- User can upload different file
- No manual entry option for MVP

### 11. Results Persistence
**Decision**: Export only - PDF/print (Option B)
- Allow PDF/print export
- No server storage
- Zero-Retention model maintained

### 12. Biomarker Coverage
**Decision**: Fixed set of common biomarkers (Option A)
- Focus on most common markers in Polish blood tests
- Core biomarkers to include:
  - **CBC (Morfologia)**: RBC, Hemoglobin, Hematocrit, WBC, Platelets, MCV, MCH, MCHC, RDW
  - **Lipid Profile**: Total Cholesterol, LDL, HDL, Triglycerides
  - **Metabolic**: Glucose, HbA1c
  - **Inflammation**: CRP, ESR
  - **Liver**: ALT, AST, ALP, Bilirubin, GGT
  - **Kidney**: Creatinine, BUN, eGFR
  - **Thyroid**: TSH, free T4, free T3
  - **Vitamins/Minerals**: Vitamin D, Calcium, Phosphorus, Magnesium

### 13. User Accounts
**Decision**: No accounts - completely anonymous (Option A)
- No login/registration required
- No user accounts for MVP
- Completely anonymous usage

### 14. Analysis Time Display
**Decision**: Show estimated time (Option A)
- Display "Usually takes 30-60 seconds" or similar
- Set user expectations

### 15. Results Display Order
**Decision**: Health Summary first, then Biological Age, then Recommendations (Option B)
- Health Summary provides context first
- Biological Age as key metric
- Recommendations as actionable next steps

### 16. Detailed Biomarker View
**Decision**: No detailed view for MVP (Option B)
- Only show: summary, positives, priorities, recommendations
- No detailed table of individual biomarker values

### 17. Mobile Camera Integration
**Decision**: Later - post-MVP (Option C)
- Users must take photos separately and upload from gallery
- Camera capture functionality deferred

### 18. File Size Limits
**Decision**: 10MB per file (Option B)
- Current implementation
- Reasonable for most PDFs and images

### 19. Recommendation Specificity
**Decision**: Moderately specific with ranges (Option B)
- General guidance with ranges
- Example: "Take 2000-4000 IU Vitamin D3 daily"
- Not overly prescriptive, but actionable

### 20. AI Prompt Structure
**Decision**: Structured template with placeholders (Option C)
- Template-based approach
- Fill in user data
- Keep prompt structure consistent

### 21. Biomarker Extraction Accuracy
**Decision**: Proceed with available biomarkers (Option A)
- Analyze what was extracted
- Note missing data if applicable
- Don't block analysis due to incomplete extraction

### 22. Biological Age Calculation Input
**Decision**: Use all extracted biomarkers (Option A)
- No filtering to core set
- Use everything available for calculation

### 23. Language Switching
**Decision**: Language selector in header/navigation (Option A)
- Visible on all pages
- Easy access for users

### 24. Export Format
**Decision**: All results included (Option A)
- Health Summary
- Biological Age
- All 3 Recommendations
- Complete analysis in export

### 25. Error Recovery
**Decision**: Show error, require full restart (Option A)
- User must upload again if analysis fails
- No partial recovery for MVP

### 26. Recommendation Examples Format
**Decision**: Plain text list (Option A)
- Simple format: "Examples: Product A, Product B"
- No complex UI elements

### 27. Loading State During Analysis
**Decision**: Simple spinner with message (Option A)
- "Analyzing your results..."
- No step-by-step progress for MVP

### 28. AI Service Provider
**Decision**: OpenAI (GPT-4/GPT-3.5) (Option A)
- Most common, well-documented
- Good support and reliability

### 29. AI Response Format
**Decision**: JSON format (Option A - simplest for MVP)
- Structured JSON response
- Easy to parse in JavaScript
- Reliable for MVP

### 30. Additional Requirements
**Decision**: None specified
- Ready to proceed to planning phase

## Key Technical Decisions Summary

### Architecture
- **AI Integration**: OpenAI with structured JSON responses
- **Anonymization**: Extract only medical data, no personal identifiers
- **Mock Fallback**: Easy to switch between real AI and mock
- **Multi-language**: English + Polish with header selector

### User Experience
- **No accounts**: Completely anonymous
- **Multiple files**: Supported with combined analysis
- **Export**: PDF/print with all results
- **Error handling**: Simple retry on failure

### Data & Privacy
- **Zero-Retention**: No server storage
- **Anonymization**: Strict removal of personal identifiers
- **Biomarkers**: Fixed set of common Polish lab markers
- **Demographics**: Age, gender, weight, test dates only

### Analysis Features
- **Biological Age**: Hybrid approach (simplified + validated algorithms)
- **Recommendations**: 3 prioritized, moderately specific actions
- **Health Summary**: 3 positives + 3 priorities
- **Display Order**: Summary → Age → Recommendations

## Ready for Planning Phase

All clarifications complete. Ready to proceed to planning, task breakdown, and implementation phases.
