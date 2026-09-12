import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import MenuItems from "./pages/MenuItems";
import About from "./pages/About";

export default function App() {
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/dashboard"
        element={
          <Dashboard
            search={search}
            setSearch={setSearch}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        }
      />

      <Route
        path="/categories"
        element={
          <Categories
            search={search}
            setSearch={setSearch}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        }
      />

      <Route
        path="/menu-items"
        element={
          <MenuItems
            search={search}
            setSearch={setSearch}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        }
      />

      <Route
        path="/about"
        element={
          <About
            search={search}
            setSearch={setSearch}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        }
      />
    </Routes>
  );
}