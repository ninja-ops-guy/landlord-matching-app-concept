"use client";
import { localFetch } from "@/lib/local-fetch";


import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Header } from "@/components/Header";
import { SwipeDeck } from "@/components/SwipeDeck";
import { DossierModal } from "@/components/DossierModal";
import { MatchCelebrationModal } from "@/components/MatchCelebrationModal";
import { MatchesAndChat } from "@/components/MatchesAndChat";
import { VibeCheckQuiz } from "@/components/VibeCheckQuiz";
import { CreateModal } from "@/components/CreateModal";
import { FilterModal, FilterState } from "@/components/FilterModal";
import { AppMode, ActiveTab, Tenant, Listing, Landlord, Match } from "@/types";
import { Sparkles, Building2, User, Flame, ArrowRight, ShieldCheck, Heart } from "lucide-react";

const DEFAULT_FILTERS: FilterState = {
  city: "all",
  maxRent: 4500,
  minCreditScore: 680,
  bedrooms: "any",
  petFriendlyOnly: false,
};

export default function Home() {
  const [mode, setMode] = useState<AppMode>("landlord");
  const [activeTab, setActiveTab] = useState<ActiveTab>("swipe");

  // Data
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Deck Key for force-refreshing swipe stack
  const [deckKey, setDeckKey] = useState(0);

  // Filters
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [dossierItem, setDossierItem] = useState<Tenant | Listing | null>(null);

  // Match celebration state
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    tenant: Tenant | null;
    listing: Listing | null;
    landlord: Landlord | null;
    match: Match | null;
  }>({ tenant: null, listing: null, landlord: null, match: null });

  // Selected match for chat
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  // Fetch all initial data
  const loadData = useCallback(async () => {
    try {
      const [tenantsRes, listingsRes, landlordsRes, matchesRes] = await Promise.all([
        localFetch("/api/tenants").then((r) => r.json()),
        localFetch("/api/listings").then((r) => r.json()),
        localFetch("/api/landlords").then((r) => r.json()),
        localFetch("/api/matches").then((r) => r.json()),
      ]);

      if (Array.isArray(tenantsRes)) setTenants(tenantsRes);
      if (Array.isArray(listingsRes)) setListings(listingsRes);
      if (Array.isArray(landlordsRes)) setLandlords(landlordsRes);
      if (Array.isArray(matchesRes)) {
        setMatches(matchesRes);
        if (matchesRes.length > 0) setSelectedMatchId(current => current ?? matchesRes[0].id);
      }
    } catch (err) {
      console.error("Error loading Landlordr data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load asynchronous browser data on mount; state updates follow the awaited request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  // Reset database to seed
  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await localFetch("/api/reset", { method: "POST" });
      await loadData();
      setDeckKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error resetting data:", err);
    } finally {
      setIsResetting(false);
    }
  };

  // Filtered tenants for Landlord Mode
  const filteredTenants = useMemo(() => {
    return tenants.filter((t) => {
      if (filters.city !== "all" && t.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
      if (t.creditScore < filters.minCreditScore) {
        return false;
      }
      if (filters.petFriendlyOnly && t.petInfo.toLowerCase().includes("no pet")) {
        return false;
      }
      return true;
    });
  }, [tenants, filters]);

  // Filtered listings for Tenant Mode
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      if (filters.city !== "all" && l.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
      if (l.rent > filters.maxRent) {
        return false;
      }
      if (filters.bedrooms !== "any") {
        const bedNum = Number(filters.bedrooms);
        if (filters.bedrooms === "2") {
          if (l.bedrooms < 2) return false;
        } else {
          if (l.bedrooms !== bedNum) return false;
        }
      }
      return true;
    });
  }, [listings, filters]);

  // Swipe Handler
  const handleSwipe = async (action: "like" | "pass" | "superlike", item: Tenant | Listing) => {
    let tenantId: number;
    let listingId: number;

    if (mode === "landlord") {
      tenantId = (item as Tenant).id;
      // Pair with the first active listing or listing 1
      listingId = listings[0]?.id || 1;
    } else {
      listingId = (item as Listing).id;
      // Current tenant profile is tenant 1 (Elena)
      tenantId = tenants[0]?.id || 1;
    }

    try {
      const res = await localFetch("/api/swipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          swiperRole: mode,
          tenantId,
          listingId,
          action,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.isMatch) {
          const currentTenant = tenants.find((t) => t.id === tenantId) || result.tenant || null;
          const currentListing = listings.find((l) => l.id === listingId) || result.listing || null;
          const currentLandlord =
            landlords.find((ld) => ld.id === currentListing?.landlordId) ||
            currentListing?.landlord ||
            result.landlord ||
            null;

          setCelebrationData({
            tenant: currentTenant,
            listing: currentListing,
            landlord: currentLandlord,
            match: result.match,
          });
          setIsCelebrationOpen(true);

          // Refresh matches
          const updatedMatchesRes = await localFetch("/api/matches");
          if (updatedMatchesRes.ok) {
            const updated = await updatedMatchesRes.json();
            setMatches(updated);
          }
        }
      }
    } catch (err) {
      console.error("Error executing swipe:", err);
    }
  };

  const handleOpenDossier = (item: Tenant | Listing) => {
    setDossierItem(item);
    setIsDossierOpen(true);
  };

  const handleDossierAction = (action: "like" | "pass", item: Tenant | Listing) => {
    handleSwipe(action, item);
  };

  return (
    <div className="min-h-screen flex flex-col bg-radial from-rose-50/40 via-slate-50 to-slate-100">
      {/* Top Header */}
      <Header
        mode={mode}
        setMode={(newMode) => {
          setMode(newMode);
          setDeckKey((prev) => prev + 1);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchesCount={matches.length}
        onOpenFilter={() => setIsFilterOpen(true)}
        onOpenCreate={() => setIsCreateOpen(true)}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Hero Mode Banner */}
      <div className="bg-white/80 border-b border-gray-100 py-2.5 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-xl font-bold flex items-center gap-1 ${
                mode === "landlord" ? "bg-rose-100 text-rose-700" : "bg-purple-100 text-purple-700"
              }`}
            >
              {mode === "landlord" ? <Building2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              <span>
                {mode === "landlord" ? "Active Landlord Persona: Arthur Pendelton" : "Active Tenant Persona: Elena Chen"}
              </span>
            </span>
            <span className="text-gray-500 hidden md:inline">
              {mode === "landlord"
                ? "Swipe right to approve applicants & auto-schedule tours"
                : "Swipe right on pads & landlord quirks you love"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>100% Verified Plaid Income</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Instant Tour Match</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main App Body */}
      <main className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-3 animate-pulse">
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">Loading Landlordr Deck...</h3>
            <p className="text-xs text-gray-400 mt-1">Checking FICO scores & radiator status</p>
          </div>
        ) : (
          <>
            {/* SWIPE TAB */}
            {activeTab === "swipe" && (
              <SwipeDeck
                key={deckKey}
                mode={mode}
                tenants={filteredTenants}
                listings={filteredListings}
                onSwipe={handleSwipe}
                onOpenDossier={handleOpenDossier}
                onOpenFilter={() => setIsFilterOpen(true)}
                onResetDeck={() => setDeckKey((prev) => prev + 1)}
              />
            )}

            {/* MATCHES & CHAT TAB */}
            {activeTab === "matches" && (
              <MatchesAndChat
                matches={matches}
                selectedMatchId={selectedMatchId}
                onSelectMatch={setSelectedMatchId}
                mode={mode}
                onRefreshMatches={async () => {
                  const res = await localFetch("/api/matches");
                  if (res.ok) setMatches(await res.json());
                }}
              />
            )}

            {/* VIBE CHECK QUIZ TAB */}
            {activeTab === "quiz" && (
              <VibeCheckQuiz
                onComplete={() => {
                  setActiveTab("swipe");
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-gray-200/80 bg-white/70 py-4 px-4 text-center text-xs text-gray-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-gray-700">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Landlordr — Dating App for Landlords & Dream Tenants</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400 text-[11px]">
            <span>Zero Wipes Flushed Guarantee™</span>
            <span>•</span>
            <span>40x Income Verified</span>
            <span>•</span>
            <span>Instant E-Sign</span>
          </div>
        </div>
      </footer>

      {/* Full Rental Dossier Modal */}
      <DossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        item={dossierItem}
        onAction={handleDossierAction}
      />

      {/* Celebration Match Modal */}
      <MatchCelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        tenant={celebrationData.tenant}
        listing={celebrationData.listing}
        landlord={celebrationData.landlord}
        match={celebrationData.match}
        onOpenChat={(matchId) => {
          setSelectedMatchId(matchId);
          setActiveTab("matches");
        }}
        onProposeLease={(matchId) => {
          setSelectedMatchId(matchId);
          setActiveTab("matches");
        }}
      />

      {/* Filter Preferences Drawer */}
      {isFilterOpen && <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setDeckKey((prev) => prev + 1);
        }}
        onResetFilters={() => {
          setFilters(DEFAULT_FILTERS);
          setDeckKey((prev) => prev + 1);
        }}
      />}

      {/* Create Listing / Tenant Modal */}
      <CreateModal key={mode}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        mode={mode}
        onTenantCreated={(newTenant) => {
          setTenants((prev) => [newTenant, ...prev]);
          setDeckKey((prev) => prev + 1);
        }}
        onListingCreated={(newListing) => {
          setListings((prev) => [newListing, ...prev]);
          setDeckKey((prev) => prev + 1);
        }}
      />
    </div>
  );
}
