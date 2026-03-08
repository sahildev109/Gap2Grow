const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: 'c:/Users/sahil salap/Desktop/Gap2Grow-main/Gap2Grow-main/backend-nodejs/.env' });

async function checkGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Testing the prompt with application/json
    const prompt = `Return a json object with a "name" string and "age" number.`;
    
    console.log("Testing Gemini API call...");
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      // The issue is likely that application/json requires a responseSchema in older SDKs or it's throwing a 400
      // Let's test with and without.
    });
    
    // Test 1: plain JSON request
    const result = await model.generateContent(
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      }
    );
    
    console.log("✅ Success!");
    console.log(result.response.text());
    
  } catch (error) {
    console.error('❌ Error calling Gemini:', error);
  }
}

checkGemini();
