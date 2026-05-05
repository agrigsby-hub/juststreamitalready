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
      className="min-h-screen flex flex-col items-center px-4 py-14"
      style={{ background: "var(--bg)" }}
    >
      {/* Film strip top bar */}
      <div className="fixed top-0 left-0 right-0 h-6 flex z-50 overflow-hidden" style={{ background: "#0a0800" }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{
              width: "32px",
              height: "100%",
              borderRight: "4px solid #0a0800",
              background: i % 2 === 0 ? "#1c1610" : "#0a0800",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center gap-8 mt-6">

        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo size={80} />
          <div>
            <h1
              className="text-5xl font-bold tracking-tight"
              style={{ color: "var(--gold)", fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
            >
              Just Stream It Already
            </h1>
            <p className="mt-2 text-lg" style={{ color: "var(--muted)" }}>
              Find out where to watch any movie or TV show — right now.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span style={{ color: "var(--muted)", fontSize: "18px" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        {/* Search */}
        <div className="w-full relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none"
                style={{ color: "var(--gold)" }}
              >
                🎬
              </span>
              <input
                type="text"
                value={query}
                onChange={handleInput}
                placeholder="Search movies & TV shows..."
                className="w-full pl-11 pr-5 py-4 rounded-xl text-lg focus:outline-none transition-all"
                style={{
                  background: "var(--card)",
                  color: "var(--text)",
                  border: "1.5px solid var(--border)",
                  caretColor: "var(--gold)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
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
          <p style={{ color: "var(--muted)" }} className="text-sm tracking-wide">
            Searching the archives...
          </p>
        )}

        {searched && !loading && results.length === 0 && !selected && (
          <p style={{ color: "var(--muted)" }}>
            No results found for &ldquo;{query}&rdquo;
          </p>
        )}

        {selected && <StreamingProviders result={selected} onClear={handleReset} />}

        {/* Footer */}
        {!selected && (
          <p className="text-xs mt-8" style={{ color: "var(--muted)" }}>
            Streaming data powered by TMDB &amp; JustWatch
          </p>
        )}
      </div>

      {/* Film strip bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 h-6 flex z-50 overflow-hidden" style={{ background: "#0a0800" }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{
              width: "32px",
              height: "100%",
              borderRight: "4px solid #0a0800",
              background: i % 2 === 0 ? "#1c1610" : "#0a0800",
            }}
          />
        ))}
      </div>
    </main>
  );
}
