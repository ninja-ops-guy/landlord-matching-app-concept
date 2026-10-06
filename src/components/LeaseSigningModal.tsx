"use client";
import { localFetch } from "@/lib/local-fetch";


import React, { useRef, useState } from "react";
import { X, CheckCircle2, FileSignature, ShieldCheck, Download, Sparkles, Building, Calendar, DollarSign } from "lucide-react";
import { Match } from "@/types";
import { fireMatchConfetti } from "@/lib/confetti";

interface LeaseSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  onLeaseSigned: (matchId: number) => void;
}

export function LeaseSigningModal({ isOpen, onClose, match, onLeaseSigned }: LeaseSigningModalProps) {
  const [typedName, setTypedName] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signedSuccess, setSignedSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  if (!isOpen || !match) return null;

  const tenant = match.tenant;
  const landlord = match.landlord;
  const listing = match.listing;

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e293b";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSign = async () => {
    if (!agreedTerms) return;
    setIsSubmitting(true);
    try {
      const res = await localFetch(`/api/matches/${match.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signLease: true,
          signerRole: "tenant",
          signerName: typedName || tenant?.name || "Tenant",
        }),
      });

      if (res.ok) {
        setSignedSuccess(true);
        fireMatchConfetti();
        onLeaseSigned(match.id);
      }
    } catch (err) {
      console.error("Error signing lease:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-gray-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Standard Residential Lease Agreement</h3>
              <p className="text-xs text-slate-400">Local demo — no legal document is executed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-gray-800 text-xs sm:text-sm">
          {signedSuccess || match.status === "lease_signed" ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                DEMO SIGNATURE SAVED! 🎉
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                A simulated signature for {tenant?.name || "Elena"} has been saved in this browser. This preview does not execute a lease, transfer funds, or notify a landlord.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md"
                >
                  Return to Matches & Chat
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Document Preamble Box */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Sample Lease Preview</span>
                </div>
                <p>
                  This fictional agreement demonstrates the signing flow. Saving a signature only updates this browser demo.
                </p>
              </div>

              {/* Parties & Property Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">LANDLORD (LESSOR)</div>
                  <div className="font-black text-gray-900 text-sm mt-0.5">{landlord?.name || "Landlord Arthur"}</div>
                  <div className="text-gray-500 text-xs">Response Rating: ★ {landlord?.rating || "4.98"}</div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase">TENANT (LESSEE)</div>
                  <div className="font-black text-gray-900 text-sm mt-0.5">{tenant?.name || "Elena Chen"}</div>
                  <div className="text-gray-500 text-xs">FICO Score: {tenant?.creditScore || "792"} Prime</div>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-gray-200">
                  <div className="text-[11px] font-bold text-gray-400 uppercase">DEMISED PREMISES</div>
                  <div className="font-bold text-gray-900 text-sm">{listing?.title || "Modern Brownstone Residence"}</div>
                  <div className="text-gray-500 text-xs">{listing?.neighborhood || "Park Slope"}, {listing?.city || "New York"}</div>
                </div>
              </div>

              {/* Financial Terms */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="text-[11px] text-emerald-800 font-bold">MONTHLY RENT</div>
                  <div className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5">
                    ${(match.leaseMonthlyRent || listing?.rent || 3200).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="text-[11px] text-blue-800 font-bold">SECURITY ESCROW</div>
                  <div className="text-lg sm:text-xl font-black text-blue-600 mt-0.5">
                    ${(match.leaseDeposit || listing?.deposit || 3200).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="text-[11px] text-purple-800 font-bold">TERM</div>
                  <div className="text-lg sm:text-xl font-black text-purple-600 mt-0.5">12 Months</div>
                </div>
              </div>

              {/* Special Stipulations */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Special Addenda & Landlord House Rules
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Autopay on the 1st of each calendar month.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Pet policy: Approved pets welcome with zero pet rent surcharge.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Quiet hours: 11:00 PM – 7:30 AM (no tap dancing or drum solos).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Landlord provides complimentary sourdough loaf and welcome keys upon move-in!</span>
                  </li>
                </ul>
              </div>

              {/* Signature Section */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">Draw or Type Electronic Signature</label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold"
                  >
                    Clear Canvas
                  </button>
                </div>

                {/* Drawing Canvas */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 overflow-hidden relative cursor-crosshair">
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={120}
                    className="w-full h-28 touch-none block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <div className="absolute bottom-1 right-3 text-[10px] text-gray-400 select-none pointer-events-none">
                    Sign inside box ✍️
                  </div>
                </div>

                {/* Or Type name */}
                <div>
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder={`Or type full legal name (e.g. ${tenant?.name || "Elena Chen"})`}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-serif italic"
                  />
                </div>

                {/* Checkbox agreement */}
                <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs text-gray-600 leading-snug">
                    I understand this is a local preview and want to save a sample signature. No real lease is signed.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!agreedTerms || isSubmitting}
                  onClick={handleSign}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    !agreedTerms || isSubmitting
                      ? "bg-gray-300 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200"
                  }`}
                >
                  <FileSignature className="w-5 h-5" />
                  <span>{isSubmitting ? "Saving sample signature..." : "Save Demo Signature"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
