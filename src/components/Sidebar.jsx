import React from "react";
import {
  LayoutDashboard,
  Folder,
  UtensilsCrossed,
  Info,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-40 w-64 border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:top-20 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="mb-4 flex items-center justify-between px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Menu
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1.5">
            <NavLink
              to="/dashboard"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <LayoutDashboard size={18} strokeWidth={1.8} />
              Dashboard
            </NavLink>

            <NavLink
              to="/categories"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Folder size={18} strokeWidth={1.8} />
              Categories
            </NavLink>

            <NavLink
              to="/menu-items"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <UtensilsCrossed size={18} strokeWidth={1.8} />
              Menu Items
            </NavLink>

            <NavLink
              to="/about"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Info size={18} strokeWidth={1.8} />
              About
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
}