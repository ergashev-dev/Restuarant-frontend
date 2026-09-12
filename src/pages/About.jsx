import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function About({
  search,
  setSearch,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      <Navbar
        search={search}
        setSearch={setSearch}
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="ml-0 min-h-[calc(100vh-64px)] bg-[#f7f8fa] p-4 sm:min-h-[calc(100vh-80px)] sm:p-6 md:ml-64 md:p-8">
        <div className="mx-auto max-w-375">

          <div className="mb-6 sm:mb-8">
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-slate-600">About</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[32px]">
              About
            </h1>

            <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
              Restaurant Management System haqida ma'lumot
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-xl text-white">
                🍽️
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                Restaurant Management
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Restaurant menyusi, kategoriyalar va taomlarni boshqarish
                uchun yaratilgan zamonaviy boshqaruv tizimi.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                ⚡
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                Fast & Simple
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Kerakli ma'lumotlarni tez qo'shish, tahrirlash va o'chirish
                uchun sodda va qulay interfeys.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🛡️
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                Reliable System
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ma'lumotlar backend API orqali boshqariladi va MongoDB
                ma'lumotlar bazasida saqlanadi.
              </p>
            </div>

          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:mt-5 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">

              <div className="max-w-2xl">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Project
                </p>

                <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                  Restaurant Management System
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Ushbu loyiha restaurantdagi kategoriyalar va menu
                  mahsulotlarini boshqarishni osonlashtirish uchun ishlab
                  chiqilgan. Administrator tizim orqali ma'lumotlarni
                  yaratishi, ko'rishi, yangilashi va o'chirishi mumkin.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-130">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Frontend</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    React
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Backend</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    Node.js
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">API</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    Express
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Database</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    MongoDB
                  </p>
                </div>

              </div>

            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:mt-5 sm:p-7">

            <h2 className="text-lg font-semibold text-slate-900">
              Asosiy imkoniyatlar
            </h2>

            <div className="mt-5 grid gap-3 md:grid-cols-2">

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                  ✓
                </span>

                <span className="text-sm text-slate-600">
                  Kategoriyalarni boshqarish
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                  ✓
                </span>

                <span className="text-sm text-slate-600">
                  Menu mahsulotlarini boshqarish
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                  ✓
                </span>

                <span className="text-sm text-slate-600">
                  Rasm yuklash tizimi
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                  ✓
                </span>

                <span className="text-sm text-slate-600">
                  Dashboard statistikasi
                </span>
              </div>

            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-5 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

            <div>
              <p className="font-medium text-slate-900">
                Restaurant Management System
              </p>

              <p className="mt-1 text-xs text-slate-400">
                MERN Stack loyihasi
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              Active
            </span>

          </div>

        </div>
      </main>
    </div>
  );
}