"use client";
import { useState } from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { Settings, LogOut, ChevronDown, UserCircle } from "lucide-react";

export default function Profile() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2"
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.fullName || "Profile"}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <UserCircle className="h-8 w-8" />
        )}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium">
            {user.fullName || user.username}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {user.primaryEmailAddress?.emailAddress}
          </div>
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* Profile Dropdown */}
      {showProfileMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
          <div className="py-1">
            <button
              onClick={() => signOut()}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
