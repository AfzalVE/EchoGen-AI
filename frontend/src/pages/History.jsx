import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";

const BASE_URL = "http://127.0.0.1:8000";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/history`)
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);
  console.log(history);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <Sidebar />

      <div className="flex-1 p-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            🎧 Audio History
          </h1>
        </div>

        {/* EMPTY STATE */}
        {history.length === 0 && (
          <div className="text-center text-zinc-400 mt-20">
            No history yet. Generate your first audio
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-[1px] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"
            >
              <div className="bg-[#0f0f0f] rounded-2xl p-5 h-full flex flex-col justify-between">
                {/* TOP */}
                <div>
                  <h2 className="text-lg font-semibold mb-1 line-clamp-2">
                    {item.input}
                  </h2>

                  <p className="text-xs text-zinc-400 mb-4">
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
                    <div className="flex items-center justify-between">
                      <a
                        href={`${BASE_URL}${item.final_file}`}
                        download
                        className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-black font-medium hover:opacity-90"
                      >
                        Download
                      </a>
                      <span className="text-xs text-zinc-500">#{i + 1}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-red-400 text-sm">
                    ❌ {item.error || "Failed to generate audio"}
                  </div>
                )}

                {/* ACTIONS */}
               
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}