import { useState, useEffect, useCallback } from "react";
import sessionService from "@/services/api/sessionService";
import tabService from "@/services/api/tabService";

const useViewSession = () => {
  const [session, setSession] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const startSession = useCallback(async (sessionData) => {
    try {
      setError("");
      setIsLoading(true);

      // Create the session
      const newSession = await sessionService.create(sessionData);
      setSession(newSession);

      // Create tabs for the session
      const newTabs = await tabService.createMultiple(
        newSession.Id,
        sessionData.tabCount,
        sessionData.proxies
      );
      setTabs(newTabs);

      // Start the simulation
      setIsRunning(true);
      
      // Update tabs to running status
      const updatedTabs = await Promise.all(
        newTabs.map(tab => 
          tabService.update(tab.Id, { status: "running" })
        )
      );
      setTabs(updatedTabs);

      // Simulate view generation
      simulateViewing(newSession.Id, updatedTabs);

    } catch (err) {
      setError("Failed to start session");
      console.error("Start session error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopSession = useCallback(async () => {
    if (!session) return;

    try {
      setError("");
      
      // Update session status
      await sessionService.update(session.Id, { status: "stopped" });
      
      // Update tabs status
      const updatedTabs = await Promise.all(
        tabs.map(tab => 
          tabService.update(tab.Id, { status: "idle" })
        )
      );
      
      setTabs(updatedTabs);
      setIsRunning(false);
      
    } catch (err) {
      setError("Failed to stop session");
      console.error("Stop session error:", err);
    }
  }, [session, tabs]);

  const simulateViewing = useCallback((sessionId, sessionTabs) => {
    const interval = setInterval(async () => {
      if (!isRunning) {
        clearInterval(interval);
        return;
      }

      try {
        // Simulate view generation (1-3 views per interval)
        const viewsGenerated = Math.floor(Math.random() * 3) + 1;
        
        // Update session view count
        const updatedSession = await sessionService.update(sessionId, {
          viewCount: (session?.viewCount || 0) + viewsGenerated
        });
        setSession(updatedSession);

        // Update random tabs with new durations
        const randomTabs = sessionTabs
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(viewsGenerated, sessionTabs.length));

        const updatedTabs = await Promise.all(
          randomTabs.map(tab => 
            tabService.update(tab.Id, {
              viewDuration: (tab.viewDuration || 0) + Math.floor(Math.random() * 10) + 5
            })
          )
        );

        // Update tabs state
        setTabs(prevTabs => 
          prevTabs.map(tab => {
            const updated = updatedTabs.find(ut => ut.Id === tab.Id);
            return updated || tab;
          })
        );

      } catch (err) {
        console.error("Simulation error:", err);
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isRunning, session]);

  return {
    session,
    tabs,
    isRunning,
    isLoading,
    error,
    startSession,
    stopSession
  };
};

export default useViewSession;