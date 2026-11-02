import { useCommandCenter } from '../contexts/CommandCenterContext';

export function TerminalPreview() {
  const { open } = useCommandCenter();

  return (
    <div
      onClick={() => open()}
      className="group relative w-full max-w-sm mx-auto sm:max-w-md bg-[#20211F] text-[#F0EEE7] backdrop-blur-md rounded-lg shadow-2xl border border-[#45453F] overflow-hidden cursor-pointer hover:border-[#6B685F] transition-colors duration-300"
    >
      {/* Terminal Header (Always Warm Dark) */}
      <div className="flex items-center px-4 py-2 bg-[#292A27] border-b border-[#45453F] relative">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-[#A6A397] font-semibold text-[9px] tracking-[0.2em] uppercase font-mono">
          JOSHUA@PORTFOLIO
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="absolute right-2 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md hover:bg-[#32332F] text-[#A6A397] hover:text-[#F0EEE7] md:hidden transition-colors"
          aria-label="Open Command Center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Terminal Body (Always Warm Dark) */}
      <div className="p-4 sm:p-5 font-mono text-[12px] sm:text-[13px] text-[#A6A397] leading-relaxed bg-[#20211F]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#82AAFF] font-bold">$</span>
          <span className="text-[#F0EEE7] font-semibold">explore</span>
        </div>
        <div className="text-[#A6A397] mb-4 opacity-0 animate-[fade-in_0.5s_ease-out_0.5s_forwards]">
          Interactive developer workstation simulation.
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-[#82AAFF]">tour, inspect cfss, trace cfss, challenge</span>
            <span className="text-[#82AAFF]">ls, cat README.md, security, theme toggle</span>
          </div>
        </div>

        <div className="border-t border-dashed border-[#45453F] pt-3 mt-3 flex items-center justify-between text-[10px] text-[#7A786E] font-sans tracking-widest opacity-0 animate-[fade-in_0.5s_ease-out_1s_forwards]">
          <span>CTRL K</span>
          <span className="text-[#A6A397] font-mono">/</span>
          <span>CLICK TO LAUNCH</span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[#F0EEE7] opacity-0 animate-[fade-in_0.5s_ease-out_1.5s_forwards]">
          <span className="text-[#82AAFF] font-bold">joshua@portfolio:~$</span>
          <span className="w-1.5 h-4 bg-[#82AAFF] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
