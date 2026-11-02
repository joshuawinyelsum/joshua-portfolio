import React from 'react';
import { ProjectStatus } from '../../types';

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    LIVE: 'bg-[#7EC28D]/15 text-[#7EC28D] border-[#7EC28D]/30',
    BUILT: 'bg-[#82AAFF]/15 text-[#82AAFF] border-[#82AAFF]/30',
    'IN PROGRESS': 'bg-[#E5C07B]/15 text-[#E5C07B] border-[#E5C07B]/30',
    RESEARCH: 'bg-[#C678DD]/15 text-[#C678DD] border-[#C678DD]/30',
    PLANNED: 'bg-[#A6A397]/15 text-[#A6A397] border-[#A6A397]/30',
  };

  const style = styles[status] || styles.BUILT;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'LIVE' ? 'bg-[#7EC28D] animate-pulse' : 'bg-current opacity-70'}`} />
      {status}
    </span>
  );
}

export function CommandLink({ cmd, onClick, label }: { cmd: string; onClick?: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#82AAFF]/15 text-[#82AAFF] hover:bg-[#82AAFF]/25 transition-colors font-mono text-[11px] font-semibold cursor-pointer"
      title={`Run '${cmd}'`}
    >
      <span>$ {label || cmd}</span>
    </button>
  );
}

export function SuccessMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 py-1 text-[#7EC28D] font-mono text-[13px]">
      <span className="font-bold">✓</span>
      <span>{children}</span>
    </div>
  );
}

export function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1 text-[#E57373] font-mono text-[13px]">
      <span className="font-bold">✗</span>
      <div>{children}</div>
    </div>
  );
}

export function InfoHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2 border-b border-[#45453F] pb-1.5">
      <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#F0EEE7]">
        {title}
      </span>
      {subtitle && (
        <span className="text-[10px] font-mono text-[#A6A397] ml-2">
          {subtitle}
        </span>
      )}
    </div>
  );
}
