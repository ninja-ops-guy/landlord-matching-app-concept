"use client";
import { localFetch } from "@/lib/local-fetch";


import React, { useState } from "react";
import { X, Building2, User, Plus, CheckCircle2, Sparkles, Image as ImageIcon } from "lucide-react";
import { AppMode, Tenant, Listing } from "@/types";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AppMode;
  onTenantCreated: (tenant: Tenant) => void;
  onListingCreated: (listing: Listing) => void;
}

export function CreateModal({
  isOpen,
  onClose,
  mode: initialMode,
  onTenantCreated,
  onListingCreated,
}: CreateModalProps) {
  const [createType, setCreateType] = useState<AppMode>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,setError]=useState("");

  // Listing Form State
  const [listingForm, setListingForm] = useState({
    title: "Charming Cobble Hill 1-Bed with Private Terrace",
    neighborhood: "Cobble Hill",
    city: "New York",
    rent: 3100,
    deposit: 3100,
    bedrooms: 1,
    bathrooms: "1.0",
    sqft: 820,
    imageUrl: "https://images.pexels.com/photos/7045907/pexels-photo-7045907.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    description: "Serene tree-lined apartment with high ceilings, private terrace overlooking rear gardens, and updated stainless kitchen.",
    amenities: "Dishwasher, In-unit Washer/Dryer, Private Terrace, Hardwood",
    petPolicy: "Cats & quiet dogs allowed",
  });

  // Tenant Form State
  const [tenantForm, setTenantForm] = useState({
    name: "Alex Morgan",
    age: 29,
    avatar: "https://images.pexels.com/photos/31453972/pexels-photo-31453972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    job: "Senior Product Manager",
    company: "Notion",
    monthlyIncome: 15500,
    creditScore: 785,
    budget: 3400,
    city: "New York",
    bio: "Product manager who travels twice a month. When home, I read, cook quietly, and keep everything in showroom condition.",
    petInfo: "None (just 3 house plants)",
    moveInDate: "Immediate / 1st of month",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (createType === "landlord") {
        const payload = {
          title: listingForm.title,
          neighborhood: listingForm.neighborhood,
          city: listingForm.city,
          rent: Number(listingForm.rent),
          deposit: Number(listingForm.deposit),
          bedrooms: Number(listingForm.bedrooms),
          bathrooms: listingForm.bathrooms,
          sqft: Number(listingForm.sqft),
          images: [listingForm.imageUrl],
          description: listingForm.description,
          amenities: listingForm.amenities.split(",").map((s) => s.trim()),
          petPolicy: listingForm.petPolicy,
          utilities: ["Water & Heat Included", "Trash Included"],
          availableDate: "Next Month",
        };

        const res = await localFetch("/api/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if(!res.ok){const data=await res.json();throw new Error(data.error??"Could not save entry")}
        if (res.ok) {
          const newListing = await res.json();
          onListingCreated(newListing);
          onClose();
        }
      } else {
        const payload = {
          name: tenantForm.name,
          age: Number(tenantForm.age),
          avatar: tenantForm.avatar,
          job: tenantForm.job,
          company: tenantForm.company,
          monthlyIncome: Number(tenantForm.monthlyIncome),
          creditScore: Number(tenantForm.creditScore),
          budget: Number(tenantForm.budget),
          city: tenantForm.city,
          bio: tenantForm.bio,
          petInfo: tenantForm.petInfo,
          moveInDate: tenantForm.moveInDate,
          greenFlags: [
            "Pristine Credit History",
            "Autopay enabled since day one",
            "Non-smoker, clean background"
          ],
          redFlags: ["Will organize spices alphabetically"],
        };

        const res = await localFetch("/api/tenants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if(!res.ok){const data=await res.json();throw new Error(data.error??"Could not save entry")}
        if (res.ok) {
          const newTenant = await res.json();
          onTenantCreated(newTenant);
          onClose();
        }
      }
    } catch (err) {
      setError(err instanceof Error?err.message:"Could not save entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-gray-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="font-black text-gray-900 text-lg">
              {createType === "landlord" ? "Post a New Pad Listing" : "Create Tenant Dossier"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <p role="alert" className="p-4 text-red-600">{error}</p>}
        {/* Type Switcher */}
        <div className="px-6 pt-4">
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setCreateType("landlord")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                createType === "landlord" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Rental Listing</span>
            </button>
            <button
              type="button"
              onClick={() => setCreateType("tenant")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                createType === "tenant" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>Tenant Applicant</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
          {createType === "landlord" ? (
            /* LISTING FORM */
            <>
              <div>
                <label htmlFor="entry-1" className="block font-bold text-gray-700 mb-1">Listing Title</label>
                <input id="entry-1"
                  type="text"
                  required
                  value={listingForm.title}
                  onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="entry-2" className="block font-bold text-gray-700 mb-1">Neighborhood</label>
                  <input id="entry-2"
                    type="text"
                    required
                    value={listingForm.neighborhood}
                    onChange={(e) => setListingForm({ ...listingForm, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="entry-3" className="block font-bold text-gray-700 mb-1">City</label>
                  <input id="entry-3"
                    type="text"
                    required
                    value={listingForm.city}
                    onChange={(e) => setListingForm({ ...listingForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="entry-4" className="block font-bold text-gray-700 mb-1">Rent ($/mo)</label>
                  <input id="entry-4"
                    type="number"
                    required
                    value={listingForm.rent}
                    onChange={(e) => setListingForm({ ...listingForm, rent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="entry-5" className="block font-bold text-gray-700 mb-1">Bedrooms</label>
                  <input id="entry-5"
                    type="number"
                    min="0"
                    max="5"
                    value={listingForm.bedrooms}
                    onChange={(e) => setListingForm({ ...listingForm, bedrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="entry-6" className="block font-bold text-gray-700 mb-1">Sqft</label>
                  <input id="entry-6"
                    type="number"
                    value={listingForm.sqft}
                    onChange={(e) => setListingForm({ ...listingForm, sqft: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="entry-7" className="block font-bold text-gray-700 mb-1">Photo Image URL</label>
                <input id="entry-7"
                  type="url"
                  value={listingForm.imageUrl}
                  onChange={(e) => setListingForm({ ...listingForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="entry-8" className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea id="entry-8"
                  rows={2}
                  value={listingForm.description}
                  onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="entry-9" className="block font-bold text-gray-700 mb-1">Amenities (comma separated)</label>
                <input id="entry-9"
                  type="text"
                  value={listingForm.amenities}
                  onChange={(e) => setListingForm({ ...listingForm, amenities: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </>
          ) : (
            /* TENANT FORM */
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="entry-10" className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input id="entry-10"
                    type="text"
                    required
                    value={tenantForm.name}
                    onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="entry-11" className="block font-bold text-gray-700 mb-1">Age</label>
                  <input id="entry-11"
                    type="number"
                    value={tenantForm.age}
                    onChange={(e) => setTenantForm({ ...tenantForm, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="entry-12" className="block font-bold text-gray-700 mb-1">Occupation</label>
                  <input id="entry-12"
                    type="text"
                    required
                    value={tenantForm.job}
                    onChange={(e) => setTenantForm({ ...tenantForm, job: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="entry-13" className="block font-bold text-gray-700 mb-1">Employer / Company</label>
                  <input id="entry-13"
                    type="text"
                    required
                    value={tenantForm.company}
                    onChange={(e) => setTenantForm({ ...tenantForm, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    FICO Credit Score: <strong className="text-emerald-600">{tenantForm.creditScore}</strong>
                  </label>
                  <input
                    type="range"
                    min="600"
                    max="850"
                    value={tenantForm.creditScore}
                    onChange={(e) => setTenantForm({ ...tenantForm, creditScore: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="entry-14" className="block font-bold text-gray-700 mb-1">Monthly Income ($)</label>
                  <input id="entry-14"
                    type="number"
                    value={tenantForm.monthlyIncome}
                    onChange={(e) => setTenantForm({ ...tenantForm, monthlyIncome: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="entry-15" className="block font-bold text-gray-700 mb-1">Photo Avatar URL</label>
                <input id="entry-15"
                  type="url"
                  value={tenantForm.avatar}
                  onChange={(e) => setTenantForm({ ...tenantForm, avatar: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="entry-16" className="block font-bold text-gray-700 mb-1">Pet Information</label>
                <input id="entry-16"
                  type="text"
                  value={tenantForm.petInfo}
                  onChange={(e) => setTenantForm({ ...tenantForm, petInfo: e.target.value })}
                  placeholder="e.g. 1 French Bulldog, fully trained"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="entry-17" className="block font-bold text-gray-700 mb-1">Personal Bio & Rental Habits</label>
                <textarea id="entry-17"
                  rows={2}
                  value={tenantForm.bio}
                  onChange={(e) => setTenantForm({ ...tenantForm, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-sm shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Publishing..." : "Add to Swipe Deck"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
