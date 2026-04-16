import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import Notification from "../components/Notification";

const BASE_URL = "http://127.0.0.1:8000";

export default function Landing() {
    const [product, setProduct] = useState("");
    const [audio, setAudio] = useState(null);
    const [script, setScript] = useState("");
    const [loading, setLoading] = useState(false);
    const [recent, setRecent] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [notification, setNotification] = useState({
        message: "",
        type: "error"
    });
    const showNotification = (message, type = "error") => {
        setNotification({ message, type });
    };

    useEffect(() => {
        fetch(`${BASE_URL}/history`)
            .then((res) => res.json())
            .then((data) => setRecent(data.slice(-3).reverse()));
    }, []);
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

        // ❌ ERROR CASE
        if (data.error) {
            showNotification(parseError(data.error), "error");
            return;
        }

        // ✅ SUCCESS CASE
        setAudio(`${BASE_URL}${data.audio_file}`);
        setScript(data.script);

        showNotification("🎉 Audio generated successfully!", "success");

    } catch (err) {
        console.error(err);
        showNotification("⚠️ Server error. Try again later.", "error");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="md:flex min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">

            <Sidebar />
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "" })}
            />

            <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 mt-2 md:mt-0">

                {/* HERO */}
                <div className="text-center mt-10 md:mt-20 mb-12">
                    <h1 className="uppercase font-['Sora'] text-3xl sm:text-4xl md:text-5xl font-bold mb-4 
                    bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 
                    bg-clip-text text-transparent 
                    tracking-[2px]
                    drop-shadow-[0_0_10px_rgba(236,72,153,0.6)] 
                    hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] 
                    transition-all duration-300">
                        Create AI Audio Ads
                    </h1>

                    <p className="text-zinc-400 text-sm mb-6">
                        Turn your idea into a stunning audio ad
                    </p>

                    {/* INPUT */}
                    <div className="max-w-2xl mx-auto rounded-2xl p-[1px] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 shadow-[0_0_25px_rgba(236,72,153,0.25)] hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-300">

                        <div className="bg-[#111] backdrop-blur-xl rounded-2xl p-4 border border-zinc-800/60">

                            <textarea
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                placeholder="Describe your product..."
                                rows={3}
                                className="w-full bg-transparent outline-none text-sm px-3 py-2 resize-none custom-scroll text-zinc-200 placeholder:text-zinc-500"
                            />

                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={generateAd}
                                    disabled={loading}
                                    className="px-6 py-2 rounded-xl text-sm font-medium text-white 
                                    bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 
                                    shadow-lg shadow-pink-500/20 
                                    hover:shadow-pink-500/40 hover:scale-105 
                                    active:scale-95 
                                    transition-all duration-200 flex items-center gap-2"
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
                        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
                            <div className="bg-[#0f0f0f] rounded-2xl p-6">
                                <h2 className="text-xl font-semibold mb-3">
                                    Generated Script
                                </h2>

                                <p className="text-sm text-zinc-300 mb-6 whitespace-pre-line leading-relaxed">
                                    {script}
                                </p>

                                <audio controls className="w-full mb-4" src={audio} />

                                <div className="flex justify-start">
                                    <a
                                        href={audio}
                                        download
                                        className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white 
                                        bg-gradient-to-r from-orange-500 to-pink-500 
                                        shadow-lg shadow-pink-500/20 
                                        hover:shadow-pink-500/40 hover:scale-105 
                                        active:scale-95 
                                        cursor-pointer 
                                        transition-all duration-200"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* RECENT */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl md:text-2xl mb-6 text-zinc-300">
                        Recent Creations
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recent.map((item, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl p-[1px] transition-all duration-300 ${activeIndex === i
                                    ? "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 scale-[1.02] shadow-xl"
                                    : "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:scale-[1.02] hover:shadow-xl"
                                    }`}
                            >
                                <div className="bg-[#111] rounded-2xl p-4 flex flex-col h-full">

                                    {/* TEXT */}
                                    <div className="h-[64px] overflow-hidden mb-2">
                                        <p className="text-sm text-zinc-200 line-clamp-3 leading-snug capitalize">
                                            {item.input}
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
                                            <div className="flex justify-start">
                                                <a
                                                    href={`${BASE_URL}${item.final_file}`}
                                                    download
                                                    className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white 
                                            bg-gradient-to-r from-orange-500 to-pink-500 
                                            shadow-lg shadow-pink-500/20 
                                            hover:shadow-pink-500/40 hover:scale-105 
                                            active:scale-95 
                                            cursor-pointer 
                                            transition-all duration-200"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-red-400 text-sm">
                                            ❌ {item.error || "Failed to generate audio"}
                                        </div>
                                    )}

                                    {/* DOWNLOAD */}

                                </div>
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
                    background: linear-gradient(to bottom, #f97316, #ec4899);
                    border-radius: 10px;
                }
                `}
            </style>
        </div>
    );
}