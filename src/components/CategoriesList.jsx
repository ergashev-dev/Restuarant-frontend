import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../services/categariosService";
import { uploadImage } from "../services/uploadService";

export default function CategoriesList({ search }) {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [filter, setFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const [sortBy, setSortBy] = useState("");
  const [sortOpen, setSortOpen] = useState(false);

  async function fetchCategory() {
    try {
      const response = await getCategories();

      setCategory(response.data?.data || response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      let imageUrl = imagePreview;

      if (image instanceof File) {
        const uploadResponse = await uploadImage(image);

        imageUrl =
          uploadResponse.data?.url ||
          uploadResponse.data?.imageUrl ||
          uploadResponse.data?.secure_url ||
          (typeof uploadResponse.data === "string"
            ? uploadResponse.data
            : imageUrl);
      }

      const newCategory = {
        name,
        description,
        image: imageUrl,
        isActive,
      };

      if (editingId) {
        const response = await updateCategory(editingId, newCategory);

        setCategory(
          category.map((item) =>
            item._id === editingId
              ? response.data?.data || response.data
              : item,
          ),
        );

        setEditingId(null);
      } else {
        await createCategory(newCategory);

        const response = await getCategories();

        setCategory(response.data?.data || response.data || []);
      }

      setName("");
      setDescription("");
      setImage(null);
      setImagePreview("");
      setIsActive(true);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  function editCategory(item) {
    setEditingId(item._id);
    setName(item.name || "");
    setDescription(item.description || "");
    setImage(null);
    setImagePreview(item.image || "");
    setIsActive(item.isActive ?? true);
    setIsModalOpen(true);
  }

  function delCategory(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);

      await deleteCategory(deleteId);

      setCategory(category.filter((item) => item._id !== deleteId));

      setDeleteId(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setName("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    setIsActive(true);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setIsModalOpen(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    setIsActive(true);
  }

  const activeCount = category.filter((item) => item.isActive).length;

  const inactiveCount = category.filter((item) => !item.isActive).length;

  const filteredCategories = category
    .filter((item) => {
      const searchText = search?.toLowerCase().trim() || "";

      if (!searchText) return true;

      return (
        item.name?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText)
      );
    })
    .filter((item) => {
      if (filter === "active") {
        return item.isActive === true;
      }

      if (filter === "inactive") {
        return item.isActive === false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortBy === "name-az") {
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortBy === "name-za") {
        return (b.name || "").localeCompare(a.name || "");
      }

      return 0;
    });

  function clearFilter() {
    setFilter("all");
  }

  function clearSort() {
    setSortBy("");
    setSortOpen(false);
  }

  function clearAll() {
    setFilter("all");
    setSortBy("");
    setFilterOpen(false);
    setSortOpen(false);
  }

  const sortLabel =
    sortBy === "newest"
      ? "Yangi → eski"
      : sortBy === "oldest"
        ? "Eski → yangi"
        : sortBy === "name-az"
          ? "A → Z"
          : sortBy === "name-za"
            ? "Z → A"
            : "Saralash";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
        <main className="ml-0 flex min-h-[calc(100vh-80px)] items-center justify-center md:ml-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
            <p className="text-sm text-slate-500">Yuklanmoqda...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />

      <main className="ml-0 min-h-[calc(100vh-80px)] p-4 sm:p-6 md:ml-64 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-slate-600">Categories</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[32px]">
                Categories
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Restaurant menyusidagi kategoriyalarni boshqaring
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-slate-800 sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Yangi kategoriya
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-xs text-slate-500 sm:text-sm">
                Jami kategoriyalar
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {category.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-xs text-slate-500 sm:text-sm">
                Faol kategoriyalar
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-600 sm:text-3xl">
                {activeCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-xs text-slate-500 sm:text-sm">
                Nofaol kategoriyalar
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-500 sm:text-3xl">
                {inactiveCount}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Barcha kategoriyalar
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {filteredCategories.length} ta kategoriya
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => {
                      setFilterOpen(!filterOpen);
                      setSortOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition sm:px-4 sm:py-2.5 ${
                      filter !== "all"
                        ? "border-slate-300 bg-slate-100 text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm">☷</span>
                    Filter
                    {filter !== "all" && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] text-white">
                        1
                      </span>
                    )}
                    <span
                      className={`text-[10px] transition ${
                        filterOpen ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </button>

                  {filterOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-xs sm:hidden"
                        onClick={() => setFilterOpen(false)}
                      />

                      <div className="fixed inset-x-3 top-24 z-50 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-64 sm:rounded-2xl sm:p-2 sm:shadow-[0_15px_40px_rgba(15,23,42,0.12)]">
                        <div className="px-3 pb-2 pt-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Filter
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            Kategoriyalarni holat bo‘yicha ko‘rsatish
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setFilter("all");
                            setFilterOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                            filter === "all"
                              ? "bg-slate-100 font-medium text-slate-900"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-xs">
                              ◉
                            </span>

                            <span>Barchasi</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">
                              {category.length}
                            </span>

                            {filter === "all" && (
                              <span className="font-semibold text-slate-900">
                                ✓
                              </span>
                            )}
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setFilter("active");
                            setFilterOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                            filter === "active"
                              ? "bg-emerald-50 font-medium text-emerald-700"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                              ●
                            </span>

                            <span>Faol</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600">
                              {activeCount}
                            </span>

                            {filter === "active" && (
                              <span className="font-semibold text-emerald-700">
                                ✓
                              </span>
                            )}
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setFilter("inactive");
                            setFilterOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                            filter === "inactive"
                              ? "bg-slate-100 font-medium text-slate-700"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                              ●
                            </span>

                            <span>Nofaol</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">
                              {inactiveCount}
                            </span>

                            {filter === "inactive" && (
                              <span className="font-semibold text-slate-700">
                                ✓
                              </span>
                            )}
                          </div>
                        </button>

                        {filter !== "all" && (
                          <div className="mt-1 border-t border-slate-100 pt-1">
                            <button
                              onClick={clearFilter}
                              className="w-full rounded-xl px-3 py-2.5 text-left text-xs text-red-500 transition hover:bg-red-50"
                            >
                              Filterni tozalash
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => {
                      setSortOpen(!sortOpen);
                      setFilterOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition sm:px-4 sm:py-2.5 ${
                      sortBy
                        ? "border-slate-300 bg-slate-100 text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm">↕</span>

                    <span className="max-w-20 truncate sm:max-w-none">
                      {sortLabel}
                    </span>

                    <span
                      className={`text-[10px] transition ${
                        sortOpen ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </button>

                  {sortOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-xs sm:hidden"
                        onClick={() => setSortOpen(false)}
                      />

                      <div className="fixed inset-x-3 top-24 z-50 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-64 sm:rounded-2xl sm:p-2 sm:shadow-[0_15px_40px_rgba(15,23,42,0.12)]">
                        <div className="px-3 pb-2 pt-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Saralash
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            Kategoriyalar tartibini tanlang
                          </p>
                        </div>

                        {[
                          ["newest", "Yangi → eski", "◷"],
                          ["oldest", "Eski → yangi", "◴"],
                          ["name-az", "Nomi A → Z", "A"],
                          ["name-za", "Nomi Z → A", "Z"],
                        ].map(([value, label, icon]) => (
                          <button
                            key={value}
                            onClick={() => {
                              setSortBy(value);
                              setSortOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                              sortBy === value
                                ? "bg-slate-100 font-medium text-slate-900"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                                {icon}
                              </span>

                              <span>{label}</span>
                            </div>

                            {sortBy === value && (
                              <span className="text-sm font-semibold">✓</span>
                            )}
                          </button>
                        ))}

                        {sortBy && (
                          <div className="mt-1 border-t border-slate-100 pt-1">
                            <button
                              onClick={clearSort}
                              className="w-full rounded-xl px-3 py-2.5 text-left text-xs text-red-500 transition hover:bg-red-50"
                            >
                              Saralashni tozalash
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="block divide-y divide-slate-100 md:hidden">
              {filteredCategories.map((item) => (
                <div
                  key={item._id || item.name}
                  className="p-4 transition hover:bg-slate-50/50"
                >
                  <div className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl">
                          📂
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-semibold text-slate-900">
                          {item.name}
                        </h3>
                        {item.isActive ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2 border-t border-slate-50 pt-2">
                    <button
                      onClick={() => editCategory(item)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => delCategory(item._id)}
                      className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <div className="min-w-175">
                <div className="grid grid-cols-[90px_1.3fr_2fr_150px_150px] items-center border-b border-slate-100 bg-slate-50/70 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <span>Preview</span>

                  <span>Kategoriya</span>

                  <span>Tavsif</span>

                  <span>Status</span>

                  <span className="text-right">Actions</span>
                </div>

                {filteredCategories.map((item) => (
                  <div
                    key={item._id || item.name}
                    className="group grid grid-cols-[90px_1.3fr_2fr_150px_150px] items-center border-b border-slate-100 px-6 py-5 transition duration-200 last:rounded-b-2xl last:border-b-0 hover:bg-slate-50/70"
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl">
                          📂
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.name}
                      </h3>
                    </div>

                    <p className="max-w-xl truncate pr-10 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                    <div>
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => editCategory(item)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => delCategory(item._id)}
                        className="rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredCategories.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-b-2xl py-16 sm:py-20">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  📂
                </div>

                <h3 className="font-medium text-slate-900">
                  Kategoriya topilmadi
                </h3>

                <p className="mt-1 text-center text-xs text-slate-400 sm:text-sm">
                  {search
                    ? `"${search}" bo‘yicha kategoriya topilmadi`
                    : filter === "active"
                      ? "Faol kategoriyalar mavjud emas"
                      : filter === "inactive"
                        ? "Nofaol kategoriyalar mavjud emas"
                        : "Hozircha hech qanday kategoriya mavjud emas"}
                </p>

                {(filter !== "all" || sortBy) && (
                  <button
                    onClick={clearAll}
                    className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Filterlarni tozalash
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-sm sm:p-4"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-7 sm:py-5">
              <div>
                <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Categories
                </p>

                <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                  {editingId ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  {editingId
                    ? "Kategoriya ma'lumotlarini yangilang"
                    : "Restaurant menyusiga yangi kategoriya qo‘shing"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 overflow-y-auto p-5 sm:space-y-5 sm:p-7"
            >
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700 sm:text-sm">
                  Kategoriya nomi
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Pizza"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:py-3"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700 sm:text-sm">
                  Tavsif
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kategoriya haqida qisqacha ma'lumot..."
                  rows={3}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:py-3"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700 sm:text-sm">
                  Kategoriya rasmi
                </label>

                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-slate-300">
                  {imagePreview ? (
                    <div className="relative h-36 w-full sm:h-44">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/40 opacity-0 transition-opacity duration-200 hover:opacity-100">
                        <label className="cursor-pointer rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100">
                          O‘zgartirish
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files && e.target.files[0];
                              if (!file) return;
                              setImage(file);
                              setImagePreview(URL.createObjectURL(file));
                              e.target.value = null;
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview("");
                          }}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
                        >
                          O‘chirish
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center sm:h-36">
                      <div className="mb-1 text-2xl sm:text-3xl">＋</div>
                      <p className="text-xs font-medium text-slate-600 sm:text-sm">
                        Rasm tanlang
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        PNG, JPG yoki WEBP
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          setImage(file);
                          setImagePreview(URL.createObjectURL(file));
                          e.target.value = null;
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 sm:py-3">
                <div>
                  <p className="text-xs font-medium text-slate-700 sm:text-sm">
                    Kategoriya holati
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Kategoriya menyuda ko‘rinadi
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    isActive ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      isActive ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 sm:gap-3 sm:pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:px-5 sm:py-3 sm:text-sm"
                >
                  Bekor qilish
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="min-w-28 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-32 sm:px-5 sm:py-3 sm:text-sm"
                >
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteId && (
        <div
          className="fixed inset-0 z-110 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!deleting) {
              setDeleteId(null);
            }
          }}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-white/60 bg-white p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl">
              🗑️
            </div>

            <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">
              Kategoriyani o‘chirish
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              Bu kategoriyani o‘chirishni xohlaysizmi? Bu amalni qaytarib
              bo‘lmaydi.
            </p>

            <div className="mt-6 flex justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Bekor qilish
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="min-w-24 rounded-xl bg-red-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {deleting ? "O‘chirilmoqda..." : "O‘chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
