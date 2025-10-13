import React, { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-slate-800">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <div className="flex min-h-screen flex-1 flex-col">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 space-y-6 bg-[var(--color-background)] px-4 py-6 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
