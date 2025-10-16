import { Settings, Eye, PieChart, Heart, Briefcase, ChevronDown, Home, CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const expenseData = [
    { name: 'Housing', value: 1532, color: '#6B7280' },
    { name: 'Food & drinks', value: 750, color: '#9CA3AF' },
    { name: 'Entertainment', value: 120, color: '#D1D5DB' },
    { name: 'Lifestyle', value: 120, color: '#E5E7EB' }
  ];

  const chartData = {
    labels: expenseData.map(item => item.name),
    datasets: [{
      data: expenseData.map(item => item.value),
      backgroundColor: expenseData.map(item => item.color),
      borderWidth: 0,
      spacing: 3,
      borderRadius: 1000,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '85%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <div className='w-10 h-10 bg-white/40 rounded-full flex items-center justify-center absolute'>
            <Settings className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-3 justify-center w-full">
          <div className="flex items-center gap-1 px-3 py-1 ml-6">
            <h1 className="text-lg font-medium">Overview: My Household</h1>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <div className="w-6"></div> {/* Spacer for centering */}
      </header>

      {/* Tab Navigation */}
      <div className="bg-black text-white pb-4">
        <div className="flex px-6">
          <button className="flex-1 py-2 text-center font-medium opacity-70">
            OVERVIEW
          </button>
          <div className='px-8 bg-white/30 rounded-full'>
            <button className="flex-1 py-2 text-center font-medium">
              SPENDING
            </button>
          </div>
          <button className="flex-1 py-2 text-center font-medium opacity-70">
            LIST
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 space-y-6">
        {/* Summary Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <ChevronLeft />
            <div className='flex flex-col'>
              <h2 className="text-xl font-semibold text-gray-500">September 2025</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">11 TRANSACTIONS</span>
                <CalendarDays className='' size={16}/>
              </div>
            </div>
            <ChevronRight />
          </div>

          
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="bg-white rounded-2xl px-4 py-2">
            <div className="relative flex items-end justify-around gap-8 h-full">
              <div className="flex flex-col items-center flex-1 relative z-10">
                <div className="w-full flex items-end justify-center mb-6" style={{ height: '150px' }}>
                  <div className="bg-stone-400 rounded-t-full w-14" style={{ height: '100%' }} />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-800">$3,500</div>
                  <div className="text-xs font-medium text-gray-400 tracking-wider mt-1">INCOME</div>
                </div>
              </div>

              <div className="flex flex-col items-center flex-1 relative z-10">
                <div className="w-full flex items-end justify-center mb-6" style={{ height: '150px' }}>
                  <div className="bg-stone-400 rounded-t-full w-14" style={{ height: '68%' }} />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-800">$2,377</div>
                  <div className="text-xs font-medium text-gray-400 tracking-wider mt-1">EXPENSES</div>
                </div>
              </div>

              <div className="flex flex-col items-center flex-1 relative z-10">
                <div className="w-full flex items-end justify-center mb-6" style={{ height: '150px' }}>
                  <div className="bg-stone-400 rounded-t-full w-14" style={{ height: '32%' }} />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-800">$1,123</div>
                  <div className="text-xs font-medium text-gray-400 tracking-wider mt-1">LEFT</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <div className="flex items-center mb-6 gap-2 bg-gray-200 w-fit px-4 py-2 rounded-full">
            <h3 className="text-xs font-semibold text-gray-900 tracking-widest">EXPENSES</h3>
            <ChevronDown size={16}/>
          </div>

          {/* Circular Chart */}
          <div className="relative flex justify-center items-center mb-8">
            <div style={{ width: '300px', height: '300px' }}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mb-2">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">$1,532</div>
              <div className="text-xs text-gray-500 mt-2 tracking-widest">HOUSING</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6 mx-auto w-fit gap-8 px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-900 bg-gray-200 px-4 py-2 rounded-full tracking-widest">HEAD CATEGORIES</h3>
            <h3 className="text-xs font-semibold text-gray-900 px-4 py-2 rounded-full tracking-widest">CATEGORIES</h3>
          </div>

          {/* Category Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-black rounded"></div>
                <span className="font-medium text-gray-900">Housing</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">$1,532</span>
                <div className="w-6 h-6 text-gray-400">›</div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-black rounded"></div>
                <span className="font-medium text-gray-900">Food & drinks</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">$750</span>
                <div className="w-6 h-6 text-gray-400">›</div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-black rounded"></div>
                <span className="font-medium text-gray-900">Entertainment</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">$66</span>
                <div className="w-6 h-6 text-gray-400">›</div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-black rounded"></div>
                <span className="font-medium text-gray-900">Lifestyle</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">$25</span>
                <div className="w-6 h-6 text-gray-400">›</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add button */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
          <div className="flex justify-end">
            <button className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              <Plus />
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1 text-black">
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
