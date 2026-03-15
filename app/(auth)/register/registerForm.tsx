"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/workflows/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await register({ name, email, password });
      if (!result.ok) {
        setError(result.error ?? "Unable to register");
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p className="text-xs text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-sky-700">
          Sign in
        </Link>
        .
      </p>
    </form>
  );
}

