"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SearchResult } from "@/app/page";

const TMDB_LOGO = "https://image.tmdb.org/t/p/original";
const TMDB_IMG = "https://image.tmdb.org/t/p/w300";

type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

type ProvidersData = {
  flatrate: Provider[];
  rent: Provider[];
  buy: Provider[];
  free: Provider[];
  ads: Provider[];
  link: string | null;
};

function ProviderGroup({ label, providers, link }: { label: string; providers: Provider[]; link: string | null }) {
  if (!providers.length) return null;
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-3">
        {providers.map((p) => (
          <a
            key={p.provider_id}
            href={link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            title={p.provider_name}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div
              className="w-14 h-14 rounded-xl overflow-hidden relative transition-all duration-150"
              style={{ border: "1.5px solid var(--border)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#7c3aed";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 14px rgba(124,58,237,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <Image
                src={`${TMDB_LOGO}${p.logo_path}`}
                alt={p.provider_name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <span className="text-xs text-center leading-tight max-w-[60px] transition-colors" style={{ color: "var(--muted)" }}>
              {p.provider_name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function StreamingProviders({
  result,
  onClear,
}: {
  result: SearchResult;
  onClear: () => void;
}) {
  const [data, setData] = useState<ProvidersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const title = result.title ?? result.name ?? "Unknown";
  const year = result.release_date?.slice(0, 4) ?? result.first_air_date?.slice(0, 4);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setData(null);
    fetch(`/api/providers?id=${result.id}&type=${result.media_type}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [result.id, result.media_type]);

  const hasAny = data && (data.flatrate.length || data.rent.length || data.buy.length || data.free.length || data.ads.length);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div className="flex gap-4 p-5" style={{ borderBottom: "1px solid var(--border)" }}>
        {result.poster_path && (
          <div className="w-16 h-24 rounded-xl overflow-hidden relative shrink-0">
            <Image src={`${TMDB_IMG}${result.poster_path}`} alt={title} fill className="object-cover" sizes="64px" />
          </div>
        )}
        <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
          <h2 className="text-xl font-bold leading-tight" style={{ color: "var(--text)" }}>
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {year && <span className="text-sm" style={{ color: "var(--muted)" }}>{year}</span>}
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ background: "var(--border)", color: "#a855f7" }}
            >
              {result.media_type === "tv" ? "TV Show" : "Movie"}
            </span>
          </div>
          <button
            onClick={onClear}
            className="text-xs mt-1 w-fit transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#a855f7")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--muted)")}
          >
            ← Search again
          </button>
        </div>
      </div>

      {/* Providers body */}
      <div className="p-5">
        {loading && <p className="text-sm" style={{ color: "var(--muted)" }}>Checking where to watch...</p>}
        {error && <p className="text-sm" style={{ color: "#ef4444" }}>Something went wrong. Try again.</p>}

        {!loading && !error && !hasAny && (
          <div className="text-center py-6">
            <p className="text-3xl mb-3">😤</p>
            <p className="font-semibold" style={{ color: "var(--text)" }}>Not streaming anywhere in the US right now</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Availability changes all the time — check back soon.</p>
          </div>
        )}

        {!loading && !error && hasAny && (
          <div className="flex flex-col gap-6">
            <ProviderGroup label="Included with subscription" providers={data!.flatrate} link={data!.link} />
            <ProviderGroup label="Free with ads" providers={data!.ads} link={data!.link} />
            <ProviderGroup label="Free" providers={data!.free} link={data!.link} />
            <ProviderGroup label="Rent" providers={data!.rent} link={data!.link} />
            <ProviderGroup label="Buy" providers={data!.buy} link={data!.link} />
          </div>
        )}
      </div>

      {data?.link && (
        <div className="px-5 pb-4">
          <p className="text-xs" style={{ color: "var(--muted)", opacity: 0.5 }}>
            Data via <a href={data.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>JustWatch</a>
          </p>
        </div>
      )}
    </div>
  );
}
