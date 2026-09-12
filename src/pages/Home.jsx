import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Folder,
  Utensils,
  LayoutDashboard,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Home({
  search,
  setSearch,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        search={search}
        setSearch={setSearch}
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="ml-0 min-h-[calc(100vh-64px)] p-4 sm:p-6 md:ml-64 md:min-h-[calc(100vh-80px)] md:p-8">
        <div className="flex min-h-[calc(100vh-96px)] items-center justify-center sm:min-h-[calc(100vh-128px)]">
          <div className="w-full max-w-4xl">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8 md:p-10">
              <div className="max-w-2xl">

                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:text-sm sm:tracking-[0.2em]">
                  Restaurant Management System
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:mt-4 sm:text-4xl md:text-5xl">
                  Restaurant boshqaruv tizimiga 
                  <br className="hidden sm:block" />
                  <span className="sm:ml-2"> xush kelibsiz </span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:mt-5 sm:text-base sm:leading-7">
                  Restoraningiz kategoriyalari va menyu mahsulotlarini
                  boshqarish, statistikalarni ko‘rish va tizimni nazorat
                  qilish uchun barcha kerakli vositalar shu yerda.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                  <Link
                    to="/dashboard"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 sm:h-12"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/menu-items"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:h-12"
                  >
                    <Utensils size={18} />
                    Menyuni ko‘rish
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5">

              <Link
                to="/categories"
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <Folder size={20} className="text-slate-700" />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
                  />
                </div>

                <h2 className="mt-4 font-semibold text-slate-900 sm:mt-5">
                  Kategoriyalar
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Restaurant kategoriyalarini boshqaring
                </p>
              </Link>

              <Link
                to="/menu-items"
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <Utensils size={20} className="text-slate-700" />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
                  />
                </div>

                <h2 className="mt-4 font-semibold text-slate-900 sm:mt-5">
                  Menu Items
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Taomlar va menyu mahsulotlarini boshqaring
                </p>
              </Link>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}