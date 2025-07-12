import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  type = "page" 
}) => {
  if (type === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface border border-error/30 rounded-lg p-4 text-center"
      >
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error mx-auto mb-3" />
        <p className="text-gray-300 mb-3">{message}</p>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Retry
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
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto mb-4 glow" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Error Occurred</h2>
          <p className="text-gray-400">{message}</p>
        </div>
        
        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            <ApperIcon name="RotateCcw" className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default Error;