# OpenAI Vision API Setup & Troubleshooting Guide

## ✅ What Was Fixed

1. **Better Error Handling**: Added detailed logging to show if OpenAI API is working
2. **Smarter Fallback**: Simulation now detects issues based on image filename, not random guessing
3. **Improved JSON Parsing**: Better handling of OpenAI responses
4. **All Issue Fields Now Auto-Filled**:
   - Category
   - Description with technical details
   - Severity Level (Critical/High/Medium)
   - Department assignment
   - Location details
   - Action required
   - Confidence score

---

## 🔧 How to Test

### Step 1: Verify API Key Configuration

Open Developer Tools (F12) and check the Console. You should see:

```
✅ OpenAI API Key is configured
```

If you see:

```
⚠️ OpenAI API Key is NOT configured. Image analysis will use simulation.
```

Then the API key is not set up correctly.

### Step 2: Upload an Image

**In AI Detection Mode:**

1. Go to **Citizens Dashboard**
2. Click **Report Issue** (⚡ icon)
3. Click **AI Mode** button
4. Upload an image

**Image Recognition Works Better With:**

- **Roads**: Upload image with pothole, crack, or damaged asphalt
- **Electricity**: Upload image with broken pole or street light
- **Water**: Upload image with pipe leak or drainage issue
- **Sanitation**: Upload image with garbage or waste
- **Trees**: Upload image with fallen branches
- **Health**: Upload image with stagnant water or sewage

### Step 3: Check Console Logs

The console will show one of:

**✅ SUCCESS:**

```
✅ OpenAI Vision Analysis (High Accuracy): {
  category: "Roads & Infrastructure",
  description: "Severe pothole detected...",
  ...
}
```

**⚠️ FALLBACK (using filename-based simulation):**

```
⚠️ OpenAI API Key is NOT configured. Image analysis will use simulation.
```

---

## 🐛 Fixing "Always Shows Waste Disposal"

### Issue 1: OpenAI API Key Not Set

**Problem**: Environment variable `VITE_OPENAI_API_KEY` not configured

**Solution**:

1. Open `.env.local` file
2. Verify it has this line:

```
VITE_OPENAI_API_KEY=sk-proj-BKDgNDopDf3iIUL2LLWc5yqDltJxNNQbLhCkFa5u5BF-...
```

3. Restart your dev server: Press `Ctrl+C` and run `npm run dev` again

### Issue 2: API Key Expired or Invalid

**Problem**: API key format is wrong or expired

**Solution**:

1. Check the API key starts with `sk-proj-`
2. Verify it hasn't expired on OpenAI dashboard
3. If invalid, get a new one from: https://platform.openai.com/api-keys

### Issue 3: Network/Firewall Blocking OpenAI

**Problem**: Request to OpenAI API is blocked

**Solution**:

1. Check firewall settings
2. Try using VPN if in restricted region
3. Check OpenAI status: https://status.openai.com/

---

## 📊 What Happens Now

### When API Key Works ✅

1. Upload image
2. OpenAI GPT-4V analyzes it in real-time
3. Returns accurate detection with:
   - Correct category (Roads, Water, Electricity, etc.)
   - Detailed technical description
   - Severity assessment
   - Required department
   - Action items

### When API Falls Back ⚠️

1. System checks image filename for keywords:
   - "pothole" → Roads & Infrastructure
   - "light" → Electricity & Street Lights
   - "water" → Water Supply & Drainage
   - "garbage" → Sanitation & Waste
   - "tree" → Trees & Environment
   - etc.

2. If no match found, returns "Other Civic Issues" (not waste disposal!)

3. User must manually select category

---

## 🚀 Testing Checklist

- [ ] Check F12 Console shows "✅ OpenAI API Key is configured"
- [ ] Upload test image with clear civic issue
- [ ] Check form auto-fills with correct category
- [ ] Verify description is detailed (3+ sentences)
- [ ] Check severity_level is assigned (Critical/High/Medium)
- [ ] Confirm department matches issue type
- [ ] Check confidence score (0.7+)

---

## 💡 API Response Format

Your form now receives complete analysis:

```json
{
  "category": "Roads & Infrastructure",
  "location_details": "Main road with visible pavement damage",
  "description": "Severe pothole detected on the road...",
  "severity_level": "High",
  "urgency": "High",
  "department": "PWD (Roads & Infrastructure)",
  "estimated_priority": 8,
  "action_required": "Pothole patching and road resurfacing",
  "confidence": 0.95
}
```

---

## 📝 Common Issues & Fixes

| Issue                           | Cause                   | Fix                       |
| ------------------------------- | ----------------------- | ------------------------- |
| Always shows waste disposal     | API key missing/invalid | Check .env.local file     |
| "Empty response from OpenAI"    | API call failed         | Check internet connection |
| "Failed to parse response"      | Bad API response        | Check OpenAI API status   |
| Confidence score = 0.3          | Image unclear           | Upload clearer image      |
| Category = "Other Civic Issues" | Unclear image content   | Specify manually          |

---

## 🔍 Debug Mode

To see detailed logs:

1. Open DevTools (F12)
2. Go to Console tab
3. Upload image
4. Check output for:
   - ✅ Success indicators
   - ❌ Error messages
   - ⚠️ Fallback notices
   - 📊 Analysis results

---

## 📞 Still Having Issues?

1. **Check API Key Format**: Should start with `sk-proj-`
2. **Verify Environment**: Restart dev server after changing `.env.local`
3. **Check Network**: Ensure firewall/VPN allow OpenAI API
4. **Check Image**: Upload clear image of actual civic issue
5. **Check Console**: Look for error messages with red ❌
