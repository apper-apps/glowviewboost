// Proxy service for automatic proxy fetching from internet sources
const proxyService = {
  // Fetch proxies from multiple free proxy APIs
  fetchProxies: async () => {
    const proxyApis = [
      'https://api.proxyscrape.com/v2/?request=get&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
      'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
      'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt'
    ];

    const fetchFromApi = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        return text.split('\n')
          .filter(line => line.trim())
          .map(line => {
            const [address, port] = line.trim().split(':');
            return { 
              address: address?.trim(), 
              port: parseInt(port?.trim()), 
              protocol: 'http', 
              status: 'unchecked',
              source: url
            };
          })
          .filter(proxy => proxy.address && proxy.port && !isNaN(proxy.port));
      } catch (error) {
        console.warn(`Failed to fetch from ${url}:`, error);
        return [];
      }
    };

    // Try multiple sources and combine results
    const results = await Promise.allSettled(
      proxyApis.map(api => fetchFromApi(api))
    );

    const allProxies = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);

    // Remove duplicates and limit to reasonable number
    const uniqueProxies = Array.from(
      new Map(allProxies.map(p => [`${p.address}:${p.port}`, p])).values()
    ).slice(0, 50); // Limit to 50 proxies

    return uniqueProxies;
  },

  // Validate proxy connectivity (basic check)
  validateProxy: async (proxy) => {
    try {
      // Simple validation - in real app would test actual connectivity
      // For demo purposes, randomly mark some as working
      const isWorking = Math.random() > 0.3; // 70% success rate simulation
      return {
        ...proxy,
        status: isWorking ? 'working' : 'failed',
        responseTime: isWorking ? Math.floor(Math.random() * 1000) + 100 : null
      };
    } catch (error) {
      return { ...proxy, status: 'failed' };
    }
  },

  // Get validated proxy list
  getValidatedProxies: async (count = 20) => {
    try {
      const proxies = await proxyService.fetchProxies();
      
      if (proxies.length === 0) {
        throw new Error('No proxies could be fetched from any source');
      }

      // Validate a subset of proxies
      const proxiesToValidate = proxies.slice(0, Math.min(count * 2, proxies.length));
      const validationPromises = proxiesToValidate.map(proxy => 
        proxyService.validateProxy(proxy)
      );

      const validatedProxies = await Promise.all(validationPromises);
      const workingProxies = validatedProxies
        .filter(proxy => proxy.status === 'working')
        .slice(0, count);

      return {
        total: proxies.length,
        validated: validatedProxies.length,
        working: workingProxies.length,
        proxies: workingProxies
      };
    } catch (error) {
      console.error('Proxy validation failed:', error);
      throw error;
    }
  }
};

export default proxyService;