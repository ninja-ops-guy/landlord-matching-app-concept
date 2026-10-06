"use client";

import React from "react";
import { X, SlidersHorizontal, RotateCcw, Check } from "lucide-react";

export interface FilterState {
  city: string;
  maxRent: number;
  minCreditScore: number;
  bedrooms: string;
  petFriendlyOnly: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters);


  if (!isOpen) return null;

  const handleSave = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-rose-500" />
            <h3 className="font-black text-gray-900 text-base">Deck Preferences & Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-6 space-y-5 text-xs text-gray-700">
          {/* City */}
          <div>
            <label className="block font-bold text-gray-800 mb-1.5">Target City / Market</label>
            <select
              value={localFilters.city}
              onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white font-medium"
            >
              <option value="all">All Cities (NYC, Austin, SF, Chicago)</option>
              <option value="New York">New York City</option>
              <option value="Austin">Austin, TX</option>
              <option value="San Francisco">San Francisco, CA</option>
              <option value="Chicago">Chicago, IL</option>
            </select>
          </div>

          {/* Max Rent / Budget */}
          <div>
            <div className="flex justify-between font-bold text-gray-800 mb-1.5">
              <span>Max Monthly Rent / Budget</span>
              <span className="text-rose-600 font-black">${localFilters.maxRent.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min="2000"
              max="5000"
              step="100"
              value={localFilters.maxRent}
              onChange={(e) => setLocalFilters({ ...localFilters, maxRent: Number(e.target.value) })}
              className="w-full accent-rose-500"
            />
          </div>

          {/* Min Credit Score */}
          <div>
            <div className="flex justify-between font-bold text-gray-800 mb-1.5">
              <span>Minimum Credit Score</span>
              <span className="text-emerald-600 font-black">{localFilters.minCreditScore}+ FICO</span>
            </div>
            <input
              type="range"
              min="650"
              max="820"
              step="10"
              value={localFilters.minCreditScore}
              onChange={(e) => setLocalFilters({ ...localFilters, minCreditScore: Number(e.target.value) })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block font-bold text-gray-800 mb-1.5">Bedrooms</label>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "Any", val: "any" },
                { label: "Studio", val: "0" },
                { label: "1 Bed", val: "1" },
                { label: "2+ Beds", val: "2" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, bedrooms: opt.val })}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    localFilters.bedrooms === opt.val
                      ? "border-rose-500 bg-rose-50 text-rose-600 shadow-xs"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pet Friendly */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={localFilters.petFriendlyOnly}
                onChange={(e) => setLocalFilters({ ...localFilters, petFriendlyOnly: e.target.checked })}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="font-semibold text-gray-700">Pet-Friendly Only (Dogs & Cats welcome)</span>
            </label>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-white text-xs font-semibold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs shadow-md shadow-rose-200 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}
