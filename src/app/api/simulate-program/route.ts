import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const groqApiKey = process.env.GROQ_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiApiKey2 = process.env.GEMINI_API_KEY2;
    const geminiApiKey3 = process.env.GEMINI_API_KEY3;

    if (!groqApiKey && !geminiApiKey) {
      return NextResponse.json(
        { error: "API keys are missing in .env.local. Please add GEMINI_API_KEY or GROQ_API_KEY and restart the server." },
        { status: 500 }
      );
    }

    const prompt = `You are the core simulation engine of a Belgian Political Simulator. The user is proposing an ENTIRE PARTY PROGRAM containing multiple policies.

[IMPACT SCALING RULES]
Evaluate the combined effect of all policies in the program.

[CONTEMPORARY POLITICAL CONTEXT]
Based on the full program, estimate the percentage of votes this program could secure in each province (0-100%).
Also, estimate how much this program matches the ideology of existing Belgian political parties (0-100%).
Reflect strict Belgian party ideologies:
- N-VA: Flemish nationalist, conservative on culture/ethics, economically right.
- Vooruit: Center-left, VERY progressive on ethical issues (LGBTQ+, abortion). They ALWAYS support progressive ethical policies.
- MR & Open Vld: Right-liberal, pro-business, but ethically progressive/secular.
- CD&V & Les Engagés: Centrist, Christian-democrat, moderate on ethics. CD&V has strong union ties.
- PS: Left-wing, strong on social security/unions, ethically progressive.
- Groen/Ecolo: Left-wing, climate-focused, VERY progressive on ethical issues.
- Vlaams Belang: Far-right, highly conservative, anti-immigration.
- PVDA/PTB: Radical left, pro-worker, ethically progressive.
CRITICAL: Progressive parties (Vooruit, Groen, PS, PTB, MR, Open Vld) MUST react positively to progressive ethical policies (like abortion or LGBTQ+ rights).

LOGICAL CONSISTENCY (CHAIN OF THOUGHT):
- You MUST fill out the 'reasoning_scratchpad' field FIRST. Use this field to explicitly evaluate how the program aligns with the predefined ideologies of each party.
- Your final numbers MUST strictly follow the logic established in your scratchpad. A left-wing program must consistently get left-wing support; a right-wing program must consistently get right-wing support. Do not contradict yourself.

Calculate the impact and return ONLY a strict RAW JSON object in this format with no markdown code blocks:
{
  "reasoning_scratchpad": "<Step-by-step logic detailing how this program strictly aligns or conflicts with the core ideologies of N-VA, Vooruit, MR, CD&V, PS, Groen, and Vlaams Belang. Evaluate this FIRST.>",
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

    let responseText = "";
    let switchMessage = null;

    try {
      if (!geminiApiKey && !geminiApiKey2 && !geminiApiKey3) {
         throw new Error("No Gemini API keys available");
      }
      
      const apiKeys = [
        { key: geminiApiKey, name: "GEMINI_API_KEY 1" },
        { key: geminiApiKey2, name: "GEMINI_API_KEY 2" },
        { key: geminiApiKey3, name: "GEMINI_API_KEY 3" }
      ].filter(k => k.key);

      const primaryModels = [
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3.0-flash"
      ];
      
      const secondaryModels = [
        "gemini-3.5-flash-lite",
        "gemini-2.5-flash",
        "gemini-3.1-lite"
      ];

      let geminiSuccess = false;

      // Phase 1: Try primary models across all available keys sequentially
      for (let i = 0; i < apiKeys.length; i++) {
        const apiKeyObj = apiKeys[i];
        const genAI = new GoogleGenerativeAI(apiKeyObj.key!);
        
        for (const modelName of primaryModels) {
          try {
            const model = genAI.getGenerativeModel({ 
              model: modelName,
              generationConfig: { responseMimeType: "application/json" }
            });
            
            const result = await model.generateContent(prompt);
            responseText = result.response.text();
            geminiSuccess = true;
            console.log(`Successfully used ${modelName} on ${apiKeyObj.name}`);
            
            if (i > 0 || modelName !== primaryModels[0]) {
               switchMessage = `Switched to model ${modelName} via ${apiKeyObj.name} to avoid rate limits.`;
            }
            break;
          } catch (e: any) {
            console.warn(`Failed to use ${modelName} on ${apiKeyObj.name}:`, e.message || e);
          }
        }
        if (geminiSuccess) break;
      }

      // Phase 2: If primary models failed on all keys, try secondary models across all keys
      if (!geminiSuccess) {
        for (let i = 0; i < apiKeys.length; i++) {
          const apiKeyObj = apiKeys[i];
          const genAI = new GoogleGenerativeAI(apiKeyObj.key!);
          
          for (const modelName of secondaryModels) {
            try {
              const model = genAI.getGenerativeModel({ 
                model: modelName,
                generationConfig: { responseMimeType: "application/json" }
              });
              
              const result = await model.generateContent(prompt);
              responseText = result.response.text();
              geminiSuccess = true;
              console.log(`Successfully used fallback ${modelName} on ${apiKeyObj.name}`);
              switchMessage = `Primary models exhausted. Switched to fallback ${modelName} via ${apiKeyObj.name}.`;
              break;
            } catch (e: any) {
              console.warn(`Failed to use fallback ${modelName} on ${apiKeyObj.name}:`, e.message || e);
            }
          }
          if (geminiSuccess) break;
        }
      }

      if (!geminiSuccess) {
        throw new Error("All Gemini models across all keys failed or rate limited.");
      }

    } catch (geminiError) {
      console.warn("Gemini API fallback loop exhausted, falling back to Groq...", geminiError);
      
      if (!groqApiKey) {
        throw new Error("Both Gemini and Groq APIs failed or are missing.");
      }
      
      const groq = new Groq({ apiKey: groqApiKey });
      let chatCompletion;
      
      try {
        chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" }
        });
      } catch (apiError: any) {
        if (apiError.status === 429 || apiError.message?.includes("Rate limit")) {
          console.warn("Rate limit reached for llama-3.3-70b-versatile, falling back to llama-3.1-8b-instant");
          chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
          });
        } else {
          throw apiError;
        }
      }
      
      switchMessage = "All Gemini keys exhausted. Switched to Groq (Llama) as ultimate fallback.";
      responseText = chatCompletion.choices[0]?.message?.content || "";
    }
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI returned invalid format: " + responseText);
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    if (switchMessage) {
       parsedData.apiSwitchMessage = switchMessage;
    }
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Program Simulation Engine Error:", error);
    return NextResponse.json({ error: error.message || "Failed to simulate program" }, { status: 500 });
  }
}
