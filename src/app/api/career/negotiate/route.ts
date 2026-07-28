import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { state, selectedParty, pitch } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is missing in .env.local. Please add GROQ_API_KEY and restart the server." },
        { status: 500 }
      );
    }

    const currentCoalition = state.parliament.filter((p: any) => p.isCoalition).map((p: any) => p.party).join(', ');

    const prompt = `You are the core simulation engine of a Belgian Political Simulator: Career Mode. 
The player is Prime Minister Bart De Wever (N-VA). The government has fallen and lost its majority.
The current remaining coalition is: ${currentCoalition}.

The player is desperately trying to save their government by inviting an opposition party to join the coalition.
Target Party: ${selectedParty.party} (${selectedParty.seats} seats).

The player's pitch/offer to ${selectedParty.party} is:
"${pitch}"

[YOUR TASK]
Evaluate if the target party accepts the offer, AND if the remaining coalition parties accept this new partner.

[RULES]
1. Reflect current Belgian politics.
   - For example, N-VA and MR will almost NEVER accept PS or PTB. 
   - Ecolo/Groen might join if offered massive climate concessions, but MR/N-VA will hate it.
   - Open Vld is a natural fit but they suffered huge losses and might prefer opposition unless offered something extremely lucrative.
   - Vlaams Belang is under a 'Cordon Sanitaire'. If N-VA invites them, Vooruit, CD&V, and MR will IMMEDIATELY reject and blow up the government.
2. The pitch must be convincing. Empty words will be rejected.
3. Both the target party AND the existing coalition must agree for 'success' to be true. If EITHER rejects, 'success' is false.

Return ONLY a strict JSON object:
{
  "success": <boolean>,
  "reasoning": "<A dramatic explanation of what happened during the negotiations. E.g. 'Open Vld has accepted your generous offer of the Finance Ministry...' OR 'The MR has vetoed the inclusion of the PS, causing the final collapse of the government.'>"
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

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Career Negotiation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to negotiate" }, { status: 500 });
  }
}
