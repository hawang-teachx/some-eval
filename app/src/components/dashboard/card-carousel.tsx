import { Eye } from "lucide-react";

type CardEntry = {
  name: string;
  tag: string;
  number: string;
  holder: string;
  availableCredit: string;
  usedLabel: string;
  expires: string;
  total: number;
};

const cards: CardEntry[] = [
  {
    name: "Platinum Rewards",
    tag: "Primary",
    number: "9012",
    holder: "John Doe",
    availableCredit: "$4976.55",
    usedLabel: "$3023.45 used",
    expires: "12/27",
    total: 8000
  },
  {
    name: "Travel Elite",
    tag: "Travel",
    number: "9012",
    holder: "John Doe",
    availableCredit: "$5,600.13",
    usedLabel: "$1,399.87 used",
    expires: "09/26",
    total: 7000
  },
];

export function CardCarousel() {
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1c1d23]">My Credit Cards</h2>
        <button className="text-sm font-medium text-[#f0434a]">Manage Cards</button>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.name}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br bg-stone-500 p-6 text-white shadow-[0_40px_90px_-45px_rgba(234,80,88,0.9)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                    {card.name}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide">
                    {card.tag}
                  </span>
                </div>
                <p className="mt-6 text-xl tracking-[6px]">**** **** **** {card.number}</p>
              </div>
              <button className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20">
                <Eye className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-start justify-between text-sm flex-col gap-4">
              <div>
                <p className="text-xs text-white/70">Card Holder</p>
                <p className="text-lg font-semibold">{card.holder}</p>
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <p className="text-white/70">Available Credit</p>
                  <p className="text-lg font-semibold">{card.availableCredit}</p>
                </div>
                <div className="my-1 flex h-2 w-full items-center overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-3/8 rounded-full bg-white" />
                </div>
                <div className="flex justify-between items-center">
                  <p className="tracking-wide text-white/70">
                    {card.usedLabel}
                  </p>
                  <p className="text-lg font-semibold">
                    {card.total}$
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70">Expires</p>
                <p className="text-lg font-semibold">{card.expires}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

