import sessionsData from "@/services/mockData/sessions.json";

let sessions = [...sessionsData];

const sessionService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...sessions];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const session = sessions.find(s => s.Id === parseInt(id));
    return session ? { ...session } : null;
  },

create: async (sessionData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = sessions.length > 0 ? Math.max(...sessions.map(s => s.Id)) : 0;
    const newSession = {
      Id: maxId + 1,
      ...sessionData,
      startTime: new Date().toISOString(),
      viewCount: 0,
      proxyCount: sessionData.proxies?.length || 0,
      useAutoProxies: sessionData.useAutoProxies || false
    };
    
    sessions.push(newSession);
    return { ...newSession };
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = sessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) return null;
    
    sessions[index] = { ...sessions[index], ...updateData };
    return { ...sessions[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = sessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) return false;
    
    sessions.splice(index, 1);
    return true;
  }
};

export default sessionService;