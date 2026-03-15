"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/workflows/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login({ email, password });

      if (!result.ok) {
        setError(result.error ?? "Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/subjects");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      
      {/* Email */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Email
        </label>

        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-400 outline-none transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Password
        </label>

        <input
          type="password"
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-400 outline-none transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-sky-700 active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-xs text-neutral-500 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-sky-500 hover:text-sky-400">
          Create one
        </Link>
      </p>

    </form>
  );
}