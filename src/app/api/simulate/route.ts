import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentMetrics, policy, action } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_api_key_here") {
      console.warn("API key is missing. Using mock response for verification.");
      // Provide a mock response for verification purposes
      return NextResponse.json({
        metric_shifts: {
          budget_deficit: 1.25,
          purchasing_power: -3.5,
          flemish_satisfaction: -8.5,
          walloon_satisfaction: -12.0,
          climate_progress: 0.5,
          government_stability: -5.5
        },
        justification: "Mock analyse: De voorgestelde beleidswijziging leidt tot aanzienlijke debatten in het parlement. Zowel Vlaamse als Waalse media benadrukken de economische gevolgen voor de middenklasse."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are the core simulation engine of a highly realistic Belgian Political Simulator game. Your job is to act as an expert political analyst, economist, and sociologist specializing in Belgian federal and regional politics.

[CONTEXT]
The player is a prominent Belgian politician who has just proposed or toggled a specific policy. You will receive the CURRENT state of the country (metrics) and the POLICY being introduced or repealed.

[YOUR TASK]
Analyze how this policy dynamically interacts with the current Belgian political landscape. Calculate the numerical shifts for the metrics and write a short, sharp political justification (max 3 sentences) in Dutch, capturing the authentic flavor of Belgian media analysis (e.g., VRT NWS, Le Soir).

[BELGIAN NUANCES TO CONSIDER]
1. Communal Balance: A policy that delights Flanders might cause massive outrage in Wallonia (and vice versa). Consider the impact on both language communities separately.
2. Coalition Friction: Bold moves often upset coalition partners. High polarization lowers Government Stability.
3. Socio-Economic Realities: Automatic wage indexation, high tax burdens, and complex state structures are core to the Belgian identity.

[INPUT FORMAT EXPECTED]
{
  "current_metrics": {
    "budget_deficit": -5.0,
    "purchasing_power": 100,
    "flemish_satisfaction": 50,
    "walloon_satisfaction": 50,
    "climate_progress": 40,
    "government_stability": 70
  },
  "policy": {
    "title": "Abolish Automatic Wage Indexation",
    "action": "ENABLE"
  }
}

[OUTPUT FORMAT REQUIRED - MUST BE STRICT, RAW JSON ONLY]
You must respond ONLY with a valid JSON object. Do not include markdown code blocks (no \`\`\`json), no conversational filler, and no text outside the JSON.

{
  "metric_shifts": {
    "budget": 1.5,
    "purchasing_power": -4.2,
    "flemish_satisfaction": -10.0,
    "walloon_satisfaction": -25.0,
    "climate": 0.0,
    "stability": -15.0
  },
  "justification": "De afschaffing van de automatische indexering zorgt voor felle reacties bezuiden de taalgrens, waar de vakbonden onmiddellijk stakingen uitroepen. Terwijl werkgeversorganisaties de maatregel toejuichen omwille van de loonhandicap, keldert uw populariteit bij de werkende Vlaming en Waal door het onmiddellijke koopkrachtverlies."
}

Here is the actual INPUT:
{
  "current_metrics": ${JSON.stringify(currentMetrics)},
  "policy": {
    "title": "${policy.title}",
    "action": "${action}"
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
