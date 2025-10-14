import React from "react";
import { NavLink } from "react-router";
import { FiBarChart2, FiHome, FiShield, FiUsers } from "react-icons/fi";

const navigation = [
  { name: "Overview", to: "/", icon: FiHome },
  { name: "Analytics", to: "/analytics", icon: FiBarChart2 },
  { name: "Sub-admins", to: "/sub-admins", icon: FiShield },
  { name: "Team", to: "/team", icon: FiUsers },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-[var(--sidebar-width)] transform bg-[var(--color-surface)] shadow-xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col border-r border-[var(--color-border)]">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center space-x-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] font-semibold text-[var(--color-primary-foreground)]">
              GG
            </span>
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Grow Gold</p>
              <h2 className="text-lg font-semibold text-slate-800">Admin Panel</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6 text-slate-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6m0 12L6 6" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-6 scrollbar-thin">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--color-muted)] text-slate-900"
                      : "text-slate-500 hover:bg-[var(--color-muted)] hover:text-slate-800",
                  ].join(" ")
                }
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-[var(--color-border)] px-6 py-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Grow Gold. All rights reserved.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
