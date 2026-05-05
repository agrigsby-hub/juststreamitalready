"use client";

import { useState, useRef } from "react";
import SearchResults from "@/components/SearchResults";
import StreamingProviders from "@/components/StreamingProviders";

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
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Just Stream It Already
          </h1>
          <p className="text-zinc-400 text-lg">
            Find out where to watch any movie or TV show right now.
          </p>
        </div>

        <div className="w-full relative">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={handleInput}
              placeholder="Search for a movie or TV show..."
              className="w-full px-5 py-4 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 focus:outline-none focus:border-blue-500 text-lg transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={handleReset}
                className="px-4 py-4 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors text-sm"
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
          <p className="text-zinc-500 text-sm">Searching...</p>
        )}

        {searched && !loading && results.length === 0 && !selected && (
          <p className="text-zinc-500">No results found for &ldquo;{query}&rdquo;</p>
        )}

        {selected && <StreamingProviders result={selected} />}
      </div>
    </main>
  );
}
