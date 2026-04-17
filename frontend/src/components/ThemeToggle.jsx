import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all
        ${theme === "dark" ? "bg-zinc-700" : "bg-zinc-300"}`}
    >
      <div
        className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-all
          ${theme === "dark" ? "translate-x-0" : "translate-x-6"}`}
      />
    </div>
  );
}