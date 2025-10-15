import React, { useState } from "react";
import { FiLogOut, FiMenu, FiSearch } from "react-icons/fi";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import LogoutConfirmationModal from "../LogoutConfirmationModal";

const Header = ({ onToggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsConfirmOpen(true);
  };

  const handleCancelLogout = () => {
    setIsConfirmOpen(false);
  };

  const handleConfirmLogout = () => {
    setIsConfirmOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] p-2 text-slate-500 transition-colors hover:text-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <div className="hidden items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 text-sm text-slate-500 md:flex">
          <FiSearch className="mr-2 h-4 w-4" />
          <span>Search insights...</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          className="inline-flex items-center space-x-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800"
          onClick={handleLogoutClick}
        >
          <FiLogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
        <LogoutConfirmationModal
          open={isConfirmOpen}
          onCancel={handleCancelLogout}
          onConfirm={handleConfirmLogout}
        />
      </div>
    </header>
  );
};

export default Header;
