import TopBar from "@/components/TopBar";
import PolicySidebar from "@/components/PolicySidebar";
import MetricsDashboard from "@/components/MetricsDashboard";
import { SimulatorProvider } from "@/context/SimulatorContext";

export default function Home() {
  return (
    <SimulatorProvider>
      <div className="flex flex-col h-screen bg-[#f7f3eb] text-slate-900 overflow-hidden font-sans">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <PolicySidebar />
          <MetricsDashboard />
        </div>
      </div>
    </SimulatorProvider>
  );
}
