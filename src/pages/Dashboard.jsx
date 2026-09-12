import React, { useEffect, useState } from "react";
import {
  Utensils,
  Folder,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { getStats } from "../services/dashboardService";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Dashboard({
  search,
  setSearch,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    try {
      const response = await getStats();
      setStats(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
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

        <main className="ml-0 min-h-[calc(100vh-64px)] bg-slate-50 p-4 sm:min-h-[calc(100vh-80px)] sm:p-6 md:ml-64 md:p-8">
          <div className="animate-pulse">

            <div className="h-8 w-40 rounded bg-slate-200 shadow-xl"></div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
              <div className="h-32 rounded-2xl bg-white shadow-xl"></div>
              <div className="h-32 rounded-2xl bg-white shadow-xl"></div>
              <div className="h-32 rounded-2xl bg-white shadow-xl"></div>
              <div className="h-32 rounded-2xl bg-white shadow-xl"></div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  const summary = stats.summary;
  const financials = stats.financials;

  const cards = [
    {
      title: "Kategoriyalar",
      value: summary.totalCategories,
      icon: Folder,
    },
    {
      title: "Menu Items",
      value: summary.totalMenuItems,
      icon: Utensils,
    },
    {
      title: "Mavjud",
      value: summary.availableItems,
      icon: CheckCircle2,
    },
    {
      title: "Mavjud emas",
      value: summary.unavailableItems,
      icon: XCircle,
    },
  ];

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

      <main className="ml-0 min-h-[calc(100vh-64px)] p-4 sm:min-h-[calc(100vh-80px)] sm:p-6 md:ml-64 md:p-8">

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-2xl">
            Dashboard
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Restaurant tizimi statistikasi
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">

          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className="text-slate-700"
                    />
                  </div>

                </div>

                <h2 className="mt-5 text-3xl font-semibold text-slate-900">
                  {card.value}
                </h2>

              </div>
            );
          })}

        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <TrendingUp size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Narx statistikasi
                </h2>

                <p className="text-xs text-slate-500 sm:text-sm">
                  Menu narxlari bo‘yicha ma'lumot
                </p>
              </div>

            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-xl bg-slate-50 p-4 sm:bg-transparent sm:p-0">
                <p className="text-xs text-slate-400">
                  O‘rtacha
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {financials.avgPrice.toLocaleString()} so‘m
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:bg-transparent sm:p-0">
                <p className="text-xs text-slate-400">
                  Eng arzon
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {financials.minPrice.toLocaleString()} so‘m
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:bg-transparent sm:p-0">
                <p className="text-xs text-slate-400">
                  Eng qimmat
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {financials.maxPrice.toLocaleString()} so‘m
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

            <p className="text-sm text-slate-500">
              Menu umumiy qiymati
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              {financials.totalMenuValue.toLocaleString()} so‘m
            </h2>

            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Barcha menu itemlarning joriy narxlari yig‘indisi
            </p>

          </div>

        </div>

      </main>
    </div>
  );
}