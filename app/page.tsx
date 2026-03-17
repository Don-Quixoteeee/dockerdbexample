"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

type Objective = {
  id: string;
  title: string;
  completed: boolean;
};

type Lesson = {
  id: string;
  title: string;
  description: string;
  minutes: number;
  objectives: Objective[];
};

const sampleLessons: Lesson[] = [
  {
    id: "l1",
    title: "Intro to Fractions",
    description: "Understand numerator and denominator and basic operations.",
    minutes: 18,
    objectives: [
      { id: "o1", title: "Identify numerator/denominator", completed: true },
      { id: "o2", title: "Compare fractions", completed: false },
      { id: "o3", title: "Add simple fractions", completed: false },
    ],
  },
  {
    id: "l2",
    title: "Reading: Main Idea",
    description: "Practice finding the main idea in short passages.",
    minutes: 12,
    objectives: [
      { id: "o4", title: "Find key sentences", completed: true },
      { id: "o5", title: "Summarize passages", completed: true },
    ],
  },
  {
    id: "l3",
    title: "Science: Plant Life Cycle",
    description: "Observe and name stages of plant growth.",
    minutes: 25,
    objectives: [
      { id: "o6", title: "Seed to sprout", completed: false },
      { id: "o7", title: "Photosynthesis basics", completed: false },
      { id: "o8", title: "Label plant parts", completed: false },
    ],
  },
];

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

export default function Home() {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("bp_lessons") : null;
      return raw ? (JSON.parse(raw) as Lesson[]) : sampleLessons;
    } catch {
      return sampleLessons;
    }
  });

  const [selected, setSelected] = useState<Lesson | null>(() => lessons[0] ?? null);
  const [showAssignments, setShowAssignments] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [view, setView] = useState<"lessons" | "profile">("lessons");

  const [profile, setProfile] = useState(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("bp_profile") : null;
      return raw ? JSON.parse(raw) : { name: "", grade: "", email: "" };
    } catch {
      return { name: "", grade: "", email: "" };
    }
  });

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if not logged in, go to sign-in
    if (typeof window !== "undefined" && !user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    // prefill profile email if available from auth
    if (user?.email && !profile.email) {
      setProfile((p: any) => ({ ...p, email: user.email }));
    }
  }, [user]);

  const overallCompleted = Math.round(
    (lessons.reduce((acc: number, l) => acc + l.objectives.filter((o) => o.completed).length, 0) /
      lessons.reduce((acc: number, l) => acc + l.objectives.length, 0)) * 100
  );

  function setNoticeTemp(msg: string, ms = 2500) {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), ms);
  }

  function toggleObjective(lessonId: string, objectiveId: string) {
    setLessons((prev) => {
      const updated = prev.map((l) => {
        if (l.id !== lessonId) return l;
        return {
          ...l,
          objectives: l.objectives.map((o) => (o.id === objectiveId ? { ...o, completed: !o.completed } : o)),
        };
      });
      const newSelected = updated.find((l) => selected && l.id === selected.id) ?? null;
      setSelected(newSelected);
      try {
        window.localStorage.setItem("bp_lessons", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }

  function markSelectedComplete() {
    if (!selected) return;
    setLessons((prev) => {
      const updated = prev.map((l) => (l.id === selected.id ? { ...l, objectives: l.objectives.map((o) => ({ ...o, completed: true })) } : l));
      setSelected(updated.find((l) => l.id === selected.id) ?? null);
      try {
        window.localStorage.setItem("bp_lessons", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setNoticeTemp("Marked complete");
  }

  function resumeNext() {
    const next = lessons.find((l) => l.objectives.some((o) => !o.completed));
    if (next) {
      setSelected(next);
      setNoticeTemp(`Resumed: ${next.title}`);
    } else {
      setNoticeTemp("All lessons completed — great job!");
    }
  }

  function askTeacher(lesson?: Lesson) {
    const subject = encodeURIComponent(`Question about ${lesson?.title ?? "a lesson"}`);
    const body = encodeURIComponent("Hi teacher,%0D%0A%0D%0AI have a question about the lesson.");
    window.location.href = `mailto:teacher@example.com?subject=${subject}&body=${body}`;
  }

  function saveProfile(updates: Partial<typeof profile>) {
    const next = { ...profile, ...updates };
    setProfile(next);
    try {
      window.localStorage.setItem("bp_profile", JSON.stringify(next));
      setNoticeTemp("Profile saved");
    } catch {}
  }

  // Persist lessons when they change
  useEffect(() => {
    try {
      window.localStorage.setItem("bp_lessons", JSON.stringify(lessons));
    } catch {}
  }, [lessons]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-gradient-to-br from-sky-500 to-emerald-400 p-2">
              <Image src="/globe.svg" alt="BrightPath" width={36} height={36} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">BrightPath Tutoring</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Student dashboard</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <button onClick={() => setView("lessons")} className={`rounded-full px-4 py-2 text-sm ${view === "lessons" ? "bg-white/60 shadow-sm" : "hover:bg-black/5 dark:hover:bg-white/5"}`}>Lessons</button>
            <button onClick={() => setView("profile")} className={`rounded-full px-4 py-2 text-sm ${view === "profile" ? "bg-white/60 shadow-sm" : "hover:bg-black/5 dark:hover:bg-white/5"}`}>Profile</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {view === "profile" ? (
            <div className="md:col-span-3 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900">
              <h2 className="text-xl font-semibold">Profile</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Keep your profile up to date so teachers can send reminders.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col text-sm">
                  <span className="mb-1">Name</span>
                  <input value={profile.name} onChange={(e) => saveProfile({ name: e.target.value })} className="rounded-md border px-3 py-2" />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="mb-1">Grade</span>
                  <input value={profile.grade} onChange={(e) => saveProfile({ grade: e.target.value })} className="rounded-md border px-3 py-2" />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="mb-1">Email</span>
                  <input value={profile.email} onChange={(e) => saveProfile({ email: e.target.value })} className="rounded-md border px-3 py-2" />
                </label>
                <div className="flex items-center gap-2">
                  <input id="notif" type="checkbox" checked={!!profile.email} readOnly className="h-4 w-4" />
                  <label htmlFor="notif" className="text-sm text-zinc-600">Email notifications enabled</label>
                </div>
              </div>
            </div>
          ) : null}
          <aside className="md:col-span-1">
            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-zinc-900">
              <h2 className="text-lg font-medium">Your progress</h2>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Course completion</div>
                  <div className="text-sm font-medium">{overallCompleted}%</div>
                </div>
                <div className="mt-3">
                  <ProgressBar percent={overallCompleted} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Next reminder</div>
                <div className="rounded-md bg-zinc-50 p-3 text-sm">Math lesson at 3:00 PM — don’t forget to review objectives.</div>
              </div>
            </div>
      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
              <h3 className="text-sm font-medium">Quick actions</h3>
              <div className="mt-3 flex flex-col gap-2">
        <button onClick={resumeNext} className="rounded-md bg-sky-600 px-3 py-2 text-sm text-white">Resume lesson</button>
        <button onClick={() => setShowAssignments(true)} className="rounded-md border px-3 py-2 text-sm">View assignments</button>
              </div>
            </div>
          </aside>

          <section className="md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Lessons</h2>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{lessons.length} available</div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {lessons.map((lesson) => {
                const done = Math.round((lesson.objectives.filter((o) => o.completed).length / lesson.objectives.length) * 100);
                return (
                  <article
                    key={lesson.id}
                    onClick={() => setSelected(lesson)}
                    className={`cursor-pointer rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900 hover:shadow-md ${selected?.id === lesson.id ? "ring-2 ring-sky-400" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-medium">{lesson.title}</h3>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{lesson.description}</p>
                      </div>
                      <div className="text-xs text-zinc-500">{lesson.minutes}m</div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="w-full">
                        <ProgressBar percent={done} />
                        <div className="mt-2 text-xs text-zinc-500">{done}% complete • {lesson.objectives.length} objectives</div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {selected && (
              <div className="mt-6 rounded-xl bg-white p-5 shadow-sm dark:bg-zinc-900">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selected.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{selected.description}</p>
                  </div>
                  <div className="text-sm text-zinc-500">{selected.minutes} min</div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selected.objectives.map((o) => (
                    <div key={o.id} className="flex items-center gap-3 rounded-md border p-3">
                      <input
                        type="checkbox"
                        checked={o.completed}
                        onChange={() => toggleObjective(selected.id, o.id)}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className="text-sm font-medium">{o.title}</div>
                        <div className="text-xs text-zinc-500">{o.completed ? "Completed" : "Incomplete"}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button onClick={markSelectedComplete} className="rounded-md bg-emerald-500 px-4 py-2 text-sm text-white">Mark complete</button>
                  <button onClick={() => askTeacher(selected ?? undefined)} className="rounded-md border px-4 py-2 text-sm">Ask teacher</button>
                </div>
              </div>
            )}
          </section>
        </section>
      </main>

      {showAssignments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Assignments</h4>
              <button onClick={() => setShowAssignments(false)} className="text-sm">Close</button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <div>• Math worksheet — due tomorrow</div>
              <div>• Reading summary — due in 3 days</div>
              <div>• Science observation log — due next week</div>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed right-6 bottom-6 z-50 rounded-md bg-black/90 px-4 py-2 text-sm text-white">{notice}</div>
      )}
    </div>
  );
}
