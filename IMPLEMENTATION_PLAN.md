# 🚀 Implementation Plan - Advanced Features

## Features to Implement

### 1. ✅ Fix Success Modal Tick Alignment
- Center the checkmark icon properly
- Ensure animations work smoothly

### 2. ✅ Real-time Issue Queue Updates
- Create shared state management
- When citizen submits report → appears in Ward Member dashboard
- Use localStorage or Context API for demo
- Backend integration points marked

### 3. ✅ Ward Place Management (Ward Member)
- Add "Manage Ward Places" section in Ward Member dashboard
- CRUD operations for places in the ward
- Store: Place name, landmarks, coordinates
- Example: "Mananchira Square", "Medical College", "Beach Road"

### 4. ✅ AI-Powered Ward Detection (Gemini)
- When citizen types place name → auto-detect ward
- Use Gemini AI to match place to ward
- Fallback to GPS if place not recognized
- **API Integration Point**: Replace with actual Gemini API

### 5. ✅ AI Image Analysis (Gemini Vision)
- Analyze uploaded images for issue type
- Detect: Roads, Electricity, Water, Sanitation
- Auto-fill category and description
- **API Integration Point**: Replace with actual Gemini Vision API

---

## Implementation Steps

### Step 1: Shared State Management
Create a simple state management system using Context API or localStorage.

**File**: `src/context/IssueContext.jsx`
```javascript
// Manages all issues across dashboards
// Citizens can add issues
// Ward Members can view and update issues
```

### Step 2: Ward Places Management
Add to Ward Member Dashboard:
- "Ward Places" tab
- Add/Edit/Delete places
- Store in localStorage (demo) or backend

### Step 3: Gemini AI Integration Points
Mark where to add Gemini API:
1. **Image Analysis**: `detectIssueFromImage()`
2. **Ward Detection**: `detectWardFromPlace()`

### Step 4: Update Dashboards
- Citizen: Submit → Add to shared state
- Ward Member: View new issues in real-time

---

## File Structure

```
src/
├── context/
│   └── IssueContext.jsx          # Shared state for issues
├── services/
│   └── geminiService.js          # Gemini AI integration
├── pages/
│   ├── CitizenDashboard.jsx      # Updated with AI detection
│   └── WardMemberDashboard.jsx   # Updated with place management
└── utils/
    └── wardPlaces.js             # Ward places data structure
```

---

## API Integration Points

### 🔑 Gemini AI - Image Analysis
**Location**: `src/services/geminiService.js`

```javascript
export const analyzeIssueImage = async (imageFile) => {
  // TODO: Replace with actual Gemini Vision API
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const imageParts = await fileToGenerativePart(imageFile);
  
  const prompt = `Analyze this civic issue image and identify:
  1. Issue type (Roads, Electricity, Water, Sanitation, Other)
  2. Brief description
  3. Urgency level (Normal, High, Critical)
  Return as JSON.`;
  
  const result = await model.generateContent([prompt, imageParts]);
  return JSON.parse(result.response.text());
};
```

### 🔑 Gemini AI - Ward Detection
**Location**: `src/services/geminiService.js`

```javascript
export const detectWardFromPlace = async (placeName, wardPlaces) => {
  // TODO: Replace with actual Gemini API
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Given this place name: "${placeName}"
  And these ward places: ${JSON.stringify(wardPlaces)}
  Determine which ward this place belongs to.
  Return: { wardNumber: "14", confidence: 0.95 }`;
  
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};
```

---

## Environment Variables

Add to `.env.local`:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Demo vs Production

### Demo Mode (Current)
- Uses localStorage for state
- Simulated AI responses
- No backend required

### Production Mode (Future)
- Replace localStorage with API calls
- Add real Gemini API integration
- Backend endpoints:
  - `POST /api/issues` - Create issue
  - `GET /api/issues/ward/:wardId` - Get ward issues
  - `POST /api/ward-places` - Add ward place
  - `GET /api/ward-places/:wardId` - Get ward places

---

## Next Steps

1. Create IssueContext for shared state
2. Update CitizenDashboard with AI integration points
3. Add Ward Places management to WardMemberDashboard
4. Fix success modal alignment
5. Test end-to-end flow
6. Document Gemini API integration

---

**Let's start implementation!** 🚀
