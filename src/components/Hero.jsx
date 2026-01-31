import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";

export default function Hero({ onRegisterClick }) {
  const videoRef = useState(null);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  const handleVideoTimeUpdate = (e) => {
    const video = e.target;
    if (!hasPlayedIntro && video.currentTime >= 1) {
      setHasPlayedIntro(true);
      video.currentTime = 1;
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Tech grid background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(0, 0, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        {/* Circuit lines */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <svg width="100%" height="100%" className="absolute">
            <line x1="0" y1="10%" x2="20%" y2="10%" stroke="#FF4444" strokeWidth="2" />
            <line x1="20%" y1="10%" x2="20%" y2="30%" stroke="#FF4444" strokeWidth="2" />
            <line x1="80%" y1="20%" x2="100%" y2="20%" stroke="#00FFFF" strokeWidth="2" />
            <line x1="80%" y1="20%" x2="80%" y2="40%" stroke="#00FFFF" strokeWidth="2" />
            <line x1="0" y1="90%" x2="25%" y2="90%" stroke="#00FFFF" strokeWidth="2" />
            <line x1="75%" y1="85%" x2="100%" y2="85%" stroke="#FF4444" strokeWidth="2" />
          </svg>
        </div>
        {/* Animated cyan glow */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Animated red glow */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 text-center py-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo with animated video */}
          <div className="mb-6 md:mb-10">
            <div className="relative inline-block w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] mx-auto">
              <video 
                ref={videoRef}
                autoPlay
                muted
                playsInline
                loop={hasPlayedIntro}
                onTimeUpdate={handleVideoTimeUpdate}
                className="relative w-full h-auto drop-shadow-2xl"
                aria-label="McGill AeroHacks Logo"
              >
                <source src="https://fqbmztbicnxbmhbgncie.supabase.co/storage/v1/object/public/mcgillaerohacks/animatedcircularlogo.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          <div>
            <motion.div
              className="inline-block mb-3 md:mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-red-600/30 to-cyan-500/30 backdrop-blur-xl border-2 border-red-500/70 rounded text-white text-xs md:text-sm font-mono font-bold shadow-lg shadow-red-500/30">
                🚀 FIRST-EVER EDITION
              </div>
            </motion.div>

            <motion.div
              className="inline-block mb-4 md:mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="px-4 md:px-5 py-2 md:py-2.5 bg-cyan-500/20 backdrop-blur-xl border-2 border-cyan-500/50 rounded text-white text-xs md:text-sm font-mono font-bold shadow-lg shadow-cyan-500/20">
                03/13-03/15
              </div>
            </motion.div>

            <motion.p 
              className="text-base sm:text-lg md:text-2xl text-white mb-2 md:mb-4 max-w-3xl mx-auto px-4 font-bold uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                textShadow: '0 0 20px rgba(255, 68, 68, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)'
              }}
            >
              Code the Future of Flight
            </motion.p>

            <motion.p 
              className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 md:mb-10 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Join 150+ students for an exciting 3-day challenge in drone programming, computer vision, embedded systems, and autonomous navigation. Code, collaborate, and compete using real ESP32-powered drones.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div 
              className="mb-8 md:mb-10 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-xs sm:text-sm md:text-lg text-red-500 mb-3 md:mb-4 uppercase tracking-wider font-bold font-mono">Event Starts In</h3>
              <CountdownTimer targetDate="2026-03-13T00:00:00" />
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Button
                onClick={onRegisterClick}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-4 md:py-6 text-sm md:text-lg rounded font-bold w-full sm:w-auto border-2 border-red-500 shadow-lg shadow-red-500/50 transition-all duration-300 hover:shadow-red-500/70"
                aria-label="Register for McGill AeroHacks"
              >
                REGISTER NOW
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-cyan-500 bg-cyan-500/20 backdrop-blur-xl text-white hover:bg-cyan-500/40 px-6 md:px-8 py-4 md:py-6 text-sm md:text-lg rounded w-full sm:w-auto font-bold shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50"
                onClick={() => window.open('http://mcgillaerohacks.devpost.com/', '_blank')}
                aria-label="View McGill AeroHacks on Devpost (opens in new tab)"
              >
                VIEW ON DEVPOST
              </Button>
            </motion.div>

            <motion.div 
              className="flex flex-col gap-3 items-center px-4 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {/* Date and Location tags */}
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center text-white">
                <div className="flex items-center gap-2 bg-cyan-500/20 backdrop-blur-xl px-3 md:px-4 py-1.5 md:py-2 rounded text-xs sm:text-sm md:text-base shadow-lg border-2 border-cyan-500/50 font-mono">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-red-500" aria-hidden="true" />
                  <span>Mar 13 - Mar 15, 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-cyan-500/20 backdrop-blur-xl px-3 md:px-4 py-1.5 md:py-2 rounded text-xs sm:text-sm md:text-base shadow-lg border-2 border-cyan-500/50 font-mono">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-500" aria-hidden="true" />
                  <span className="hidden sm:inline">McGill University, Montreal</span>
                  <span className="sm:hidden">McGill, Montreal</span>
                </div>
              </div>
              
              {/* Hosted by tag */}
              <a 
                href="https://www.mcgillaerialdesign.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600/20 backdrop-blur-xl px-3 md:px-4 py-1.5 md:py-2 rounded text-xs sm:text-sm md:text-base shadow-lg border-2 border-red-500/50 hover:bg-red-600/30 transition-colors font-mono"
              >
                <span className="text-gray-300">Hosted by</span>
                <span className="font-bold text-red-500">McGill Aerial Design</span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 text-red-500 cursor-pointer z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll down to learn more"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
