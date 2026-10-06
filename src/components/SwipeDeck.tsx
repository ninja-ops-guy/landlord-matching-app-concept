"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Heart, Star, RotateCcw, Zap, SlidersHorizontal, Sparkles } from "lucide-react";
import { Tenant, Listing, AppMode } from "@/types";
import { TenantCard } from "./TenantCard";
import { ListingCard } from "./ListingCard";

interface SwipeDeckProps {
  mode: AppMode;
  tenants: Tenant[];
  listings: Listing[];
  onSwipe: (action: "like" | "pass" | "superlike", item: Tenant | Listing) => void;
  onOpenDossier: (item: Tenant | Listing) => void;
  onOpenFilter: () => void;
  onResetDeck: () => void;
}

export function SwipeDeck({
  mode,
  tenants,
  listings,
  onSwipe,
  onOpenDossier,
  onOpenFilter,
  onResetDeck,
}: SwipeDeckProps) {
  // We keep track of current index in the deck
  const items = mode === "landlord" ? tenants : listings;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState<number[]>([]);
  const [animatingOut, setAnimatingOut] = useState<"like" | "pass" | "superlike" | null>(null);

  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const currentItem = items[currentIndex];
  const nextItem = items[currentIndex + 1];

  const handleSwipeAction = useCallback((action: "like" | "pass" | "superlike") => {
    if (!currentItem || animatingOut) return;
    setAnimatingOut(action);

    setTimeout(() => {
      onSwipe(action, currentItem);
      setSwipeHistory((prev) => [...prev, currentIndex]);
      setCurrentIndex((prev) => prev + 1);
      setAnimatingOut(null);
      setDragOffset({ x: 0, y: 0 });
    }, 250);
  }, [currentItem, animatingOut, currentIndex, onSwipe]);

  const handleUndo = useCallback(() => {
    if (swipeHistory.length === 0 || currentIndex === 0) return;
    const lastIdx = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastIdx);
  }, [swipeHistory, currentIndex]);

  // Drag / Pointer Events
  const onPointerDown = (e: React.PointerEvent) => {
    if (animatingOut) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || animatingOut) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const onPointerUp = () => {
    if (!isDragging || animatingOut) return;
    setIsDragging(false);

    const threshold = 110;
    if (dragOffset.x > threshold) {
      handleSwipeAction("like");
    } else if (dragOffset.x < -threshold) {
      handleSwipeAction("pass");
    } else if (dragOffset.y < -threshold) {
      handleSwipeAction("superlike");
    } else {
      // Spring back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") handleSwipeAction("like");
      if (e.key === "ArrowLeft") handleSwipeAction("pass");
      if (e.key === "ArrowUp") handleSwipeAction("superlike");
      if (e.key === "z" && (e.ctrlKey || e.metaKey)) handleUndo();
      if (e.key === " " || e.key === "i") {
        if (currentItem) onOpenDossier(currentItem);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentItem, handleSwipeAction, handleUndo, onOpenDossier]);

  // Compute visual transform styles
  const getCardStyle = () => {
    if (animatingOut === "like") {
      return {
        transform: "translateX(120vw) rotate(25deg)",
        transition: "transform 0.3s ease-in-out, opacity 0.3s",
        opacity: 0,
      };
    }
    if (animatingOut === "pass") {
      return {
        transform: "translateX(-120vw) rotate(-25deg)",
        transition: "transform 0.3s ease-in-out, opacity 0.3s",
        opacity: 0,
      };
    }
    if (animatingOut === "superlike") {
      return {
        transform: "translateY(-120vh) rotate(5deg)",
        transition: "transform 0.3s ease-in-out, opacity 0.3s",
        opacity: 0,
      };
    }
    if (isDragging) {
      const rotation = dragOffset.x * 0.08;
      return {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        transition: "none",
        cursor: "grabbing",
      };
    }
    return {
      transform: "translate(0px, 0px) rotate(0deg)",
      transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      cursor: "grab",
    };
  };

  // Stamp opacities
  const likeOpacity = Math.min(Math.max(dragOffset.x / 100, 0), 1);
  const passOpacity = Math.min(Math.max(-dragOffset.x / 100, 0), 1);
  const superOpacity = Math.min(Math.max(-dragOffset.y / 100, 0), 1);

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-6 px-3 max-w-md mx-auto w-full">
      {/* Perspective Info Pill */}
      <div className="mb-3 flex items-center justify-between w-full px-2 text-xs text-gray-500 font-medium">
        <span>
          {mode === "landlord"
            ? `Reviewing Applicants (${currentIndex + 1} of ${items.length})`
            : `Exploring Available Pads (${currentIndex + 1} of ${items.length})`}
        </span>
        <span className="hidden sm:inline text-gray-400">
          Keys: ← Pass • → Like • ↑ Super • Space Details
        </span>
      </div>

      {/* Card Deck Container */}
      <div className="relative w-full h-[580px] sm:h-[620px] max-w-[420px]">
        {currentItem ? (
          <>
            {/* Background Card (preview of next in stack) */}
            {nextItem && (
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none transition-all duration-300"
                style={{
                  transform: "scale(0.94) translateY(16px)",
                  opacity: 0.8,
                  zIndex: 1,
                }}
              >
                {mode === "landlord" ? (
                  <TenantCard tenant={nextItem as Tenant} onOpenDossier={onOpenDossier} />
                ) : (
                  <ListingCard listing={nextItem as Listing} onOpenDossier={onOpenDossier} />
                )}
              </div>
            )}

            {/* Foreground Active Card */}
            <div
              ref={cardRef}
              className="absolute inset-0 z-10 touch-none"
              style={getCardStyle()}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {/* Dynamic Tinder Stamp: LIKE / APPROVE */}
              <div
                className="absolute top-12 left-8 z-30 pointer-events-none transform -rotate-12 border-4 border-emerald-500 text-emerald-500 font-black text-3xl sm:text-4xl px-4 py-2 rounded-2xl tracking-wider uppercase bg-emerald-950/40 backdrop-blur-xs shadow-xl transition-opacity"
                style={{
                  opacity: animatingOut === "like" ? 1 : likeOpacity,
                }}
              >
                {mode === "landlord" ? "APPROVE 💚" : "LOVE IT! 🔥"}
              </div>

              {/* Dynamic Tinder Stamp: NOPE / PASS */}
              <div
                className="absolute top-12 right-8 z-30 pointer-events-none transform rotate-12 border-4 border-rose-500 text-rose-500 font-black text-3xl sm:text-4xl px-4 py-2 rounded-2xl tracking-wider uppercase bg-rose-950/40 backdrop-blur-xs shadow-xl transition-opacity"
                style={{
                  opacity: animatingOut === "pass" ? 1 : passOpacity,
                }}
              >
                PASS ❌
              </div>

              {/* Dynamic Tinder Stamp: SUPER LEASE */}
              <div
                className="absolute bottom-32 inset-x-0 mx-auto w-fit z-30 pointer-events-none border-4 border-blue-400 text-blue-400 font-black text-2xl sm:text-3xl px-6 py-2 rounded-2xl tracking-wider uppercase bg-blue-950/70 backdrop-blur-xs shadow-xl transition-opacity"
                style={{
                  opacity: animatingOut === "superlike" ? 1 : superOpacity,
                }}
              >
                ⚡ FAST TRACK!
              </div>

              {/* Actual Card Inner */}
              {mode === "landlord" ? (
                <TenantCard tenant={currentItem as Tenant} onOpenDossier={onOpenDossier} />
              ) : (
                <ListingCard listing={currentItem as Listing} onOpenDossier={onOpenDossier} />
              )}
            </div>
          </>
        ) : (
          /* Empty Deck State */
          <div className="w-full h-full rounded-3xl bg-white border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center shadow-lg">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
              <Sparkles className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              You&apos;re All Caught Up!
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
              {mode === "landlord"
                ? "You have reviewed all current applicant dossiers! Check your matches or reset the deck to swipe again."
                : "You have browsed every rental listing in the area! Check your matches and scheduled tours."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={onResetDeck}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-md shadow-rose-200 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Deck</span>
              </button>
              <button
                onClick={onOpenFilter}
                className="py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Preferences</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tinder Action Buttons Bar */}
      {currentItem && (
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-5 z-20">
          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={swipeHistory.length === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-white border border-amber-200 shadow-md text-amber-500 transition-all ${
              swipeHistory.length === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:scale-110 active:scale-95 hover:bg-amber-50"
            }`}
            title="Rewind / Undo Last Swipe"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Pass / Nope Button */}
          <button
            onClick={() => handleSwipeAction("pass")}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-white border-2 border-rose-200 shadow-lg text-rose-500 hover:bg-rose-50 hover:scale-110 active:scale-95 transition-all"
            title="Pass (Swipe Left)"
          >
            <X className="w-8 h-8 stroke-[3]" />
          </button>

          {/* Super-Lease / Fast-Track Button */}
          <button
            onClick={() => handleSwipeAction("superlike")}
            className="w-13 h-13 rounded-full flex items-center justify-center bg-white border-2 border-blue-200 shadow-lg text-blue-500 hover:bg-blue-50 hover:scale-110 active:scale-95 transition-all"
            title="Super-Lease Fast Track (Swipe Up)"
          >
            <Star className="w-6 h-6 fill-blue-500 text-blue-500" />
          </button>

          {/* Match / Approve Button */}
          <button
            onClick={() => handleSwipeAction("like")}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-white border-2 border-emerald-200 shadow-lg text-emerald-500 hover:bg-emerald-50 hover:scale-110 active:scale-95 transition-all"
            title={mode === "landlord" ? "Approve Applicant (Swipe Right)" : "Like Property (Swipe Right)"}
          >
            <Heart className="w-8 h-8 fill-emerald-500 text-emerald-500" />
          </button>

          {/* Fast-Track Lightning */}
          <button
            onClick={() => handleSwipeAction("superlike")}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-purple-200 shadow-md text-purple-500 hover:bg-purple-50 hover:scale-110 active:scale-95 transition-all"
            title="Instant Match Priority Boost"
          >
            <Zap className="w-5 h-5 fill-purple-500" />
          </button>
        </div>
      )}
    </div>
  );
}
