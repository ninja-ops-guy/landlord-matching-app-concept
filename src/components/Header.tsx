"use client";

import React from "react";
import { Flame, KeyRound, MessageCircle, SlidersHorizontal, PlusCircle, RotateCcw, Sparkles, Building2, User } from "lucide-react";
import { AppMode, ActiveTab } from "@/types";

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  matchesCount: number;
  onOpenFilter: () => void;
  onOpenCreate: () => void;
  onResetData: () => void;
  isResetting: boolean;
}

export function Header({
  mode,
  setMode,
  activeTab,
  setActiveTab,
  matchesCount,
  onOpenFilter,
  onOpenCreate,
  onResetData,
  isResetting,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 text-white shadow-md shadow-rose-200">
              <div className="relative">
                <Flame className="w-5 h-5 fill-white" />
                <KeyRound className="w-3.5 h-3.5 text-amber-200 absolute -bottom-1 -right-1 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                  Landlordr
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  🔥 Tinder for Landlords
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium hidden md:block">
                {mode === "landlord"
                  ? "Screening prospective tenants with 750+ credit scores & zero drama"
                  : "Browsing verified pads & landlords who actually fix sinks"}
              </p>
            </div>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200/80 shadow-inner">
            <button
              onClick={() => setMode("landlord")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === "landlord"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Landlord Mode</span>
            </button>
            <button
              onClick={() => setMode("tenant")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === "tenant"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Tenant Mode</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFilter}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200 text-xs font-medium flex items-center gap-1.5"
              title="Filters & Preferences"
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span className="hidden lg:inline text-xs">Filters</span>
            </button>

            <button
              onClick={onOpenCreate}
              className="p-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors border border-rose-200 text-xs font-medium flex items-center gap-1.5"
              title={mode === "landlord" ? "Add New Property Listing" : "Create Tenant Profile"}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden lg:inline text-xs">
                {mode === "landlord" ? "+ New Listing" : "+ Tenant Profile"}
              </span>
            </button>

            <button
              onClick={onResetData}
              disabled={isResetting}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
              title="Reset Demo Data / Deck"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? "animate-spin text-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-center space-x-6 border-t border-gray-100 py-1.5">
          <button
            onClick={() => setActiveTab("swipe")}
            className={`flex items-center gap-2 py-1.5 px-3 border-b-2 text-sm font-semibold transition-all ${
              activeTab === "swipe"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Swipe Deck</span>
          </button>

          <button
            onClick={() => setActiveTab("matches")}
            className={`flex items-center gap-2 py-1.5 px-3 border-b-2 text-sm font-semibold transition-all relative ${
              activeTab === "matches"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Matches & Chat</span>
            {matchesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-pulse">
                {matchesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-2 py-1.5 px-3 border-b-2 text-sm font-semibold transition-all ${
              activeTab === "quiz"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Vibe Check Quiz</span>
          </button>
        </div>
      </div>
    </header>
  );
}
