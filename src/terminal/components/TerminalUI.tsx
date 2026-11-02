import React from 'react';
import { ProjectStatus } from '../../types';

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    LIVE: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    BUILT: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
    'IN PROGRESS': 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    RESEARCH: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30',
    PLANNED: 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30',
  };

  const style = styles[status] || styles.BUILT;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'LIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-current opacity-70'}`} />
      {status}
    </span>
  );
}

export function CommandLink({ cmd, onClick, label }: { cmd: string; onClick?: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 transition-colors font-mono text-[11px] font-semibold cursor-pointer"
      title={`Run '${cmd}'`}
    >
      <span>$ {label || cmd}</span>
    </button>
  );
}

export function SuccessMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 py-1 text-emerald-700 dark:text-emerald-400 font-mono text-[13px]">
      <span className="font-bold">✓</span>
      <span>{children}</span>
    </div>
  );
}

export function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1 text-rose-700 dark:text-rose-400 font-mono text-[13px]">
      <span className="font-bold">✗</span>
      <div>{children}</div>
    </div>
  );
}

export function InfoHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2 border-b border-gray-300/60 dark:border-[#282a32] pb-1.5">
      <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-gray-700 dark:text-neutral-300">
        {title}
      </span>
      {subtitle && (
        <span className="text-[10px] font-mono text-gray-400 dark:text-neutral-500 ml-2">
          {subtitle}
        </span>
      )}
    </div>
  );
}
