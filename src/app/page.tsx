"use client";

import { useState, useRef } from "react";
import SearchResults from "@/components/SearchResults";
import StreamingProviders from "@/components/StreamingProviders";
import Logo from "@/components/Logo";

export type SearchResult = {
  id: number;
  title: string;
  name?: string;
  media_type: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  overview: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 400);
  };

  const handleSelect = (result: SearchResult) => {
    setSelected(result);
    setResults([]);
    setQuery(result.title ?? result.name ?? "");
  };

  const handleReset = () => {
    setSelected(null);
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 py-20"
      style={{ background: "var(--bg)" }}
    >
      {/* Subtle gradient glow behind header */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(124,58,237,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-xl flex flex-col items-center gap-8 relative">

        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-5 text-center">
          <Logo size={72} />
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Just Stream It{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #a855f7, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Already
              </span>
            </h1>
            <p className="mt-2 text-base" style={{ color: "var(--muted)" }}>
              Stop googling. Find out where to watch it — right now.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="w-full relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                🎬
              </span>
              <input
                type="text"
                value={query}
                onChange={handleInput}
                placeholder="Search movies & TV shows..."
                className="w-full pl-11 pr-5 py-4 rounded-xl text-base focus:outline-none transition-all"
                style={{
                  background: "var(--card)",
                  color: "var(--text)",
                  border: "1.5px solid var(--border)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#7c3aed";
                  e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
                autoFocus
              />
            </div>
            {query && (
              <button
                onClick={handleReset}
                className="px-4 py-4 rounded-xl text-sm transition-colors"
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  color: "var(--muted)",
                }}
              >
                Clear
              </button>
            )}
          </div>

          {results.length > 0 && !selected && (
            <SearchResults results={results} onSelect={handleSelect} />
          )}
        </div>

        {loading && (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Looking it up...
          </p>
        )}

        {searched && !loading && results.length === 0 && !selected && (
          <p style={{ color: "var(--muted)" }}>
            Nothing found for &ldquo;{query}&rdquo;
          </p>
        )}

        {selected && <StreamingProviders result={selected} onClear={handleReset} />}

        {!selected && !searched && (
          <p className="text-xs" style={{ color: "var(--muted)", opacity: 0.5 }}>
            Covers Netflix, Hulu, Max, Disney+, Prime, Apple TV+, Peacock & more
          </p>
        )}
      </div>
    </main>
  );
}
