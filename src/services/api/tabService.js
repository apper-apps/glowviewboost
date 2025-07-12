import tabsData from "@/services/mockData/tabs.json";

let tabs = [...tabsData];

const tabService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...tabs];
  },

  getBySessionId: async (sessionId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return tabs.filter(tab => tab.sessionId === parseInt(sessionId));
  },

  create: async (tabData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const maxId = tabs.length > 0 ? Math.max(...tabs.map(t => t.Id)) : 0;
    const newTab = {
      Id: maxId + 1,
      ...tabData,
      viewDuration: 0,
      errors: []
    };
    
    tabs.push(newTab);
    return { ...newTab };
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = tabs.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    tabs[index] = { ...tabs[index], ...updateData };
    return { ...tabs[index] };
  },

  createMultiple: async (sessionId, count, proxies = []) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newTabs = [];
    for (let i = 0; i < count; i++) {
      const maxId = tabs.length > 0 ? Math.max(...tabs.map(t => t.Id)) : 0;
      const proxy = proxies[i % proxies.length] || null;
      
      const newTab = {
        Id: maxId + 1 + i,
        sessionId: parseInt(sessionId),
        proxyUsed: proxy ? `${proxy.address}:${proxy.port}` : null,
        status: "idle",
        viewDuration: 0,
        errors: []
      };
      
      tabs.push(newTab);
      newTabs.push({ ...newTab });
    }
    
    return newTabs;
  },

  deleteBySessionId: async (sessionId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    tabs = tabs.filter(tab => tab.sessionId !== parseInt(sessionId));
    return true;
  }
};

export default tabService;