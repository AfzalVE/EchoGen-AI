import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();





  // 🔗 NAV STYLE
  const itemClass = (path) =>
    `cursor-pointer px-3 py-2 rounded-lg transition-all text-sm ${location.pathname === path
      ? theme === "dark"
        ? "bg-white/10 text-white"
        : "bg-black/10 text-black"
      : theme === "dark"
        ? "text-zinc-400 hover:text-white hover:bg-white/5"
        : "text-zinc-600 hover:text-black hover:bg-black/5"
    }`;

  return (
    <>
      {/* 🔹 MOBILE NAVBAR */}
      <div
        className={`md:hidden w-full border-b px-4 py-3 flex items-center justify-between backdrop-blur-xl transition-all
        ${theme === "dark"
            ? "bg-[#0b0b0f]/80 border-white/10 text-white"
            : "bg-white/70 border-black/10 text-black shadow-sm"
          }`}
      >
        {/* LOGO */}
<div className="flex items-center">
  <img
    src="/logo.png"
    alt="logo"
    className="h-12 w-12 object-contain -mr-0"
  />
  <h1 className="text-xl font-semibold tracking-tight">
    EchoGen AI
  </h1>
</div>
        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* NAV */}
          <div className="flex gap-2 text-xs">
            <div onClick={() => navigate("/")} className={itemClass("/")}>
              Home
            </div>
            <div onClick={() => navigate("/history")} className={itemClass("/history")}>
              History
            </div>
          </div>

        </div>
      </div>

      {/* 🔹 DESKTOP SIDEBAR */}
      <div
        className={`hidden md:flex w-64 p-5 flex-col justify-between border-r backdrop-blur-xl transition-all
        ${theme === "dark"
            ? "bg-[#0b0b0f]/80 border-white/10 text-white"
            : "bg-white/70 border-black/10 text-black shadow-[4px_0_20px_rgba(0,0,0,0.05)]"
          }`}
      >
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-2 mb-10">
            <img src="/logo.png" alt="logo" className="h-12 w-12" />
            <h1 className="text-xl font-semibold tracking-tight">
              EchoGen AI
            </h1>
          </div>

          {/* NAV */}
          <div className="space-y-2">
            <div onClick={() => navigate("/")} className={itemClass("/")}>
              Home
            </div>

            <div onClick={() => navigate("/history")} className={itemClass("/history")}>
              History
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="space-y-4">
          {/* CTA */}
          <button
            className={`w-full py-2 rounded-lg text-sm font-medium transition-all
            ${theme === "dark"
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-black/10 hover:bg-black/20 text-black"
              }`}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </>
  );
}