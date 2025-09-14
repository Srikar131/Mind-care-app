"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type MoodEntry = {
  id: string;
  rating: number;
  note: string;
  createdAt: string; // ISO string
};

const STORAGE_KEY = "mood-tracker:entries:v1";

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [rating, setRating] = useState<number>(3);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MoodEntry[];
        if (Array.isArray(parsed)) {
          setEntries(parsed);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [entries]);

  function handleAddEntry() {
    const newEntry: MoodEntry = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      rating,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
    setRating(3);
    setNote("");
  }

  function handleDeleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function handleClearAll() {
    if (entries.length === 0) return;
    setEntries([]);
  }

  return (
    <div className="font-sans max-w-2xl mx-auto min-h-screen p-6 sm:p-10">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Mood Tracker</h1>
        <Link
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
          href="/"
        >
          ← Home
        </Link>
      </header>

      <section aria-labelledby="log-mood" className="mb-10 w-full">
        <h2 id="log-mood" className="text-lg font-medium mb-4">
          Log your mood
        </h2>
        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-4 sm:p-6">
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-foreground/80">Mood rating (1–5)</span>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                aria-valuemin={1}
                aria-valuemax={5}
                aria-valuenow={rating}
              />
              <div className="text-sm">Current: {rating}</div>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-foreground/80">Add a note (optional)</span>
              <textarea
                className="w-full rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent p-2 text-sm"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's contributing to your mood today?"
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddEntry}
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background font-medium text-sm h-10 px-4 hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Save entry
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-full border border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center font-medium text-sm h-10 px-4 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="history" className="w-full">
        <h2 id="history" className="text-lg font-medium mb-4">
          History
        </h2>
        {sortedEntries.length === 0 ? (
          <p className="text-sm text-foreground/70">No entries yet. Your saved moods will appear here.</p>
        ) : (
          <ul className="grid gap-3">
            {sortedEntries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-black/[.08] dark:border-white/[.145] p-3 sm:p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">Mood: {entry.rating} / 5</div>
                    <div className="text-xs text-foreground/70">
                      {new Date(entry.createdAt).toLocaleString()}
                    </div>
                    {entry.note && (
                      <p className="mt-2 text-sm whitespace-pre-wrap">{entry.note}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEntry(entry.id)}
                    aria-label="Delete entry"
                    className="rounded-full border border-black/[.08] dark:border-white/[.145] transition-colors px-3 h-8 text-xs hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

