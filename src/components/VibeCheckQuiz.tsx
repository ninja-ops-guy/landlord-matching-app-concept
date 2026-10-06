"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, RotateCcw, Flame, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import { fireMatchConfetti } from "@/lib/confetti";

interface Question {
  id: number;
  question: string;
  subtitle: string;
  options: {
    text: string;
    score: number;
    badge: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "The Dripping Faucet Dilemma",
    subtitle: "It's 10:45 PM on a Friday. The bathroom faucet has developed a rhythmic drip. What is your reaction?",
    options: [
      {
        text: "I grab my own Teflon tape & wrench from my toolbox and swap the washer in 5 minutes.",
        score: 25,
        badge: "🛠️ DIY Hero",
      },
      {
        text: "I snap a polite photo, submit a maintenance ticket, and sleep soundly till morning.",
        score: 23,
        badge: "🧘 Chill Communicator",
      },
      {
        text: "I call the emergency hotline immediately demanding a plumber at midnight.",
        score: 5,
        badge: "🚨 High Maintenance",
      },
    ],
  },
  {
    id: 2,
    question: "Hanging Art & Gallery Walls",
    subtitle: "You want to hang your vintage art collection on the living room wall.",
    options: [
      {
        text: "Strictly Command strips or monkey hooks, zero drywall damage.",
        score: 25,
        badge: "🖼️ Wall Guardian",
      },
      {
        text: "I use proper anchors, but I spackle, sand, and color-match paint before move-out.",
        score: 24,
        badge: "🎨 Responsible Artist",
      },
      {
        text: "Industrial toggle bolts everywhere. That's what the security deposit is for, right?",
        score: 8,
        badge: "💥 Sledgehammer Style",
      },
    ],
  },
  {
    id: 3,
    question: "Winter Thermostat Protocol",
    subtitle: "It is freezing outside. How do you manage heating?",
    options: [
      {
        text: "Comfortable 68°F wearing cozy wool sweaters and slippers.",
        score: 25,
        badge: "❄️ Eco-Conscious",
      },
      {
        text: "Balanced 70°F with programmable day/night setback.",
        score: 22,
        badge: "🌡️ Moderate Comfort",
      },
      {
        text: "Blasting 80°F heat while opening the window for a fresh breeze.",
        score: 5,
        badge: "🔥 Utility Destroyer",
      },
    ],
  },
  {
    id: 4,
    question: "Rent Payment Timing",
    subtitle: "Rent is due on the 1st of the month. When do you execute payment?",
    options: [
      {
        text: "Autopay scheduled for the 28th of every prior month like clockwork.",
        score: 25,
        badge: "👑 Credit Royalty",
      },
      {
        text: "Direct deposit or Zelle on the morning of the 1st.",
        score: 23,
        badge: "⏱️ Punctual Pro",
      },
      {
        text: "Usually sometime between the 4th and the 5-day grace period.",
        score: 10,
        badge: "⏳ Grace Period Gambler",
      },
    ],
  },
];

export function VibeCheckQuiz({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (score: number) => {
    const nextAnswers = [...selectedAnswers, score];
    setSelectedAnswers(nextAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const finalSum = nextAnswers.reduce((a, b) => a + b, 0);
      setTotalScore(finalSum);
      setIsCompleted(true);
      fireMatchConfetti();
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setTotalScore(0);
    setIsCompleted(false);
  };

  const getArchetype = (score: number) => {
    if (score >= 90) {
      return {
        title: "The Unicorn Tenant (98% Landlord Match)",
        subtitle: "Landlords would literally build a statue in your honor. Autopay champion, DIY capable, respectful of wood floors.",
        color: "from-emerald-500 to-teal-600",
        recommendedLandlord: "Arthur Pendelton (He will bake you sourdough)",
      };
    }
    if (score >= 70) {
      return {
        title: "The Respectful Modernist (88% Landlord Match)",
        subtitle: "Solid, dependable, low-drama renter who communicates clearly and respects the building community.",
        color: "from-blue-500 to-indigo-600",
        recommendedLandlord: "Cheryl Vance (Eco-Lofts & Fiber WiFi)",
      };
    }
    return {
      title: "The Wildcard Renter (62% Landlord Match)",
      subtitle: "You might want to brush up on lease etiquette or look for a hands-off mega-corporation property manager!",
      color: "from-amber-500 to-rose-600",
      recommendedLandlord: "Corporate Highrise with 24/7 staff",
    };
  };

  const currentQ = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-6 text-white text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Landlordr Vibe Check™</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            The Landlord-Tenant Harmony Quiz
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-md mx-auto mt-1">
            Calculate your rental compatibility score and discover your ideal landlord match.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {!isCompleted ? (
            <div>
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-2">
                <span>QUESTION {currentStep + 1} OF {questions.length}</span>
                <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                {currentQ.question}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">{currentQ.subtitle}</p>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option.score)}
                    className="w-full text-left p-4 rounded-2xl border-2 border-gray-200 hover:border-rose-500 hover:bg-rose-50/50 transition-all group flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-rose-950">
                        {option.text}
                      </div>
                      <span className="inline-block mt-1 text-[11px] font-bold text-gray-400 group-hover:text-rose-600">
                        {option.badge}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-rose-500 shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="text-center py-4 space-y-6">
              {(() => {
                const archetype = getArchetype(totalScore);
                return (
                  <>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-200 animate-bounce">
                      <HeartHandshake className="w-10 h-10" />
                    </div>

                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-rose-600 mb-1">
                        YOUR COMPATIBILITY RESULTS
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                        {archetype.title}
                      </h3>
                      <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                        {archetype.subtitle}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 max-w-md mx-auto text-left">
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1">
                        IDEAL LANDLORD MATCH
                      </div>
                      <div className="text-sm font-black text-gray-900 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-rose-500" />
                        <span>{archetype.recommendedLandlord}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <button
                        onClick={handleReset}
                        className="py-3 px-6 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Retake Quiz</span>
                      </button>

                      {onComplete && (
                        <button
                          onClick={onComplete}
                          className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xs shadow-md shadow-rose-200 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                        >
                          <Flame className="w-4 h-4" />
                          <span>Start Swiping with 98% Match</span>
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
