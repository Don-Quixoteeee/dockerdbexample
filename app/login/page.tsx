"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, name || undefined);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center dark:bg-black">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h1 className="text-xl font-semibold">Sign in to BrightPath</h1>
        <p className="text-sm text-zinc-500">Enter your student email to continue.</p>

        <label className="mt-4 block text-sm">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />

        <label className="mt-3 block text-sm">Name (optional)</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />

        <div className="mt-5 flex items-center justify-between">
          <button type="submit" className="rounded-md bg-sky-600 px-4 py-2 text-white">Sign in</button>
          <button type="button" onClick={() => router.push("/")} className="text-sm text-zinc-500">Back</button>
        </div>
      </form>
    </div>
  );
}
