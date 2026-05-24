import { motion, AnimatePresence } from "motion/react";
import { Rocket } from "lucide-react";
import { useEffect, useState } from "react";

export default function RocketLoading() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowFallback(true), 4000);
    return () => clearTimeout(t);
  }, []);

  // Generate some stars
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 2 + 1,
    delay: Math.random() * -2,
    size: Math.random() * 3 + 1,
  }));

  // Planets
  const planets = [
    { id: 1, size: 80, color: "bg-blue-500", left: "10%", duration: 4, delay: 0 },
    { id: 2, size: 120, color: "bg-purple-600", left: "80%", duration: 6, delay: 1 },
    { id: 3, size: 40, color: "bg-orange-400", left: "30%", duration: 3, delay: 2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 z-[100] bg-[#050810] overflow-hidden flex flex-col items-center justify-center cursor-default"
    >
      {/* Stars streaming down */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute bg-white rounded-full"
          style={{
            left: star.left,
            width: star.size,
            height: star.size,
            top: "-5%",
          }}
          animate={{
            top: ["-5%", "105%"],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
            delay: star.delay,
          }}
        />
      ))}

      {/* Planets passing by */}
      {planets.map((planet) => (
        <motion.div
          key={`planet-${planet.id}`}
          className={`absolute rounded-full opacity-40 ${planet.color} block blur-[2px]`}
          style={{
            left: planet.left,
            width: planet.size,
            height: planet.size,
            top: "-20%",
            boxShadow: "inset -10px -10px 20px rgba(0,0,0,0.8)",
          }}
          animate={{
            top: ["-20%", "120%"],
          }}
          transition={{
            duration: planet.duration,
            repeat: Infinity,
            ease: "linear",
            delay: planet.delay,
          }}
        />
      ))}

      {/* Center text */}
      <h2 className="absolute top-1/4 text-2xl md:text-3xl font-bold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20 text-center px-4">
        Zavádění do Telegramu...
      </h2>

      {/* Rocket */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          x: [-5, 5, -5],
        }}
        transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
        className="relative z-20 mt-10"
      >
        <Rocket size={140} strokeWidth={1.5} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] -rotate-45" />

        {/* Thruster Fire */}
        <motion.div
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-8 h-24 bg-gradient-to-b from-orange-400 via-yellow-400 to-transparent rounded-full blur-sm origin-top"
        />
      </motion.div>

      <AnimatePresence>
        {showFallback && (
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            href="https://t.me/MyCATpaybot"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-20 z-30 px-6 py-3 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-cyan-400 hover:bg-cyan-500/40 transition-colors cursor-pointer"
          >
            Spustit Telegram
          </motion.a>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
