import { CreditCard, LayoutGrid, Wallet, ReceiptText, Command, BarChart3, Trophy, HelpCircle, Plus, ShieldCheck, Lock, Eye } from 'lucide-react'

function App() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr] bg-white text-black">
      {/* Sidebar */}
      <aside className="flex flex-col border-b border-black lg:border-b-0 lg:border-r">
        <div className="p-4 flex items-center gap-2">
          <CreditCard size={28} />
          <div>
            <div className="font-semibold">RedBank</div>
            <div className="text-xs text-black/60">Credit Management</div>
          </div>
        </div>

        <div className="px-2 pb-4 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md"><LayoutGrid size={16} /> Dashboard</div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/20"><CreditCard size={16} /> Credit List</div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md"><Wallet size={16} /> Loans</div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md"><ReceiptText size={16} /> Transactions</div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md"><Command size={16} /> Command Center</div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md"><BarChart3 size={16} /> Reports</div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md"><Trophy size={16} /> Rewards</div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md"><HelpCircle size={16} /> Help</div>
        </div>

        <div className="mt-auto p-4">
          <div className="border border-black rounded-lg bg-white">
            <div className="p-4">
              <div className="font-semibold text-black/60 mb-2">Account Summary</div>
              <div className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
                <div className="text-black/60 text-xs">Total Credit</div>
                <div className="text-xs">$15,000</div>
                <div className="text-black/60 text-xs">Available</div>
                <div className="text-xs">$12,341</div>
                <div className="text-black/60 text-xs">Used</div>
                <div className="text-xs">$2,659</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main>
        <div className="flex items-center justify-between p-4 border-b border-black">
          <div>
            <div className="font-bold">Credit Card Management</div>
            <div className="text-xs text-gray-500 mt-1">Manage all your credit cards in one place</div>
          </div>
          <button className="inline-flex items-center gap-2 border border-black rounded-md px-3 py-2 bg-white"> 
            <Plus size={16} /> Apply for New Card
          </button>
        </div>

        <div className="p-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="border border-black rounded-lg bg-white">
              <div className="p-4 border-b border-black flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} />
                  <div className="font-semibold">Platinum Rewards</div>
                </div>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 border border-black rounded-full px-2 py-0.5 text-xs">Primary</span>
                  <span className="inline-flex items-center gap-1 border border-black rounded-full px-2 py-0.5 text-xs"><ShieldCheck size={14} /> Active</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between">
                  <div className="font-semibold">**** **** **** 9012</div>
                  <Eye size={16} />
                </div>

                <div className="flex gap-4 mt-3">
                  <div className="flex-1">
                    <div className="text-xs text-black/60">Expires</div>
                    <div className="text-xs">12/27</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-black/60">Holder</div>
                    <div className="text-xs">John Doe</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-black/60 flex justify-between">
                    <span>Credit Utilization</span>
                    <span>15.7%</span>
                  </div>
                  <div className="h-2 border border-black rounded-full overflow-hidden mt-1">
                    <span className="block h-full bg-black w-[15.7%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <div className="text-xs text-black/60">Balance</div>
                    <div>$1,259.43</div>
                  </div>
                  <div>
                    <div className="text-xs text-black/60">Available</div>
                    <div>$6,740.57</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <div className="text-xs text-black/60">Min Payment</div>
                    <div>$45.00</div>
                  </div>
                  <div>
                    <div className="text-xs text-black/60">Due Date</div>
                    <div>9/14/2025</div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button className="border border-black rounded-md px-3 py-2 bg-white">Make Payment</button>
                  <button className="border border-black rounded-md px-3 py-2 bg-white">View Statements</button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border border-black rounded-lg bg-white">
              <div className="p-4 border-b border-black flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} />
                  <div className="font-semibold">Travel Elite</div>
                </div>
                <div className="inline-flex items-center gap-1 border border-black rounded-full px-2 py-0.5 text-xs"><ShieldCheck size={14} /> Active</div>
              </div>
              <div className="p-4">
                <div className="flex justify-between">
                  <div className="font-semibold">**** **** **** 9012</div>
                  <Eye size={16} />
                </div>

                <div className="flex gap-4 mt-3">
                  <div className="flex-1">
                    <div className="text-xs text-black/60">Expires</div>
                    <div className="text-xs">09/26</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-black/60">Holder</div>
                    <div className="text-xs">John Doe</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-black/60 flex justify-between">
                    <span>Credit Utilization</span>
                    <span>20.0%</span>
                  </div>
                  <div className="h-2 border border-black rounded-full overflow-hidden mt-1">
                    <span className="block h-full bg-black w-[20%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <div className="text-xs text-black/60">Balance</div>
                    <div>$1,399.87</div>
                  </div>
                  <div>
                    <div className="text-xs text-black/60">Available</div>
                    <div>$5,600.13</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <div className="text-xs text-black/60">Min Payment</div>
                    <div>$50.00</div>
                  </div>
                  <div>
                    <div className="text-xs text-black/60">Due Date</div>
                    <div>9/19/2025</div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button className="border border-black rounded-md px-3 py-2 bg-white">Make Payment</button>
                  <button className="border border-black rounded-md px-3 py-2 bg-white">View Statements</button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-black rounded-lg bg-white">
              <div className="p-4 border-b border-black flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} />
                  <div className="font-semibold">Cashback Plus</div>
                </div>
                <div className="inline-flex items-center gap-1 border border-black rounded-full px-2 py-0.5 text-xs"><Lock size={14} /> Locked</div>
              </div>
              <div className="p-4">
                <div className="flex justify-between">
                  <div className="font-semibold">**** **** **** 9012</div>
                  <Eye size={16} />
                </div>

                <div className="flex gap-4 mt-3">
                  <div className="flex-1">
                    <div className="text-xs text-black/60">Expires</div>
                    <div className="text-xs">06/28</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-black/60">Holder</div>
                    <div className="text-xs">John Doe</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-black/60 flex justify-between">
                    <span>Credit Utilization</span>
                    <span>0.0%</span>
                  </div>
                  <div className="h-2 border border-black rounded-full overflow-hidden mt-1">
                    <span className="block h-full bg-black w-[0%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <div className="text-xs text-black/60">Balance</div>
                    <div>$0</div>
                  </div>
                  <div>
                    <div className="text-xs text-black/60">Available</div>
                    <div>$5,000</div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button className="border border-black rounded-md px-3 py-2 bg-white">Make Payment</button>
                  <button className="border border-black rounded-md px-3 py-2 bg-white">View Statements</button>
                </div>
              </div>
            </div>
          </div>

          <div className="h-4" />

          <div className="grid gap-4 lg:grid-cols-4">
            <div className="border border-black rounded-lg p-4 bg-white">
              <div className="text-xs text-black/60">Total Cards</div>
              <div className="font-bold text-xl">3</div>
            </div>
            <div className="border border-black rounded-lg p-4 bg-white">
              <div className="text-xs text-black/60">Total Credit Limit</div>
              <div className="font-bold text-xl">$20,000</div>
            </div>
            <div className="border border-black rounded-lg p-4 bg-white">
              <div className="text-xs text-black/60">Total Balance</div>
              <div className="font-bold text-xl">$2,659.3</div>
            </div>
            <div className="border border-black rounded-lg p-4 bg-white">
              <div className="text-xs text-black/60">Available Credit</div>
              <div className="font-bold text-xl">$17,340.7</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App
