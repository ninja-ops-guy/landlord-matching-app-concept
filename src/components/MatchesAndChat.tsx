"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Calendar,
  FileText,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Clock,
  MapPin,
  Building2,
  User,
  Lightbulb,
  FileSignature
} from "lucide-react";
import { Match, Message, AppMode } from "@/types";
import { LeaseSigningModal } from "./LeaseSigningModal";

interface MatchesAndChatProps {
  matches: Match[];
  selectedMatchId: number | null;
  onSelectMatch: (matchId: number) => void;
  mode: AppMode;
  onRefreshMatches: () => void;
}

export function MatchesAndChat({
  matches,
  selectedMatchId,
  onSelectMatch,
  mode,
  onRefreshMatches,
}: MatchesAndChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [filterType, setFilterType] = useState<"all" | "tours" | "offers" | "signed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Tour Proposal Modal state
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [tourDate, setTourDate] = useState("Saturday, 11:00 AM");

  // Lease Proposal Modal state
  const [isLeaseOfferModalOpen, setIsLeaseOfferModalOpen] = useState(false);
  const [leaseRent, setLeaseRent] = useState(3200);
  const [leaseDeposit, setLeaseDeposit] = useState(3200);
  const [leaseDate, setLeaseDate] = useState("1st of next month");

  // Sign lease modal
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);

  // Quick icebreakers toggle
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMatch = matches.find((m) => m.id === selectedMatchId) || matches[0] || null;

  // Load messages when activeMatch changes
  useEffect(() => {
    if (!activeMatch) return;
    let isMounted = true;
    setIsLoadingMessages(true);

    fetch(`/api/messages?matchId=${activeMatch.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setMessages(Array.isArray(data) ? data : []);
          setIsLoadingMessages(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        if (isMounted) setIsLoadingMessages(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeMatch?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeMatch || isSending) return;

    setIsSending(true);
    setInputText("");
    setShowIcebreakers(false);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: activeMatch.id,
          senderRole: mode,
          senderName:
            mode === "landlord"
              ? activeMatch.landlord?.name || "Landlord"
              : activeMatch.tenant?.name || "Tenant",
          text,
          messageType: "text",
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        onRefreshMatches();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTourInvite = async () => {
    if (!activeMatch) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: activeMatch.id,
          senderRole: mode,
          senderName:
            mode === "landlord"
              ? activeMatch.landlord?.name || "Landlord"
              : activeMatch.tenant?.name || "Tenant",
          text: `📅 Official In-Person Tour Proposed: ${tourDate} at ${activeMatch.listing?.title || "the apartment"}.`,
          messageType: "tour_invite",
          metadata: {
            tourDate,
            address: `${activeMatch.listing?.neighborhood || "Downtown"}, ${activeMatch.listing?.city || "New York"}`,
          },
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setIsTourModalOpen(false);
        onRefreshMatches();
      }
    } catch (err) {
      console.error("Error sending tour invite:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendLeaseOffer = async () => {
    if (!activeMatch) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: activeMatch.id,
          senderRole: "landlord",
          senderName: activeMatch.landlord?.name || "Landlord",
          text: `📄 Official Lease Proposal: $${leaseRent.toLocaleString()}/mo with $${leaseDeposit.toLocaleString()} security deposit. Start date: ${leaseDate}. Ready for review & countersignature!`,
          messageType: "lease_offer",
          metadata: {
            rent: leaseRent,
            deposit: leaseDeposit,
            leaseStartDate: leaseDate,
            leaseTerm: "12 Months",
          },
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setIsLeaseOfferModalOpen(false);
        onRefreshMatches();
      }
    } catch (err) {
      console.error("Error sending lease offer:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    if (filterType === "tours" && m.status !== "tour_scheduled") return false;
    if (filterType === "offers" && m.status !== "lease_offered") return false;
    if (filterType === "signed" && m.status !== "lease_signed") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const tenantMatch = m.tenant?.name?.toLowerCase().includes(q);
      const listingMatch = m.listing?.title?.toLowerCase().includes(q);
      const landlordMatch = m.landlord?.name?.toLowerCase().includes(q);
      return tenantMatch || listingMatch || landlordMatch;
    }
    return true;
  });

  const icebreakerOptions =
    mode === "landlord"
      ? [
          "Would you like to schedule an in-person walk-through this weekend?",
          "Can you confirm your preferred move-in date?",
          "Your 790+ credit score looks fantastic. Do you have any pets?",
          "I'd love to share the building's digital lease agreement for review."
        ]
      : [
          "Hi! How is the water pressure and natural light in the living room?",
          "Is the apartment available for an in-person tour this week?",
          "I have my proof of income and renter's insurance ready to share!",
          "Are utilities and high-speed internet included in the monthly rent?"
        ];

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 w-full h-[calc(100vh-140px)] min-h-[580px] flex gap-4">
      {/* Matches Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-white rounded-3xl border border-gray-200/80 shadow-md flex flex-col overflow-hidden shrink-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-gray-900 text-lg flex items-center gap-1.5">
              <span>Lease Matches</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-bold">
                {matches.length}
              </span>
            </h2>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search matches or pads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-semibold">
            <button
              onClick={() => setFilterType("all")}
              className={`px-2.5 py-1 rounded-full transition-colors shrink-0 ${
                filterType === "all" ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("tours")}
              className={`px-2.5 py-1 rounded-full transition-colors shrink-0 ${
                filterType === "tours" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tours
            </button>
            <button
              onClick={() => setFilterType("offers")}
              className={`px-2.5 py-1 rounded-full transition-colors shrink-0 ${
                filterType === "offers" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Lease Offers
            </button>
            <button
              onClick={() => setFilterType("signed")}
              className={`px-2.5 py-1 rounded-full transition-colors shrink-0 ${
                filterType === "signed" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Signed 🔑
            </button>
          </div>
        </div>

        {/* Matches List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredMatches.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              No matches found. Swipe right on more cards to spark new matches!
            </div>
          ) : (
            filteredMatches.map((m) => {
              const isSelected = activeMatch?.id === m.id;
              const otherAvatar =
                mode === "landlord"
                  ? m.tenant?.avatar || "https://images.pexels.com/photos/7752822/pexels-photo-7752822.jpeg"
                  : m.landlord?.avatar || m.listing?.images?.[0] || "https://images.pexels.com/photos/40035694/pexels-photo-40035694.jpeg";
              const otherName = mode === "landlord" ? m.tenant?.name || "Applicant" : m.landlord?.name || "Landlord";
              const padTitle = m.listing?.title || "Apartment";

              const getStatusBadge = () => {
                if (m.status === "lease_signed") {
                  return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700">Lease Signed 🔑</span>;
                }
                if (m.status === "lease_offered") {
                  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Lease Proposed 📄</span>;
                }
                if (m.status === "tour_scheduled") {
                  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Tour Booked 📅</span>;
                }
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">New Match 🔥</span>;
              };

              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMatch(m.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? "bg-rose-50/70 border-l-4 border-rose-500" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={otherAvatar}
                      alt={otherName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    {m.status === "lease_signed" && (
                      <span className="absolute -top-1 -right-1 text-xs">🔑</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                        {otherName}
                      </span>
                      {getStatusBadge()}
                    </div>

                    <div className="text-[11px] text-gray-500 truncate font-medium">
                      {padTitle}
                    </div>

                    <div className="text-[11px] text-gray-400 truncate mt-1">
                      {m.lastMessage?.text || "Started conversation"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Pane */}
      {activeMatch ? (
        <div className="flex-1 bg-white rounded-3xl border border-gray-200/80 shadow-md flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 border-b border-gray-100 bg-white flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  mode === "landlord"
                    ? activeMatch.tenant?.avatar || "https://images.pexels.com/photos/7752822/pexels-photo-7752822.jpeg"
                    : activeMatch.landlord?.avatar || "https://images.pexels.com/photos/40035694/pexels-photo-40035694.jpeg"
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                    {mode === "landlord" ? activeMatch.tenant?.name : activeMatch.landlord?.name}
                  </h3>
                  {mode === "landlord" && activeMatch.tenant && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      FICO {activeMatch.tenant.creditScore}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 truncate max-w-[220px] sm:max-w-xs font-medium">
                  {activeMatch.listing?.title} (${activeMatch.listing?.rent}/mo)
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setIsTourModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold transition-colors flex items-center gap-1"
                title="Propose Tour Date & Time"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Propose Tour</span>
              </button>

              <button
                onClick={() => setIsLeaseOfferModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 text-xs font-bold transition-colors flex items-center gap-1"
                title="Draft Lease Proposal"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send Lease</span>
              </button>

              <button
                onClick={() => setIsSignModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-xs transition-all flex items-center gap-1"
                title="Open Electronic Lease Signing"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>{activeMatch.status === "lease_signed" ? "View Signed Lease 🔑" : "Sign Lease ✍️"}</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
            {isLoadingMessages ? (
              <div className="text-center text-xs text-gray-400 py-10">Loading conversation...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                No messages yet. Say hello or send a tour invitation!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderRole === mode;

                // Special Interactive Message Cards
                if (msg.messageType === "tour_invite") {
                  return (
                    <div key={msg.id} className="max-w-md mx-auto my-3">
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-4 shadow-md text-emerald-950">
                        <div className="flex items-center gap-2 mb-2 font-black text-emerald-800 text-xs uppercase tracking-wide">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span>Official Tour Invitation</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold mb-3">{msg.text}</p>
                        {msg.metadata && (
                          <div className="bg-white/80 rounded-xl p-2.5 text-xs text-gray-700 mb-3 space-y-1">
                            <div><strong>Proposed Time:</strong> {msg.metadata.tourDate} {msg.metadata.tourTime}</div>
                            <div><strong>Address:</strong> {msg.metadata.address}</div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSendMessage("✅ Tour Accepted! Looking forward to seeing the space in person.")}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            Accept Tour Time
                          </button>
                          <button
                            onClick={() => handleSendMessage("Can we reschedule to an hour earlier?")}
                            className="py-2 px-3 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-semibold text-xs hover:bg-emerald-50 transition-colors"
                          >
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (msg.messageType === "lease_offer") {
                  return (
                    <div key={msg.id} className="max-w-md mx-auto my-3">
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-4 shadow-md text-amber-950">
                        <div className="flex items-center gap-2 mb-2 font-black text-amber-800 text-xs uppercase tracking-wide">
                          <FileText className="w-4 h-4 text-amber-600" />
                          <span>Official Lease Proposal Draft</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold mb-3">{msg.text}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsSignModalOpen(true)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                          >
                            <FileSignature className="w-4 h-4" />
                            <span>Review & E-Sign Lease Agreement ✍️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (msg.messageType === "lease_signed") {
                  return (
                    <div key={msg.id} className="max-w-md mx-auto my-3">
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-3xl p-4 shadow-lg text-purple-950 text-center">
                        <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center mx-auto mb-2 font-black">
                          🔑
                        </div>
                        <h4 className="font-black text-sm uppercase tracking-wide text-purple-900 mb-1">
                          LEASE SIGNED & VALIDATED!
                        </h4>
                        <p className="text-xs text-purple-800 font-medium">{msg.text}</p>
                      </div>
                    </div>
                  );
                }

                // Standard Chat Bubble
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="text-[10px] text-gray-400 font-semibold mb-1 px-1">
                      {msg.senderName}
                    </div>
                    <div
                      className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isMe
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-xs"
                          : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Icebreakers Panel */}
          {showIcebreakers && (
            <div className="bg-amber-50/90 border-t border-amber-200 p-3 space-y-1.5">
              <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Rental Icebreaker Suggestions:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {icebreakerOptions.map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(text)}
                    className="text-left text-xs bg-white hover:bg-amber-100 text-gray-700 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors"
                  >
                    &quot;{text}&quot;
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setShowIcebreakers((prev) => !prev)}
                className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                  showIcebreakers
                    ? "bg-amber-100 border-amber-300 text-amber-800"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
                title="Rental Icebreakers"
              >
                <Lightbulb className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  mode === "landlord"
                    ? "Message applicant (e.g. 'Love the credit score, would you like to tour?')..."
                    : "Message landlord (e.g. 'Is parking included? Can I move in on the 1st?')..."
                }
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className={`p-2.5 rounded-xl text-white font-bold transition-all ${
                  !inputText.trim() || isSending
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-500 to-pink-500 shadow-md shadow-rose-200 hover:scale-105 active:scale-95"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-3xl border border-gray-200/80 shadow-md flex flex-col items-center justify-center p-8 text-center text-gray-400">
          <Sparkles className="w-12 h-12 text-rose-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">Select a Lease Match</h3>
          <p className="text-xs max-w-xs">
            Choose an applicant or property from the left sidebar to start chatting, arrange tours, or execute a digital lease.
          </p>
        </div>
      )}

      {/* Tour Proposal Modal */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-1">Propose Walk-through Tour</h3>
            <p className="text-xs text-gray-500 mb-4">Set preferred date & time for the applicant to inspect the pad.</p>
            <div className="space-y-3 mb-5">
              <label className="block text-xs font-bold text-gray-700">Date & Time</label>
              <input
                type="text"
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                placeholder="e.g. Saturday, 11:30 AM"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsTourModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTourInvite}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lease Offer Draft Modal */}
      {isLeaseOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-1">Generate Official Lease Offer</h3>
            <p className="text-xs text-gray-500 mb-4">Customize the terms to send for electronic signing.</p>
            <div className="space-y-3 mb-5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Monthly Rent ($)</label>
                <input
                  type="number"
                  value={leaseRent}
                  onChange={(e) => setLeaseRent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Security Deposit ($)</label>
                <input
                  type="number"
                  value={leaseDeposit}
                  onChange={(e) => setLeaseDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Move-in Date</label>
                <input
                  type="text"
                  value={leaseDate}
                  onChange={(e) => setLeaseDate(e.target.value)}
                  placeholder="e.g. June 1st"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsLeaseOfferModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSendLeaseOffer}
                className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
              >
                Send Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Lease Signing Modal */}
      <LeaseSigningModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        match={activeMatch}
        onLeaseSigned={() => {
          onRefreshMatches();
        }}
      />
    </div>
  );
}
