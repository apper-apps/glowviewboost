import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";
import React from "react";

const StatusIndicator = ({ status, label, count }) => {
  const statusConfig = {
    idle: { icon: "Pause", color: "text-gray-400", variant: "default" },
    running: { icon: "Play", color: "text-success", variant: "active" },
    error: { icon: "AlertCircle", color: "text-error", variant: "error" },
    loading: { icon: "Loader2", color: "text-warning", variant: "warning" }
  };

  const config = statusConfig[status] || statusConfig.idle;

  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={status === "running" ? { rotate: 360 } : {}}
        transition={status === "running" ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
      >
        <ApperIcon 
          name={config.icon} 
          className={cn("w-5 h-5", config.color)}
        />
      </motion.div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">{label}</span>
        {count !== undefined && (
          <Badge variant={config.variant}>
            {count}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;