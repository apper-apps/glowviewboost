import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import proxyService from "@/services/api/proxyService";

const ControlPanel = ({ onStartSession, onStopSession, session, isRunning }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [tabCount, setTabCount] = useState(5);
  const [useAutoProxies, setUseAutoProxies] = useState(true);
  const [manualProxies, setManualProxies] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [proxyStats, setProxyStats] = useState(null);

  const validateYouTubeUrl = (url) => {
    const patterns = [
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/(?:www\.)?youtube\.com\/shorts\/[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/
    ];
    return patterns.some(pattern => pattern.test(url));
  };

const parseManualProxies = (proxyText) => {
    if (!proxyText.trim()) return [];
    
    const lines = proxyText.trim().split("\n");
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [address, port] = line.trim().split(":");
        return { address, port: parseInt(port), protocol: "http", status: "unchecked" };
      })
      .filter(proxy => proxy.address && proxy.port);
  };

  const fetchAutoProxies = async () => {
    try {
      setIsLoading(true);
      toast.info("Fetching proxies from internet...");
      
      const result = await proxyService.getValidatedProxies(tabCount * 2);
      setProxyStats(result);
      
      if (result.working === 0) {
        throw new Error("No working proxies found");
      }
      
      toast.success(`Found ${result.working} working proxies`);
      return result.proxies;
    } catch (error) {
      console.error("Auto proxy fetch failed:", error);
      toast.error(`Failed to fetch proxies: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!videoUrl.trim()) {
      newErrors.videoUrl = "Video URL is required";
    } else if (!validateYouTubeUrl(videoUrl)) {
      newErrors.videoUrl = "Please enter a valid YouTube URL";
    }

    if (tabCount < 1 || tabCount > 20) {
      newErrors.tabCount = "Tab count must be between 1 and 20";
    }

if (!useAutoProxies) {
      const parsedProxies = parseManualProxies(manualProxies);
      if (parsedProxies.length === 0 && manualProxies.trim()) {
        newErrors.proxies = "Please enter valid proxy addresses in format IP:PORT";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleStart = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      setIsLoading(true);
      const videoType = videoUrl.includes("/shorts/") ? "short" : "video";
      
      let proxies = [];
      if (useAutoProxies) {
        proxies = await fetchAutoProxies();
      } else {
        proxies = parseManualProxies(manualProxies);
      }

      const sessionData = {
        videoUrl: videoUrl.trim(),
        videoType,
        tabCount,
        proxies,
        useAutoProxies,
        status: "running",
        startTime: new Date(),
        viewCount: 0
      };

      onStartSession(sessionData);
      toast.success(`Started viewing session with ${tabCount} tabs and ${proxies.length} proxies`);
    } catch (error) {
      toast.error("Failed to start session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    onStopSession();
    toast.info("Viewing session stopped");
  };

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value);
    if (errors.videoUrl) {
      setErrors({ ...errors, videoUrl: "" });
    }
  };

  const handleTabCountChange = (e) => {
    const count = parseInt(e.target.value);
    setTabCount(count);
    if (errors.tabCount) {
      setErrors({ ...errors, tabCount: "" });
    }
  };

const handleManualProxiesChange = (e) => {
    setManualProxies(e.target.value);
    if (errors.proxies) {
      setErrors({ ...errors, proxies: "" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-secondary/30 rounded-xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ApperIcon name="Settings" className="w-6 h-6 text-primary glow" />
          <h2 className="text-xl font-display font-semibold text-white">Control Panel</h2>
        </div>
        
        {session && (
          <StatusIndicator 
            status={isRunning ? "running" : "idle"}
            label={isRunning ? "Session Active" : "Session Idle"}
            count={session.viewCount}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <FormField
            label="YouTube Video URL"
            type="input"
            placeholder="https://youtube.com/watch?v=... or https://youtube.com/shorts/..."
            value={videoUrl}
            onChange={handleUrlChange}
            error={errors.videoUrl}
            required
          />

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Number of Windows"
              type="number"
              min="1"
              max="20"
              value={tabCount}
              onChange={handleTabCountChange}
              error={errors.tabCount}
              required
            />
<div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Window Preview</label>
              <div className="bg-background border border-secondary/20 rounded-lg p-3 h-[42px] flex items-center">
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(tabCount, 8) }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-4 h-3 bg-primary/30 border border-primary rounded-sm flex items-center justify-center animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="w-1 h-1 bg-primary rounded-full" />
                    </div>
                  ))}
                  {tabCount > 8 && (
                    <span className="text-xs text-gray-400 ml-2">+{tabCount - 8}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
<div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300">Proxy Mode:</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="proxyMode"
                    checked={useAutoProxies}
                    onChange={() => setUseAutoProxies(true)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-white">Auto-fetch from Internet</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="proxyMode"
                    checked={!useAutoProxies}
                    onChange={() => setUseAutoProxies(false)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-white">Manual Entry</span>
                </label>
              </div>
            </div>

            {useAutoProxies ? (
              <div className="bg-background border border-secondary/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <ApperIcon name="Globe" className="w-5 h-5 text-primary" />
                  <span className="text-white font-medium">Automatic Proxy Fetching</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Proxies will be automatically fetched from reliable internet sources when the session starts.
                </p>
                {proxyStats && (
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400">Total Found:</span>
                      <span className="text-white ml-1">{proxyStats.total}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Validated:</span>
                      <span className="text-white ml-1">{proxyStats.validated}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Working:</span>
                      <span className="text-success ml-1">{proxyStats.working}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <FormField
                label="Manual Proxy List"
                type="textarea"
                placeholder="192.168.1.1:8080&#10;10.0.0.1:3128&#10;proxy.example.com:8080"
                value={manualProxies}
                onChange={handleManualProxiesChange}
                error={errors.proxies}
                className="min-h-[100px]"
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-background border border-secondary/20 rounded-lg p-4">
            <h3 className="font-medium text-white mb-3">Session Stats</h3>
<div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Windows:</span>
                <span className="text-white">{session?.tabCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Views Generated:</span>
                <span className="text-success font-medium">{session?.viewCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Proxies:</span>
                <span className="text-white">
                  {useAutoProxies ? 
                    (proxyStats ? `${proxyStats.working} auto` : "Auto-fetch") : 
                    parseManualProxies(manualProxies).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={isRunning ? "text-success" : "text-gray-400"}>
                  {isRunning ? "Running" : "Stopped"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
{!isRunning ? (
              <Button 
                onClick={handleStart}
                className="w-full"
                disabled={!videoUrl.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                    {useAutoProxies ? "Fetching Proxies..." : "Starting..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                    Start Session
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleStop}
                variant="danger"
                className="w-full"
              >
                <ApperIcon name="Square" className="w-5 h-5 mr-2" />
                Stop Session
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ControlPanel;