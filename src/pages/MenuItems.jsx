import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuItemService";
import { getCategories } from "../services/categariosService";
import { uploadImage } from "../services/uploadService";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  async function fetchData() {
    try {
      const [menuResponse, categoryResponse] = await Promise.all([
        getMenuItems(),
        getCategories(),
      ]);

      setMenuItems(menuResponse.data?.data || menuResponse.data || []);
      setCategories(categoryResponse.data?.data || categoryResponse.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
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
          (typeof uploadResponse.data === "string" ? uploadResponse.data : imageUrl);
      }

      const newMenuItem = {
        name,
        description,
        price: Number(price),
        image: imageUrl,
        category,
        isAvailable,
      };

      if (editingId) {
        const response = await updateMenuItem(
          editingId,
          newMenuItem
        );

        setMenuItems(
          menuItems.map((item) =>
            item._id === editingId
              ? (response.data?.data || response.data)
              : item
          )
        );
      } else {
        await createMenuItem(newMenuItem);

        const response = await getMenuItems();

        setMenuItems(response.data?.data || response.data || []);
      }

      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  function editMenuItem(item) {
    setEditingId(item._id);

    setName(item.name || "");
    setDescription(item.description || "");
    setPrice(item.price || "");
    setImage(null);
    setImagePreview(item.image || "");

    if (item.category?._id) {
      setCategory(item.category._id);
    } else {
      setCategory(item.category || "");
    }

    setIsAvailable(item.isAvailable ?? true);

    setIsModalOpen(true);
  }

  function openCreateModal() {
    setEditingId(null);

    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImage(null);
    setImagePreview("");
    setIsAvailable(true);

    setIsModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setIsModalOpen(false);
    setCategoryDropdownOpen(false);
    setEditingId(null);

    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImage(null);
    setImagePreview("");
    setIsAvailable(true);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);

      await deleteMenuItem(deleteId);

      setMenuItems(
        menuItems.filter(
          (item) => item._id !== deleteId
        )
      );

      setDeleteId(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  }

  function getCategoryName(item) {
    if (item.category?.name) {
      return item.category.name;
    }

    const foundCategory = categories.find(
      (c) => c._id === item.category
    );

    return foundCategory?.name || "Noma'lum";
  }

  const availableItems = menuItems.filter(
    (item) => item.isAvailable
  ).length;

  const unavailableItems = menuItems.filter(
    (item) => !item.isAvailable
  ).length;

  const averagePrice =
    menuItems.length > 0
      ? menuItems.reduce(
          (sum, item) => sum + Number(item.price || 0),
          0
        ) / menuItems.length
      : 0;

  const filteredMenuItems = menuItems
    .filter((item) => {
      const searchText = search.toLowerCase().trim();

      if (!searchText) return true;

      return (
        item.name?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText) ||
        getCategoryName(item)
          ?.toLowerCase()
          .includes(searchText)
      );
    })
    .filter((item) => {
      if (!categoryFilter) return true;

      const itemCategory =
        item.category?._id || item.category;

      return itemCategory === categoryFilter;
    })
    .filter((item) => {
      if (!availabilityFilter) return true;

      if (availabilityFilter === "available") {
        return item.isAvailable === true;
      }

      if (availabilityFilter === "unavailable") {
        return item.isAvailable === false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      if (sortBy === "name-az") {
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortBy === "name-za") {
        return (b.name || "").localeCompare(a.name || "");
      }

      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
        );
      }

      return 0;
    });

  function clearFilters() {
    setCategoryFilter("");
    setAvailabilityFilter("");
  }

  function clearAllControls() {
    setSearch("");
    setCategoryFilter("");
    setAvailabilityFilter("");
    setSortBy("");
    setShowFilters(false);
    setShowSort(false);
  }

  if (loading) {
    return (
      <div>
        <Navbar
          search={search}
          setSearch={setSearch}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="ml-0 flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f7f8fa] md:ml-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

            <p className="text-sm text-slate-500">
              Yuklanmoqda...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar
        search={search}
        setSearch={setSearch}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="ml-0 min-h-[calc(100vh-80px)] p-4 sm:p-6 md:ml-64 md:p-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-slate-600">
                  Menu Items
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[32px]">
                Menu Items
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Restaurant menyusidagi taomlarni boshqaring
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-slate-800 sm:w-auto"
            >
              <span className="text-lg leading-none">
                +
              </span>

              Yangi taom
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-xs text-slate-500 sm:text-sm">
                Jami taomlar
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {menuItems.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-xs text-slate-500 sm:text-sm">
                Mavjud
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-600 sm:text-3xl">
                {availableItems}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-xs text-slate-500 sm:text-sm">
                Mavjud emas
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-500 sm:text-3xl">
                {unavailableItems}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-xs text-slate-500 sm:text-sm">
                O'rtacha narx
              </p>

              <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">
                {Math.round(
                  averagePrice
                ).toLocaleString()}{" "}
                so'm
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

            <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Barcha taomlar
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {filteredMenuItems.length} ta taom
                </p>
              </div>

              <div className="flex items-center gap-2">

                {/* Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowFilters(!showFilters);
                      setShowSort(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition sm:px-4 sm:py-2.5 ${
                      showFilters ||
                      categoryFilter ||
                      availabilityFilter
                        ? "border-slate-300 bg-slate-100 text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm">
                      ☷
                    </span>

                    Filter

                    {(categoryFilter ||
                      availabilityFilter) && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] text-white">
                        {Number(!!categoryFilter) +
                          Number(
                            !!availabilityFilter
                          )}
                      </span>
                    )}
                  </button>

                  {showFilters && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-xs sm:hidden"
                        onClick={() => setShowFilters(false)}
                      />

                      <div className="fixed inset-x-3 top-24 z-50 max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:max-h-none sm:w-80 sm:rounded-2xl sm:p-4 sm:shadow-[0_15px_40px_rgba(15,23,42,0.12)]">

                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">
                              Filter
                            </h3>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                              Taomlarni kerakli holat bo‘yicha toping
                            </p>
                          </div>

                          {(categoryFilter ||
                            availabilityFilter) && (
                            <button
                              onClick={clearFilters}
                              className="text-[11px] font-medium text-red-500 transition hover:text-red-600"
                            >
                              Tozalash
                            </button>
                          )}
                        </div>

                        <div className="mb-5">
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Kategoriya
                          </p>

                          <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1">

                            <button
                              onClick={() =>
                                setCategoryFilter("")
                              }
                              className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                                !categoryFilter
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span>Barchasi</span>

                                {!categoryFilter && (
                                  <span>✓</span>
                                )}
                              </div>
                            </button>

                            {categories.map((item) => (
                              <button
                                key={item._id}
                                onClick={() =>
                                  setCategoryFilter(
                                    item._id
                                  )
                                }
                                className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                                  categoryFilter ===
                                  item._id
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="truncate">
                                    {item.name}
                                  </span>

                                  {categoryFilter ===
                                    item._id && (
                                    <span>✓</span>
                                  )}
                                </div>
                              </button>
                            ))}

                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Holati
                          </p>

                          <div className="grid grid-cols-3 gap-2">

                            <button
                              onClick={() =>
                                setAvailabilityFilter("")
                              }
                              className={`rounded-xl border px-2 py-2.5 text-center text-xs transition ${
                                !availabilityFilter
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="mb-0.5 block text-xs">
                                ◉
                              </span>

                              Barchasi
                            </button>

                            <button
                              onClick={() =>
                                setAvailabilityFilter(
                                  "available"
                                )
                              }
                              className={`rounded-xl border px-2 py-2.5 text-center text-xs transition ${
                                availabilityFilter ===
                                "available"
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="mb-0.5 block text-xs">
                                ●
                              </span>

                              Mavjud
                            </button>

                            <button
                              onClick={() =>
                                setAvailabilityFilter(
                                  "unavailable"
                                )
                              }
                              className={`rounded-xl border px-2 py-2.5 text-center text-xs transition ${
                                availabilityFilter ===
                                "unavailable"
                                  ? "border-slate-400 bg-slate-100 text-slate-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="mb-0.5 block text-xs">
                                ●
                              </span>

                              Yo‘q
                            </button>

                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setShowFilters(false)
                          }
                          className="mt-5 w-full rounded-xl bg-slate-950 py-3 text-xs font-medium text-white transition hover:bg-slate-800 sm:mt-4 sm:py-2.5"
                        >
                          Tayyor
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowSort(!showSort);
                      setShowFilters(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition sm:px-4 sm:py-2.5 ${
                      sortBy
                        ? "border-slate-300 bg-slate-100 text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm">
                      ↕
                    </span>

                    <span className="max-w-20 truncate sm:max-w-none">
                      {sortBy === "newest"
                        ? "Yangi → eski"
                        : sortBy === "oldest"
                        ? "Eski → yangi"
                        : sortBy === "price-low"
                        ? "Arzon → qimmat"
                        : sortBy === "price-high"
                        ? "Qimmat → arzon"
                        : sortBy === "name-az"
                        ? "A → Z"
                        : sortBy === "name-za"
                        ? "Z → A"
                        : "Saralash"}
                    </span>

                    <span className="text-[10px]">
                      ⌄
                    </span>
                  </button>

                  {showSort && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-xs sm:hidden"
                        onClick={() => setShowSort(false)}
                      />
                      <div className="fixed inset-x-3 top-24 z-50 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-60 sm:rounded-2xl sm:p-2 sm:shadow-[0_15px_40px_rgba(15,23,42,0.12)]">

                        <div className="px-3 pb-2 pt-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Saralash
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            Taomlarni qanday tartibda ko‘rsatish
                          </p>
                        </div>

                        {[
                          ["newest", "Yangi → eski"],
                          ["oldest", "Eski → yangi"],
                          ["price-low", "Arzon → qimmat"],
                          ["price-high", "Qimmat → arzon"],
                          ["name-az", "Nomi A → Z"],
                          ["name-za", "Nomi Z → A"],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            onClick={() => {
                              setSortBy(value);
                              setShowSort(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                              sortBy === value
                                ? "bg-slate-100 font-medium text-slate-900"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <span>{label}</span>

                            {sortBy === value && (
                              <span className="text-sm font-semibold">
                                ✓
                              </span>
                            )}
                          </button>
                        ))}

                        {sortBy && (
                          <div className="mt-1 border-t border-slate-100 pt-1">
                            <button
                              onClick={() => {
                                setSortBy("");
                                setShowSort(false);
                              }}
                              className="w-full rounded-xl px-3 py-2 text-left text-xs text-red-500 transition hover:bg-red-50"
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
              {filteredMenuItems.map((item) => (
                <div key={item._id} className="p-4 transition hover:bg-slate-50/50">
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
                          🍽️
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-semibold text-slate-900">
                          {item.name}
                        </h3>
                        {item.isAvailable ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Unavailable
                          </span>
                        )}
                      </div>

                      <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                        {item.description}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {getCategoryName(item)}
                        </span>
                        <p className="font-semibold text-slate-900">
                          {Number(item.price).toLocaleString()} so'm
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2 border-t border-slate-50 pt-2">
                    <button
                      onClick={() => editMenuItem(item)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
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
                <div className="grid grid-cols-[80px_1.4fr_1fr_120px_120px_140px] items-center border-b border-slate-100 bg-slate-50/70 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <span>Preview</span>
                  <span>Taom</span>
                  <span>Kategoriya</span>
                  <span>Narx</span>
                  <span>Status</span>
                  <span className="text-right">Actions</span>
                </div>

                {filteredMenuItems.map((item) => (
                  <div
                    key={item._id}
                    className="group grid grid-cols-[80px_1.4fr_1fr_120px_120px_140px] items-center border-b border-slate-100 px-6 py-4 transition duration-200 last:border-b-0 hover:bg-slate-50/70"
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg">
                          🍽️
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                        {item.description}
                      </p>
                    </div>

                    <div>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {getCategoryName(item)}
                      </span>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {Number(item.price).toLocaleString()} so'm
                      </p>
                    </div>

                    <div>
                      {item.isAvailable ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Unavailable
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => editMenuItem(item)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredMenuItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                  🔎
                </div>

                <h3 className="font-medium text-slate-900">
                  Taom topilmadi
                </h3>

                <p className="mt-1 text-center text-xs text-slate-400 sm:text-sm">
                  Qidiruv yoki filter bo‘yicha natija mavjud emas
                </p>

                {(search ||
                  categoryFilter ||
                  availabilityFilter ||
                  sortBy) && (
                  <button
                    onClick={clearAllControls}
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
                  Menu Items
                </p>

                <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                  {editingId
                    ? "Taomni tahrirlash"
                    : "Yangi taom"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  {editingId
                    ? "Taom ma'lumotlarini yangilang"
                    : "Restaurant menyusiga yangi taom qo'shing"}
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
                  Taom nomi
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Masalan: Pepperoni Pizza"
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
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Taom haqida qisqacha ma'lumot..."
                  rows={2}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:py-3"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 sm:text-sm">
                    Narx
                  </label>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    placeholder="45000"
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:py-3"
                  />
                </div>

                <div className="relative">
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 sm:text-sm">
                    Kategoriya
                  </label>

                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition outline-none sm:py-3 ${
                      categoryDropdownOpen
                        ? "border-slate-400 bg-white ring-2 ring-slate-100"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
                    }`}
                  >
                    <span className={`truncate ${category ? "font-medium text-slate-900" : "text-slate-400"}`}>
                      {category
                        ? categories.find((c) => c._id === category)?.name || "Kategoriyani tanlang"
                        : "Kategoriyani tanlang"}
                    </span>
                    <span
                      className={`ml-2 text-[10px] text-slate-400 transition-transform duration-200 ${
                        categoryDropdownOpen ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </button>

                  {categoryDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                      {categories.length === 0 ? (
                        <p className="px-3 py-2 text-center text-xs text-slate-400">
                          Kategoriyalar topilmadi
                        </p>
                      ) : (
                        categories.map((item) => (
                          <button
                            type="button"
                            key={item._id}
                            onClick={() => {
                              setCategory(item._id);
                              setCategoryDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                              category === item._id
                                ? "bg-slate-100 font-semibold text-slate-900"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <span className="truncate">{item.name}</span>
                            {category === item._id && (
                              <span className="text-sm font-semibold text-slate-900">✓</span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  <input
                    type="text"
                    tabIndex={-1}
                    value={category}
                    required
                    onChange={() => {}}
                    className="pointer-events-none absolute bottom-0 left-0 h-0 w-0 opacity-0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700 sm:text-sm">
                  Taom rasmi
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
                    Taom holati
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Taom menyuda mavjud yoki mavjud emas
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsAvailable(!isAvailable)
                  }
                  className={`relative h-6 w-11 rounded-full transition ${
                    isAvailable
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      isAvailable
                        ? "left-6"
                        : "left-1"
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
                  {saving
                    ? "Saqlanmoqda..."
                    : editingId
                    ? "Saqlash"
                    : "Yaratish"}
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
              Taomni o‘chirish
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              Bu taomni o‘chirishni xohlaysizmi?
              Bu amalni qaytarib bo‘lmaydi.
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
                {deleting
                  ? "O‘chirilmoqda..."
                  : "O‘chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}