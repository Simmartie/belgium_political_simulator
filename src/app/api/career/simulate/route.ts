import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { state, action } = body;

    const isDebug = action.title?.toUpperCase().includes("DEBUG") ||
      action.description?.toUpperCase().includes("DEBUG");

    if (isDebug) {
      return NextResponse.json({
        "metrics_impact": {
          "popularity": -5.0,
          "coalition": -15.0,
          "internal": 2.0
        },
        "analysis": {
          "budgetImpact": "- €1.5B",
          "complexity": "Medium (Legal Review Required)",
          "summary": "DEBUG: Dit is een test voor de Career Mode."
        },
        "personas": [
          { "id": "jan", "name": "Jan", "background": "Havenarbeider uit Antwerpen, Vlaams-nationalist", "score": 65, "quote": "DEBUG: Goed voor Vlaanderen!" },
          { "id": "lucie", "name": "Lucie", "background": "Vakbondslid uit Luik, socialist", "score": 20, "quote": "DEBUG: Dit is een aanval op de werkende klasse." },
          { "id": "guillaume", "name": "Guillaume", "background": "Ondernemer uit Ukkel, rechts-liberaal", "score": 80, "quote": "DEBUG: Goed voor de economie, we moeten doorzetten." },
          { "id": "sofie", "name": "Sofie", "background": "Klimaatactiviste uit Gent, progressief", "score": 40, "quote": "DEBUG: Economie boven ecologie? Teleurstellend." }
        ],
        "institutions": {
          "unions": -30,
          "employers": 25,
          "media": 10,
          "flemishGov": 15,
          "walloonGov": -25
        },
        "map_impact": {
          "antwerpen": 15, "limburg": 10, "oost_vlaanderen": 5, "west_vlaanderen": 5, "vlaams_brabant": 0,
          "hainaut": -20, "liege": -25, "namur": -15, "brabant_wallon": -5, "luxembourg": -10, "bruxelles": -5
        },
        "next_event": {
          "id": "budget_crisis_1",
          "title": "Europese Waarschuwing",
          "description": "De Europese Commissie eist onmiddellijke begrotingsinspanningen. U moet reageren.",
          "type": "budget",
          "requiresResponse": true
        }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is missing in .env.local. Please add GEMINI_API_KEY and restart the server." },
        { status: 500 }
      );
    }

    const prompt = `You are the core simulation engine of a Belgian Political Simulator: Career Mode. 
The player is Prime Minister Bart De Wever (N-VA), leading the 'Arizona' coalition (N-VA, MR, Les Engagés, Vooruit, CD&V).
The current month is ${state.currentMonth} out of 48 (Starting Jan 2025).

Current Metrics:
- Popularity: ${state.metrics.popularity}%
- Coalition Stability: ${state.metrics.coalitionStability}%
- Internal N-VA Stability: ${state.metrics.internalStability}%

${action.type === 'event_response' 
  ? `The player is responding to a crisis event: "${action.event.title}" (${action.event.description}).\nPlayer Response: "${action.response}"` 
  : `The player is implementing a new policy:\nTitle: "${action.title}"\nDescription: "${action.description}"`
}

[YOUR TASK]
Calculate the political impact of this action and generate a JSON response. 

[RULES]
1. Reflect current Belgian politics (e.g. Vooruit is center-left but pragmatic, MR is right-liberal, N-VA is Flemish nationalist & conservative).
2. "Coalition Stability" drops when the player pushes hard-right/Vlaams-nationalist policies without consulting left-wing partners (Vooruit) or centrist partners (CD&V/Les Engagés).
3. Generate realistic reactions for 4 specific personas:
   - "Jan": Antwerp dockworker, Flemish-nationalist (0-100 score + quote).
   - "Lucie": Liege union member, socialist (0-100 score + quote).
   - "Guillaume": Uccle entrepreneur, right-liberal (0-100 score + quote).
   - "Sofie": Ghent climate activist, progressive (0-100 score + quote).
4. (Optional) Generate a 'next_event' if you feel a crisis should spawn based on their action, or just randomly (e.g. budget warning, strike, coalition infighting).

Return ONLY a strict JSON object:
{
  "metrics_impact": {
    "popularity": <number between -20 and 20>,
    "coalition": <number between -30 and 20>,
    "internal": <number between -20 and 20>
  },
  "analysis": {
    "budgetImpact": "<string e.g. '+ €1.2B' or '- €500M' or 'Neutral'>",
    "complexity": "<string e.g. 'Low', 'High (Constitutional Risk)'>",
    "summary": "<Short executive summary>"
  },
  "personas": [
    { "id": "jan", "name": "Jan", "background": "Havenarbeider, Vlaams-nationalist", "score": <0-100>, "quote": "<Dutch quote>" },
    { "id": "lucie", "name": "Lucie", "background": "Vakbondslid, socialist", "score": <0-100>, "quote": "<French/Dutch quote>" },
    { "id": "guillaume", "name": "Guillaume", "background": "Ondernemer, rechts-liberaal", "score": <0-100>, "quote": "<French quote>" },
    { "id": "sofie", "name": "Sofie", "background": "Klimaatactiviste, progressief", "score": <0-100>, "quote": "<Dutch quote>" }
  ],
  "institutions": {
    "unions": <-100 to 100>,
    "employers": <-100 to 100>,
    "media": <-100 to 100>,
    "flemishGov": <-100 to 100>,
    "walloonGov": <-100 to 100>
  },
  "map_impact": {
    "antwerpen": <number>, "limburg": <number>, "oost_vlaanderen": <number>, "west_vlaanderen": <number>, "vlaams_brabant": <number>,
    "hainaut": <number>, "liege": <number>, "namur": <number>, "brabant_wallon": <number>, "luxembourg": <number>, "bruxelles": <number>
  },
  "next_event": null // OR an object { "id": "evt1", "title": "Crisis", "description": "...", "type": "budget", "requiresResponse": true }
}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    let result;
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      result = await model.generateContent(prompt);
    } catch (error: any) {
      console.warn("Gemini 2.5-flash failed, switching to 3-flash...", error.message || error);
      const modelFallback = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      result = await modelFallback.generateContent(prompt);
    }

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned invalid format: " + responseText);

    const parsedData = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Career Simulation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to simulate turn" }, { status: 500 });
  }
}
