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

    const prompt = `You are the core simulation engine of a Belgian Political Simulator. The user is entering a CUSTOM policy written in natural language.
Analyze the policy's text and calculate its numerical impact on Belgium's metrics.

Return strictly a RAW JSON object with no markdown formatting:
{
  "metric_shifts": {
    "budget_deficit": <number between -50.0 and 50.0>,
    "purchasing_power": <number between -50.0 and 50.0>,
    "flemish_satisfaction": <number between -50.0 and 50.0>,
    "walloon_satisfaction": <number between -50.0 and 50.0>,
    "climate_progress": <number between -50.0 and 50.0>,
    "government_stability": <number between -50.0 and 50.0>
  },
  "justification": "<A sharp political news analysis in Dutch (max 3 sentences) explaining the specific consequences of this custom policy in Flanders and Wallonia.>"
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
