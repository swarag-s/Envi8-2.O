# ✅ Final Verification Checklist

## 1. 📦 Dependencies
Ensure all new packages are installed:
```bash
npm install leaflet react-leaflet @google/generative-ai
```

## 2. 🗺️ Location & Map Features
- [ ] **Open Citizen Dashboard**
- [ ] **Click "Select on Map"** in the report form.
- [ ] **Verify Map Loads:** You should see a map of Kozhikode.
- [ ] **Drag Marker:** Move the pin. Address field should update automatically.
- [ ] **Switch to "Auto Detect":** Click "Auto Detect" tab. It should use GPS.

## 3. 🤖 AI & Ward Detection
- [ ] **Type a Place Name:** In "Exact Location", type "Mananchira Square".
- [ ] **Check Ward Detection:** You should see a green checkmark saying "Detected: Ward 14" (or similar).
- [ ] **Upload Photo:** Upload an image of a pothole/garbage.
- [ ] **Check AI analysis:** Category and Severity should auto-fill.

## 4. 🏘️ Ward Member Features
- [ ] **Login as Ward Member**
- [ ] **Navigate to "Ward Places"** tab.
- [ ] **Add New Place:** Click "Add Place". Enter Name (e.g., "City Hospital"), Type, Lat/Lng. Save.
- [ ] **Switch to Citizen View:** Go back to Citizen Dashboard.
- [ ] **Test Autocomplete:** Type "City" in the place input. You should see "City Hospital" in suggestions.

## 5. 🔄 Real-time Updates
- [ ] **Submit Report:** Submit a report from Citizen Dashboard with "Pending" status.
- [ ] **Check Ward Dashboard:** Go to Ward Dashboard.
- [ ] **Verify Issue:** The new token should appear instantly in the "Recent Issues" list.

## 6. 🐛 Troubleshooting
- **Map not showing?** Check if `leaflet` css is imported (it is int `LocationPicker.jsx`).
- **Icons missing?** Refresh the page. Leaflet icons sometimes need a rebuild.
- **AI not working?** Check browser console for "API Key invalid" or "Quota exceeded".
