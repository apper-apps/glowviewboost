import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ControlPanel from "@/components/organisms/ControlPanel";
import TabGrid from "@/components/organisms/TabGrid";
import StatsPanel from "@/components/organisms/StatsPanel";
import useViewSession from "@/hooks/useViewSession";

const Dashboard = () => {
  const {
    session,
    tabs,
    isRunning,
    isLoading,
    error,
    startSession,
    stopSession
  } = useViewSession();

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} isRunning={isRunning} />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              YouTube View Automation
            </h1>
            <p className="text-gray-400">
              Manage multiple viewing sessions with proxy support
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <ControlPanel
                onStartSession={startSession}
                onStopSession={stopSession}
                session={session}
                isRunning={isRunning}
              />
              
              <TabGrid
                tabs={tabs}
                isLoading={isLoading}
                onStartSession={() => {}}
              />
            </div>
            
            <div className="xl:col-span-1">
              <StatsPanel session={session} isRunning={isRunning} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;