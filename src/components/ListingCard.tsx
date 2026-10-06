"use client";

import React, { useState } from "react";
import { Bed, Bath, Square, MapPin, Sparkles, Info, ShieldCheck, Heart, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import { Listing } from "@/types";

interface ListingCardProps {
  listing: Listing;
  onOpenDossier: (listing: Listing) => void;
}

export function ListingCard({ listing, onOpenDossier }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = Array.isArray(listing.images) && listing.images.length > 0
    ? listing.images
    : ["https://images.pexels.com/photos/7587828/pexels-photo-7587828.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const landlord = listing.landlord;

  return (
    <div className="relative w-full h-[580px] sm:h-[620px] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 select-none border border-slate-700/60">
      {/* Background Image Carousel */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[currentImageIndex]}
        alt={listing.title}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-300"
      />

      {/* Top Carousel Navigation Dots */}
      <div className="absolute top-3 inset-x-0 flex items-center justify-center gap-1.5 z-20 px-4">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Prev / Next Click Zones */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-opacity"
            title="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-opacity"
            title="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Top Badges */}
      <div className="absolute top-7 inset-x-0 p-4 flex items-start justify-between z-10 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <span className="px-3 py-1.5 rounded-full text-sm font-black shadow-lg bg-rose-600 text-white flex items-center gap-1">
            <span>${listing.rent.toLocaleString()}</span>
            <span className="text-xs font-normal text-rose-100">/mo</span>
          </span>

          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" />
            <span>{listing.neighborhood}</span>
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDossier(listing);
          }}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all border border-white/20 hover:scale-110 active:scale-95 pointer-events-auto"
          title="Open Listing Dossier"
        >
          <Info className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom Gradient Overlay & Listing + Landlord Info */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-20 pb-4 px-5 z-10 text-white">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 drop-shadow-sm line-clamp-1">
          {listing.title}
        </h2>

        {/* Specs: Beds, Baths, Sqft */}
        <div className="flex items-center gap-3 text-xs text-slate-300 mb-3 font-semibold">
          <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <Bed className="w-3.5 h-3.5 text-indigo-400" />
            <span>{listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} Bed`}</span>
          </span>
          <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <Bath className="w-3.5 h-3.5 text-cyan-400" />
            <span>{listing.bathrooms} Bath</span>
          </span>
          <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <Square className="w-3.5 h-3.5 text-amber-400" />
            <span>{listing.sqft} sqft</span>
          </span>
        </div>

        {/* Meet Your Landlord Feature Card */}
        {landlord && (
          <div className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-slate-700/80 mb-3 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={landlord.avatar}
                alt={landlord.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-rose-400 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white truncate">{landlord.name}</span>
                  <span className="text-xs px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-md font-semibold">
                    ★ {landlord.rating}
                  </span>
                </div>
                <div className="text-[11px] text-rose-300 font-medium">
                  {landlord.responseTime} • {landlord.style}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic line-clamp-2">
              &quot;{landlord.bio}&quot;
            </p>
          </div>
        )}

        {/* Top Amenities chips */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {listing.amenities.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/70 text-slate-200 border border-slate-700/50"
            >
              ✓ {amenity}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/50 text-slate-400">
              +{listing.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Dossier Tap Hint */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDossier(listing);
          }}
          className="w-full text-center py-1.5 text-xs text-indigo-300 hover:text-white font-semibold flex items-center justify-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-500/20"
        >
          <span>Tap for Full Lease Specs & Landlord Vibe Check</span>
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
