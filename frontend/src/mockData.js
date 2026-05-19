// Mock data generator for testing without Firebase/ESP32

export const generateMockDeviceData = () => {
  return {
    tankLevel: Math.floor(Math.random() * 100),
    bowlLevel: Math.floor(Math.random() * 100),
    petDetected: Math.random() > 0.5,
    isOnline: true,
    lastUpdate: new Date().toISOString(),
    dispensing: false
  };
};

export const generateMockHistory = () => {
  const history = [];
  const now = Date.now();
  
  // Generate 20 data points over the last 2 hours
  for (let i = 20; i >= 0; i--) {
    history.push({
      timestamp: new Date(now - i * 6 * 60 * 1000).toISOString(), // Every 6 minutes
      tankLevel: Math.max(20, Math.min(100, 80 - i * 2 + Math.random() * 10))
    });
  }
  
  return history;
};

// Simulate real-time updates
export const startMockDataSimulation = (updateCallback) => {
  const interval = setInterval(() => {
    const data = generateMockDeviceData();
    updateCallback(data);
  }, 3000); // Update every 3 seconds

  return () => clearInterval(interval);
};
