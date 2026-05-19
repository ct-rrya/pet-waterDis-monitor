import { Coffee, Sparkles } from 'lucide-react';

export default function BowlLevelCard({ level }) {
  return (
    <div className="group relative bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-3xl shadow-[8px_8px_20px_rgba(0,0,0,0.3)] dark:shadow-[8px_8px_20px_rgba(0,0,0,0.6)] p-6 text-white overflow-hidden hover:shadow-[12px_12px_30px_rgba(0,0,0,0.4)] dark:hover:shadow-[12px_12px_30px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-105">
      {/* Animated sparkles */}
      <div className="absolute top-4 right-4 animate-pulse">
        <Sparkles className="w-6 h-6 text-white/60" />
      </div>
      <div className="absolute bottom-4 left-4 animate-pulse animation-delay-2000">
        <Sparkles className="w-5 h-5 text-white/40" />
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="animate-wiggle">
            <Coffee className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold">Bowl Level</h3>
        </div>
        {/* <button className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all shadow-lg">
          <ArrowRight className="w-4 h-4" />
        </button> */}
      </div>
      
      <div className="py-6 relative z-10">
        <div className="text-6xl font-bold mb-2 drop-shadow-lg">{level}%</div>
        <div className="text-sm opacity-90 font-medium">Available water</div>
      </div>

      <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-white to-blue-100 rounded-full transition-all duration-700 shadow-inner"
          style={{ width: `${level}%` }}
        />
      </div>
      
      {/* Decorative wave pattern */}
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
  );
}
