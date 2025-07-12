import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const StatsPanel = ({ session, isRunning }) => {
  const statsCards = [
    {
      title: "Total Views",
      value: session?.viewCount || 0,
      icon: "Eye",
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/30"
    },
    {
      title: "Active Tabs",
      value: session?.tabCount || 0,
      icon: "Grid3x3",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30"
    },
    {
      title: "Session Time",
      value: session?.startTime ? 
        `${Math.floor((Date.now() - new Date(session.startTime)) / 60000)}m` : 
        "0m",
      icon: "Clock",
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/30"
    },
    {
      title: "Success Rate",
      value: session?.tabCount ? 
        `${Math.round((session.viewCount / session.tabCount) * 100)}%` : 
        "0%",
      icon: "TrendingUp",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/30"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-surface border border-secondary/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <ApperIcon name="BarChart3" className="w-6 h-6 text-primary glow" />
          <h2 className="text-xl font-display font-semibold text-white">Statistics</h2>
        </div>

        <div className="space-y-4">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${stat.bgColor} ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color} neon-text`}>
                    {stat.value}
                  </p>
                </div>
                <ApperIcon name={stat.icon} className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {session && (
        <div className="bg-surface border border-secondary/30 rounded-xl p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-4">Session Info</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status:</span>
              <Badge variant={isRunning ? "active" : "default"}>
                {isRunning ? "Running" : "Stopped"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Video Type:</span>
              <span className="text-white capitalize">{session.videoType || "unknown"}</span>
            </div>
            
<div className="flex items-center justify-between">
              <span className="text-gray-400">Proxies:</span>
              <div className="flex items-center gap-2">
                <span className="text-white">{session.proxies?.length || 0}</span>
                {session.useAutoProxies && (
                  <Badge variant="info" className="text-xs">Auto</Badge>
                )}
              </div>
            </div>
            
            {session.startTime && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Started:</span>
                <span className="text-white">
                  {format(new Date(session.startTime), "HH:mm:ss")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-surface border border-secondary/30 rounded-xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg border border-secondary/20 hover:border-secondary/50 hover:bg-secondary/10 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <ApperIcon name="Download" className="w-5 h-5 text-gray-400 group-hover:text-secondary" />
              <span className="text-gray-300 group-hover:text-white">Export Data</span>
            </div>
          </button>
          
          <button className="w-full text-left p-3 rounded-lg border border-secondary/20 hover:border-secondary/50 hover:bg-secondary/10 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <ApperIcon name="History" className="w-5 h-5 text-gray-400 group-hover:text-secondary" />
              <span className="text-gray-300 group-hover:text-white">View History</span>
            </div>
          </button>
          
          <button className="w-full text-left p-3 rounded-lg border border-secondary/20 hover:border-secondary/50 hover:bg-secondary/10 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <ApperIcon name="Settings" className="w-5 h-5 text-gray-400 group-hover:text-secondary" />
              <span className="text-gray-300 group-hover:text-white">Settings</span>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsPanel;