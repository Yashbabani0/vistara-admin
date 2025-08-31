"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import Profile from "./Profile";
import Notifications from "./Notifications";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 right-0 w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30 px-4">
      <div className="h-full flex items-center justify-end">
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications Component */}
          <Notifications />

          {/* Profile Component */}
          <Profile />
        </div>
      </div>
    </header>
  );
}
