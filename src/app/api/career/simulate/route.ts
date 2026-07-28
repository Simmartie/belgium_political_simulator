import { NextResponse } from "next/server";
import Groq from "groq-sdk";

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
          "source": "SITUATION REPORT",
          "title": "Europese Waarschuwing",
          "context": "De Europese Commissie heeft officieel aan de bel getrokken over het oplopende begrotingstekort. Buitenlandse investeerders kijken nerveus toe. De vakbonden roepen echter op om niet in de zorg te snijden.",
          "description": "De Europese Commissie eist onmiddellijke begrotingsinspanningen. U moet reageren.",
          "type": "budget",
          "requiresResponse": true
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

    const prompt = `You are the core simulation engine of a Belgian Political Simulator: Career Mode. 
The player is Prime Minister Bart De Wever (N-VA), leading the 'Arizona' coalition (N-VA, MR, Les Engagés, Vooruit, CD&V).
The current month is ${state.currentMonth} out of 48 (Starting Jan 2025).

Current Metrics:
- Popularity: ${state.metrics.popularity}%
- Coalition Stability: ${state.metrics.coalitionStability}%
- Internal N-VA Stability: ${state.metrics.internalStability}%

Current Coalition Partners & Satisfaction (0-100):
${state.parliament.filter((p: any) => p.isCoalition).map((p: any) => `- ${p.party}: ${p.satisfaction}%`).join('\n')}

Current Economy:
- Budget Deficit: ${state.economy.budgetDeficit}% of GDP
- GDP: ${state.economy.gdp} Billion EUR
- Inflation: ${state.economy.inflation}%
- Purchasing Power Index: ${state.economy.purchasingPower}
- Climate Goals Progress: ${state.economy.climateGoals}%

${action.event
  ? `The player is responding to a crisis event: "${action.event.title}" (${action.event.description}).\nTheir policy response is:\nTitle: "${action.title}"\nDescription: "${action.description}"`
  : `The player is implementing a new policy:\nTitle: "${action.title}"\nDescription: "${action.description}"`
}

Options applied by the player:
- Consult Kernkabinet: ${action.options?.consultKernkabinet ? "YES (Player consulted with coalition partners before announcing this, meaning coalition stability should generally be positively affected or less negatively impacted)." : "NO (The player acted unilaterally, which might upset coalition partners)."}
- Media Spin: ${action.options?.mediaSpin ? "YES (Player launched a major PR campaign for this, meaning popularity should generally receive a boost or take less of a hit)." : "NO"}

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
   - If a partner's satisfaction drops very low (< 30) or you completely ignore their core demands, you MUST generate a crisis 'next_event' where they threaten to leave the government.
   - If a partner is critically angry and the player's current action is a bad response to their threat, they WILL leave the government. In that case, add them to 'coalition_changes' with action 'left'.
7. FREQUENCY & GENERATION OF EVENTS:
   - If currentMonth is 1, 'next_event' MUST BE null. The first month is always event-free.
   - For all other months, standard monthly actions should spawn a 'next_event' ~80% of the time.
   - You MUST spawn a crisis event if the economy performs poorly (e.g. budgetDeficit > 5.5%, inflation > 5.0%, or purchasingPower < 95.0).
   - Events MUST include a 'severity' level ('low', 'medium', 'high', 'critical').
   - If the player's response to an event is "ignore" or "do nothing": 'low'/'medium' crises might resolve themselves, but 'high'/'critical' crises will escalate severely.
   - Events should be realistic "Situation Reports" (e.g., strikes, court rulings, international crises, EU demands) or direct consequences of the player's previous actions (e.g., if they cut pensions, spawn a union strike event).
   - Do NOT generate repetitive or identical crisis events turn after turn.

Return ONLY a strict JSON object:
{
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
    "budgetImpact": "<string e.g. '+ €1.2B' or '- €500M' or 'Neutral'>",
    "complexity": "<string e.g. 'Low', 'High (Constitutional Risk)'>",
    "summary": "<Short executive summary>"
  },
  "opposition_reaction": [
    { "party": "<Party Name>", "quote": "<Quote>", "stance": "<positive|neutral|negative>" }
  ],
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
  "next_event": null // OR an object: { "id": "evt1", "source": "SITUATION REPORT", "title": "Crisis Name", "context": "Detailed background...", "description": "What happens...", "type": "budget", "severity": "low|medium|high|critical", "requiresResponse": true }
}`;

    const groq = new Groq({ apiKey });
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned invalid format: " + responseText);

    const parsedData = JSON.parse(jsonMatch[0]);

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
