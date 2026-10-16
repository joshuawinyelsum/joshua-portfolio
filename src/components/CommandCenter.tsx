import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface HistoryItem {
  id: number;
  type: 'input' | 'output';
  content: React.ReactNode;
}

export function CommandCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: Date.now(),
      type: 'output',
      content: (
        <div className="text-gray-400 mb-4">
          Explore like a developer.
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-blue-400">projects, research, cv</span>
          </div>
          <div className="mt-3 text-[10px] text-gray-500 font-sans tracking-widest">
            [ CTRL K → ENTER ]
          </div>
        </div>
      )
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const availableCommands = [
    'projects', 'cpw', 'research', 'experience', 'skills', 'cv', 'github', 
    'contact', 'about', 'clear', 'exit', 'help', 'whoami', 'stack'
  ];

  const navigateTo = (path: string) => {
    onClose();
    if (path.startsWith('/#')) {
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(path.substring(2));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(path.substring(2));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (path.startsWith('http') || path.startsWith('mailto')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  const pushOutput = (content: React.ReactNode) => {
    setHistory(prev => [...prev, { id: Date.now() + Math.random(), type: 'output', content }]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    
    // Add to visual history
    setHistory(prev => [...prev, {
      id: Date.now(),
      type: 'input',
      content: trimmed
    }]);

    if (!trimmed) return;

    // Add to command history for up/down navigation
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Aliases
    let resolvedCmd = trimmed;
    if (['project', 'work'].includes(trimmed)) resolvedCmd = 'projects';
    if (['resume'].includes(trimmed)) resolvedCmd = 'cv';
    if (['lab'].includes(trimmed)) resolvedCmd = 'research';

    switch (resolvedCmd) {
      case 'help':
        pushOutput(
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 w-full max-w-sm mt-2 mb-4">
            <span className="text-blue-400">projects</span><span>Explore projects</span>
            <span className="text-blue-400">cpw</span><span>Coach Prosper’s World</span>
            <span className="text-blue-400">research</span><span>Explore research</span>
            <span className="text-blue-400">experience</span><span>View experience</span>
            <span className="text-blue-400">skills</span><span>View technical skills</span>
            <span className="text-blue-400">cv</span><span>Open interactive CV</span>
            <span className="text-blue-400">github</span><span>Open GitHub</span>
            <span className="text-blue-400">contact</span><span>Contact Joshua</span>
            <span className="text-blue-400">about</span><span>About Joshua</span>
            <span className="text-blue-400">whoami</span><span>Developer identity</span>
            <span className="text-blue-400">stack</span><span>Tech stack</span>
            <span className="text-blue-400">clear</span><span>Clear terminal</span>
            <span className="text-blue-400">exit</span><span>Close console</span>
          </div>
        );
        break;
      case 'cpw':
      case 'coach':
      case 'coachprospersworld':
        pushOutput(<span className="text-green-400">Navigating to Coach Prosper’s World case study...</span>);
        setTimeout(() => navigateTo('/case-study/coach-prospers-world'), 300);
        break;
      case 'projects':
        pushOutput(<span className="text-green-400">Navigating to Projects...</span>);
        setTimeout(() => navigateTo('/#work'), 300);
        break;
      case 'research':
        pushOutput(<span className="text-green-400">Navigating to Research...</span>);
        setTimeout(() => navigateTo('/#research'), 300);
        break;
      case 'experience':
        pushOutput(<span className="text-green-400">Navigating to Experience...</span>);
        setTimeout(() => navigateTo('/#experience'), 300);
        break;
      case 'skills':
        pushOutput(<span className="text-green-400">Navigating to Engineering Skills...</span>);
        setTimeout(() => navigateTo('/#engineering'), 300);
        break;
      case 'cv':
        pushOutput(<span className="text-green-400">Opening interactive CV...</span>);
        setTimeout(() => navigateTo('/cv'), 300);
        break;
      case 'github':
        pushOutput(<span className="text-green-400">Opening GitHub...</span>);
        setTimeout(() => navigateTo('https://github.com/joshuawinyelsum'), 300);
        break;
      case 'contact':
        pushOutput(<span className="text-green-400">Navigating to Contact...</span>);
        setTimeout(() => navigateTo('/#contact'), 300);
        break;
      case 'about':
        pushOutput(<span className="text-green-400">Navigating to About...</span>);
        setTimeout(() => navigateTo('/#about'), 300);
        break;
      case 'whoami':
        pushOutput(
          <div className="text-gray-300 my-2 leading-relaxed">
            Joshua Winyelsum<br/>
            <br/>
            Systems Engineer<br/>
            ML & Data Systems Researcher<br/>
            Computer Science Student
          </div>
        );
        break;
      case 'stack':
        pushOutput(
          <div className="text-gray-300 my-2 leading-relaxed">
            Languages: TypeScript, Python, C++, Go, Rust<br/>
            Frontend: React, Tailwind CSS, Vite<br/>
            Backend: Node.js, Express, PostgreSQL, MongoDB<br/>
            Systems: Docker, Linux, AWS, CI/CD
          </div>
        );
        break;
      case 'clear':
        clearHistory();
        break;
      case 'exit':
        onClose();
        break;
      default:
        pushOutput(
          <div className="text-red-400 my-2">
            command not found: {trimmed}<br/>
            <span className="text-gray-400">Type 'help' to see available commands.</span>
          </div>
        );
    }
  };

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = '';
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto scroll to bottom
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [history]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      const match = availableCommands.find(cmd => cmd.startsWith(input.toLowerCase()));
      if (match) {
        setInput(match);
      }
    }
  };

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      className={`backdrop:bg-black/60 fixed inset-0 z-[100] m-0 w-full max-w-none h-full max-h-none bg-transparent p-4 sm:p-6 md:pt-[10vh] flex-col items-center duration-200 motion-reduce:duration-0 motion-reduce:transition-none ${isOpen ? 'flex animate-in fade-in-0' : 'hidden'}`}
      aria-label="Developer Console"
    >
      <div 
        className="w-full max-w-[750px] h-[60vh] min-h-[400px] max-h-[800px] bg-[#0d1117] rounded-xl shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)] border border-[#30363d] flex flex-col font-mono text-[13px] sm:text-[14px] overflow-hidden"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-center px-4 py-3 bg-[#161b22] border-b border-[#30363d] relative shrink-0">
          <div className="absolute left-4 flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[#8b949e] font-semibold text-[11px] tracking-[0.2em]">JOSHUA@PORTFOLIO</span>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-5 overflow-y-auto text-gray-300">
          {history.map((item) => (
            <div key={item.id} className="mb-1">
              {item.type === 'input' ? (
                <div className="flex items-start gap-2 text-gray-100">
                  <span className="text-[#27c93f] shrink-0">joshua@portfolio:~$</span>
                  <span>{item.content}</span>
                </div>
              ) : (
                <div className="pl-0">{item.content}</div>
              )}
            </div>
          ))}
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#27c93f] shrink-0">joshua@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent border-0 p-0 m-0 text-gray-100 focus:ring-0 focus:outline-none caret-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </dialog>
  );
}
