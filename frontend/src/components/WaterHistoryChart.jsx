import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, TrendingUp } from 'lucide-react';

export default function WaterHistoryChart({ data }) {
  const [timeRange, setTimeRange] = useState('all'); // all, hour, day, week

  const filterData = () => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let filteredData = [...data];

    switch(timeRange) {
      case 'hour':
        filteredData = data.filter(item => {
          const itemTime = new Date(item.timestamp);
          return (now - itemTime) <= 60 * 60 * 1000; // Last hour
        });
        break;
      case 'day':
        filteredData = data.filter(item => {
          const itemTime = new Date(item.timestamp);
          return (now - itemTime) <= 24 * 60 * 60 * 1000; // Last 24 hours
        });
        break;
      case 'week':
        filteredData = data.filter(item => {
          const itemTime = new Date(item.timestamp);
          return (now - itemTime) <= 7 * 24 * 60 * 60 * 1000; // Last 7 days
        });
        break;
      default:
        filteredData = data;
    }

    return filteredData.map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        ...(timeRange === 'week' && { month: 'short', day: 'numeric' })
      }),
      level: item.tankLevel
    }));
  };

  const chartData = filterData();

  const getAverageLevel = () => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, item) => acc + item.level, 0);
    return Math.round(sum / chartData.length);
  };

  const getTrend = () => {
    if (chartData.length < 2) return 0;
    const first = chartData[0].level;
    const last = chartData[chartData.length - 1].level;
    return last - first;
  };

  const timeRangeOptions = [
    { value: 'hour', label: 'Last Hour', icon: Clock },
    { value: 'day', label: 'Today', icon: Calendar },
    { value: 'week', label: 'Week', icon: TrendingUp },
    { value: 'all', label: 'All Time', icon: TrendingUp }
  ];

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {timeRangeOptions.map(option => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                timeRange === option.value
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-2 sm:p-4">
          <div className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Data Points</div>
          <div className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300 truncate">{chartData.length}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-2 sm:p-4">
          <div className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Average Level</div>
          <div className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-300 truncate">{getAverageLevel()}%</div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-2xl p-2 sm:p-4">
          <div className="text-[10px] sm:text-xs text-pink-600 dark:text-pink-400 font-medium mb-1">Trend</div>
          <div className={`text-lg sm:text-2xl font-bold flex items-center gap-1 truncate ${
            getTrend() > 0 ? 'text-green-600 dark:text-green-400' : getTrend() < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
          }`}>
            <span className="text-base sm:text-2xl">{getTrend() > 0 ? '↑' : getTrend() < 0 ? '↓' : '→'}</span>
            <span className="truncate">{Math.abs(Math.round(getTrend()))}%</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-2 sm:p-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                className="dark:stroke-gray-400"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#6b7280"
                className="dark:stroke-gray-400"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                wrapperClassName="dark:bg-gray-800"
              />
              <Line 
                type="monotone" 
                dataKey="level" 
                stroke="url(#colorLevel)" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#8b5cf6' }}
                activeDot={{ r: 6, fill: '#ec4899' }}
                fill="url(#colorLevel)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <TrendingUp className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">Waiting for sensor readings...</p>
          </div>
        )}
      </div>
    </div>
  );
}
