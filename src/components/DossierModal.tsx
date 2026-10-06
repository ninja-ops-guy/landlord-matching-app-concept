"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Calendar,
  Dog,
  Briefcase,
  Award,
  AlertTriangle,
  ThumbsUp,
  MapPin,
  Bed,
  Bath,
  Square,
  Sparkles,
  FileCheck,
  Heart,
  Home
} from "lucide-react";
import { Tenant, Listing } from "@/types";

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Tenant | Listing | null;
  onAction?: (action: "like" | "pass", item: Tenant | Listing) => void;
}

export function DossierModal({ isOpen, onClose, item, onAction }: DossierModalProps) {
  if (!isOpen || !item) return null;

  const isTenant = "creditScore" in item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col border border-gray-100">
        {/* Sticky Header with Close */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
              {isTenant ? <FileCheck className="w-5 h-5" /> : <Home className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="font-black text-gray-900 text-lg leading-tight">
                {isTenant ? "Verified Rental Dossier" : "Property & Landlord Specifications"}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {isTenant ? "Applicant Screening Report" : "Lease Terms & Landlord Review"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 text-gray-800">
          {isTenant ? (
            /* TENANT DOSSIER CONTENT */
            (() => {
              const tenant = item as Tenant;
              return (
                <>
                  {/* Top Profile Summary */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tenant.avatar}
                      alt={tenant.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-rose-100 shrink-0"
                    />
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                        <h2 className="text-2xl font-black text-gray-900">
                          {tenant.name}, {tenant.age}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Plaid Verified</span>
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-600 flex items-center justify-center sm:justify-start gap-1.5 mb-2">
                        <Briefcase className="w-4 h-4 text-rose-500" />
                        <span>{tenant.job} at <strong className="text-gray-900">{tenant.company}</strong></span>
                      </p>
                      <p className="text-xs text-gray-600 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        &quot;{tenant.bio}&quot;
                      </p>
                    </div>
                  </div>

                  {/* FICO Score & Financial Snapshot */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-500" />
                      <span>Financial & Credit Credentials</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 text-center">
                        <div className="text-xs text-emerald-700 font-bold mb-1">FICO Credit Score</div>
                        <div className="text-3xl font-black text-emerald-600">{tenant.creditScore}</div>
                        <div className="text-[11px] text-emerald-800 font-medium mt-1">Tier: Tier-1 Prime</div>
                      </div>

                      <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100 text-center">
                        <div className="text-xs text-blue-700 font-bold mb-1">Monthly Gross Income</div>
                        <div className="text-3xl font-black text-blue-600">
                          ${(tenant.monthlyIncome / 1000).toFixed(1)}k
                        </div>
                        <div className="text-[11px] text-blue-800 font-medium mt-1">Direct Deposit Verified</div>
                      </div>

                      <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 text-center">
                        <div className="text-xs text-purple-700 font-bold mb-1">Rent-to-Income Ratio</div>
                        <div className="text-3xl font-black text-purple-600">
                          {(tenant.monthlyIncome / (tenant.budget || 3000)).toFixed(1)}x
                        </div>
                        <div className="text-[11px] text-purple-800 font-medium mt-1">Safe Threshold: &gt;3.0x</div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Badges Checklist */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">
                      Automated Verification Checks
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-white p-2 rounded-xl border border-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>0 Late Payments in 5 Yrs</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-white p-2 rounded-xl border border-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Clean Eviction Record</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-white p-2 rounded-xl border border-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Renter&apos;s Insurance Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Pet Dossier */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                      <Dog className="w-4 h-4 text-amber-500" />
                      <span>Pet Dossier</span>
                    </h4>
                    <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 flex items-center gap-4">
                      {tenant.petAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tenant.petAvatar}
                          alt="Pet"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold shrink-0">
                          🐾
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{tenant.petInfo}</div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Vaccination records up to date. Professional training complete. Zero noise infractions reported.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Green Flags vs Red Flags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                      <h5 className="text-xs font-black text-emerald-800 uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
                        <ThumbsUp className="w-4 h-4 text-emerald-600" />
                        <span>Landlord Green Flags</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {tenant.greenFlags.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100">
                      <h5 className="text-xs font-black text-amber-800 uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Tenant Quirks / Red Flags</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {tenant.redFlags.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">!</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Prior Landlord Recommendation */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4">
                    <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                      Verified Prior Landlord Endorsement ★★★★★
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      &quot;{tenant.name} lived in my building for {tenant.rentalHistoryYears} years. Flawless rent payments, took great care of the wood finishes, and communicated early whenever traveling. 10/10 would rent again in a heartbeat.&quot;
                    </p>
                    <div className="text-[11px] text-slate-400 mt-2 font-medium">
                      — Former Building Superintendent, Manhattan NY
                    </div>
                  </div>
                </>
              );
            })()
          ) : (
            /* LISTING DOSSIER CONTENT */
            (() => {
              const listing = item as Listing;
              const landlord = listing.landlord;
              return (
                <>
                  {/* Photo Gallery preview */}
                  <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
                    {listing.images.map((img, idx) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={idx}
                        src={img}
                        alt="Property view"
                        className="w-full h-32 sm:h-40 object-cover hover:scale-105 transition-transform"
                      />
                    ))}
                  </div>

                  {/* Details Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-gray-900">{listing.title}</h2>
                      <span className="text-2xl font-black text-rose-600">
                        ${listing.rent.toLocaleString()}<span className="text-xs text-gray-500 font-normal">/mo</span>
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{listing.neighborhood}, {listing.city}</span>
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="text-gray-400 text-[10px] font-bold">BEDROOMS</div>
                      <div className="font-bold text-gray-800">{listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} Bed`}</div>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="text-gray-400 text-[10px] font-bold">BATHROOMS</div>
                      <div className="font-bold text-gray-800">{listing.bathrooms} Bath</div>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="text-gray-400 text-[10px] font-bold">SQUARE FEET</div>
                      <div className="font-bold text-gray-800">{listing.sqft} sqft</div>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="text-gray-400 text-[10px] font-bold">AVAILABLE</div>
                      <div className="font-bold text-gray-800">{listing.availableDate}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Description</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                      {listing.description}
                    </p>
                  </div>

                  {/* Landlord Card In-depth */}
                  {landlord && (
                    <div className="bg-slate-900 text-white rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={landlord.avatar}
                          alt={landlord.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-rose-400 shadow-md"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-white">{landlord.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black">
                              ★ {landlord.rating} ({landlord.reviewsCount} reviews)
                            </span>
                          </div>
                          <div className="text-xs text-rose-300 font-medium">
                            {landlord.style} • Replies {landlord.responseTime}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 italic mb-4">&quot;{landlord.bio}&quot;</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                          <span className="text-emerald-400 font-bold block mb-1">Landlord Green Flags:</span>
                          <ul className="space-y-1 text-slate-300">
                            {landlord.greenFlags.map((gf, idx) => (
                              <li key={idx}>✓ {gf}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                          <span className="text-amber-400 font-bold block mb-1">Building Rules / Quirks:</span>
                          <ul className="space-y-1 text-slate-300">
                            {landlord.redFlags.map((rf, idx) => (
                              <li key={idx}>• {rf}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amenities & Utilities */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <h5 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Amenities</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {listing.amenities.map((a, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-md text-xs bg-white border border-gray-200 text-gray-700">
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <h5 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Included Utilities</h5>
                      <div className="space-y-1 text-xs text-gray-600">
                        {listing.utilities.map((u, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                            <span>{u}</span>
                          </div>
                        ))}
                        <div className="text-[11px] text-gray-500 pt-1 font-medium">Pet Policy: {listing.petPolicy}</div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()
          )}
        </div>

        {/* Footer Actions */}
        {onAction && (
          <div className="sticky bottom-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-t border-gray-100">
            <button
              onClick={() => {
                onAction("pass", item);
                onClose();
              }}
              className="py-2.5 px-5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-sm transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4 stroke-[3]" />
              <span>Pass</span>
            </button>

            <button
              onClick={() => {
                onAction("like", item);
                onClose();
              }}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isTenant ? "Approve & Match" : "Like & Apply"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
