import { X, Users, BookOpen, Calendar, Code } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const teamMembers = [
    {
      name: 'Lord Jason Riveral',
      role: 'Main Hardware Developer',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Jason'
    },
    {
      name: 'Jerome Magdadaro',
      role: 'Assistant Hardware Developer',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Jerome'
    },
    {
      name: 'Merry Apple Edaño',
      role: 'Software Developer',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Merry'
    },
    {
      name: 'Vence Peter Doble',
      role: 'Documentation and Hardware Assistant',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Vence'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden animate-slideUp flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-110 z-10"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 p-8 text-white rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold">About Us</h2>
          </div>
          <p className="text-white/90 text-lg">Pet Water Dispenser IoT Project</p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-8">
          {/* Project Info */}
          <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Project Information
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <span className="font-semibold">Group:</span> GROUP 1
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Code className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <span className="font-semibold">Course:</span> BSIT 3A
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <span className="font-semibold">Academic Year:</span> 2025-2026
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <span className="font-semibold">Subject:</span> Application of Internet of Things (AP 5)
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                This project demonstrates an IoT-based automated pet water dispenser system that monitors water levels, 
                detects pet activity, and provides real-time control through a web interface. The system integrates 
                ESP32 microcontroller, sensors, and a modern web dashboard for seamless monitoring and management.
              </p>
            </div>
          </div>

          {/* Team Members */}
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Development Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-gray-600 ring-4 ring-purple-200 dark:ring-purple-800 group-hover:ring-purple-400 dark:group-hover:ring-purple-600 transition-all">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Built with ❤️ by Group 1 • BSIT 3A • 2025-2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
