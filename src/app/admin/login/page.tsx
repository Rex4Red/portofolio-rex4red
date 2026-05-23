"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login gagal";
      if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("user-not-found")) {
        setError("Email atau password salah.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent-subtle border border-accent/30 flex items-center justify-center">
            <span className="font-[family-name:var(--font-display)] text-2xl text-accent">R</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary mb-1">Admin Login</h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary">
            Masuk untuk mengelola portofolio
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-[family-name:var(--font-body)]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-[family-name:var(--font-body)] text-xs font-semibold text-text-muted mb-1.5 tracking-wide uppercase">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-border rounded-lg px-4 py-3 text-text-primary text-sm font-[family-name:var(--font-body)] placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              placeholder="admin@email.com"
            />
          </div>
          <div>
            <label className="block font-[family-name:var(--font-body)] text-xs font-semibold text-text-muted mb-1.5 tracking-wide uppercase">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-border rounded-lg px-4 py-3 text-text-primary text-sm font-[family-name:var(--font-body)] placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-on-primary font-[family-name:var(--font-body)] text-sm font-semibold py-3 rounded-lg hover:brightness-110 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {/* Back to site */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="font-[family-name:var(--font-body)] text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            ← Kembali ke website
          </a>
        </div>
      </div>
    </div>
  );
}
