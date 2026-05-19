import { Activity, Clock, AlertTriangle } from 'lucide-react';

export default function StatusCard({ isOnline, lastUpdate, tankLevel }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.9)] dark:shadow-[8px_8px_20px_rgba(0,0,0,0.5),-8px_-8px_20px_rgba(255,255,255,0.05)] p-6 hover:shadow-[12px_12px_30px_rgba(0,0,0,0.15),-12px_-12px_30px_rgba(255,255,255,1)] dark:hover:shadow-[12px_12px_30px_rgba(0,0,0,0.6),-12px_-12px_30px_rgba(255,255,255,0.08)] transition-all duration-300 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Device Status</h3>
        </div>
        {/* <button className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
          <ArrowRight className="w-4 h-4" />
        </button> */}
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl">
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Connection</span>
          <div className="flex items-center gap-2">
            <div className={`relative w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
              {isOnline && (
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
              )}
            </div>
            <span className={`text-sm font-bold ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl">
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Last Update</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{formatTime(lastUpdate)}</span>
          </div>
        </div>

        {tankLevel < 30 && (
          <div className="relative p-4 bg-gradient-to-r from-red-50 via-pink-50 to-red-50 dark:from-red-900/30 dark:via-pink-900/30 dark:to-red-900/30 rounded-2xl border-2 border-red-200 dark:border-red-800 overflow-hidden">
            <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 animate-pulse opacity-30" />
            <div className="relative z-10">
              <p className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
                Low Water Alert
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">Please refill the tank soon</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-transparent rounded-bl-full opacity-20" />
    </div>
  );
}
