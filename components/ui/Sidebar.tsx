import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Image as ImageIcon,
  LayoutDashboard,
  Calendar,
  Logs,
  Activity,
  PiggyBank,
  StickyNote,
  ListChecks,
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  count?: number;
}

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    { name: "User", href: "#user", icon: <LayoutDashboard size={20} /> },
    { name: "Calendario", href: "#calendario", icon: <Calendar size={20} /> },
    { name: "Imágenes", href: "#images", icon: <ImageIcon size={20} /> },
    { name: "Movimientos", href: "#movements", icon: <Logs size={20} /> },
    {
      name: "PersonalFinances",
      href: "#PersonalFinances",
      icon: <Activity size={20} />,
    },
    {
      name: "BankReconciliation",
      href: "#BankReconciliation",
      icon: <PiggyBank size={20} />,
    },
    { name: "Notes", href: "#notes", icon: <StickyNote size={20} /> },
    { name: "Tasks", href: "#tasks", icon: <ListChecks size={20} /> },
    { name: "Pending", href: "#pending", icon: <PiggyBank size={20} /> },
  ];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú"
        className="fixed top-1 left-1 z-9999 p-3 bg-slate-900/80 backdrop-blur-md text-white rounded-full shadow-2xl hover:bg-blue-500 hover:scale-110 transition-all border border-white/20"
      >
        <Menu size={16} />
      </button>

      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-950 z-[1001] shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 pb-2 flex justify-between items-center">
            <span className="text-xs mt-8 font-bold uppercase tracking-widest text-slate-500">
              Navegación
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors group"
              >
                {item.icon && (
                  <span className="text-slate-600 group-hover:text-blue-400 transition-colors">
                    {item.icon}
                  </span>
                )}
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
