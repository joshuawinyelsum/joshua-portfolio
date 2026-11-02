import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { projects } from '../data/projects';
import { skills } from '../data/skills';
import { experience } from '../data/experience';
import { researchAreas } from '../data/research';
import { socialLinks, contactInfo } from '../data/social';
import { getCompletions } from '../terminal/registry';
import { executeCommandLine } from '../terminal/commandExecutor';
import { CommandContext, TraceState, ChallengeState } from '../terminal/types';
import { isApprovedInternalRoute, isApprovedExternalUrl } from '../terminal/navigationAllowlist';

interface HistoryItem {
  id: string;
  type: 'input' | 'output';
  content: React.ReactNode;
  promptPath?: string;
}

export function CommandCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { theme, themePreference, setThemePreference, toggleTheme } = useTheme();

  // Session state: isolated to each visitor session
  const [cwd, setCwd] = useState('/home/joshua');
  const [tourStep, setTourStep] = useState(1);
  const [traceState, setTraceState] = useState<TraceState>({ project: 'cfss', step: 1, active: false });
  const [challengeProgress, setChallengeProgress] = useState<Record<number, ChallengeState>>({});

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autocompleteHint, setAutocompleteHint] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Path formatter for the terminal prompt (e.g. /home/joshua -> ~)
  const formatPromptPath = (path: string): string => {
    if (path === '/home/joshua') return '~';
    if (path.startsWith('/home/joshua/')) return '~' + path.substring(12);
    return path;
  };

  const displayPromptPath = formatPromptPath(cwd);

  const setChallengeAnswer = (challengeId: number, selected: string, correct: boolean) => {
    setChallengeProgress((prev) => ({
      ...prev,
      [challengeId]: { answered: true, selected, correct },
    }));
  };

  // Safe navigation restricted to allowlist
  const navigateTo = (path: string) => {
    onClose();

    if (path.startsWith('/#')) {
      if (!isApprovedInternalRoute(path)) return;
      const targetId = path.substring(2);
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (path.startsWith('http') || path.startsWith('mailto') || path.startsWith('tel')) {
      if (!isApprovedExternalUrl(path)) return;
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      if (!isApprovedInternalRoute(path)) return;
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const openExternal = (url: string) => {
    if (!isApprovedExternalUrl(url)) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Build the execution context passed to all commands
  const getContext = (): CommandContext => ({
    cwd,
    setCwd,
    tourStep,
    setTourStep,
    traceState,
    setTraceState,
    challengeProgress,
    setChallengeAnswer,
    navigate: navigateTo,
    openExternal,
    theme,
    themePreference,
    setThemePreference,
    toggleTheme,
    clearHistory: () => setHistory([]),
    closeTerminal: onClose,
    commandHistory,
    projects,
    skills,
    experience,
    researchAreas,
    socialLinks,
    contactInfo,
    runCommand: (cmdString: string) => executeCommand(cmdString),
  });

  // Initial welcome greeting
  const getWelcomeContent = (): React.ReactNode => (
    <div className="space-y-3 pb-3 text-xs font-mono">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#45453F] pb-2">
        <div className="text-[#F0EEE7] font-bold text-sm">
          JOSHUA WINYELSUM — DEVELOPER WORKSTATION [v2.5]
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#292A27] text-[#7EC28D] border border-[#7EC28D]/30 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7EC28D]" />
          <span>SIMULATED LINUX ENVIRONMENT</span>
        </span>
      </div>
      <p className="text-[#A6A397] leading-relaxed">
        Interactive developer console and simulated Linux environment. Inspect project architectures, simulate request lifecycles, solve systems challenges, and explore the read-only virtual filesystem.
      </p>

      {/* Recruiter Quick Launcher Chips */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] uppercase font-bold text-[#7A786E] tracking-wider block">
          Featured Experiences:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => executeCommand('tour')}
            className="px-2.5 py-1.5 min-h-[34px] flex items-center rounded bg-[#82AAFF]/15 border border-[#82AAFF]/30 text-[#82AAFF] hover:bg-[#82AAFF]/25 text-[11px] font-semibold cursor-pointer transition-colors"
          >
            $ tour (Guided Walkthrough)
          </button>
          <button
            type="button"
            onClick={() => executeCommand('inspect cfss')}
            className="px-2.5 py-1.5 min-h-[34px] flex items-center rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7] hover:bg-[#32332F] text-[11px] font-semibold cursor-pointer transition-colors"
          >
            $ inspect cfss
          </button>
          <button
            type="button"
            onClick={() => executeCommand('trace cfss')}
            className="px-2.5 py-1.5 min-h-[34px] flex items-center rounded bg-[#292A27] border border-[#45453F] text-[#7EC28D] hover:bg-[#32332F] text-[11px] font-semibold cursor-pointer transition-colors"
          >
            $ trace cfss
          </button>
          <button
            type="button"
            onClick={() => executeCommand('challenge')}
            className="px-2.5 py-1.5 min-h-[34px] flex items-center rounded bg-[#292A27] border border-[#45453F] text-[#E5C07B] hover:bg-[#32332F] text-[11px] font-semibold cursor-pointer transition-colors"
          >
            $ challenge
          </button>
          <button
            type="button"
            onClick={() => executeCommand('security')}
            className="px-2.5 py-1.5 min-h-[34px] flex items-center rounded bg-[#292A27] border border-[#45453F] text-[#C678DD] hover:bg-[#32332F] text-[11px] font-semibold cursor-pointer transition-colors"
          >
            $ security
          </button>
          <button
            type="button"
            onClick={() => executeCommand('help')}
            className="px-2.5 py-1.5 min-h-[34px] flex items-center rounded bg-[#292A27] border border-[#45453F] text-[#A6A397] hover:text-[#F0EEE7] hover:bg-[#32332F] text-[11px] font-semibold cursor-pointer transition-colors"
          >
            $ help
          </button>
        </div>
      </div>
    </div>
  );

  // Initialize history on first load
  useEffect(() => {
    if (history.length === 0) {
      setHistory([
        {
          id: 'welcome',
          type: 'output',
          content: getWelcomeContent(),
        },
      ]);
    }
  }, []);

  const pushOutput = (content: React.ReactNode) => {
    setHistory((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, type: 'output', content },
    ]);
  };

  const executeCommand = async (rawInput: string) => {
    const trimmed = rawInput.trim();
    setAutocompleteHint(null);

    // Record user command in visual output with current prompt path
    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-input`,
        type: 'input',
        content: trimmed,
        promptPath: displayPromptPath,
      },
    ]);

    if (!trimmed) return;

    // Record in history navigation buffer
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const ctx = getContext();
    const result = await executeCommandLine(trimmed, ctx);

    if (result.isClear) {
      // Handled in ctx.clearHistory()
      return;
    }

    if (result.output) {
      pushOutput(result.output);
    }
  };

  // Keyboard navigation & autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const ctx = getContext();
      const completions = getCompletions(input, ctx);
      if (completions.length === 1) {
        setInput(completions[0] + ' ');
        setAutocompleteHint(null);
      } else if (completions.length > 1) {
        setAutocompleteHint(completions.join('   '));
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  // Dialog open/close lifecycle
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = '';
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    }
  }, [isOpen]);

  // Scroll to bottom on new output
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Global keydown (Escape to close)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={`backdrop:bg-black/70 fixed inset-0 z-[100] m-0 w-full max-w-none h-full max-h-none bg-transparent p-2 sm:p-4 md:pt-[6vh] flex flex-col items-center justify-center sm:justify-start duration-200 motion-reduce:duration-0 motion-reduce:transition-none ${
        isOpen ? 'flex animate-in fade-in-0' : 'hidden'
      }`}
      aria-label="Engineering Command Center"
    >
      {/*
        PERMANENT WARM DARK CONTAINER:
        Always uses warm charcoal (#20211F), surface (#292A27), ivory text (#F0EEE7),
        muted warm grey (#A6A397), and borders (#45453F) regardless of website light/dark theme.
      */}
      <div
        className="w-full max-w-3xl h-[92vh] sm:h-[80vh] max-h-[94vh] min-h-0 bg-[#20211F] text-[#F0EEE7] rounded-lg sm:rounded-xl shadow-2xl border border-[#45453F] flex flex-col font-mono text-[13px] overflow-hidden"
        role="document"
        onClick={(e) => {
          e.stopPropagation();
          const selection = window.getSelection();
          if (!selection || selection.isCollapsed) {
            inputRef.current?.focus();
          }
        }}
      >
        {/* Terminal Window Header (Warm Dark) */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-[#292A27] border-b border-[#45453F] select-none shrink-0">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-pointer transition"
              title="Close terminal"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
            </button>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>

          {/* Centered title / Identity */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#F0EEE7]">
              <span className="hidden sm:inline">JOSHUA@WINYELSUM-WORKSTATION</span>
              <span className="inline sm:hidden">JOSHUA@PORTFOLIO</span>
            </span>
            <span className="text-[#45453F] hidden sm:inline">:</span>
            <span className="text-[10px] text-[#82AAFF] hidden sm:inline font-bold">
              {displayPromptPath}
            </span>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Website Theme Controller Capsule */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border border-[#45453F] bg-[#32332F] text-[#F0EEE7] hover:bg-[#3E403B] transition-colors cursor-pointer"
              title={`Switch website to ${theme === 'dark' ? 'light' : 'dark'} mode (terminal remains dark)`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#82AAFF]" />
              <span>SITE: {theme.toUpperCase()}</span>
            </button>

            {/* Clear Screen */}
            <button
              type="button"
              onClick={() => setHistory([])}
              className="p-1.5 sm:p-1 min-w-[32px] min-h-[32px] flex items-center justify-center rounded text-[#A6A397] hover:text-[#F0EEE7] hover:bg-[#32332F] transition-colors cursor-pointer"
              title="Clear terminal output (Ctrl+L)"
              aria-label="Clear output"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-1 min-w-[32px] min-h-[32px] flex items-center justify-center rounded text-[#A6A397] hover:text-[#F0EEE7] hover:bg-[#32332F] transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Terminal Body Scroll Area */}
        <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto bg-[#20211F] text-[#F0EEE7] space-y-3">
          {history.map((item) => (
            <div key={item.id}>
              {item.type === 'input' ? (
                <div className="flex items-start gap-2 text-[#F0EEE7] font-semibold pt-1">
                  <span className="text-[#82AAFF] shrink-0 select-none text-xs sm:text-[13px]">
                    joshua@portfolio:{item.promptPath || '~'}$
                  </span>
                  <span className="break-all">{item.content}</span>
                </div>
              ) : (
                <div className="pl-0">{item.content}</div>
              )}
            </div>
          ))}

          {/* Autocomplete hint box */}
          {autocompleteHint && (
            <div className="p-2 rounded bg-[#292A27] border border-[#45453F] text-xs text-[#A6A397]">
              <span className="text-[10px] uppercase font-bold text-[#7A786E] mr-2">Completions:</span>
              <span>{autocompleteHint}</span>
            </div>
          )}

          {/* Active input row */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[#82AAFF] font-bold shrink-0 select-none text-xs sm:text-[13px]">
              <span className="hidden sm:inline">joshua@portfolio:{displayPromptPath}$</span>
              <span className="inline sm:hidden">joshua:{displayPromptPath}$</span>
            </span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent border-0 p-0 m-0 text-[#F0EEE7] font-mono text-[16px] sm:text-[13px] focus:ring-0 focus:outline-none caret-[#F0EEE7] placeholder:text-[#7A786E]"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setAutocompleteHint(null);
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="type 'tour', 'inspect cfss', 'help', 'ls'..."
              aria-label="Terminal command input"
            />
          </div>
          <div ref={bottomRef} />
        </div>

        {/* Mobile Touch Quick Launcher Strip */}
        <div className="px-3 py-1.5 bg-[#252623] border-t border-[#45453F] flex items-center gap-1.5 overflow-x-auto shrink-0 select-none">
          <span className="text-[10px] uppercase font-bold text-[#7A786E] shrink-0 mr-1">QUICK:</span>
          {[
            { label: 'tour', cmd: 'tour', color: 'text-[#82AAFF] bg-[#82AAFF]/10 border-[#82AAFF]/25' },
            { label: 'inspect cfss', cmd: 'inspect cfss', color: 'text-[#F0EEE7] bg-[#2F302C] border-[#45453F]' },
            { label: 'trace cfss', cmd: 'trace cfss', color: 'text-[#7EC28D] bg-[#7EC28D]/10 border-[#7EC28D]/25' },
            { label: 'challenge', cmd: 'challenge', color: 'text-[#E5C07B] bg-[#E5C07B]/10 border-[#E5C07B]/25' },
            { label: 'security', cmd: 'security', color: 'text-[#C678DD] bg-[#C678DD]/10 border-[#C678DD]/25' },
            { label: 'ls', cmd: 'ls', color: 'text-[#A6A397] bg-[#2F302C] border-[#45453F]' },
            { label: 'cat ABOUT.md', cmd: 'cat ABOUT.md', color: 'text-[#A6A397] bg-[#2F302C] border-[#45453F]' },
            { label: 'help', cmd: 'help', color: 'text-[#A6A397] bg-[#2F302C] border-[#45453F]' },
          ].map((chip) => (
            <button
              key={chip.cmd}
              type="button"
              onClick={() => executeCommand(chip.cmd)}
              className={`px-2 py-1 min-h-[30px] rounded text-[10.5px] font-semibold border whitespace-nowrap shrink-0 transition-colors cursor-pointer hover:brightness-125 ${chip.color}`}
            >
              ${chip.label}
            </button>
          ))}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2 bg-[#292A27] border-t border-[#45453F] text-[10px] text-[#A6A397] flex flex-col sm:flex-row sm:items-center justify-between gap-1 select-none shrink-0">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#32332F] border border-[#45453F] text-[#F0EEE7]">TAB</kbd> Complete</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#32332F] border border-[#45453F] text-[#F0EEE7]">↑/↓</kbd> History</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#32332F] border border-[#45453F] text-[#F0EEE7]">CTRL+K</kbd> Toggle</span>
          </div>
          <div className="text-[10px] text-[#7A786E]">
            Type <code className="text-[#82AAFF] font-semibold">tour</code> for guided walkthrough • <code className="text-[#7EC28D] font-semibold">security</code> for audit
          </div>
        </div>
      </div>
    </dialog>
  );
}
