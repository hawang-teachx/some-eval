import { Settings, Eye, PieChart, Heart, Briefcase, ChevronDown, Home } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-pink-500 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6" />
          <div className="flex items-center gap-1 bg-white bg-opacity-20 rounded-full px-3 py-1">
            <h1 className="text-lg font-medium">Overview: My Household</h1>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <div className="w-6"></div> {/* Spacer for centering */}
      </header>

      {/* Tab Navigation */}
      <div className="bg-pink-500 text-white">
        <div className="flex px-6">
          <button className="flex-1 py-4 text-center font-medium border-b-2 border-white">
            OVERVIEW
          </button>
          <button className="flex-1 py-4 text-center font-medium opacity-70">
            SPENDING
          </button>
          <button className="flex-1 py-4 text-center font-medium opacity-70">
            LIST
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 space-y-6">
        {/* Summary Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-500">September 2025</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">11 TRANSACTIONS</span>
              <div className="w-4 h-4 bg-pink-400 rounded-sm"></div>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Income Card */}
            <div className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-400 rounded-full mb-3 flex items-center justify-center">
                <div className="w-8 h-6 bg-green-300 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-900">$3,500</div>
              <div className="text-sm text-gray-500">INCOME</div>
            </div>

            {/* Expenses Card */}
            <div className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-pink-400 rounded-full mb-3 flex items-center justify-center">
                <div className="w-8 h-6 bg-pink-300 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-900">$2,377</div>
              <div className="text-sm text-gray-500">EXPENSES</div>
            </div>

            {/* Left Card */}
            <div className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-purple-400 rounded-full mb-3 flex items-center justify-center">
                <div className="w-8 h-6 bg-purple-300 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-900">$1,123</div>
              <div className="text-sm text-gray-500">LEFT</div>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">EXPENSES</h3>
            <div className="w-6"></div>
          </div>

          {/* Circular Chart */}
          <div className="relative flex justify-center items-center mb-8">
            <svg width="200" height="200" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#FEF3C7"
                strokeWidth="16"
              />
              {/* Housing segment (orange) - 65% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#FB923C"
                strokeWidth="16"
                strokeDasharray={`${0.65 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                strokeLinecap="round"
              />
              {/* Food & drinks segment (blue) - 30% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="16"
                strokeDasharray={`${0.30 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                strokeLinecap="round"
                strokeDashoffset={`${-0.65 * 2 * Math.PI * 80}`}
              />
              {/* Entertainment segment (pink) - 3% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#F472B6"
                strokeWidth="16"
                strokeDasharray={`${0.03 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                strokeLinecap="round"
                strokeDashoffset={`${-(0.65 + 0.30) * 2 * Math.PI * 80}`}
              />
              {/* Lifestyle segment (red) - 2% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#F87171"
                strokeWidth="16"
                strokeDasharray={`${0.02 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                strokeLinecap="round"
                strokeDashoffset={`${-(0.65 + 0.30 + 0.03) * 2 * Math.PI * 80}`}
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mb-2">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">$1,532</div>
              <div className="text-sm text-gray-500">HOUSING</div>
            </div>
          </div>

          {/* Add button */}
          <div className="flex justify-end">
            <button className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
              +
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">HEAD CATEGORIES</h3>
            <h3 className="text-lg font-semibold text-gray-900">CATEGORIES</h3>
          </div>

          {/* Category Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                <span className="font-medium text-gray-900">Housing</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">$1,532</span>
                <div className="w-6 h-6 text-gray-400">›</div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <span className="font-medium text-gray-900">Food & drinks</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">$750</span>
                <div className="w-6 h-6 text-gray-400">›</div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
                <span className="font-medium text-gray-900">Entertainment</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">$66</span>
                <div className="w-6 h-6 text-gray-400">›</div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                <span className="font-medium text-gray-900">Lifestyle</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">$2</span>
                <div className="w-6 h-6 text-gray-400">›</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1 text-pink-500">
            <Eye className="w-6 h-6" />
            <span className="text-xs font-medium">Overview</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <PieChart className="w-6 h-6" />
            <span className="text-xs font-medium">Budget</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Heart className="w-6 h-6" />
            <span className="text-xs font-medium">Save</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Briefcase className="w-6 h-6" />
            <span className="text-xs font-medium">Tools</span>
          </button>
        </div>
      </nav>
  </div>
  );
}

export default App
