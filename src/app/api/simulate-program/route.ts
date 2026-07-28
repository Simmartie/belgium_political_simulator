import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { policies, currentMetrics } = body; // policies is an array of strings/objects

    // MOCK MODE: If any policy title or description contains "DEBUG", return static data immediately
    const isDebug = policies.some((p: any) => 
      p.title.toUpperCase().includes("DEBUG") || p.description.toUpperCase().includes("DEBUG")
    );

    if (isDebug) {
      return NextResponse.json({
        "metric_shifts": {
          "budget_deficit": -2.5,
          "gdp_total": 12.0,
          "inflation_rate": 0.5,
          "purchasing_power_index": 5.0,
          "climate_progress": 4.5
        },
        "metric_explanations": {
          "budget_deficit": "DEBUG: Het partijprogramma helpt het begrotingstekort.",
          "gdp_total": "DEBUG: De economie groeit aanzienlijk.",
          "inflation_rate": "DEBUG: Er is een lichte stijging van de inflatie.",
          "purchasing_power_index": "DEBUG: Koopkracht stijgt.",
          "climate_progress": "DEBUG: Klimaatdoelen worden sneller gehaald."
        },
        "province_votes": {
          "antwerpen": 25, "limburg": 20, "oost_vlaanderen": 18, "west_vlaanderen": 22, "vlaams_brabant": 15,
          "hainaut": 5, "liege": 8, "namur": 6, "brabant_wallon": 12, "luxembourg": 4, "bruxelles": 10
        },
        "province_explanations": {
          "flanders": "Vlaanderen is overwegend positief.",
          "wallonia": "Wallonië is minder overtuigd.",
          "brussels": "Brussel twijfelt nog."
        },
        "party_matches": {
          "N-VA": 45, "Vlaams Belang": 30, "Vooruit": 60, "CD&V": 50, "Open Vld": 40, "Groen": 70, "PVDA": 80,
          "MR": 35, "PS": 65, "Les Engagés": 45, "Ecolo": 75, "DéFI": 40
        }
      });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is missing in .env.local. Please add GROQ_API_KEY and restart the server." },
        { status: 500 }
      );
    }

    const prompt = `You are the core simulation engine of a Belgian Political Simulator. The user is proposing an ENTIRE PARTY PROGRAM containing multiple policies.

[IMPACT SCALING RULES]
Evaluate the combined effect of all policies in the program.

[CONTEMPORARY POLITICAL CONTEXT]
Based on the full program, estimate the percentage of votes this program could secure in each province (0-100%).
Also, estimate how much this program matches the ideology of existing Belgian political parties (0-100%).

Calculate the impact and return ONLY a strict RAW JSON object in this format with no markdown code blocks:
{
  "metric_shifts": {
    "budget_deficit": 0.5,
    "gdp_total": 2.5,
    "inflation_rate": 0.1,
    "purchasing_power_index": -1.2,
    "climate_progress": 0.2
  },
  "metric_explanations": {
    "budget_deficit": "Uitleg hier",
    "gdp_total": "Uitleg hier",
    "inflation_rate": "Uitleg hier",
    "purchasing_power_index": "Uitleg hier",
    "climate_progress": "Uitleg hier"
  },
  "province_votes": {
    "antwerpen": 15.5, "limburg": 12.0, "oost_vlaanderen": 14.5, "west_vlaanderen": 16.0, "vlaams_brabant": 13.5,
    "hainaut": 5.5, "liege": 6.0, "namur": 4.5, "brabant_wallon": 8.0, "luxembourg": 5.0, "bruxelles": 10.0
  },
  "province_explanations": {
    "flanders": "Uitleg over Vlaanderen",
    "wallonia": "Uitleg over Wallonië",
    "brussels": "Uitleg over Brussel"
  },
  "party_matches": {
    "N-VA": 45, "Vlaams Belang": 10, "Vooruit": 80, "CD&V": 50, "Open Vld": 30, "Groen": 85, "PVDA": 70,
    "MR": 25, "PS": 75, "Les Engagés": 40, "Ecolo": 80, "DéFI": 35
  }
}

Here is the actual INPUT:
{
  "current_metrics": ${JSON.stringify(currentMetrics)},
  "program": ${JSON.stringify(policies)}
}`;

    const groq = new Groq({ apiKey });

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    console.log(`Program Simulation successful using Groq llama-3.3-70b-versatile`);

    let responseText = chatCompletion.choices[0]?.message?.content || "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI returned invalid format: " + responseText);
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Program Simulation Engine Error:", error);
    return NextResponse.json({ error: error.message || "Failed to simulate program" }, { status: 500 });
  }
}
