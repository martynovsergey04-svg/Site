/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, ChevronRight, Cpu } from "lucide-react";
import NetworkBackground from "./components/NetworkBackground";

export default function App() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        // Use an anchor tag to safely open the link in a new tab,
        // avoiding iframe X-Frame-Options blocks and direct location assignments.
        const link = document.createElement('a');
        link.href = "https://t.me/MyCATpaybot";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsTransitioning(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const shapes = useMemo(() => {
    const pieces = [];
    // Create 12 fragments using a grid
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const top = (row / 3) * 100;
        const bottom = ((row + 1) / 3) * 100;
        const left = (col / 4) * 100;
        const right = ((col + 1) / 4) * 100;

        // Space drift animation end points
        const dirX = (Math.random() - 0.5) * 400;
        const dirY = (Math.random() - 0.5) * 400;
        const rot = (Math.random() - 0.5) * 360;

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
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-cyan-500/30">
      <NetworkBackground />
      
      {/* Main Content Overlay */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center max-w-2xl"
        >
          {/* Top minimal badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <span className="font-mono text-sm uppercase tracking-widest text-cyan-400">Neuronové Vzdělávací Prostředí</span>
          </motion.div>

          <h1 className="mb-4 text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            <span className="block">
              Ponoření se
            </span>
            <span className="block mt-2">
              do budoucnosti
            </span>
          </h1>
          
          <p className="mb-12 max-w-2xl text-xl text-gray-400 leading-relaxed">
             Získejte přístup k pokročilým znalostem. Interaktivní učení řízené umělou inteligencí je k dispozici právě teď.
          </p>

          <div className="relative h-[68px] sm:h-[84px] flex items-center justify-center w-[300px] sm:w-[400px]">
            {!isTransitioning && (
              <motion.button
                onClick={() => setIsTransitioning(true)}
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

            {/* The Shards - appear and fly away slowly like in space */}
            {isTransitioning && shapes.map((shape, i) => (
              <motion.div
                key={i}
                className="absolute top-0 left-0 w-full h-full origin-center pointer-events-none"
                style={{ clipPath: shape.path }}
                animate={{
                  x: shape.x,
                  y: shape.y,
                  rotate: shape.rotate,
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{
                  duration: 4.5,
                  ease: "easeOut",
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
