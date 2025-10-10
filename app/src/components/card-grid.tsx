import { Eye, MoreHorizontal } from "lucide-react";

type CreditCard = {
  id: string;
  name: string;
  status: "Active" | "Primary" | "Locked";
  type: "primary" | "secondary" | "locked";
  number: string;
  expires: string;
  holder: string;
  utilization: string;
  balance: string;
  available: string;
  minPayment: string;
  dueDate: string;
  hasLock?: boolean;
};

const cards: CreditCard[] = [
  {
    id: "1",
    name: "Platinum Rewards",
    status: "Active",
    type: "primary",
    number: "9012",
    expires: "12/27",
    holder: "John Doe",
    utilization: "15.7%",
    balance: "$1,259.43",
    available: "$6,740.57",
    minPayment: "$45.00",
    dueDate: "9/14/2025",
  },
  {
    id: "2",
    name: "Travel Elite",
    status: "Active",
    type: "secondary",
    number: "9012",
    expires: "09/26",
    holder: "John Doe",
    utilization: "20.0%",
    balance: "$1,399.87",
    available: "$5,600.13",
    minPayment: "$50.00",
    dueDate: "9/19/2025",
  },
  {
    id: "3",
    name: "Cashback Plus",
    status: "Locked",
    type: "locked",
    number: "9012",
    expires: "06/28",
    holder: "John Doe",
    utilization: "0.0%",
    balance: "$0",
    available: "$5,000",
    minPayment: "$0",
    dueDate: "-",
  },
];

export function CardGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.id}
          className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_-40px_rgba(234,80,88,0.7)]"
        >
          <CardHeader card={card} />
          <CardBody card={card} />
          <CardFooter />
        </div>
      ))}
    </section>
  );
}

function CardHeader({ card }: { card: CreditCard }) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-[#1c1d23]">{card.name}</p>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-[#ffe5e8] px-2 py-1 text-[#f0434a]">
            {card.type === "primary" ? "Primary" : "Card"}
          </span>
          <span
            className="rounded-full px-2 py-1"
            style={
              card.type === "locked"
                ? { backgroundColor: "#fff2d5", color: "#caa022" }
                : { backgroundColor: "#e6f7ee", color: "#21b26f" }
            }
          >
            {card.status}
          </span>
        </div>
      </div>
      <button className="rounded-full p-2 text-[#a3a6b4] transition hover:bg-[#fff0f2] hover:text-[#f0434a]">
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
}

function CardBody({ card }: { card: CreditCard }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-[#1c1d23]">
        <span className="text-xl font-semibold tracking-widest">
          **** **** **** {card.number}
        </span>
        <Eye className="h-5 w-5 text-[#a3a6b4]" />
      </div>

      <div className="flex items-center justify-between text-sm text-[#555b66]">
        <div>
          <p className="text-xs text-[#a3a6b4]">Expires</p>
          <p className="font-medium text-[#1c1d23]">{card.expires}</p>
        </div>
        <div>
          <p className="text-xs text-[#a3a6b4]">Holder</p>
          <p className="font-medium text-[#1c1d23]">{card.holder}</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-[#a3a6b4]">
          <span>Credit Utilization</span>
          <span className="text-[#f0434a]">{card.utilization}</span>
        </div>
        <div className="h-2 rounded-full bg-[#ffe5e8]">
          <div className="h-full rounded-full bg-[#f0434a]" style={{ width: card.utilization }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-[#555b66]">
        <InfoBlock label="Balance" primary={card.balance} secondary="Available" secondaryValue={card.available} />
        <InfoBlock label="Min Payment" primary={card.minPayment} secondary="Due Date" secondaryValue={card.dueDate} />
      </div>
    </div>
  );
}

function InfoBlock({
  label,
  primary,
  secondary,
  secondaryValue,
}: {
  label: string;
  primary: string;
  secondary: string;
  secondaryValue: string;
}) {
  return (
    <div className="rounded-2xl bg-[#fff7f8] p-4">
      <p className="text-xs text-[#a3a6b4]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[#1c1d23]">{primary}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-[#a3a6b4]">
        <span>{secondary}</span>
        <span className={secondary === "Available" ? "text-[#21b26f]" : "text-[#1c1d23]"}>
          {secondaryValue}
        </span>
      </div>
    </div>
  );
}

function CardFooter() {
  return (
    <div className="mt-6 flex gap-3">
      <button className="flex-1 rounded-full bg-[#f0434a] py-3 text-sm font-semibold text-white shadow hover:bg-[#d93b40]">
        Make Payment
      </button>
      <button className="flex-1 rounded-full border border-[#ffe5e8] bg-white py-3 text-sm font-semibold text-[#f0434a] hover:bg-[#fff0f2]">
        View Statements
      </button>
    </div>
  );
}

