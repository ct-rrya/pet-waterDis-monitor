import { Radio, Dog, Moon } from 'lucide-react';

export default function PetDetectionCard({ detected }) {
  return (
    <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.9)] dark:shadow-[8px_8px_20px_rgba(0,0,0,0.5),-8px_-8px_20px_rgba(255,255,255,0.05)] p-6 hover:shadow-[12px_12px_30px_rgba(0,0,0,0.15),-12px_-12px_30px_rgba(255,255,255,1)] dark:hover:shadow-[12px_12px_30px_rgba(0,0,0,0.6),-12px_-12px_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-105 relative overflow-hidden">
      {/* Animated background when detected */}
      {detected && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-800 rounded-full blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 dark:bg-emerald-800 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-2000" />
        </>
      )}
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <Radio className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Pet Activity</h3>
        </div>
        {/* <button className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
          <ArrowRight className="w-4 h-4" />
        </button> */}
      </div>
      
      <div className="flex items-center space-x-4 py-4 relative z-10">
        <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${
          detected ? 'bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 shadow-lg shadow-green-300 dark:shadow-green-900' : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600'
        }`}>
          {detected && (
            <div className="absolute inset-0 rounded-2xl bg-green-400 animate-ping opacity-30" />
          )}
          <div className={`relative z-10 ${detected ? 'animate-bounce' : ''}`}>
            {detected ? (
              <Dog className="w-10 h-10 text-white" strokeWidth={2.5} />
            ) : (
              <Moon className="w-10 h-10 text-gray-400" strokeWidth={2} />
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className={`text-xl font-bold mb-1 ${detected ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {detected ? 'Detected!' : 'No Activity'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {detected ? (
              <>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Pet is drinking
              </>
            ) : (
              'Waiting for pet...'
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative dots */}
      <div className="absolute bottom-3 right-3 flex gap-1 opacity-20">
        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
      </div>
    </div>
  );
}
