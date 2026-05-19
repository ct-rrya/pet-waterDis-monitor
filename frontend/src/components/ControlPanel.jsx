import { Play, Square, Gamepad2, Droplets, AlertCircle } from 'lucide-react';

export default function ControlPanel({ dispensing, onStart, onStop, disabled }) {
  return (
    <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.9)] dark:shadow-[8px_8px_20px_rgba(0,0,0,0.5),-8px_-8px_20px_rgba(255,255,255,0.05)] p-6 hover:shadow-[12px_12px_30px_rgba(0,0,0,0.15),-12px_-12px_30px_rgba(255,255,255,1)] dark:hover:shadow-[12px_12px_30px_rgba(0,0,0,0.6),-12px_-12px_30px_rgba(255,255,255,0.08)] transition-all duration-300 relative overflow-hidden">
      {/* Animated water drops when dispensing */}
      {dispensing && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <Droplets className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Manual Control</h3>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-inner flex items-center gap-1.5 ${
          dispensing ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}>
          <span className={`w-2 h-2 rounded-full ${dispensing ? 'bg-white' : 'bg-gray-400 dark:bg-gray-500'}`} />
          {dispensing ? 'Active' : 'Idle'}
        </div>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={onStart}
          disabled={disabled || dispensing}
          className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg relative overflow-hidden group/btn ${
            disabled || dispensing
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white hover:shadow-2xl hover:shadow-purple-300 dark:hover:shadow-purple-900 active:scale-95'
          }`}
        >
          {!(disabled || dispensing) && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-30 transform -skew-x-12 group-hover/btn:translate-x-full transition-all duration-700" />
          )}
          <div className="flex items-center justify-center space-x-3 relative z-10">
            <Play className="w-5 h-5" fill="currentColor" />
            <span>Start Dispensing</span>
            <Droplets className="w-5 h-5" />
          </div>
        </button>
        
        <button
          onClick={onStop}
          disabled={disabled || !dispensing}
          className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg relative overflow-hidden group/btn ${
            disabled || !dispensing
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:shadow-2xl hover:shadow-gray-400 dark:hover:shadow-gray-900 active:scale-95'
          }`}
        >
          {!(disabled || !dispensing) && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 transform -skew-x-12 group-hover/btn:translate-x-full transition-all duration-700" />
          )}
          <div className="flex items-center justify-center space-x-3 relative z-10">
            <Square className="w-5 h-5" fill="currentColor" />
            <span>Stop Dispensing</span>
          </div>
        </button>
      </div>

      {disabled && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl border border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">Device offline</p>
        </div>
      )}
    </div>
  );
}
