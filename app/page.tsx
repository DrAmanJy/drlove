"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Volume2,
  VolumeX,
  Sparkles,
  Gem,
  ArrowRight,
  Stars,
  Flower,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import confetti from "canvas-confetti";

// --- ASSETS ---
// Bollywod Romantic Song (Instrumental) or Keep existing
const MUSIC_URL =
  "/song.mp3";
const CAT_GIF =
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmM2Z2QyYnI2Nnk2M2J5eHBoN2w5b3h5b3h5b3h5b3h5b3h5/26FLdmIp6wJr91J4k/giphy.gif";
const RING_GIF =
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWt5cXZ4ZmN5eGZ4ZmN5eGZ4ZmN5eGZ4ZmN5eGZ4ZmN5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKoWXm3okO1kgHC/giphy.gif";

// --- COMPONENTS ---

const StageTransition = ({ isTransitioning }) => (
  <AnimatePresence>
    {isTransitioning && (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 50 }}
          exit={{ scale: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="w-20 h-20 bg-rose-600 rounded-full"
        />
      </motion.div>
    )}
  </AnimatePresence>
);

export default function DesiValentine() {
  const [started, setStarted] = useState(false);
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // No Button Logic
  const [noCount, setNoCount] = useState(0);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [isRunaway, setIsRunaway] = useState(false);

  const audioRef = useRef(null);
  const playgroundRef = useRef(null);
  const noBtnRef = useRef(null);

  // --- API / TELEMETRY FUNCTION ---
  const sendTelemetry = async (actionType) => {
    // Collect Browser Details
    const info = {
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      platform: navigator.platform,
      time: new Date().toLocaleString("en-IN"),
    };

    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          count: noCount,
          deviceInfo: info,
        }),
      });
    } catch (error) {
      console.error("Telemetry Error:", error);
    }
  };

  // --- LOGIC ---

  const handleStart = () => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio blocked:", e));
      setIsPlaying(true);
    }
  };

  const toggleMusic = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const moveNoButton = () => {
    setNoCount((prev) => prev + 1);

    if (playgroundRef.current && noBtnRef.current) {
      const container = playgroundRef.current.getBoundingClientRect();
      const btn = noBtnRef.current.getBoundingClientRect();
      const maxX = container.width - btn.width;
      const maxY = container.height - btn.height;

      setNoBtnPos({
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      });
      setIsRunaway(true);
    }
  };

  const nextStage = (nextStageIndex) => {
    // 1. Reset No Button
    setIsRunaway(false);
    setNoBtnPos({ x: 0, y: 0 });

    // 2. SEND API DATA (The important part)
    if (nextStageIndex === 1) sendTelemetry("Opened Letter (Stage 1)");
    if (nextStageIndex === 2) sendTelemetry("Said YES to Valentine (Stage 2)");
    if (nextStageIndex === 3) {
      sendTelemetry("SAID YES TO MARRIAGE (FINAL)");
      fireConfetti();
    }

    // 3. Trigger Transition Animation
    setIsTransitioning(true);

    setTimeout(() => {
      setStage(nextStageIndex);
    }, 500);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const fireConfetti = () => {
    const end = Date.now() + 3000;
    // DESI WEDDING COLORS: Marigold, Red, Gold
    const colors = ["#FFD700", "#FF0000", "#FFA500"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const getWhatsAppLink = () => {
    const text = `Oye! YES! 💍💖\n\nRishta Pakka samjho! (Refusals: ${noCount} times par dil toh bachcha hai ji 🙈)`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const getBgColor = () => {
    if (stage === 2) return "bg-amber-50";
    return "bg-rose-50";
  };

  // --- RENDER ---

  return (
    <div
      className={`relative w-full h-[100dvh] overflow-hidden transition-colors duration-1000 ${getBgColor()}`}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,600;1,600&family=Nunito:wght@400;700;900&display=swap");
        .font-hand {
          font-family: "Dancing Script", cursive;
        }
        .font-serif {
          font-family: "Playfair Display", serif;
        }
        .font-body {
          font-family: "Nunito", sans-serif;
        }
      `}</style>

      <audio ref={audioRef} loop src={MUSIC_URL} />
      <StageTransition isTransitioning={isTransitioning} />

      {/* MUSIC TOGGLE */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleMusic}
          className={`p-3 rounded-full backdrop-blur-md shadow-lg border transition-colors ${stage === 2 ? "bg-white/60 text-amber-600 border-amber-200" : "bg-white/60 text-rose-500 border-white"}`}
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* --- START SCREEN --- */}
      <AnimatePresence>
        {!started && (
          <motion.div
            className="absolute inset-0 z-[90] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer"
            onClick={handleStart}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart
                size={80}
                className="text-rose-500 fill-rose-500 drop-shadow-2xl"
              />
            </motion.div>
            <p className="mt-4 text-white font-body tracking-[0.3em] text-xs animate-pulse">
              TAP TO OPEN
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTAINER --- */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        {/* STAGE 0: LANDING (The Letter) */}
        {started && stage === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <div
              className="relative group cursor-pointer"
              onClick={() => nextStage(1)}
            >
              <div className="w-64 h-48 bg-rose-500 rounded-b-xl shadow-2xl relative z-10 flex items-center justify-center">
                <Heart className="text-rose-700/50 w-20 h-20" />
              </div>
              <motion.div
                initial={{ rotateX: 0 }}
                whileHover={{ rotateX: 180 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 w-full h-24 bg-rose-600 rounded-t-xl origin-top z-20 brightness-110"
                style={{
                  borderRadius: "12px 12px 50% 50% / 12px 12px 20% 20%",
                }}
              />
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                whileHover={{ y: -80, opacity: 1 }}
                className="absolute left-4 right-4 h-32 bg-white shadow-md rounded-t-lg z-0 flex items-center justify-center p-4 text-center"
              >
                <p className="font-hand text-xl text-gray-700">
                  "Ek baat bolni hai..."
                </p>
              </motion.div>
            </div>
            <button
              onClick={() => nextStage(1)}
              className="px-8 py-3 bg-white text-rose-500 font-bold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
            >
              Chitthi Padhoge? 💌
            </button>
          </motion.div>
        )}

        {/* STAGE 1: VALENTINE (Desi Cute) */}
        {started && stage === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white/80 backdrop-blur-xl border-4 border-white p-6 rounded-[2.5rem] shadow-2xl shadow-rose-200/50 relative overflow-hidden flex flex-col"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-200 rounded-full blur-2xl opacity-50" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-200 rounded-full blur-2xl opacity-50" />

            <div className="relative w-full h-44 bg-rose-50 rounded-2xl mb-4 overflow-hidden border-2 border-rose-100 shrink-0">
              <img src={CAT_GIF} className="w-full h-full object-cover" />
            </div>

            <div className="text-center mb-2 shrink-0">
              <h2 className="text-3xl font-hand font-bold text-rose-500">
                Valentine Banogi? 🌹
              </h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                Bhao mat khao, Yes kardo 😉
              </p>
            </div>

            <div className="flex-1 flex flex-col relative min-h-[160px]">
              <div
                ref={playgroundRef}
                className="relative w-full h-24 mb-2 rounded-xl"
              >
                <motion.button
                  ref={noBtnRef}
                  initial={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                  animate={
                    isRunaway
                      ? { top: 0, left: 0, x: noBtnPos.x, y: noBtnPos.y }
                      : { top: "50%", left: "50%", x: "-50%", y: "-50%" }
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onMouseEnter={moveNoButton}
                  onTouchStart={moveNoButton}
                  className="absolute px-5 py-2 bg-gray-100 text-gray-400 font-bold rounded-full text-sm shadow-sm border border-gray-200 whitespace-nowrap z-10"
                >
                  {noCount === 0 ? "Nahi yaar" : "Sochne do..."}
                </motion.button>
              </div>

              <div className="mt-auto w-full flex justify-center pb-2 z-20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => nextStage(2)}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-rose-300/40 flex items-center justify-center gap-2"
                >
                  Haan Baba YES! 🥰
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: MARRIAGE (Desi Royal Wedding Vibe) */}
        {started && stage === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white/90 backdrop-blur-xl border-4 border-amber-50 p-6 rounded-[2.5rem] shadow-2xl shadow-amber-200/40 relative overflow-hidden flex flex-col"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200 rounded-full blur-2xl opacity-40" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-100 rounded-full blur-2xl opacity-40" />

            {/* RING GIF */}
            <div className="relative w-full h-52 bg-amber-50/50 rounded-2xl mb-4 overflow-hidden border-2 border-amber-100 shadow-inner flex items-center justify-center">
              <img
                src={RING_GIF}
                className="w-full h-full object-cover scale-125"
              />
            </div>

            <div className="text-center mb-4 shrink-0">
              <h2 className="text-3xl font-serif font-bold text-amber-600 mb-1">
                Mujhse Shaadi Karogi?
              </h2>
              <p className="text-amber-800/60 text-xs font-bold uppercase tracking-widest">
                Saath Janam Ka Wada Hai ❤️
              </p>
            </div>

            <div className="flex-1 flex flex-col relative min-h-[160px] justify-end">
              <div
                ref={playgroundRef}
                className="relative w-full h-24 mb-2 rounded-xl"
              >
                <motion.button
                  ref={noBtnRef}
                  initial={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                  animate={
                    isRunaway
                      ? { top: 0, left: 0, x: noBtnPos.x, y: noBtnPos.y }
                      : { top: "50%", left: "50%", x: "-50%", y: "-50%" }
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onMouseEnter={moveNoButton}
                  onTouchStart={moveNoButton}
                  className="absolute px-5 py-2 bg-amber-50 text-amber-400 font-bold rounded-full text-sm shadow-sm border border-amber-100 whitespace-nowrap z-10"
                >
                  {noCount === 0 ? "Mummy se puchungi" : "Abhi nahi"}
                </motion.button>
              </div>

              <div className="mt-auto w-full flex justify-center pb-2 z-20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => nextStage(3)}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white font-serif font-bold text-lg tracking-wider rounded-xl shadow-lg shadow-amber-300/40 flex items-center justify-center gap-2"
                >
                  Kabool Hai! 💍
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: SUCCESS (Shadi Mubarak) */}
        {started && stage === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-white"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block"
            >
              <Heart
                size={100}
                className="text-rose-500 fill-rose-500 drop-shadow-[0_0_25px_rgba(225,29,72,0.8)]"
              />
            </motion.div>
            <h1 className="text-5xl font-hand mt-6 mb-2 text-rose-500 drop-shadow-lg">
              Mubarak Ho! 🥁
            </h1>
            <p className="text-xl font-serif text-slate-600">
              Rishta Pakka! (My heart is yours)
            </p>

            <div className="mt-10 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between gap-8 text-slate-700">
                <span>Nakhre Count:</span>
                <span className="font-bold text-rose-600 text-xl">
                  {noCount}
                </span>
              </div>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                className="mt-6 block w-full py-3 bg-[#25D366] text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform"
              >
                Send Good News 💌
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
