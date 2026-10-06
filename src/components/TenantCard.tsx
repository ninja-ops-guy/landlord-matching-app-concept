"use client";

import React from "react";
import { ShieldCheck, Dog, Briefcase, DollarSign, Calendar, ThumbsUp, AlertTriangle, Sparkles, Info, CheckCircle2 } from "lucide-react";
import { Tenant } from "@/types";

interface TenantCardProps {
  tenant: Tenant;
  onOpenDossier: (tenant: Tenant) => void;
}

export function TenantCard({ tenant, onOpenDossier }: TenantCardProps) {
  const getCreditScoreTier = (score: number) => {
    if (score >= 780) return { label: "Credit Royalty 👑", color: "bg-emerald-500 text-white" };
    if (score >= 720) return { label: "Excellent ⭐", color: "bg-teal-500 text-white" };
    if (score >= 680) return { label: "Solid Good 👍", color: "bg-blue-500 text-white" };
    return { label: "Co-Signer Ready", color: "bg-amber-500 text-white" };
  };

  const creditTier = getCreditScoreTier(tenant.creditScore);

  return (
    <div className="relative w-full h-[580px] sm:h-[620px] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 select-none border border-slate-700/60">
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tenant.avatar}
        alt={tenant.name}
        className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
      />

      {/* Top Gradient for Status & Verification */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 flex items-start justify-between z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1 ${creditTier.color}`}>
            <span>FICO {tenant.creditScore}</span>
            <span>•</span>
            <span>{creditTier.label}</span>
          </span>

          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{tenant.compatibilityScore}% Compatibility</span>
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDossier(tenant);
          }}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all border border-white/20 hover:scale-110 active:scale-95"
          title="Open Full Rental Dossier"
        >
          <Info className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom Gradient Overlay & Tenant Info */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-24 pb-5 px-5 z-10 text-white">
        {/* Name, Age, Verification */}
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
            {tenant.name}, {tenant.age}
          </h2>
          <span
            className="flex items-center text-blue-400 bg-blue-900/60 p-1 rounded-full border border-blue-400/40"
            title="100% Background & Income Verified"
          >
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>

        {/* Occupation & Employer */}
        <div className="flex items-center gap-2 text-sm text-slate-300 mb-3 font-medium">
          <Briefcase className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="truncate">
            {tenant.job} at <strong className="text-white">{tenant.company}</strong>
          </span>
        </div>

        {/* Key Metrics Chips */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-2 border border-slate-700/60">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>Verified Income</span>
            </div>
            <div className="text-sm font-bold text-white">
              ${tenant.monthlyIncome.toLocaleString()}/mo
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-2 border border-slate-700/60">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar className="w-3 h-3 text-blue-400" />
              <span>Move-in Date</span>
            </div>
            <div className="text-sm font-bold text-white truncate">
              {tenant.moveInDate}
            </div>
          </div>
        </div>

        {/* Pet details */}
        <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-md rounded-xl px-3 py-1.5 border border-slate-700/50 mb-3 text-xs">
          <Dog className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300 truncate font-medium">
            <strong className="text-white">Pet:</strong> {tenant.petInfo}
          </span>
        </div>

        {/* Landlord Green & Red Flags highlights */}
        <div className="space-y-1 mb-2">
          {tenant.greenFlags.slice(0, 2).map((flag, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium truncate">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{flag}</span>
            </div>
          ))}
          {tenant.redFlags.slice(0, 1).map((flag, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-amber-300 font-medium truncate">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{flag}</span>
            </div>
          ))}
        </div>

        {/* Dossier Tap Hint */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDossier(tenant);
          }}
          className="w-full text-center py-1.5 text-xs text-rose-300 hover:text-white font-semibold flex items-center justify-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20"
        >
          <span>Tap for Full Background & Plaid Paystubs</span>
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
