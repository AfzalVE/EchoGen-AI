import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import Notification from "../components/Notification";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function History() {
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState({
    message: "",
    type: "error",
  });
  const [loading, setLoading] = useState(true);

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/history`);
        const data = await res.json();
        setHistory(data.reverse());
      } catch (err) {
        showNotification("⚠️ Failed to load history", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="md:flex min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      
      {/* SIDEBAR (TOP ON MOBILE, SIDE ON DESKTOP) */}
      <Sidebar />

      {/* NOTIFICATION */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "" })}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 mt-2 md:mt-0">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            🎧 Audio History
          </h1>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-zinc-400 mt-20">
            Loading history...
          </div>
        )}

        {/* EMPTY */}
        {!loading && history.length === 0 && (
          <div className="text-center text-zinc-400 mt-20">
            No history yet. Generate your first audio 🚀
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-[1px] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="bg-[#111] rounded-2xl p-5 flex flex-col h-full">

                {/* TEXT */}
                <div className="mb-3">
                  <h2 className="text-base font-semibold line-clamp-2 capitalize">
                    {item.input}
                  </h2>

                  <p className="text-xs text-zinc-400 mt-1">
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
                        className="px-4 py-1.5 rounded-full text-xs font-medium text-white 
                        bg-gradient-to-r from-orange-500 to-pink-500 
                        hover:scale-105 active:scale-95 transition-all"
                      >
                        Download
                      </a>

                      <span className="text-xs text-zinc-500">
                        #{history.length - i}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-red-400 text-sm mt-auto">
                    ❌ {item.error || "Failed to generate audio"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}