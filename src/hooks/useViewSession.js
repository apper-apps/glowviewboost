import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
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
        // Check for running windows and update their durations
        const runningTabs = sessionTabs.filter(tab => tab.status === "running");
        
        if (runningTabs.length > 0) {
          const updatedTabs = await Promise.all(
            runningTabs.map(tab => 
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

          // Update session view count based on running windows
          const viewsGenerated = runningTabs.length;
          const updatedSession = await sessionService.update(sessionId, {
            viewCount: (session?.viewCount || 0) + viewsGenerated
          });
          setSession(updatedSession);
        }

      } catch (err) {
        console.error("Simulation error:", err);
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isRunning, session]);

  const openWindow = useCallback(async (tabId) => {
    if (!session || !session.videoUrl) {
      toast.error("No video URL available");
      return;
    }

    try {
      // Open the window
      const windowRef = window.open(
        session.videoUrl,
        `viewboost_window_${tabId}`,
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );

      if (!windowRef) {
        toast.error("Window blocked by browser. Please allow popups.");
        return;
      }

      // Update tab status and store window reference
      const updatedTab = await tabService.update(tabId, { 
        status: "running",
        windowRef: windowRef
      });

      // Update tabs state
      setTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.Id === tabId ? updatedTab : tab
        )
      );

      toast.success("Window opened successfully!");

      // Monitor window close
      const checkClosed = setInterval(() => {
        if (windowRef.closed) {
          clearInterval(checkClosed);
          tabService.update(tabId, { status: "idle", windowRef: null });
          setTabs(prevTabs => 
            prevTabs.map(tab => 
              tab.Id === tabId ? { ...tab, status: "idle" } : tab
            )
          );
        }
      }, 1000);

    } catch (error) {
      console.error("Failed to open window:", error);
      toast.error("Failed to open window");
    }
  }, [session]);

return {
    session,
    tabs,
    isRunning,
    isLoading,
    error,
    startSession,
    stopSession,
    openWindow
  };
};

export default useViewSession;