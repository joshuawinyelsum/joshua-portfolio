import React from 'react';
import { Command } from '../types';
import { InfoHeader, SuccessMsg, ErrorMsg } from '../components/TerminalUI';

export const themeCommands: Command[] = [
  {
    name: 'theme',
    aliases: ['mode', 'color-scheme'],
    category: 'Theme',
    description: 'Inspect or control website theme (light, dark, system, toggle).',
    usage: 'theme [dark|light|system|toggle]',
    examples: ['theme', 'theme dark', 'theme light', 'theme system', 'theme toggle'],
    execute: (args, ctx) => {
      const mode = args[0]?.toLowerCase().trim();

      if (!mode) {
        return {
          output: (
            <div className="space-y-2 font-mono text-xs">
              <InfoHeader title="WEBSITE THEME CONTROLS" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#A6A397] w-36">Website active theme:</span>
                  <span className="font-bold text-[#F0EEE7] uppercase">{ctx.theme}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#A6A397] w-36">Preference mode:</span>
                  <span className="font-bold text-[#82AAFF] uppercase">{ctx.themePreference}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#A6A397]">
                  <span>Terminal mode:</span>
                  <span className="text-[#7EC28D] font-bold">INDEPENDENT DARK (#20211F)</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#45453F] text-[#A6A397] space-y-1">
                <div className="text-[11px] font-semibold text-[#F0EEE7]">Available website theme commands:</div>
                <div>• <code className="text-[#82AAFF] font-bold">theme dark</code>: Activate dark mode across website</div>
                <div>• <code className="text-[#82AAFF] font-bold">theme light</code>: Activate light mode across website</div>
                <div>• <code className="text-[#82AAFF] font-bold">theme system</code>: Follow OS appearance preference</div>
                <div>• <code className="text-[#82AAFF] font-bold">theme toggle</code>: Toggle between light and dark</div>
              </div>
            </div>
          ),
        };
      }

      switch (mode) {
        case 'dark':
          ctx.setThemePreference('dark');
          return {
            output: <SuccessMsg>Dark theme activated.</SuccessMsg>,
          };
        case 'light':
          ctx.setThemePreference('light');
          return {
            output: <SuccessMsg>Light theme activated.</SuccessMsg>,
          };
        case 'system': {
          ctx.setThemePreference('system');
          const isSystemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
          return {
            output: (
              <SuccessMsg>
                System appearance preference activated (currently {isSystemDark ? 'dark' : 'light'}).
              </SuccessMsg>
            ),
          };
        }
        case 'toggle': {
          const next = ctx.theme === 'dark' ? 'light' : 'dark';
          ctx.toggleTheme();
          return {
            output: <SuccessMsg>Theme toggled to {next}.</SuccessMsg>,
          };
        }
        default:
          return {
            error: (
              <div className="space-y-1">
                <div>Unsupported theme: <span className="font-bold underline text-[#E57373]">{mode}</span></div>
                <div className="text-[#A6A397] text-xs">
                  Available options: <span className="text-[#82AAFF]">light, dark, system, toggle</span>.
                </div>
              </div>
            ) as unknown as string,
          };
      }
    },
    getSubcommands: () => ['dark', 'light', 'system', 'toggle'],
  },
];
