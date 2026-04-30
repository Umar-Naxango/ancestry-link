"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaDesktop } from "react-icons/fa";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-[88px]"></div>; // placeholder to prevent layout shift
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-xl transition ${theme === "light" ? "bg-white dark:bg-gray-700 shadow-sm text-yellow-500" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
      >
        <FaSun size={14} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-xl transition ${theme === "system" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
      >
        <FaDesktop size={14} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-xl transition ${theme === "dark" ? "bg-white dark:bg-gray-700 shadow-sm text-emerald-500" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
      >
        <FaMoon size={14} />
      </button>
    </div>
  );
}
