import { useNavigate, useLocation } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const itemClass = (path) =>
    `cursor-pointer px-3 py-2 rounded-lg transition-all ${
      location.pathname === path
        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
        : "hover:bg-zinc-800 text-zinc-300 hover:text-white"
    }`;

  return (
    <>
      {/* 🔹 MOBILE TOP NAVBAR */}
      <div className="md:hidden w-full bg-[#0b0b0b] border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          Jhume Jo Pathan
        </h1>

        {/* NAV LINKS */}
        <div className="flex items-center gap-2 text-xs">
          <div onClick={() => navigate("/")} className={itemClass("/")}>
            Home
          </div>

          <div onClick={() => navigate("/history")} className={itemClass("/history")}>
            History
          </div>
        </div>
      </div>

      {/* 🔹 DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-64 bg-gradient-to-b from-[#0b0b0b] to-[#111] border-r border-zinc-800 p-5 flex-col justify-between">
        
        {/* TOP */}
        <div>
          <h1 className="text-2xl font-bold mb-10 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent tracking-wide">
            Jhume Jo Pathan
          </h1>

          <div className="space-y-3 text-sm">
            <div onClick={() => navigate("/")} className={itemClass("/")}>
              Home
            </div>

            <div onClick={() => navigate("/history")} className={itemClass("/history")}>
              History
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500 to-orange-500 hover:opacity-90 transition">
          Upgrade to Pro
        </button>
      </div>
    </>
  );
}