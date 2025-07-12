import { motion } from "framer-motion";

const Loading = ({ type = "page" }) => {
  if (type === "tabs") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface border border-secondary/30 rounded-lg p-4 h-32"
          >
            <div className="w-full h-16 bg-gradient-to-r from-secondary/20 to-primary/20 rounded mb-3 animate-pulse"></div>
            <div className="h-3 bg-gradient-to-r from-secondary/20 to-primary/20 rounded animate-pulse mb-2"></div>
            <div className="h-2 bg-gradient-to-r from-secondary/20 to-primary/20 rounded w-2/3 animate-pulse"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-surface rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-primary border-r-secondary border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h3 className="text-xl font-display font-semibold text-white">Loading ViewBoost Pro</h3>
          <div className="space-y-2">
            <div className="h-2 bg-gradient-to-r from-secondary/20 to-primary/20 rounded w-64 animate-pulse"></div>
            <div className="h-2 bg-gradient-to-r from-secondary/20 to-primary/20 rounded w-48 animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;