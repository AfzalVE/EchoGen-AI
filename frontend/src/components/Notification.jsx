import { useEffect } from "react";

export default function Notification({ message, type = "error", onClose }) {

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl 
            text-sm font-medium shadow-lg backdrop-blur-md border
            transition-all duration-300 animate-slideIn
            ${type === "error"
                ? "bg-red-500/20 border-red-400 text-red-200"
                : "bg-green-500/20 border-green-400 text-green-200"
            }`}
        >
            {message}
        </div>
    );
}