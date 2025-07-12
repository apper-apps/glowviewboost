import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";
import React from "react";

const TabPreview = ({ tab, index, openWindow }) => {
  const statusConfig = {
    idle: { color: "border-gray-600", bg: "bg-surface" },
    running: { color: "border-success", bg: "bg-success/10" },
    error: { color: "border-error", bg: "bg-error/10" },
    loading: { color: "border-warning", bg: "bg-warning/10" }
  };

  const config = statusConfig[tab.status] || statusConfig.idle;

  const handleOpenWindow = () => {
    if (openWindow && tab.Id) {
      openWindow(tab.Id);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "border rounded-lg p-4 transition-all duration-200",
        config.color,
        config.bg
      )}
    >
<div className="flex items-center justify-between mb-3">
        <Badge variant={tab.status === "running" ? "active" : tab.status}>
          Window {index + 1}
        </Badge>
        {tab.status === "running" && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-success rounded-full"
          />
        )}
      </div>

      <div className="bg-gray-800 rounded-lg h-16 flex items-center justify-center mb-3 relative">
        <ApperIcon name="Youtube" className="w-8 h-8 text-red-500" />
        {tab.status === "idle" && (
          <button
            onClick={handleOpenWindow}
            className="absolute inset-0 bg-primary/20 hover:bg-primary/30 rounded-lg border-2 border-primary/50 hover:border-primary transition-all flex items-center justify-center group"
          >
            <ApperIcon name="ExternalLink" className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Proxy:</span>
          <span className="text-white font-mono">
            {tab.proxyUsed ? `${tab.proxyUsed.split(":")[0]}:***` : "None"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Duration:</span>
          <span className="text-white">{tab.viewDuration || 0}s</span>
        </div>

        {tab.errors && tab.errors.length > 0 && (
          <div className="text-error text-xs">
            <ApperIcon name="AlertTriangle" className="w-3 h-3 inline mr-1" />
            {tab.errors[tab.errors.length - 1]}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TabPreview;