import React from 'react';
import { Command } from '../types';
import {
  SIMULATION_HOST,
  SIMULATED_PROCESSES,
  SIMULATED_DISK_USAGE,
  SIMULATED_MEMORY_USAGE,
  getSimulatedDateString,
} from '../simulationData';
import { InfoHeader } from '../components/TerminalUI';

export const linuxCommands: Command[] = [
  {
    name: 'whoami',
    category: 'Linux',
    description: 'Print current simulated user identity.',
    execute: () => {
      return {
        output: (
          <div className="font-mono text-xs text-[#F0EEE7]">
            {SIMULATION_HOST.username} <span className="text-[#A6A397]">({SIMULATION_HOST.sessionType})</span>
          </div>
        ),
      };
    },
  },
  {
    name: 'hostname',
    category: 'Linux',
    description: 'Print simulated system network name.',
    execute: () => {
      return {
        output: (
          <div className="font-mono text-xs text-[#F0EEE7]">
            {SIMULATION_HOST.hostname}
          </div>
        ),
      };
    },
  },
  {
    name: 'uname',
    category: 'Linux',
    description: 'Print simulated operating system information.',
    usage: 'uname [-a]',
    execute: (args) => {
      const isAll = args.includes('-a') || args.includes('-all');
      return {
        output: (
          <div className="font-mono text-xs text-[#F0EEE7]">
            {isAll ? SIMULATION_HOST.kernel : 'Linux'}
          </div>
        ),
      };
    },
  },
  {
    name: 'date',
    category: 'Linux',
    description: 'Display current date and time.',
    execute: () => {
      return {
        output: (
          <div className="font-mono text-xs text-[#F0EEE7]">
            {getSimulatedDateString()}
          </div>
        ),
      };
    },
  },
  {
    name: 'uptime',
    category: 'Linux',
    description: 'Show how long the simulated system has been running.',
    execute: () => {
      return {
        output: (
          <div className="font-mono text-xs text-[#F0EEE7]">
            {SIMULATION_HOST.uptimeFormatted}
          </div>
        ),
      };
    },
  },
  {
    name: 'ps',
    aliases: ['top', 'htop'],
    category: 'Linux',
    description: 'Report a snapshot of the current simulated processes.',
    usage: 'ps [aux]',
    execute: () => {
      return {
        output: (
          <div className="space-y-1 font-mono text-xs text-[#A6A397]">
            <div className="flex gap-4 font-bold border-b border-[#45453F] pb-1 text-[#F0EEE7]">
              <span className="w-12">PID</span>
              <span className="w-16">USER</span>
              <span className="w-12">%CPU</span>
              <span className="w-12">%MEM</span>
              <span className="w-16">TIME</span>
              <span>COMMAND</span>
            </div>
            {SIMULATED_PROCESSES.map((p) => (
              <div key={p.pid} className="flex gap-4 items-center">
                <span className="w-12 text-[#82AAFF]">{p.pid}</span>
                <span className="w-16 text-[#7A786E]">{p.user}</span>
                <span className="w-12 text-[#7A786E]">{p.cpu}</span>
                <span className="w-12 text-[#7A786E]">{p.mem}</span>
                <span className="w-16 text-[#7A786E]">{p.time}</span>
                <span className="text-[#F0EEE7]">{p.command}</span>
              </div>
            ))}
          </div>
        ),
      };
    },
  },
  {
    name: 'df',
    category: 'Linux',
    description: 'Report virtual filesystem disk space usage.',
    usage: 'df [-h]',
    execute: () => {
      return {
        output: (
          <pre className="p-3 rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7] font-mono text-xs whitespace-pre overflow-x-auto leading-relaxed">
            {SIMULATED_DISK_USAGE}
          </pre>
        ),
      };
    },
  },
  {
    name: 'free',
    category: 'Linux',
    description: 'Display simulated amount of free and used memory in the system.',
    usage: 'free [-h]',
    execute: () => {
      return {
        output: (
          <pre className="p-3 rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7] font-mono text-xs whitespace-pre overflow-x-auto leading-relaxed">
            {SIMULATED_MEMORY_USAGE}
          </pre>
        ),
      };
    },
  },
  {
    name: 'history',
    category: 'Linux',
    description: 'Display commands executed during this session.',
    execute: (_args, ctx) => {
      if (ctx.commandHistory.length === 0) {
        return {
          output: <div className="font-mono text-xs text-[#A6A397]">No commands in session history yet.</div>,
        };
      }
      return {
        output: (
          <div className="space-y-1 font-mono text-xs">
            <InfoHeader title="SESSION COMMAND HISTORY" subtitle={`${ctx.commandHistory.length} executed`} />
            <div className="space-y-0.5 pl-2">
              {ctx.commandHistory.map((cmd, idx) => (
                <div key={idx} className="flex gap-3 text-[#A6A397]">
                  <span className="w-8 text-right text-[#7A786E]">{idx + 1}</span>
                  <span className="text-[#F0EEE7]">{cmd}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      };
    },
  },
  {
    name: 'clear',
    aliases: ['cls'],
    category: 'Linux',
    description: 'Clear the terminal output screen.',
    execute: (_args, ctx) => {
      ctx.clearHistory();
      return { isClear: true };
    },
  },
];
