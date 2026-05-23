"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter, usePathname } from "next/navigation";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, logout: async () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);

      // If not authenticated and not on login page, redirect
      if (!u && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    });
    return unsub;
  }, [router, pathname]);

  const logout = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-text-muted text-sm font-[family-name:var(--font-body)]">Loading...</span>
        </div>
      </div>
    );
  }

  // If on login page, don't require auth
  if (pathname === "/admin/login") {
    return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
  }

  // If not authenticated, show nothing (redirect is happening)
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-text-muted text-sm font-[family-name:var(--font-body)]">Redirecting...</span>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}
