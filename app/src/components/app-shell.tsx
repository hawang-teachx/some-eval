import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#fff4f5] text-[#1c1d23]">
      <div className="mx-auto flex">
        <Sidebar />
        <main
          className={cn(
            "flex-1 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(234,80,88,0.7)] backdrop-blur",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

