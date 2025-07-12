import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import TabPreview from "@/components/molecules/TabPreview";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const TabGrid = ({ tabs, isLoading, onStartSession, openWindow }) => {
  if (isLoading) {
    return <Loading type="tabs" />;
  }

  if (!tabs || tabs.length === 0) {
    return (
      <div className="bg-surface border border-secondary/30 rounded-xl p-8">
        <Empty 
          type="tabs"
          title="No Active Tabs"
          description="Start a viewing session to see active tabs here"
          actionLabel="Start Session"
          onAction={onStartSession}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-surface border border-secondary/30 rounded-xl p-6"
    >
<div className="flex items-center gap-3 mb-6">
        <ApperIcon name="Grid3x3" className="w-6 h-6 text-primary glow" />
        <h2 className="text-xl font-display font-semibold text-white">Active Windows</h2>
        <div className="ml-auto bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/30">
          {tabs.length} Active
        </div>
      </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {tabs.map((tab, index) => (
          <TabPreview key={tab.Id} tab={tab} index={index} openWindow={openWindow} />
        ))}
      </div>
    </motion.div>
  );
};

export default TabGrid;