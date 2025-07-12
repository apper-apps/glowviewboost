import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import StatusIndicator from "@/components/molecules/StatusIndicator";

const ControlPanel = ({ onStartSession, onStopSession, session, isRunning }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [tabCount, setTabCount] = useState(5);
  const [proxies, setProxies] = useState("");
  const [errors, setErrors] = useState({});

  const validateYouTubeUrl = (url) => {
    const patterns = [
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/(?:www\.)?youtube\.com\/shorts\/[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const parseProxies = (proxyText) => {
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

    const parsedProxies = parseProxies(proxies);
    if (parsedProxies.length === 0 && proxies.trim()) {
      newErrors.proxies = "Please enter valid proxy addresses in format IP:PORT";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStart = () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const videoType = videoUrl.includes("/shorts/") ? "short" : "video";
    const parsedProxies = parseProxies(proxies);

    const sessionData = {
      videoUrl: videoUrl.trim(),
      videoType,
      tabCount,
      proxies: parsedProxies,
      status: "running",
      startTime: new Date(),
      viewCount: 0
    };

    onStartSession(sessionData);
    toast.success(`Started viewing session with ${tabCount} tabs`);
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

  const handleProxiesChange = (e) => {
    setProxies(e.target.value);
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
              label="Number of Tabs"
              type="number"
              min="1"
              max="20"
              value={tabCount}
              onChange={handleTabCountChange}
              error={errors.tabCount}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Tab Preview</label>
              <div className="bg-background border border-secondary/20 rounded-lg p-3 h-[42px] flex items-center">
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(tabCount, 8) }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 h-2 bg-primary rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                  {tabCount > 8 && (
                    <span className="text-xs text-gray-400 ml-2">+{tabCount - 8}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <FormField
            label="Proxy List (Optional)"
            type="textarea"
            placeholder="192.168.1.1:8080&#10;10.0.0.1:3128&#10;proxy.example.com:8080"
            value={proxies}
            onChange={handleProxiesChange}
            error={errors.proxies}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-background border border-secondary/20 rounded-lg p-4">
            <h3 className="font-medium text-white mb-3">Session Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Tabs:</span>
                <span className="text-white">{session?.tabCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Views Generated:</span>
                <span className="text-success font-medium">{session?.viewCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Proxies Loaded:</span>
                <span className="text-white">{parseProxies(proxies).length}</span>
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
                disabled={!videoUrl.trim()}
              >
                <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                Start Session
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