import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, ChevronRight, Cpu, RotateCcw } from "lucide-react";
import NetworkBackground from "./components/NetworkBackground";
import RocketLoading from "./components/RocketLoading";

const AnimatedText = ({ text, animationState, delayBase = 0, yOffset = 200, className = "" }: any) => {
  const chars = useMemo(() => {
    return String(text).split('').map((char) => {
      const topOff = -20 - Math.random() * 50;
      const xOff = (Math.random() - 0.5) * 300;
      const rot = (Math.random() - 0.5) * 1080;
      const dur = 3 + Math.random() * 1.5;
      const dly = delayBase + Math.random() * 0.5;
      return { char, topOff, xOff, rot, dur, dly };
    });
  }, [text, delayBase]);

  return (
    <span className={`inline-block relative ${className}`}>
      {chars.map(({ char, topOff, xOff, rot, dur, dly }, i) => {
// 0: idle, 1: sucking, 2: wait with hole, 3: rewinding
        const isSucking = animationState === 1;
        const isHidden = animationState === 2;
        const isRewinding = animationState === 3;

        return (
          <motion.span
            key={i}
            className={`inline-block ${className}`}
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal', position: 'relative' }}
            initial={{ y: 0, x: 0, scale: 1, rotate: 0, opacity: 1 }}
            animate={
              isSucking ? {
                y: [0, topOff, yOffset],
                x: [0, xOff, xOff],
                scale: [1, 1.5, 0],
                rotate: [0, rot, rot * 2],
                opacity: [1, 1, 0]
              } : isHidden ? {
                y: yOffset,
                x: xOff,
                scale: 0,
                rotate: rot * 2,
                opacity: 0
              } : isRewinding ? {
                y: [yOffset, topOff, 0],
                x: [xOff, xOff, 0],
                scale: [0, 1.5, 1],
                rotate: [rot * 2, rot, 0],
                opacity: [0, 1, 1]
              } : {
                 y: 0, x: 0, scale: 1, rotate: 0, opacity: 1 
              }
            }
            transition={{
              duration: isSucking ? dur : (isRewinding ? 2 : 0),
              delay: isSucking ? dly : 0,
              ease: "easeInOut"
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
};

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

  const shapes = useMemo(() => {
    const pieces = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const top = (row / 3) * 100;
        const bottom = ((row + 1) / 3) * 100;
        const left = (col / 4) * 100;
        const right = ((col + 1) / 4) * 100;

        const dirX = (Math.random() - 0.5) * 800;
        const dirY = (Math.random() - 0.5) * 800;
        const rot = (Math.random() - 0.5) * 720;

        pieces.push({
          path: `polygon(${left}% ${top}%, ${right}% ${top}%, ${right}% ${bottom}%, ${left}% ${bottom}%)`,
          x: dirX,
          y: dirY,
          rotate: rot,
        });
      }
    }
    return pieces;
  }, []);
  
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
        <motion.div
           animate={animationState === 1 ? { scale: [1, 0.5, 0], opacity: [1, 0.8, 0] } : animationState === 2 ? { scale: 0, opacity: 0 } : animationState === 3 ? { scale: [0, 0.5, 1], opacity: [0, 0.8, 1] } : { scale: 1, opacity: 1 }}
           transition={{ duration: animationState === 1 ? 2.5 : (animationState === 3 ? 2 : 0), ease: "easeInOut" }}
          className="flex flex-col items-center max-w-2xl"
        >
          {/* Top minimal badge */}
          <div className="mb-6 flex items-center gap-3">
            <motion.div
              animate={
                animationState === 1 ? { y: [0, -50, 400], x: [0, -100, -100], scale: [1, 1.5, 0], rotate: [0, -360, -360] } :
                animationState === 2 ? { y: 400, x: -100, scale: 0, rotate: -360 } :
                animationState === 3 ? { y: [400, -50, 0], x: [-100, -100, 0], scale: [0, 1.5, 1], rotate: [-360, 0, 0] } :
                { y: 0, x: 0, scale: 1, rotate: 0 }
              }
              transition={{ duration: animationState === 1 ? 2.4 : (animationState === 3 ? 2 : 0), ease: "easeInOut" }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20"
            >
              <Cpu className="h-6 w-6 text-white" />
            </motion.div>
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-cyan-400">
              <AnimatedText text="Neuronové Vzdělávací Prostředí" animationState={animationState} yOffset={350} delayBase={0} />
            </span>
          </div>

          <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight py-2 leading-tight">
            <span className="block drop-shadow-md">
              <AnimatedText text="Ponoření se" className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400" animationState={animationState} yOffset={250} delayBase={0.2} />
            </span>
            <span className="block mt-2 drop-shadow-md">
              <AnimatedText text="do budoucnosti" className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400" animationState={animationState} yOffset={250} delayBase={0.4} />
            </span>
          </h1>
          
          <p className="mb-12 max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed max-w-[500px]">
             <AnimatedText text="Získejte přístup k pokročilým znalostem. Interaktivní učení řízené umělou inteligencí je k dispozici právě teď." animationState={animationState} yOffset={150} delayBase={0.6} />
          </p>

          <div className="relative h-[68px] sm:h-[84px] flex items-center justify-center w-[300px] sm:w-[400px]">
            {animationState === 0 && (
              <motion.button
                onClick={() => {
                  setAnimationState(1);
                }}
                className="group relative w-full h-full block cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Glow Effect Behind Button */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500" />
                
                <div className="relative flex items-center justify-center bg-[#0a0f1a] hover:bg-[#0f172a] border border-white/10 h-full rounded-full transition-all duration-300 gap-4">
                  <Bot className="h-6 w-6 text-cyan-400" />
                  <span className="text-xl sm:text-2xl font-semibold tracking-wide text-white uppercase whitespace-nowrap">Přejít na kurz</span>
                  <ChevronRight className="h-6 w-6 text-cyan-400 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            )}

            {/* The Shards - explode then sucked into black hole, or rewind */}
            {animationState !== 0 && shapes.map((shape, i) => (
              <motion.div
                key={i}
                className="absolute top-0 left-0 w-full h-full origin-center pointer-events-none"
                style={{ clipPath: shape.path }}
                animate={
                  animationState === 1 ? {
                    x: [0, shape.x, 0],
                    y: [0, shape.y, 0],
                    rotate: [0, shape.rotate, shape.rotate * 3],
                    opacity: [1, 1, 0],
                    scale: [1, 1.2, 0],
                  } : animationState === 2 ? {
                    x: 0,
                    y: 0,
                    rotate: shape.rotate * 3,
                    opacity: 0,
                    scale: 0,
                  } : { // animationState === 3
                    x: [0, shape.x, 0],
                    y: [0, shape.y, 0],
                    rotate: [shape.rotate * 3, shape.rotate, 0],
                    opacity: [0, 1, 1],
                    scale: [0, 1.2, 1],
                  }
                }
                transition={{
                  duration: animationState === 1 ? 2.4 : (animationState === 3 ? 2 : 0),
                  times: animationState === 1 ? [0, 0.4, 1] : (animationState === 3 ? [0, 0.6, 1] : undefined),
                  ease: "easeInOut",
                }}
              >
                <div className="relative flex items-center justify-center bg-[#0a0f1a] shadow-[0_0_15px_rgba(34,211,238,0.5)] border border-white/20 w-full h-full rounded-full gap-4">
                  <Bot className="h-6 w-6 text-cyan-400" />
                  <span className="text-xl sm:text-2xl font-semibold tracking-wide text-white uppercase whitespace-nowrap">Přejít na kurz</span>
                  <ChevronRight className="h-6 w-6 text-cyan-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
