import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const Header = ({ session, isRunning }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border-b border-secondary/30 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Youtube" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white neon-text">
                ViewBoost Pro
              </h1>
              <p className="text-gray-400 text-sm">YouTube Automation Tool</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session && (
            <div className="flex items-center gap-3">
              <Badge variant={isRunning ? "active" : "default"}>
                {isRunning ? "Active Session" : "Session Paused"}
              </Badge>
              
              <div className="text-right">
                <p className="text-sm text-gray-400">Views Generated</p>
                <p className="text-lg font-bold text-success neon-text">
                  {session.viewCount || 0}
                </p>
              </div>
            </div>
          )}

          <button className="p-2 rounded-lg border border-secondary/30 hover:border-secondary hover:bg-secondary/10 transition-all duration-200">
            <ApperIcon name="Bell" className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="p-2 rounded-lg border border-secondary/30 hover:border-secondary hover:bg-secondary/10 transition-all duration-200">
            <ApperIcon name="Settings" className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;