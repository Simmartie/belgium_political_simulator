import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentMetrics, policy } = body;

    // MOCK MODE: If title or description contains "DEBUG", return static data immediately
    const isDebug = policy.title.toUpperCase().includes("DEBUG") || 
                    policy.description.toUpperCase().includes("DEBUG");

    if (isDebug) {
      return NextResponse.json({
        "metric_shifts": {
          "budget_deficit": -5.5,
          "purchasing_power_index": 12.0,
          "climate_progress": 8.5
        },
        "metric_explanations": {
          "budget_deficit": "DEBUG: Dit is een test-uitleg voor het begrotingstekort. De kosten zijn gedaald door simulatie.",
          "purchasing_power_index": "DEBUG: De koopkracht stijgt fors in deze testmodus om de UI-badges te verifiëren.",
          "climate_progress": "DEBUG: Klimaatdoelen worden sneller gehaald in deze gesimuleerde omgeving."
        },
        "province_reactions": {
          "antwerpen": 45, "limburg": 30, "oost_vlaanderen": 20, "west_vlaanderen": 15, "vlaams_brabant": 10,
          "hainaut": -40, "liege": -35, "namur": -25, "brabant_wallon": -15, "luxembourg": -10, "bruxelles": 50
        },
        "province_explanations": {
          "flanders": "Vlaanderen reageert positief op deze test-simulatie.",
          "wallonia": "Wallonië is kritisch over de resultaten van deze DEBUG-run.",
          "brussels": "Brussel is enthousiast over de technologische vooruitgang."
        },
        "media_reactions": {
          "socialist": "Een technocratisch experiment dat de sociale realiteit negeert.",
          "liberal": "Eindelijk een efficiënte aanpak, zelfs als het slechts een test is.",
          "nationalist": "Een interessant resultaat, maar waar blijft de regionale autonomie?",
          "christian_democrat": "We moeten de balans bewareen tussen simulatie en realiteit."
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

    const prompt = `You are the core simulation engine of a Belgian Political Simulator. The user is proposing a CUSTOM policy.

[IMPACT SCALING RULES - THE T-DISTRIBUTION LOGIC]
1. FAT-TAILED MAGNITUDE: Scale your numerical impacts based purely on the severity and realism of the policy. Think of the distribution of impacts like a Student's t-distribution (no strict artificial caps like ±5):
   - Routine/Minor policies (e.g., a small subsidy, naming a street) = Minor shifts (±0.1 to ±2.0)
   - Major policies (e.g., standard tax hike, pension age adjustment) = Moderate shifts (±2.0 to ±8.0)
   - Historic/Extreme policies (e.g., splitting the country, 0% income tax, abolishing the army, massive wealth confiscation) = Extreme shockwaves (±15.0 to ±50.0 or more). Do not shy away from extreme numbers if the policy warrants a historic national crisis or euphoria.
2. MAINTAIN NUANCE: Even in extreme scenarios, remember the political baseline. Wallonia has a strong right-wing/liberal voter base (e.g., MR party) and Flanders has a strong left-wing base in cities. Almost no policy has 0% or 100% support. Avoid dropping a region's or province's support entirely to absolute zero instantly unless it is a mathematically absolute consequence.

[CONTEMPORARY POLITICAL CONTEXT]
CRITICAL: Do NOT rely on outdated historical stereotypes for the ideological media reactions or explanations. You must use your knowledge of the most recent, contemporary political landscape of Belgium. Reflect the actual, nuanced current-day platforms of major parties (e.g., N-VA, Vooruit, MR, Les Engagés, CD&V). If a party has shifted its stance recently (for example, regarding the European Union, migration, or state reform), your reasoning and media reactions MUST reflect this modern reality.

Calculate the impact and return ONLY a strict RAW JSON object in this format with no markdown code blocks:
{
  "metric_shifts": {
    "budget_deficit": 0.5,
    "purchasing_power_index": -1.2,
    "climate_progress": 0.2
  },
  "metric_explanations": {
    "budget_deficit": "Uitleg hier",
    "purchasing_power_index": "Uitleg hier",
    "climate_progress": "Uitleg hier"
  },
  "province_reactions": {
    "antwerpen": 5, "limburg": 5, "oost_vlaanderen": 5, "west_vlaanderen": 5, "vlaams_brabant": 5,
    "hainaut": -5, "liege": -5, "namur": -5, "brabant_wallon": -5, "luxembourg": -5, "bruxelles": 0
  },
  "province_explanations": {
    "flanders": "Uitleg over Vlaanderen",
    "wallonia": "Uitleg over Wallonië",
    "brussels": "Uitleg over Brussel"
  },
  "media_reactions": {
    "socialist": "Reactie", "liberal": "Reactie", "nationalist": "Reactie", "christian_democrat": "Reactie"
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

    const genAI = new GoogleGenerativeAI(apiKey);
    let result;

    try {
      // Primary attempt with gemini-2.5-flash
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      result = await model.generateContent(prompt);
    } catch (error) {
      console.warn("Gemini 2.5-flash failed, falling back to 3.0-flash...", error);
      try {
        // Fallback attempt with gemini-3.0-flash
        const modelFallback = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });
        result = await modelFallback.generateContent(prompt);
      } catch (fallbackError: any) {
        throw new Error(`Both Gemini 2.5 and 3.0 failed: ${fallbackError.message}`);
      }
    }

    let responseText = result.response.text();

    // More robust JSON extraction
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI returned invalid format: " + responseText);
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Simulation Engine Error:", error);
    return NextResponse.json({ error: error.message || "Failed to simulate policy" }, { status: 500 });
  }
}
