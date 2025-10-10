const utilization = [
  { name: "Platinum Rewards", used: "$1,259.43", percent: "15.7% used", limit: "$8,000" },
  { name: "Travel Elite", used: "$1,399.87", percent: "20.0% used", limit: "$7,000" },
];

export function CreditUtilization() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_-40px_rgba(234,80,88,0.7)]">
      <h2 className="text-lg font-semibold text-[#1c1d23]">Credit Utilization</h2>
      <div className="mt-4 space-y-6">
        {utilization.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-[#1c1d23]">
              <p className="font-medium">{item.name}</p>
              <span className="text-xs text-[#a3a6b4]">{item.limit}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#a3a6b4]">
              <span>{item.used}</span>
              <span className="text-[#f0434a]">{item.percent}</span>
            </div>
            <div className="h-2 rounded-full bg-[#ffe5e8]">
              <div className="h-full rounded-full bg-[#f0434a]" style={{ width: item.percent.replace(" used", "") }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

