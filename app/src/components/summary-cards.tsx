type Summary = {
  label: string;
  value: string;
  emphasis?: boolean;
};

const summaries: Summary[] = [
  { label: "Total Cards", value: "3" },
  { label: "Total Credit Limit", value: "$20,000" },
  { label: "Total Balance", value: "$2,659.3" },
  { label: "Available Credit", value: "$17,340.7", emphasis: true },
];

export function SummaryCards() {
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaries.map(({ label, value, emphasis }) => (
        <div
          key={label}
          className="rounded-3xl bg-white p-5 text-sm shadow-[0_20px_60px_-40px_rgba(234,80,88,0.7)]"
        >
          <p className="text-xs text-[#a3a6b4]">{label}</p>
          <p
            className="mt-2 text-xl font-semibold"
            style={emphasis ? { color: "#1db05b" } : undefined}
          >
            {value}
          </p>
        </div>
      ))}
    </section>
  );
}

