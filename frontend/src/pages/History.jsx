import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import Notification from "../components/Notification";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const [notification, setNotification] = useState({
    message: "",
    type: "error",
  });

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
  };

  // 🌗 Apply Theme globally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔁 Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/history`);
        const data = await res.json();
        setHistory(data.reverse());
      } catch {
        showNotification("⚠️ Failed to load history", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div
      className={`relative md:flex min-h-screen overflow-hidden transition-all duration-500 ${
        theme === "dark"
          ? "bg-[#0b0b0f] text-zinc-100"
          : "bg-[#f4f6f8] text-zinc-800"
      }`}
    >
      {/* 🌫️ BACKGROUND GLOW BLOBS */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-20
          ${theme === "dark" ? "bg-purple-500" : "bg-pink-300"}
          top-[-100px] left-[-100px]`}
        />
        <div
          className={`absolute w-[350px] h-[350px] rounded-full blur-[120px] opacity-20
          ${theme === "dark" ? "bg-blue-500" : "bg-blue-300"}
          bottom-[-120px] right-[-80px]`}
        />
      </div>

      {/* SIDEBAR */}
      <Sidebar />

      {/* 🔔 Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "" })}
      />

      {/* MAIN */}
      <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8">

        {/* 🔝 TOP BAR */}
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Audio History
          </h1>
          <p
            className={`text-sm mt-2 ${
              theme === "dark" ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            All your generated audio ads in one place
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div
            className={`text-center mt-20 ${
              theme === "dark" ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Loading history...
          </div>
        )}

        {/* EMPTY */}
        {!loading && history.length === 0 && (
          <div
            className={`text-center mt-20 ${
              theme === "dark" ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            No history yet. Generate your first audio 🚀
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 border backdrop-blur-xl transition-all
              ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.05)]"
                  : "bg-white/60 border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
              }`}
            >
              {/* TEXT */}
              <div className="mb-3">
                <h2
                  className={`text-base font-semibold line-clamp-2 capitalize ${
                    theme === "dark" ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {item.input}
                </h2>

                <p
                  className={`text-xs mt-1 ${
                    theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>

              {/* AUDIO */}
              {item.final_file ? (
                <>
                  <audio
                    controls
                    className="w-full mb-4 rounded-lg"
                    src={`${BASE_URL}${item.final_file}`}
                  />

                  <div className="flex justify-between items-center mt-auto">
                    <a
                      href={`${BASE_URL}${item.final_file}`}
                      download
                      className="px-4 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition"
                    >
                      Download
                    </a>

                    <span
                      className={`text-xs ${
                        theme === "dark"
                          ? "text-zinc-500"
                          : "text-zinc-400"
                      }`}
                    >
                      #{history.length - i}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-red-500 text-sm mt-auto">
                  ❌ {item.error || "Failed to generate audio"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SCROLLBAR */}
      <style>
        {`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        `}
      </style>
    </div>
  );
}