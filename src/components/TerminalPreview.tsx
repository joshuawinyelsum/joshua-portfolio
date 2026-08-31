import { useCommandCenter } from '../contexts/CommandCenterContext';

export function TerminalPreview() {
  const { open } = useCommandCenter();

  return (
    <div 
      onClick={() => {
        if (window.innerWidth >= 768) open();
      }}
      className="group relative w-full max-w-sm mx-auto sm:max-w-md bg-[#0d1117]/90 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700/50 overflow-hidden md:cursor-pointer hover:border-gray-500/50 transition-colors duration-300"
    >
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-2 bg-[#161b22]/90 border-b border-gray-700/50 relative">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-[#8b949e] font-semibold text-[9px] tracking-[0.2em] uppercase">
          JOSHUA@PORTFOLIO
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="absolute right-3 p-1.5 rounded-md hover:bg-gray-700/50 text-gray-500 hover:text-gray-300 md:hidden transition-colors"
          aria-label="Open Developer Console"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-5 font-mono text-[12px] sm:text-[13px] text-gray-300 leading-relaxed">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#27c93f]">$</span>
          <span className="text-gray-100">explore</span>
        </div>
        <div className="text-gray-400 mb-4 opacity-0 animate-[fade-in_0.5s_ease-out_0.5s_forwards]">
          Explore like a developer.
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-blue-400">projects</span>
            <span className="text-blue-400">research</span>
            <span className="text-blue-400">cv</span>
          </div>
        </div>
        
        <div className="border-t border-dashed border-gray-700/50 pt-3 mt-3 flex items-center justify-between text-[10px] text-gray-500 font-sans tracking-widest opacity-0 animate-[fade-in_0.5s_ease-out_1s_forwards]">
          <span>CTRL K</span>
          <span>→</span>
          <span>ENTER</span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-gray-100 opacity-0 animate-[fade-in_0.5s_ease-out_1.5s_forwards]">
          <span className="text-[#27c93f]">joshua@portfolio:~$</span>
          <span className="w-1.5 h-4 bg-gray-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

