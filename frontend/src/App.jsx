import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from './firebase';
import Dashboard from './components/Dashboard';

function App() {
  const [deviceData, setDeviceData] = useState({
    tankLevel: 0,
    bowlLevel: 0,
    petDetected: false,
    isOnline: false,
    lastUpdate: null,
    dispensing: false
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Listen to device data changes
    const deviceRef = ref(database, 'device');
    const unsubscribeDevice = onValue(deviceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDeviceData({
          tankLevel: data.tankLevel || 0,
          bowlLevel: data.bowlLevel || 0,
          petDetected: data.petDetected || false,
          isOnline: data.isOnline || false,
          lastUpdate: data.lastUpdate || null,
          dispensing: data.dispensing || false
        });
      }
    });

    // Listen to history changes
    const historyRef = ref(database, 'history');
    const unsubscribeHistory = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyArray = Object.values(data);
        setHistory(historyArray);
      }
    });

    return () => {
      unsubscribeDevice();
      unsubscribeHistory();
    };
  }, []);

  const handleStartDispensing = () => {
    const controlRef = ref(database, 'control/command');
    set(controlRef, 'start');
  };

  const handleStopDispensing = () => {
    const controlRef = ref(database, 'control/command');
    set(controlRef, 'stop');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 relative overflow-hidden transition-colors duration-500">
      {/* Pet Pattern Background */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05] pointer-events-none z-0">
        <div 
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: 'url(/pets-pattern.svg)',
            backgroundSize: '400px 300px',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000 z-0" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000 z-0" />
      
      <div className="relative z-10">
        <Dashboard
          deviceData={deviceData}
          history={history}
          onStartDispensing={handleStartDispensing}
          onStopDispensing={handleStopDispensing}
        />
      </div>
    </div>
  );
}

export default App;
