import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, ChevronRight, Cpu, RotateCcw } from "lucide-react";
import NetworkBackground from "./components/NetworkBackground";
import RocketLoading from "./components/RocketLoading";

const AnimatedText = React.memo(({ text, className = "" }: any) => {
  return <span className={className}>{text}</span>;
});

export default function App() {
  // 0: idle, 1: sucking, 2: hidden waiting for TG/rewind, 3: rewinding
  const [animationState, setAnimationState] = useState(0);

  useEffect(() => {
    let timer1: any, timer2: any, timer3: any;
    if (animationState === 1) {
      // Switch to rocket loading state after 2.5s (fast sucking)
      // This is crucial to stay under the 5000ms browser popup-blocker limit!
      timer1 = setTimeout(() => {
        setAnimationState(2); 
      }, 2500);
    } else if (animationState === 2) {
      // Open TG after 2.2 seconds of rocket flying (Total elapsed: 4.7s)
      // Browsers keep "User Activation" for exactly 5000ms. 
      // Opening within 4.7s avoids the permission blocker!
      timer2 = setTimeout(() => {
        const win = window.open("https://t.me/MyCATpaybot", "_blank");
        if (!win) {
          window.location.href = "tg://resolve?domain=MyCATpaybot";
        }
      }, 2200); 

      // Wait 10 seconds total in rocket state before rewinding
      timer3 = setTimeout(() => {
        setAnimationState(3); // Start rewinding
      }, 10000); 
    } else if (animationState === 3) {
      timer1 = setTimeout(() => {
        setAnimationState(0); // Restore normal state
      }, 2000); // 2 second rewind time
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [animationState]);

  
  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-cyan-500/30 overflow-hidden">
      <NetworkBackground animationState={animationState} />
      
      <AnimatePresence>
        {animationState === 2 && <RocketLoading />}
      </AnimatePresence>

      {/* Black Hole Core overlay */}
      <AnimatePresence>
        {(animationState === 1 || animationState === 2) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 4.5, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none z-20 flex items-center justify-center mix-blend-screen"
          >
            <div className="absolute inset-0 rounded-full bg-black shadow-[0_0_150px_80px_rgba(34,211,238,0.2)] mix-blend-normal z-0" />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border-t-8 border-r-8 border-cyan-400/80 shadow-[0_0_80px_20px_rgba(34,211,238,0.8)] blur-[2px] z-10"
            />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border-b-8 border-l-8 border-indigo-500/80 shadow-[0_0_60px_10px_rgba(99,102,241,0.8)] blur-[4px] z-10"
            />
            <div className="absolute w-32 h-32 bg-black rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,1)] mix-blend-normal z-20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewind Clock Overlay */}
      <AnimatePresence>
        {animationState === 3 && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: 180 }}
            animate={{ scale: 1.5, opacity: 0.8, rotate: -720 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]"
          >
            <RotateCcw className="w-32 h-32 md:w-48 md:h-48" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Overlay */}
      <main className="relative z-30 flex min-h-screen flex-col items-center justify-center p-6 text-center">
        {/* Flash / Sparkle Event */}
        <motion.div
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen z-50 flex items-center justify-center"
        >
          {/* Horizontal Flare */}
          <motion.div
            className="absolute bg-white rounded-full"
            animate={
              animationState === 1 ? {
                 width: ["0vw", "0vw", "80vw", "0vw", "0vw"],
                 height: ["0px", "0px", "3px", "0px", "0px"],
                 opacity: [0, 0, 1, 0, 0],
                 boxShadow: [
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 80px 20px rgba(255,255,255,1), 0 0 200px 40px rgba(34,211,238,0.8)",
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 0px 0px rgba(255,255,255,0)"
                 ],
              } : animationState === 2 ? {
                 width: "0vw", height: "0px", opacity: 0
              } : animationState === 3 ? {
                 width: ["0vw", "0vw", "80vw", "0vw", "0vw"],
                 height: ["0px", "0px", "3px", "0px", "0px"],
                 opacity: [0, 0, 1, 0, 0],
                 boxShadow: [
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 80px 20px rgba(255,255,255,1), 0 0 200px 40px rgba(34,211,238,0.8)",
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 0px 0px rgba(255,255,255,0)"
                 ],
              } : { width: "0vw", height: "0px", opacity: 0 }
            }
            transition={{
              duration: animationState === 1 ? 2.5 : (animationState === 3 ? 2 : 0),
              times: [0, 0.5, 0.6, 0.7, 1],
              ease: "easeInOut"
            }}
          />
          {/* Vertical Flare */}
          <motion.div
            className="absolute bg-white rounded-full"
            animate={
              animationState === 1 ? {
                 height: ["0vh", "0vh", "40vh", "0vh", "0vh"],
                 width: ["0px", "0px", "2px", "0px", "0px"],
                 opacity: [0, 0, 1, 0, 0],
                 boxShadow: [
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 40px 10px rgba(255,255,255,1), 0 0 100px 20px rgba(34,211,238,0.8)",
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 0px 0px rgba(255,255,255,0)"
                 ],
              } : animationState === 2 ? {
                 height: "0vh", width: "0px", opacity: 0
              } : animationState === 3 ? {
                 height: ["0vh", "0vh", "40vh", "0vh", "0vh"],
                 width: ["0px", "0px", "2px", "0px", "0px"],
                 opacity: [0, 0, 1, 0, 0],
                 boxShadow: [
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 40px 10px rgba(255,255,255,1), 0 0 100px 20px rgba(34,211,238,0.8)",
                   "0 0 0px 0px rgba(255,255,255,0)",
                   "0 0 0px 0px rgba(255,255,255,0)"
                 ],
              } : { height: "0vh", width: "0px", opacity: 0 }
            }
            transition={{
              duration: animationState === 1 ? 2.5 : (animationState === 3 ? 2 : 0),
              times: [0, 0.53, 0.6, 0.67, 1],
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <motion.div
           className="relative flex flex-col items-center max-w-2xl"
           animate={
             animationState === 1 ? {
               scaleY: [1, 1, 0.01, 0, 0],
               scaleX: [1, 1, 1.2, 0, 0],
               opacity: [1, 1, 1, 0, 0],
               filter: ["brightness(1) blur(0px)", "brightness(1) blur(0px)", "brightness(8) blur(4px)", "brightness(1) blur(0px)", "brightness(1) blur(0px)"],
             } : animationState === 2 ? {
               scaleY: 0, scaleX: 0, opacity: 0
             } : animationState === 3 ? {
               scaleY: [0, 0, 0.01, 1, 1],
               scaleX: [0, 0, 1.2, 1, 1],
               opacity: [0, 0, 1, 1, 1],
               filter: ["brightness(1) blur(0px)", "brightness(1) blur(0px)", "brightness(8) blur(4px)", "brightness(1) blur(0px)", "brightness(1) blur(0px)"],
             } : {
               scaleY: 1, scaleX: 1, opacity: 1, filter: "brightness(1) blur(0px)"
             }
           }
           transition={{
             duration: animationState === 1 ? 2.5 : (animationState === 3 ? 2 : 0),
             times: [0, 0.5, 0.6, 0.65, 1],
             ease: "easeInOut"
           }}
        >
          {/* Top minimal badge */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-cyan-400">
              <AnimatedText text="Neuronové Vzdělávací Prostředí" />
            </span>
          </div>

          <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight py-2 leading-tight">
            <span className="block drop-shadow-md">
              <AnimatedText text="Ponoření se" className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400" />
            </span>
            <span className="block mt-2 drop-shadow-md">
              <AnimatedText text="do budoucnosti" className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400" />
            </span>
          </h1>
          
          <p className="mb-12 max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed max-w-[500px]">
             <AnimatedText text="Získejte přístup k pokročilým znalostem. Interaktivní učení řízené umělou inteligencí je k dispozici právě teď." />
          </p>

          <div className="relative h-[68px] sm:h-[84px] flex items-center justify-center w-[300px] sm:w-[400px]">
             <button
                onClick={() => {
                  if (animationState === 0) setAnimationState(1);
                }}
                disabled={animationState !== 0}
                className="group relative w-full h-full block cursor-pointer transition-all duration-300"
              >
                {/* Glow Effect Behind Button */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500" />
                
                <div className="relative flex items-center justify-center bg-[#0a0f1a] hover:bg-[#0f172a] border border-white/10 h-full rounded-full transition-all duration-300 gap-4">
                  <Bot className="h-6 w-6 text-cyan-400" />
                  <span className="text-xl sm:text-2xl font-semibold tracking-wide text-white uppercase whitespace-nowrap">Přejít na kurz</span>
                  <ChevronRight className="h-6 w-6 text-cyan-400 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
