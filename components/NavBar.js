"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Builder" },
  { href: "/word-quotation", label: "Word Export" },
  { href: "/quotations", label: "Quotations" },
  { href: "/admin", label: "Inventory" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="no-print bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800/80 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 sm:gap-8">
          <span className="font-bold text-sm tracking-tight text-gray-900 dark:text-slate-100">
            PC Quotations
          </span>
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-150 ${
                    isActive
                      ? "bg-gray-900 text-white dark:bg-indigo-600 dark:text-white font-medium shadow-sm"
                      : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}


