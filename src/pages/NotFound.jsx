import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <SearchX size={34} className="text-slate-400" />
        </div>

        <p className="mt-7 text-7xl font-bold tracking-tight text-slate-900">
          404
        </p>

        <h1 className="mt-4 text-2xl font-semibold text-slate-900">
          Sahifa topilmadi
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
          Siz qidirayotgan sahifa mavjud emas yoki manzil noto‘g‘ri
          kiritilgan.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            to="/"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Home size={17} />
            Bosh sahifa
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Orqaga
          </button>

        </div>
      </div>
    </div>
  );
}