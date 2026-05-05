import Image from "next/image";
import { SearchResult } from "@/app/page";

const TMDB_IMG = "https://image.tmdb.org/t/p/w92";

type Props = {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
};

export default function SearchResults({ results, onSelect }: Props) {
  return (
    <ul
      className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-2xl z-50"
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
      }}
    >
      {results.map((r, i) => {
        const title = r.title ?? r.name ?? "Unknown";
        const year = r.release_date?.slice(0, 4) ?? r.first_air_date?.slice(0, 4);
        const label = r.media_type === "tv" ? "TV Show" : "Movie";

        return (
          <li
            key={r.id}
            style={{
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <button
              onClick={() => onSelect(r)}
              className="w-full flex items-center gap-4 px-4 py-3 text-left transition-colors"
              style={{ background: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Poster */}
              <div
                className="w-10 h-14 rounded-lg overflow-hidden shrink-0 relative"
                style={{ background: "var(--surface)" }}
              >
                {r.poster_path ? (
                  <Image
                    src={`${TMDB_IMG}${r.poster_path}`}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-lg"
                    style={{ color: "var(--muted)" }}
                  >
                    🎬
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: "var(--text)" }}>
                  {title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {year && (
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                      {year}
                    </span>
                  )}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--border)",
                      color: "var(--gold)",
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </span>
                </div>
              </div>

              <span style={{ color: "var(--gold)", fontSize: "18px" }}>›</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
