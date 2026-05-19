import { useState } from 'react';
import { Droplets, ArrowRight, Moon, Sun, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import WaterLevelCard from './WaterLevelCard';
import BowlLevelCard from './BowlLevelCard';
import PetDetectionCard from './PetDetectionCard';
import ControlPanel from './ControlPanel';
import StatusCard from './StatusCard';
import WaterHistoryChart from './WaterHistoryChart';
import AboutModal from './AboutModal';

export default function Dashboard({ deviceData, history, onStartDispensing, onStopDispensing }) {
  const { tankLevel, bowlLevel, petDetected, isOnline, lastUpdate, dispensing } = deviceData;
  const { isDark, toggleTheme } = useTheme();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
      <header className="mb-8 text-center relative">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="absolute top-0 right-0 w-12 h-12 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 group"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-6 h-6 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="w-6 h-6 text-purple-600 group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        {/* About Us Button */}
        <button
          onClick={() => setIsAboutOpen(true)}
          className="absolute top-0 right-16 w-12 h-12 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 group"
          aria-label="About Us"
        >
          <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
        </button>

        <div className="inline-block mb-4 animate-float">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
            <Droplets className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
          Pet Water Monitor
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Real-time monitoring & control
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <WaterLevelCard level={tankLevel} />
        <BowlLevelCard level={bowlLevel} />
        <PetDetectionCard detected={petDetected} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ControlPanel
          dispensing={dispensing}
          onStart={onStartDispensing}
          onStop={onStopDispensing}
          disabled={!isOnline}
        />
        <StatusCard isOnline={isOnline} lastUpdate={lastUpdate} tankLevel={tankLevel} />
      </div>

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.9)] dark:shadow-[8px_8px_20px_rgba(0,0,0,0.5),-8px_-8px_20px_rgba(255,255,255,0.05)] p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white transform rotate-90" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Water Usage</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Historical consumption data</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <WaterHistoryChart data={history} />
      </div>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
