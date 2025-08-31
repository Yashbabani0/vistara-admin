"use client";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Lock, Users } from "lucide-react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Secure Access",
      description: "Enterprise-grade security for your administrative needs",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Admin Only",
      description: "Restricted access to authorized personnel only",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User Management",
      description: "Complete control over user permissions and roles",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo or Brand */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Vistara Styles Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your central hub for managing Vistara Styles e-commerce platform
            </p>
          </div>

          {/* Main CTA */}
          <div className="mt-10 flex flex-col items-center gap-4">
            {isLoaded && (
              <>
                {user ? (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                      Sign In to Access
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </SignInButton>
                )}
              </>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user
                ? "You are signed in and have admin access"
                : "Only authorized administrators can access the dashboard"}
            </p>
          </div>

          {/* Footer Section */}
          <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Vistara Styles. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
