import React, { useState } from "react";
import { useCareer } from "../../context/CareerContext";
import { AlertTriangle, Send } from "lucide-react";

export function DynamicEventModal() {
  const { state, submitEventResponse, isLoading } = useCareer();
  const [response, setResponse] = useState("");

  const event = state.activeEvent;
  if (!event) return null;

  const handleSubmit = () => {
    if (!response.trim()) return;
    submitEventResponse(response);
    setResponse(""); // Clear for next time
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-white" />
          <div>
            <span className="text-red-200 text-xs font-bold uppercase tracking-wider block">Urgent Crisis</span>
            <h2 className="text-xl font-bold text-white">{event.title}</h2>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <p className="text-slate-800 text-lg mb-6 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">
              Your Response as Prime Minister:
            </label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              placeholder="How do you handle this crisis? E.g., 'We will negotiate with the unions' or 'We deploy police to clear the blockade'."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              disabled={isLoading}
            />

            <div className="flex justify-end pt-4">
              <button 
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isLoading || !response.trim()}
              >
                Issue Statement
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
