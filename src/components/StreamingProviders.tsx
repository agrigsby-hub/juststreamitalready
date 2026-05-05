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
      <p className="text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">{label}</p>
      <div className="flex flex-wrap gap-3">
        {providers.map((p) => (
          <a
            key={p.provider_id}
            href={link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            title={p.provider_name}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-700 group-hover:border-blue-500 transition-colors relative">
              <Image
                src={`${TMDB_LOGO}${p.logo_path}`}
                alt={p.provider_name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <span className="text-zinc-400 text-xs group-hover:text-white transition-colors text-center max-w-[60px] leading-tight">
              {p.provider_name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function StreamingProviders({ result }: { result: SearchResult }) {
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
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [result.id, result.media_type]);

  const hasAny = data && (
    data.flatrate.length || data.rent.length || data.buy.length || data.free.length || data.ads.length
  );

  return (
    <div className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl overflow-hidden">
      {/* Header with poster */}
      <div className="flex gap-4 p-5 border-b border-zinc-700">
        {result.poster_path && (
          <div className="w-16 h-24 rounded-lg overflow-hidden relative shrink-0">
            <Image
              src={`${TMDB_IMG}${result.poster_path}`}
              alt={title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}
        <div className="flex flex-col justify-center gap-1">
          <h2 className="text-white text-xl font-bold">{title}</h2>
          <div className="flex items-center gap-2">
            {year && <span className="text-zinc-400 text-sm">{year}</span>}
            <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
              {result.media_type === "tv" ? "TV Show" : "Movie"}
            </span>
          </div>
        </div>
      </div>

      {/* Providers */}
      <div className="p-5">
        {loading && (
          <p className="text-zinc-500 text-sm">Checking streaming availability...</p>
        )}

        {error && (
          <p className="text-red-400 text-sm">Failed to load streaming data. Try again.</p>
        )}

        {!loading && !error && !hasAny && (
          <div className="text-center py-4">
            <p className="text-zinc-300 font-medium">Not currently available to stream in the US</p>
            <p className="text-zinc-500 text-sm mt-1">Check back later — availability changes frequently.</p>
          </div>
        )}

        {!loading && !error && hasAny && (
          <div className="flex flex-col gap-6">
            <ProviderGroup label="Stream" providers={data!.flatrate} link={data!.link} />
            <ProviderGroup label="Free with ads" providers={data!.ads} link={data!.link} />
            <ProviderGroup label="Free" providers={data!.free} link={data!.link} />
            <ProviderGroup label="Rent" providers={data!.rent} link={data!.link} />
            <ProviderGroup label="Buy" providers={data!.buy} link={data!.link} />
          </div>
        )}
      </div>

      {data?.link && (
        <div className="px-5 pb-4">
          <p className="text-zinc-600 text-xs">
            Availability data provided by{" "}
            <a href={data.link} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline">
              JustWatch
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
