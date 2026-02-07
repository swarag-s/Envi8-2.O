/**
 * Gemini AI Service - PRODUCTION VERSION
 * Real API integration enabled
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Analyze an image to detect civic issue type and details
 */
export const analyzeIssueImage = async (imageFile) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert image to base64
        const imageData = await fileToGenerativePart(imageFile);

        const prompt = `Analyze this civic infrastructure issue image and provide:
    1. Issue category (MUST be one of: Roads, Electricity, Water, Sanitation, Other)
    2. Brief description of the problem (2-3 sentences)
    3. Urgency level (MUST be one of: Normal, High, Critical)
    4. Recommended department (MUST be one of: PWD (Roads & Infrastructure), KSEB (Electricity), Water Authority, Sanitation Department, General)
    
    Return ONLY a valid JSON object with this exact structure:
    {
      "category": "category_name",
      "description": "detailed description",
      "urgency": "urgency_level",
      "department": "department_name"
    }
    
    Do not include any markdown formatting or extra text, just the JSON object.`;

        const result = await model.generateContent([prompt, imageData]);
        const response = await result.response;
        let text = response.text();

        // Clean up response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse JSON response
        const analysis = JSON.parse(text);

        console.log('Gemini AI Analysis:', analysis);
        return analysis;
    } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback to simulation
        return simulateImageAnalysis(imageFile);
    }
};

/**
 * Detect ward number from place name using AI
 */
export const detectWardFromPlace = async (placeName, wardPlaces) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const wardPlacesText = Object.entries(wardPlaces)
            .map(([ward, places]) =>
                `Ward ${ward}: ${places.map(p => p.name).join(', ')}`
            )
            .join('\n');

        const prompt = `Given this place name: "${placeName}"
    
    And these ward places in Kozhikode:
    ${wardPlacesText}
    
    Determine which ward this place belongs to. Consider:
    - Exact name matches
    - Similar names or landmarks
    - Common knowledge about Kozhikode geography
    
    Return ONLY a valid JSON object:
    {
      "wardNumber": "14",
      "confidence": 0.95,
      "matchedPlace": "exact place name from list or null"
    }
    
    If no match found, return wardNumber as null.
    Do not include any markdown formatting or extra text, just the JSON object.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up response
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const detection = JSON.parse(text);

        console.log('Gemini Ward Detection:', detection);
        return detection;
    } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback to simulation
        return simulateWardDetection(placeName, wardPlaces);
    }
};

/**
 * Helper function to convert File to GenerativePart for Gemini
 */
async function fileToGenerativePart(file) {
    const base64EncodedData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type
        }
    };
}

// ============================================================================
// FALLBACK SIMULATION FUNCTIONS
// ============================================================================

function simulateImageAnalysis(imageFile) {
    const filename = imageFile.name.toLowerCase();
    let category = 'Other';
    let description = 'Issue detected in the uploaded image.';
    let urgency = 'Normal';
    let department = 'General';

    if (filename.includes('road') || filename.includes('pothole')) {
        category = 'Roads';
        description = 'Pothole or road damage detected. The road surface appears damaged and requires immediate repair to ensure public safety.';
        urgency = 'High';
        department = 'PWD (Roads & Infrastructure)';
    } else if (filename.includes('light') || filename.includes('electric')) {
        category = 'Electricity';
        description = 'Electrical infrastructure issue detected. Street light or power line appears to be malfunctioning.';
        urgency = 'High';
        department = 'KSEB (Electricity)';
    } else if (filename.includes('water') || filename.includes('pipe')) {
        category = 'Water';
        description = 'Water supply issue detected. Possible pipe leakage or water wastage observed.';
        urgency = 'High';
        department = 'Water Authority';
    } else if (filename.includes('waste') || filename.includes('garbage')) {
        category = 'Sanitation';
        description = 'Sanitation issue detected. Waste accumulation or drainage blockage observed.';
        urgency = 'Normal';
        department = 'Sanitation Department';
    }

    return { category, description, urgency, department };
}

function simulateWardDetection(placeName, wardPlaces) {
    const searchTerm = placeName.toLowerCase();

    for (const [wardNumber, places] of Object.entries(wardPlaces)) {
        for (const place of places) {
            if (place.name.toLowerCase().includes(searchTerm) ||
                searchTerm.includes(place.name.toLowerCase())) {
                return {
                    wardNumber: wardNumber,
                    confidence: 0.95,
                    matchedPlace: place.name
                };
            }
        }
    }

    return {
        wardNumber: null,
        confidence: 0,
        matchedPlace: null
    };
}

export const GEMINI_CONFIG = {
    USE_REAL_API: true,
    IMAGE_MODEL: 'gemini-1.5-flash',
    TEXT_MODEL: 'gemini-1.5-flash',
    API_KEY_SET: !!import.meta.env.VITE_GEMINI_API_KEY
};
