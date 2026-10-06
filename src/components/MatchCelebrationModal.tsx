"use client";

import React, { useEffect } from "react";
import { Flame, MessageCircle, FileText, X, Sparkles, KeyRound, CheckCircle2 } from "lucide-react";
import { Tenant, Listing, Landlord, Match } from "@/types";
import { fireMatchConfetti } from "@/lib/confetti";

interface MatchCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: Tenant | null;
  listing?: Listing | null;
  landlord?: Landlord | null;
  match?: Match | null;
  onOpenChat: (matchId: number) => void;
  onProposeLease: (matchId: number) => void;
}

export function MatchCelebrationModal({
  isOpen,
  onClose,
  tenant,
  listing,
  landlord,
  match,
  onOpenChat,
  onProposeLease,
}: MatchCelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      fireMatchConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-rose-500/30 shadow-2xl text-center overflow-hidden">
        {/* Glow backdrop behind avatars */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Flame Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Mutual Lease Attraction</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 mb-2">
          IT&apos;S A MATCH! 🔥
        </h2>
        <p className="text-sm text-slate-300 max-w-sm mx-auto mb-6">
          {landlord?.name || "The Landlord"} and {tenant?.name || "The Tenant"} both swiped right on{" "}
          <span className="text-white font-semibold">{listing?.title || "this residence"}</span>!
        </p>

        {/* Side-by-side Avatars with Heart/Key in middle */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 my-6">
          {/* Tenant Avatar */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tenant?.avatar || "https://images.pexels.com/photos/7752822/pexels-photo-7752822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
              alt={tenant?.name || "Tenant"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-rose-500 shadow-xl"
            />
            <div className="absolute -bottom-2 inset-x-0 text-center">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400 border border-emerald-500/50 shadow-sm">
                FICO {tenant?.creditScore || 780}
              </span>
            </div>
          </div>

          {/* Glowing Animated Pulse Center */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/50 animate-bounce">
              <KeyRound className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold text-rose-300 mt-1 uppercase tracking-wider">
              100% Match
            </span>
          </div>

          {/* Landlord or Listing Avatar */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={landlord?.avatar || listing?.images?.[0] || "https://images.pexels.com/photos/40035694/pexels-photo-40035694.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
              alt={landlord?.name || "Landlord"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-amber-400 shadow-xl"
            />
            <div className="absolute -bottom-2 inset-x-0 text-center">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300 border border-amber-500/50 shadow-sm truncate max-w-[100px] inline-block">
                {landlord?.name || "Landlord"}
              </span>
            </div>
          </div>
        </div>

        {/* Fun Match Highlights */}
        <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60 mb-6 text-left space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Verified 40x Income Guarantee & Clean Criminal Record</span>
          </div>
          <div className="flex items-center gap-2 text-rose-300">
            <Flame className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Landlord Response Time: {landlord?.responseTime || "Under 5 mins"}</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Pet Approved: {tenant?.petInfo || "No noise violations on record"}</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              if (match) onOpenChat(match.id);
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Open Chat & Schedule Tour</span>
          </button>

          <button
            onClick={() => {
              if (match) onProposeLease(match.id);
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Send Official Lease Agreement ($3,200/mo)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Keep Swiping More Candidates
          </button>
        </div>
      </div>
    </div>
  );
}
