import Image from "next/image";
import { SearchResult } from "@/app/page";

const TMDB_IMG = "https://image.tmdb.org/t/p/w92";

type Props = {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
};

export default function SearchResults({ results, onSelect }: Props) {
  return (
    <ul className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl z-50">
      {results.map((r) => {
        const title = r.title ?? r.name ?? "Unknown";
        const year = r.release_date?.slice(0, 4) ?? r.first_air_date?.slice(0, 4);
        const label = r.media_type === "tv" ? "TV" : "Movie";

        return (
          <li key={r.id}>
            <button
              onClick={() => onSelect(r)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 transition-colors text-left"
            >
              <div className="w-10 h-14 rounded overflow-hidden bg-zinc-700 shrink-0 relative">
                {r.poster_path ? (
                  <Image
                    src={`${TMDB_IMG}${r.poster_path}`}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">?</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{title}</p>
                <p className="text-zinc-400 text-sm">
                  {label}{year ? ` · ${year}` : ""}
                </p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
