const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateTravelPlan = async (req, res) => {
  try {
    const { destination, durationDays, budgetTier, interests } = req.body;

    const prompt = `
Create a detailed travel plan in JSON format only.

Destination: ${destination}
Duration: ${durationDays} Days
Budget Type: ${budgetTier}
Interests: ${interests.join(", ")}

Return the response strictly in the following JSON format:

{
  "budget": {
    "flights": number,
    "accommodation": number,
    "food": number,
    "activities": number,
    "total": number
  },

  "hotels": [
    {
      "hotel_name": "",
      "hotel_type": "",
      "rating": 0,
      "price_per_night": 0
    }
  ],

  "packing": [
    {
      "item_name": "",
      "category": ""
    }
  ],

  "itinerary": [
    {
      "day": 1,
      "activities": [
        {
          "title": "",
          "description": "",
          "estimated_cost": 0,
          "time_of_day": "Morning"
        }
      ]
    }
  ]
}

Rules:
1. Return only valid JSON.
2. Do not include markdown.
3. Do not include explanations.
4. Use only Morning, Afternoon, or Evening for time_of_day.
5. Generate at least 2 activities for each day.
6. Suggest 3 hotels.
7. Include common travel items and destination-specific packing items.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const tripPlan = JSON.parse(response.text);

    return res.status(200).json(tripPlan);
  } catch (error) {
    try {
      const parsedErrorObject = JSON.parse(error.message);

      console.log("Gemini Error:", parsedErrorObject.error.message);

      return res.status(500).json({
        message:
          parsedErrorObject.error.message || "Error generating trip plan",
      });
    } catch (parseError) {
      console.log("Gemini Error:", error.message);

      return res.status(500).json({
        message: error.message || "Error generating trip plan",
      });
    }
  }
};

module.exports = {
  generateTravelPlan,
};
