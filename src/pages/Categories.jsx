import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CategoriesList from "../components/CategoriesList";

export default function Categories({
  search,
  setSearch,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  return (
    <div>
      <Navbar
        search={search}
        setSearch={setSearch}
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div>
        <CategoriesList
          search={search}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </div>
  );
}