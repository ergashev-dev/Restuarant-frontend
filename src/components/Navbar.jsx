import React from "react";
import { Menu } from "lucide-react";
import logo from "../assets/logo.jpg";

export default function Navbar({ search, setSearch, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 h-16 sm:h-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:gap-8 sm:px-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Menyuni ochish"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
          >
            <Menu size={20} strokeWidth={2} />
          </button>

          <img
            src={logo}
            alt="Logo"
            className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl object-cover"
          />

          <div className="hidden xs:block">
            <h1 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight">
              Restaurant
            </h1>

            <p className="text-[9px] sm:text-[10px] tracking-widest text-slate-400">
              MANAGEMENT SYSTEM
            </p>
          </div>
        </div>
        <div className="max-w-lg flex-1">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish..."
              className="
                h-9 sm:h-10
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-3 sm:px-4
                pr-8 sm:pr-10
                text-xs sm:text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-slate-400
                focus:bg-white
                focus:ring-4
                focus:ring-slate-100
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base sm:text-lg text-slate-400 transition hover:text-slate-700"
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div className="hidden md:block md:w-32" />

      </div>
    </header>
  );
}