import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { projects } from '../data/projects';
import { skills } from '../data/skills';
import { experience } from '../data/experience';
import { researchAreas } from '../data/research';
import { socialLinks, contactInfo } from '../data/social';
import { findCommand, suggestCommand, getCompletions } from '../terminal/registry';
import { CommandContext } from '../terminal/types';

interface HistoryItem {
  id: string;
  type: 'input' | 'output';
  content: React.ReactNode;
}

export function CommandCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { theme, themePreference, setThemePreference, toggleTheme } = useTheme();

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autocompleteHint, setAutocompleteHint] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const navigateTo = (path: string) => {
    onClose();
    if (path.startsWith('/#')) {
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
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Build the execution context passed to all commands
  const getContext = (): CommandContext => ({
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

  // Initial welcome greeting (warm dark palette)
  const getWelcomeContent = (): React.ReactNode => (
    <div className="space-y-3 pb-3 text-xs font-mono">
      <div className="text-[#F0EEE7] font-bold text-sm">
        JOSHUA WINYELSUM — ENGINEERING COMMAND CENTER [v2.4]
      </div>
      <p className="text-[#A6A397] leading-relaxed">
        Interactive engineering console. Navigate portfolio sections, inspect verified project specifications, review architecture, and control the website theme.
      </p>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[10px] uppercase font-bold text-[#7A786E] tracking-wider">Quick Commands:</span>
        <button
          type="button"
          onClick={() => executeCommand('projects')}
          className="px-2 py-0.5 rounded bg-[#292A27] border border-[#45453F] text-[#82AAFF] hover:bg-[#32332F] text-[11px] font-semibold cursor-pointer transition-colors"
        >
          $ projects
        </button>
        <button
          type="button"
          onClick={() => executeCommand('skills')}
          className="px-2 py-0.5 rounded bg-[#292A27] border border-[#45453F] text-[#82AAFF] hover:bg-[#32332F] text-[11px] font-semibold cursor-pointer transition-colors"
        >
          $ skills
        </button>
        <button
          type="button"
          onClick={() => executeCommand('theme toggle')}
          className="px-2 py-0.5 rounded bg-[#292A27] border border-[#45453F] text-[#82AAFF] hover:bg-[#32332F] text-[11px] font-semibold cursor-pointer transition-colors"
        >
          $ theme toggle
        </button>
        <button
          type="button"
          onClick={() => executeCommand('help')}
          className="px-2 py-0.5 rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7] hover:bg-[#32332F] text-[11px] font-semibold cursor-pointer transition-colors"
        >
          $ help
        </button>
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

    // Record user command in visual output
    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-input`,
        type: 'input',
        content: trimmed,
      },
    ]);

    if (!trimmed) return;

    // Record in history navigation buffer
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = findCommand(commandName);

    if (command) {
      try {
        const ctx = getContext();
        const result = await command.execute(args, ctx);

        if (result.isClear) {
          // Handled via ctx.clearHistory
          return;
        }

        if (result.error) {
          pushOutput(
            <div className="py-1 text-[#E57373] font-mono text-xs space-y-1">
              <div className="flex items-start gap-1.5 font-semibold">
                <span>✗</span>
                <span>{typeof result.error === 'string' ? result.error : result.error}</span>
              </div>
              {command.usage && (
                <div className="text-[#A6A397] text-[11px] pl-4">
                  Usage: {command.usage}
                </div>
              )}
            </div>
          );
        } else if (result.output) {
          pushOutput(result.output);
        }
      } catch (err: unknown) {
        pushOutput(
          <div className="py-1 text-[#E57373] font-mono text-xs">
            Execution error: {err instanceof Error ? err.message : String(err)}
          </div>
        );
      }
    } else {
      // Unknown command: calculate fuzzy match suggestion
      const suggestion = suggestCommand(commandName);
      pushOutput(
        <div className="py-1 text-xs font-mono space-y-1">
          <div className="text-[#E57373]">
            Command not found: <span className="font-bold">{commandName}</span>
          </div>
          {suggestion && (
            <div className="text-[#A6A397] flex items-center gap-1.5">
              <span>Did you mean:</span>
              <button
                type="button"
                onClick={() => executeCommand(suggestion)}
                className="text-[#82AAFF] font-bold hover:underline cursor-pointer"
              >
                {suggestion}
              </button>
              <span>?</span>
            </div>
          )}
          <div className="text-[11px] text-[#7A786E]">
            Type <button type="button" onClick={() => executeCommand('help')} className="text-[#82AAFF] hover:underline cursor-pointer">help</button> to see all available commands.
          </div>
        </div>
      );
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
      className={`backdrop:bg-black/70 fixed inset-0 z-[100] m-0 w-full max-w-none h-full max-h-none bg-transparent p-3 sm:p-6 md:pt-[8vh] flex-col items-center duration-200 motion-reduce:duration-0 motion-reduce:transition-none ${
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
        className="w-full max-w-3xl h-[72vh] min-h-[440px] max-h-[820px] bg-[#20211F] text-[#F0EEE7] rounded-xl shadow-2xl border border-[#45453F] flex flex-col font-mono text-[13px] overflow-hidden"
        role="document"
        onClick={(e) => {
          e.stopPropagation();
          // Refocus input unless user is selecting text
          const selection = window.getSelection();
          if (!selection || selection.isCollapsed) {
            inputRef.current?.focus();
          }
        }}
      >
        {/* Terminal Window Header (Always Warm Dark) */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#292A27] border-b border-[#45453F] select-none shrink-0">
          {/* Traffic light dots */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center text-[8px] text-black/60 group"
              title="Close terminal (Esc)"
              aria-label="Close terminal"
            >
              <span className="opacity-0 group-hover:opacity-100 font-bold leading-none">×</span>
            </button>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>

          {/* Centered title / Identity */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F0EEE7]">
              JOSHUA@PORTFOLIO
            </span>
            <span className="text-[#45453F] hidden sm:inline">|</span>
            <span className="text-[10px] text-[#A6A397] hidden sm:inline tracking-wider">
              COMMAND CENTER
            </span>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2">
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
              className="p-1 rounded text-[#A6A397] hover:text-[#F0EEE7] hover:bg-[#32332F] transition-colors cursor-pointer"
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
              className="p-1 rounded text-[#A6A397] hover:text-[#F0EEE7] hover:bg-[#32332F] transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Terminal Body Scroll Area (Always Warm Dark) */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-[#20211F] text-[#F0EEE7] space-y-3">
          {history.map((item) => (
            <div key={item.id}>
              {item.type === 'input' ? (
                <div className="flex items-start gap-2 text-[#F0EEE7] font-semibold pt-1">
                  <span className="text-[#82AAFF] shrink-0 select-none">joshua@portfolio:~$</span>
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
            <span className="text-[#82AAFF] font-bold shrink-0 select-none">
              joshua@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent border-0 p-0 m-0 text-[#F0EEE7] font-mono text-[13px] focus:ring-0 focus:outline-none caret-[#F0EEE7] placeholder:text-[#7A786E]"
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
              placeholder="type 'help', 'projects', 'theme dark'..."
              aria-label="Terminal command input"
            />
          </div>
          <div ref={bottomRef} />
        </div>

        {/* Footer shortcuts info (Always Warm Dark) */}
        <div className="px-4 py-2 bg-[#292A27] border-t border-[#45453F] text-[10px] text-[#A6A397] flex flex-col sm:flex-row sm:items-center justify-between gap-1 select-none shrink-0">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#32332F] border border-[#45453F] text-[#F0EEE7]">TAB</kbd> Complete</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#32332F] border border-[#45453F] text-[#F0EEE7]">↑/↓</kbd> History</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#32332F] border border-[#45453F] text-[#F0EEE7]">CTRL+K</kbd> Toggle</span>
          </div>
          <div className="text-[10px] text-[#7A786E]">
            Type <code className="text-[#82AAFF] font-semibold">exit</code> or press <kbd className="px-1.5 py-0.5 rounded bg-[#32332F] border border-[#45453F] text-[#F0EEE7]">ESC</kbd> to return
          </div>
        </div>
      </div>
    </dialog>
  );
}
