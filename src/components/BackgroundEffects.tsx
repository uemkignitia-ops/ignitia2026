import React from "react";

const BackgroundEffects = () => {
  return (
    <>
      <div className="fixed inset-0 z-[0] bg-black w-full h-full overflow-hidden pointer-events-none">
        {/* Looping video background - Actually an image tuf.png */}
        <img
          src="/images/tuf.png"
          alt="IGNITIA Background"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          loading="lazy"
          decoding="async"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55 z-10" />

        {/* Cinematic gradient */}
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.10)_0%,rgba(0,0,0,0.15)_38%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

        {/* Floor glow / smoke */}
        <div className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full">
            {/* Thick floor smoke cloud */}
            <div className="absolute left-1/2 bottom-[-2%] h-20 w-[110%] -translate-x-1/2 rounded-full bg-orange-300/20 blur-3xl opacity-90" />
            <div className="absolute left-[28%] bottom-[1%] h-16 w-[55%] -translate-x-1/2 rounded-full bg-purple-400/25 blur-2xl animate-smoke-left" />
            <div className="absolute left-[48%] bottom-[-1%] h-20 w-[70%] -translate-x-1/2 rounded-full bg-white/15 blur-3xl animate-smoke-center" />
            <div className="absolute left-[68%] bottom-[1%] h-16 w-[55%] -translate-x-1/2 rounded-full bg-orange-300/25 blur-2xl animate-smoke-right" />
            <div className="absolute left-[38%] bottom-[8%] h-10 w-[45%] -translate-x-1/2 rounded-full bg-orange-200/15 blur-xl animate-smoke-small-left" />
            <div className="absolute left-[62%] bottom-[8%] h-10 w-[45%] -translate-x-1/2 rounded-full bg-purple-300/15 blur-xl animate-smoke-small-right" />
          </div>
        </div>
      </div>
    </>
  );
};

export default BackgroundEffects;
