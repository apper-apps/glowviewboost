import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data available",
  description = "Get started by adding some content",
  actionLabel = "Get Started",
  onAction,
  icon = "Database",
  type = "page"
}) => {
  if (type === "tabs") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface border border-secondary/30 rounded-lg p-12 text-center"
      >
        <ApperIcon name="Play" className="w-16 h-16 text-secondary mx-auto mb-6 glow" />
        <h3 className="text-xl font-display font-semibold text-white mb-3">No Active Sessions</h3>
        <p className="text-gray-400 mb-6">Start a viewing session to see active tabs here</p>
        {onAction && (
          <Button onClick={onAction}>
            <ApperIcon name="Play" className="w-5 h-5 mr-2" />
            Start Session
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-6"
      >
        <div className="mb-8">
          <ApperIcon name={icon} className="w-20 h-20 text-primary mx-auto mb-6 glow" />
          <h2 className="text-2xl font-display font-bold text-white mb-3">{title}</h2>
          <p className="text-gray-400">{description}</p>
        </div>
        
        {onAction && (
          <Button onClick={onAction} className="w-full">
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default Empty;