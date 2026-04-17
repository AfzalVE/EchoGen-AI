import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import Notification from "../components/Notification";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Landing() {
    const [product, setProduct] = useState("");
    const [audio, setAudio] = useState(null);
    const [script, setScript] = useState("");
    const [loading, setLoading] = useState(false);
    const [recent, setRecent] = useState([]);
    const { theme } = useTheme();

    const [notification, setNotification] = useState({
        message: "",
        type: "error",
    });

    const showNotification = (message, type = "error") => {
        setNotification({ message, type });
    };


    // 🌗 Apply Theme
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    // 🔁 Fetch history
    useEffect(() => {
        fetch(`${BASE_URL}/history`)
            .then((res) => res.json())
            .then((data) => setRecent(data.slice(-3).reverse()));
    }, []);

    // 🚀 Generate
    const generateAd = async () => {
        if (!product.trim()) return;

        try {
            setLoading(true);

            const res = await fetch(`${BASE_URL}/generate-ad`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product }),
            });

            const data = await res.json();

            if (data.error) {
                showNotification(data.error, "error");
                return;
            }

            setAudio(`${BASE_URL}${data.audio_file}`);
            setScript(data.script);

            showNotification("🎉 Audio generated successfully!", "success");
        } catch {
            showNotification("⚠️ Server error. Try again later.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`relative md:flex min-h-screen overflow-hidden transition-all duration-500 ${theme === "dark"
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

            <Sidebar />

            {/* 🔔 Notification */}
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "" })}
            />

            <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8">

                {/* 🔝 Theme toggle button*/}
                <div className="flex justify-end mb-6">
                    <ThemeToggle />
                </div>

                {/* HERO */}
                <div className="text-center mt-12 mb-12">
                    <h1 className="uppercase font-['Sora'] text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-wide">
                        Create AI Audio Ads
                    </h1>

                    <p
                        className={`text-sm mb-6 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                            }`}
                    >
                        Turn your idea into a stunning audio ad
                    </p>

                    {/* INPUT GLASS */}
                    <div className="max-w-2xl mx-auto">
                        <div
                            className={`rounded-2xl p-4 transition-all border
              ${theme === "dark"
                                    ? "bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                                    : "bg-white/60 backdrop-blur-xl border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                                }`}
                        >
                            <textarea
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                placeholder="Describe your product..."
                                rows={3}
                                className={`w-full bg-transparent outline-none text-sm px-3 py-2 resize-none ${theme === "dark"
                                    ? "text-zinc-200 placeholder:text-zinc-500"
                                    : "text-zinc-800 placeholder:text-zinc-400"
                                    }`}
                            />

                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={generateAd}
                                    disabled={loading}
                                    className="px-6 py-2 rounded-xl text-sm font-medium text-white 
                  bg-zinc-900 hover:bg-zinc-800 transition flex items-center gap-2"
                                >
                                    {loading && (
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    )}
                                    {loading ? "Generating..." : "Generate"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* OUTPUT */}
                {audio && (
                    <div className="max-w-2xl mx-auto mb-12">
                        <div
                            className={`rounded-2xl p-6 border backdrop-blur-xl transition-all
              ${theme === "dark"
                                    ? "bg-white/5 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                                    : "bg-white/60 border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                                }`}
                        >
                            <h2 className="text-xl font-semibold mb-3">
                                Generated Script
                            </h2>

                            <p
                                className={`mb-6 ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"
                                    }`}
                            >
                                {script}
                            </p>

                            <audio controls className="w-full mb-4" src={audio} />

                            <a
                                href={audio}
                                download
                                className="inline-block px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                )}

                {/* RECENT */}
                <div className="max-w-6xl mx-auto">
                    <h2
                        className={`text-xl md:text-2xl mb-6 ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"
                            }`}
                    >
                        Recent Creations
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recent.map((item, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl p-4 border backdrop-blur-xl transition-all
                ${theme === "dark"
                                        ? "bg-white/5 border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                        : "bg-white/60 border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                                    }`}
                            >
                                <p
                                    className={`mb-2 line-clamp-3 ${theme === "dark"
                                        ? "text-zinc-200"
                                        : "text-zinc-800"
                                        }`}
                                >
                                    {item.input}
                                </p>

                                {item.final_file ? (
                                    <>
                                        <audio
                                            controls
                                            className="w-full mb-3"
                                            src={`${BASE_URL}${item.final_file}`}
                                        />
                                        <a
                                            href={`${BASE_URL}${item.final_file}`}
                                            download
                                            className="text-sm px-3 py-1 rounded-md bg-zinc-900 text-white"
                                        >
                                            Download
                                        </a>
                                    </>
                                ) : (
                                    <div className="text-red-500 text-sm">
                                        ❌ {item.error || "Failed"}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
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