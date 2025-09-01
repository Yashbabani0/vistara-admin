"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";

export default function UsersTable() {
  const users = useQuery(api.users.getUsers);

  if (!users) return <p className="text-center mt-8">Loading users...</p>;

  return (
    <div className="overflow-x-auto p-6 mt-20 w-[40em]">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-indigo-50 dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              Image
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              Role
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              Joined
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              ID
            </th>
          </tr>
        </thead>
        <tbody className="w-full">
          {users.map((user, idx) => (
            <tr
              key={user.id}
              className={`transition-colors duration-200 ${
                idx % 2 === 0
                  ? "bg-white dark:bg-gray-900"
                  : "bg-gray-50 dark:bg-gray-800"
              } hover:bg-indigo-100 dark:hover:bg-gray-700`}
            >
              <td className="px-4 py-3 flex items-center gap-3">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    className={`rounded-full object-cover border-2 ${
                      user.role === "admin"
                        ? "border-red-500"
                        : user.role === "editor"
                          ? "border-yellow-500"
                          : "border-green-500"
                    }`}
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-gray-600 font-bold border-2 ${
                      user.role === "admin"
                        ? "border-red-500 bg-red-100"
                        : user.role === "editor"
                          ? "border-yellow-500 bg-yellow-100"
                          : "border-green-500 bg-green-100"
                    }`}
                  >
                    {user.name?.[0] || "U"}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">
                {user.name || "No Name"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[180px]">
                {user.email}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    user.role === "admin"
                      ? "destructive"
                      : user.role === "editor"
                        ? "secondary"
                        : "default"
                  }
                  className="px-2 py-1 text-sm"
                >
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) ||
                    "User"}
                </Badge>
              </td>
              <td className="px-4 py-3 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <User className="w-4 h-4" />
                {user.id.toString().slice(0, 8)}...
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
