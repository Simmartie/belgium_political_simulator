import { NextResponse } from "next/server";
import Groq from "groq-sdk";
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
        "party_satisfaction_impact": [
          { "party": "Vooruit", "shift": -15 },
          { "party": "N-VA", "shift": 5 }
        ],
        "coalition_changes": [],
        "analysis": {
          "budgetImpact": "- €1.5B",
          "complexity": "Medium (Legal Review Required)",
          "summary": "DEBUG: Dit is een test voor de Career Mode."
        },
        "economy_impact": {
          "budgetDeficit": 0.2,
          "gdp": -1.5,
          "inflation": 0.1,
          "purchasingPower": -2.0,
          "climateGoals": -1.0
        },
        "opposition_reaction": [
          { "party": "PS", "quote": "DEBUG: Dit is onaanvaardbaar.", "stance": "negative" }
        ],
        "media_headlines": [
          { "id": "hln", "outlet": "Het Laatste Nieuws (HLN)", "bias": "Mainstream Vlaams", "score": 65, "headline": "DEBUG: Goed voor Vlaanderen!" },
          { "id": "lesoir", "outlet": "Le Soir", "bias": "Mainstream Franstalig", "score": 20, "headline": "DEBUG: Dit is een aanval op de werkende klasse." },
          { "id": "tijd", "outlet": "De Tijd", "bias": "Financieel-economisch", "score": 80, "headline": "DEBUG: Goed voor de economie, we moeten doorzetten." },
          { "id": "morgen", "outlet": "De Morgen", "bias": "Progressief Vlaams", "score": 40, "headline": "DEBUG: Economie boven ecologie? Teleurstellend." }
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
          "source": "SITUATION REPORT",
          "title": "Europese Waarschuwing",
          "context": "De Europese Commissie heeft officieel aan de bel getrokken over het oplopende begrotingstekort. Buitenlandse investeerders kijken nerveus toe. De vakbonden roepen echter op om niet in de zorg te snijden.",
          "description": "De Europese Commissie eist onmiddellijke begrotingsinspanningen. U moet reageren.",
          "type": "budget",
          "requiresResponse": true
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

    const enactedPolicies = state.history && state.history.length > 0 
      ? state.history.map((turn: any) => `- Month ${turn.month}: ${turn.actionTitle} (${turn.actionDescription})`).join('\\n')
      : "None yet.";

    const startYear = state.startYear || 2025;
    const startMonth = state.startMonth || 1;
    const maxMonths = state.maxMonths || 48;
    const date = new Date(startYear, startMonth - 1 + state.currentMonth - 1);
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    const currentYear = date.getFullYear();

    let historicalContext = "";
    if (state.gameMode === "vivaldi") {
      if (currentYear === 2020 || currentYear === 2021) {
        historicalContext = `\\nHISTORICAL CONTEXT: The year is ${currentYear}. The dominant global crisis is the COVID-19 pandemic. Hospitals are struggling, and lockdowns or restrictions are a constant political debate. You must generate events relating to this.`;
      } else if (currentYear === 2022) {
        historicalContext = `\\nHISTORICAL CONTEXT: The year is ${currentYear}. The dominant global crisis is the Russian invasion of Ukraine, leading to a massive European energy crisis and inflation. You must generate events relating to this.`;
      } else if (currentYear >= 2023) {
        const budgetWarning = state.economy.budgetDeficit > 4.0 ? " and severe budget deficits" : "";
        historicalContext = `\\nHISTORICAL CONTEXT: The year is ${currentYear}. The Gaza conflict${budgetWarning} dominate the political landscape. You must generate events relating to this.`;
      }
    }

    const prompt = `You are the core simulation engine of a Belgian Political Simulator: Career Mode. 
The player is the Prime Minister from the ${state.playerParty || "N-VA"} party.
They are leading a coalition consisting of: ${state.parliament.filter((p: any) => p.isCoalition).map((p: any) => p.party).join(', ')}.
The current date is ${monthName} ${currentYear} (Month ${state.currentMonth} out of ${maxMonths}).${historicalContext}

Current Metrics:
- Popularity: ${state.metrics.popularity}%
- Coalition Stability: ${state.metrics.coalitionStability}%
- Internal Party Stability: ${state.metrics.internalStability}%

Current Coalition Partners & Satisfaction (0-100):
${state.parliament.filter((p: any) => p.isCoalition).map((p: any) => `- ${p.party}: ${p.satisfaction}%`).join('\\n')}

Current Economy:
- Budget Deficit: ${state.economy.budgetDeficit}% of GDP
- GDP: ${state.economy.gdp} Billion EUR
- Inflation: ${state.economy.inflation}%
- Purchasing Power Index: ${state.economy.purchasingPower}
- Climate Goals Progress: ${state.economy.climateGoals}%

Global Macro-Economic Context: ${state.globalContext}

Enacted Policies (Active Laws from Previous Months):
${enactedPolicies}

${action.event
  ? `The player is responding to a crisis event: "${action.event.title}"\\nEvent Background Context: "${action.event.context}"\\nEvent Description: "${action.event.description}"\\n\\nTheir policy response is:\\nTitle: "${action.title}"\\nDescription: "${action.description}"`
  : `The player is implementing a new policy:\\nTitle: "${action.title}"\\nDescription: "${action.description}"`
}
[YOUR TASK]
Calculate the political impact of this action and generate a JSON response. 

[RULES]
1. Reflect strict Belgian party ideologies and RED LINES:
   - N-VA: Flemish nationalist, conservative on culture/ethics, economically right. RED LINE: Re-federalizing powers back to the federal level.
   - Vooruit: Center-left, VERY progressive on ethical issues (LGBTQ+, abortion). RED LINE: Abolishing indexation of wages.
   - MR & Open Vld: Right-liberal, pro-business. RED LINE: Introducing a massive new wealth tax.
   - CD&V & Les Engagés: Centrist, Christian-democrat. RED LINE: Abolishing child benefits.
   - PS: Left-wing, strong on social security/unions. RED LINE: Slashing pensions or unemployment benefits.
   - Groen/Ecolo: Left-wing, climate-focused. RED LINE: Opening new nuclear plants without investments in renewables.
   - Vlaams Belang: Far-right, highly conservative.
   - PVDA/PTB: Radical left, pro-worker.
   CRITICAL VETO RULE: If the player enacts a policy that crosses a coalition partner's RED LINE, you MUST drop their satisfaction to 0 and spawn a 'critical' next_event where they threaten to collapse the government immediately. Progressive parties (Vooruit, Groen, PS, PTB, MR, Open Vld) MUST react positively to progressive ethical policies, regardless of who proposes them.
2. "Coalition Stability" drops when the player pushes policies that directly contradict the core ideologies of their coalition partners.
3. MEDIA FRAMING (Newspapers):
   - Generate realistic headlines from 4 specific media outlets to reflect how the policy is framed in the press. Do NOT use personas.
     * "Het Laatste Nieuws (HLN)": Mainstream, popular Flemish newspaper (0-100 sentiment score + headline).
     * "De Tijd": Financial/Business-focused Flemish newspaper (0-100 sentiment score + headline).
     * "De Morgen": Progressive, left-leaning Flemish newspaper (0-100 sentiment score + headline).
     * "Le Soir": Mainstream Francophone newspaper (0-100 sentiment score + headline).
   CRITICAL FOR MEDIA: Make the headlines sound like authentic, punchy newspaper titles. Don't force topics (like climate or finance) if the policy is about something else. Reflect their specific editorial bias naturally.
4. EVALUATION & PUNISHMENT FOR CRISIS RESPONSES:
   - If the player gives a BAD, weak, dismissive, or contradictory response to a crisis (e.g., ignoring a partner party's core demand or making arrogant statements):
     * Heavily punish their metrics: drop Coalition Stability (-15 to -30), Popularity (-10 to -20), or Institutional approval.
     * If the response is catastrophically bad, you MAY spawn an escalating follow-up 'next_event' (e.g. "Vooruit Formally Leaves Government" or "National General Strike").
   - If the player gives a GOOD, diplomatic, or compromise response:
     * Reward them or minimize damage (e.g. +5 to +15 Coalition/Popularity).
     * Set 'next_event' to null to successfully resolve the crisis.
5. ECONOMIC IMPACT & OPPOSITION:
   - You MUST estimate the impact of the policy on the 5 economy indicators (budgetDeficit, gdp, inflation, purchasingPower, climateGoals). Values can be positive or negative.
   - You MUST generate at least one reaction from the opposition (e.g. PS, PTB, Vlaams Belang, Groen). Provide their party name, a sharp quote (Dutch or French), and their stance.
6. COALITION PARTNER SATISFACTION:
   - You MUST calculate a 'party_satisfaction_impact' (e.g. -15 or +10) for each coalition partner based on how much they like the policy.
   - If a partner's satisfaction drops very low (< 30) or you completely ignore their core demands, you MUST generate a crisis 'next_event' where they threaten to leave the government. CRITICAL: In the event description, you MUST explicitly state their CONCRETE and ACTIONABLE demand (e.g., "They demand an extra €500M for healthcare" or "They demand the immediate cancellation of the tax cut"). The player needs to know exactly what policy they must enact to save the coalition.
   - If a partner is critically angry and the player's current action is a bad response to their threat, they WILL leave the government. In that case, add them to 'coalition_changes' with action 'left'.
7. FREQUENCY & GENERATION OF EVENTS:
   - If currentMonth is 1, 'next_event' MUST BE null. The first month is always event-free.
   - DYNAMIC EVENT GENERATION: Assess the situation realistically to decide if 'next_event' should be an event or null:
     * PACING: You MUST leave 'next_event' as null roughly 20% of the time (1 out of 5 months) to give the player "free months" where they can proactively enact their own legislation. The other 80% of the time, you MUST generate an interesting event or situation.
     * EXOGENOUS SHOCKS: To keep the game realistic, occasionally generate completely unexpected, random external events that the player has no control over. Examples of themes (create your own!): natural disasters (floods, droughts), geopolitical crises (NATO requests, sudden wars), global economic shocks, or unexpected domestic tragedies.
     * CAUSAL EVENTS: If there is an unresolved severe crisis from a previous turn, if the player enacts a highly controversial measure, or if the economy performs poorly, you MUST spawn a crisis event related to that.
   - Events MUST include a 'severity' level ('low', 'medium', 'high', 'critical').
   - If the player's response to an event is "ignore" or "do nothing": 'low'/'medium' crises might resolve themselves, but 'high'/'critical' crises will escalate severely.
   - Events should be realistic "Situation Reports" or direct consequences of the player's previous actions. CRITICAL: When generating an event, you MUST use the 'context' field to explicitly state WHY this event is happening, especially if it is a consequence of the player's action (e.g. "Because the player embedded abortion in the constitution last turn, conservative groups are protesting"). This 'context' will be fed back to you next turn so you remember the exact cause.
8. LOGICAL CONSISTENCY (CHAIN OF THOUGHT):
   - You MUST fill out the 'reasoning_scratchpad' field FIRST. Use this field to explicitly evaluate how the policy aligns with the predefined ideologies of each party before assigning any scores or generating quotes.
   - CRITICAL: Read the player's action carefully! Do NOT hallucinate policy mechanisms. If the player says "Invest in X", it costs budget but does NOT raise taxes. If the player says "Tax Y", it raises taxes. Do not assume "climate policy" automatically equals "energy price hikes" unless the player specifically introduced a tax. Evaluate exactly what the player wrote.
   - Your final numbers and quotes MUST strictly follow the logic established in your scratchpad. A left-wing policy must consistently get left-wing support; a right-wing policy must consistently get right-wing support. Do not contradict yourself or assign random reactions.
9. LONG-TERM COMPOUNDING EFFECTS:
   - The player has enacted several policies in previous months (see "Enacted Policies").
   - You MUST consider the continuous, long-term effects of these active laws on the current economy and popularity. For example, if a previous policy was "Raise interest rates", it should continue to lower inflation this month. If they "Subsidize green energy", it should continue to improve climate goals but cost budget.
   - Dynamically deduce these ongoing effects and factor them into your final \`economy_impact\` and \`metrics_impact\` numbers for THIS turn. Do not wait for me to hardcode them.
10. MACRO-ECONOMIC CONTEXT:
    - You MUST judge the player's economic policies against the backdrop of the 'Global Macro-Economic Context'. For example, tax cuts during a "Tech Boom" work well, but during a "European Economic Recession" they will cause a massive deficit spike.

Return ONLY a strict JSON object:
{
  "reasoning_scratchpad": "<Step-by-step logic detailing how this policy strictly aligns or conflicts with the core ideologies of N-VA, Vooruit, MR, CD&V, PS, Groen, and Vlaams Belang. Evaluate this FIRST.>",
  "metrics_impact": {
    "popularity": <number between -20 and 20>,
    "coalition": <number between -30 and 20>,
    "internal": <number between -20 and 20>
  },
  "economy_impact": {
    "budgetDeficit": <number, e.g. -0.2 (deficit decreases) or 0.5 (deficit increases)>,
    "gdp": <number, e.g. 1.5 or -2.0>,
    "inflation": <number, e.g. 0.1 or -0.3>,
    "purchasingPower": <number, e.g. -1.5 or 2.0>,
    "climateGoals": <number, e.g. 1.0 or -0.5>
  },
  "party_satisfaction_impact": [
    { "party": "<Party Name>", "shift": <number> }
  ],
  "coalition_changes": [
    { "party": "<Party Name>", "action": "left" }
  ],
  "analysis": {
    "budgetImpact": "<string e.g. '+ €500M' (MUST USE '+' if the policy SAVES money or generates revenue) or '- €500M' (MUST USE '-' if the policy COSTS money)>",
    "complexity": "<string e.g. 'Low', 'High (Constitutional Risk)'>",
    "summary": "<Short executive summary>"
  },
  "opposition_reaction": [
    { "party": "<Party Name>", "quote": "<Quote>", "stance": "<positive|neutral|negative>" }
  ],
  "media_headlines": [
    { "id": "hln", "outlet": "Het Laatste Nieuws (HLN)", "bias": "Mainstream Vlaams", "score": <0-100>, "headline": "<Dutch headline>" },
    { "id": "tijd", "outlet": "De Tijd", "bias": "Financieel-economisch", "score": <0-100>, "headline": "<Dutch headline>" },
    { "id": "morgen", "outlet": "De Morgen", "bias": "Progressief Vlaams", "score": <0-100>, "headline": "<Dutch headline>" },
    { "id": "lesoir", "outlet": "Le Soir", "bias": "Mainstream Franstalig", "score": <0-100>, "headline": "<French headline>" }
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
  "next_event": null // OR an object: { "id": "evt1", "source": "SITUATION REPORT", "title": "Crisis Name", "context": "Detailed background...", "description": "What happens...", "type": "budget", "severity": "low|medium|high|critical", "requiresResponse": true }
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
      ].filter(k => k.key); // Only keep the ones that actually exist in .env

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
            
            // Generate popup message if we had to switch key or model away from the absolute ideal first try
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
          // Fallback to another model if rate limited
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
    if (!jsonMatch) throw new Error("AI returned invalid format: " + responseText);

    const parsedData = JSON.parse(jsonMatch[0]);

    // Defensive programming: ensure all required objects exist to prevent frontend crashes
    parsedData.metrics_impact = parsedData.metrics_impact || { popularity: 0, coalition: 0, internal: 0 };
    parsedData.economy_impact = parsedData.economy_impact || { budgetDeficit: 0, gdp: 0, inflation: 0, purchasingPower: 0, climateGoals: 0 };
    parsedData.party_satisfaction_impact = parsedData.party_satisfaction_impact || [];
    parsedData.coalition_changes = parsedData.coalition_changes || [];
    parsedData.analysis = parsedData.analysis || { budgetImpact: "Neutral", complexity: "Low", summary: "AI failed to provide a summary." };
    parsedData.opposition_reaction = parsedData.opposition_reaction || [];
    parsedData.media_headlines = parsedData.media_headlines || [];
    parsedData.institutions = parsedData.institutions || { unions: 0, employers: 0, media: 0, flemishGov: 0, walloonGov: 0 };
    parsedData.map_impact = parsedData.map_impact || { antwerpen: 0, limburg: 0, oost_vlaanderen: 0, west_vlaanderen: 0, vlaams_brabant: 0, hainaut: 0, liege: 0, namur: 0, brabant_wallon: 0, luxembourg: 0, bruxelles: 0 };

    // Pass the switch message to the frontend if one occurred
    if (switchMessage) {
       parsedData.apiSwitchMessage = switchMessage;
    }

    // Force no events in the very first month
    if (state.currentMonth === 1) {
      parsedData.next_event = null;
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Career Simulation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to simulate turn" }, { status: 500 });
  }
}
