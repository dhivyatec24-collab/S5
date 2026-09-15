import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Calculator,
  Compass,
  GitCompare,
  Sparkles,
  Bot,
  User,
  LogOut,
  Menu,
  X,
  Database,
  LayoutDashboard
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Cutoff Predictor", path: "/cutoff-predictor", icon: Calculator },
    { name: "Find Colleges", path: "/colleges", icon: Compass },
    { name: "Compare", path: "/compare", icon: GitCompare },
    { name: "Recommendations", path: "/recommendations", icon: Sparkles },
    { name: "AI Counselor", path: "/counselor", icon: Bot },
    { name: "Data Sources", path: "/sources", icon: Database },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F1D2DB]/60 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F8D7DE] to-[#FDE8ED] flex items-center justify-center text-[#D85A7F] shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#372B2E] block leading-tight">
                SMART COUNSELOR
              </span>
              <span className="text-[11px] font-medium text-[#B83B60] tracking-wide block">
                TNEA Engineering 2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                    active
                      ? "bg-[#FDF2F4] text-[#D85A7F] border border-[#F1D2DB]"
                      : "text-[#6E5D63] hover:text-[#372B2E] hover:bg-[#FDF2F4]/60"
                  }`}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section / Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#FDF2F4] border border-[#F1D2DB] hover:border-[#D85A7F] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "S"}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#372B2E] block truncate max-w-[110px]">
                      {user.name || "Student"}
                    </span>
                    <span className="text-[10px] font-semibold text-[#D85A7F] block">
                      Cutoff: {user.calculated_cutoff || "—"}/200
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-[#6E5D63] hover:text-[#D85A7F] hover:bg-[#FDF2F4] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#6E5D63] hover:text-[#372B2E] hover:bg-[#FDF2F4] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] shadow-soft-sm transition-all"
                >
                  Student Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#6E5D63] hover:bg-[#FDF2F4]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#F1D2DB] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                isActive(link.path)
                  ? "bg-[#FDF2F4] text-[#D85A7F]"
                  : "text-[#6E5D63] hover:bg-[#FDF2F4]"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#F1D2DB] flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-[#372B2E]"
                >
                  <User className="w-4 h-4 text-[#D85A7F]" />
                  <span>Profile ({user.name}) — Cutoff: {user.calculated_cutoff}/200</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-sm font-semibold text-[#6E5D63] hover:bg-[#FDF2F4] rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-sm font-bold text-white bg-[#D85A7F] rounded-lg"
                >
                  Student Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
