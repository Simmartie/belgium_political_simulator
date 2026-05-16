import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentMetrics, policy, action } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is missing in .env.local. Please add GEMINI_API_KEY and restart the server." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are the core simulation engine of a Belgian Political Simulator. The user is proposing a CUSTOM policy.

[IMPACT SCALING RULES - THE T-DISTRIBUTION LOGIC]
1. FAT-TAILED MAGNITUDE: Scale your numerical impacts based purely on the severity and realism of the policy. Think of the distribution of impacts like a Student's t-distribution (no strict artificial caps like ±5):
   - Routine/Minor policies (e.g., a small subsidy, naming a street) = Minor shifts (±0.1 to ±2.0)
   - Major policies (e.g., standard tax hike, pension age adjustment) = Moderate shifts (±2.0 to ±8.0)
   - Historic/Extreme policies (e.g., splitting the country, 0% income tax, abolishing the army, massive wealth confiscation) = Extreme shockwaves (±15.0 to ±50.0 or more). Do not shy away from extreme numbers if the policy warrants a historic national crisis or euphoria.
2. MAINTAIN NUANCE: Even in extreme scenarios, remember the political baseline. Wallonia has a strong right-wing/liberal voter base (e.g., MR party) and Flanders has a strong left-wing base in cities. Almost no policy has 0% or 100% support. Avoid dropping a region's or province's support entirely to absolute zero instantly unless it is a mathematically absolute consequence.

Calculate the impact and return ONLY a strict RAW JSON object in this format with no markdown code blocks:
{
  "metric_shifts": {
    "budget_deficit": <number representing percentage point shift, no hard limits>,
    "purchasing_power_index": <number representing index shift, no hard limits>,
    "climate_progress": <number representing percentage point shift, no hard limits>
  },
  "province_reactions": {
    "antwerpen": <number between -100 and 100, where 0 is neutral>,
    "limburg": <number between -100 and 100>,
    "oost_vlaanderen": <number between -100 and 100>,
    "west_vlaanderen": <number between -100 and 100>,
    "vlaams_brabant": <number between -100 and 100>,
    "hainaut": <number between -100 and 100>,
    "liege": <number between -100 and 100>,
    "namur": <number between -100 and 100>,
    "brabant_wallon": <number between -100 and 100>,
    "luxembourg": <number between -100 and 100>,
    "bruxelles": <number between -100 and 100>
  },
  "media_reactions": {
    "socialist": "<1 sharp sentence from a left-wing perspective in Dutch>",
    "liberal": "<1 sharp sentence from a free-market/liberal perspective in Dutch>",
    "nationalist": "<1 sharp sentence from a Flemish-nationalist or conservative perspective in Dutch>",
    "christian_democrat": "<1 sharp sentence from a centrist/institutional perspective in Dutch>"
  }
}

Here is the actual INPUT:
{
  "current_metrics": ${JSON.stringify(currentMetrics)},
  "policy": {
    "title": "${policy.title}",
    "description": "${policy.description}"
  }
}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Clean up markdown formatting if the model still returns it
    if (responseText.startsWith('\`\`\`json')) {
      responseText = responseText.substring(7);
    }
    if (responseText.startsWith('\`\`\`')) {
      responseText = responseText.substring(3);
    }
    if (responseText.endsWith('\`\`\`')) {
      responseText = responseText.substring(0, responseText.length - 3);
    }

    const parsedData = JSON.parse(responseText.trim());

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Simulation Engine Error:", error);
    return NextResponse.json({ error: error.message || "Failed to simulate policy" }, { status: 500 });
  }
}
