import { Droplet, AlertTriangle, CheckCircle } from 'lucide-react';

export default function WaterLevelCard({ level }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.9)] dark:shadow-[8px_8px_20px_rgba(0,0,0,0.5),-8px_-8px_20px_rgba(255,255,255,0.05)] p-6 hover:shadow-[12px_12px_30px_rgba(0,0,0,0.15),-12px_-12px_30px_rgba(255,255,255,1)] dark:hover:shadow-[12px_12px_30px_rgba(0,0,0,0.6),-12px_-12px_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Tank Level</h3>
        </div>
        {/* <button className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
          <ArrowRight className="w-4 h-4" />
        </button> */}
      </div>
      
      <div className="flex items-center justify-center py-4 relative">
        {/* Ripple effect when low */}
        {level < 30 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-red-400 animate-ping opacity-20" />
          </div>
        )}
        
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">{level}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Liters</span>
          </div>
        </div>
      </div>

      <div className={`text-center text-sm font-medium mt-2 px-3 py-2 rounded-full flex items-center justify-center gap-2 ${
        level >= 70 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
        level >= 30 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 
        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 animate-pulse'
      }`}>
        {level >= 70 ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Tank is full</span>
          </>
        ) : level >= 30 ? (
          <>
            <AlertTriangle className="w-4 h-4" />
            <span>Refill soon</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" />
            <span>Low water!</span>
          </>
        )}
      </div>
    </div>
  );
}
