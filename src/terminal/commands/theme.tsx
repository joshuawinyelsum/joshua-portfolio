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
                  <span className="text-gray-500 dark:text-neutral-400 w-32">Active theme:</span>
                  <span className="font-bold text-gray-900 dark:text-[#ededeb] uppercase">{ctx.theme}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-neutral-400 w-32">Preference mode:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 uppercase">{ctx.themePreference}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200/60 dark:border-[#282a32] text-gray-600 dark:text-neutral-400 space-y-1">
                <div className="text-[11px] font-semibold text-gray-800 dark:text-neutral-200">Available commands:</div>
                <div>• <code className="text-blue-600 dark:text-blue-400 font-bold">theme dark</code> — Activate dark mode</div>
                <div>• <code className="text-blue-600 dark:text-blue-400 font-bold">theme light</code> — Activate light mode</div>
                <div>• <code className="text-blue-600 dark:text-blue-400 font-bold">theme system</code> — Follow operating system preference</div>
                <div>• <code className="text-blue-600 dark:text-blue-400 font-bold">theme toggle</code> — Toggle between light and dark</div>
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
                <div>Unsupported theme: <span className="font-bold underline">{mode}</span></div>
                <div className="text-gray-500 dark:text-neutral-400 text-xs">
                  Available options: <span className="text-blue-600 dark:text-blue-400">light, dark, system, toggle</span>.
                </div>
              </div>
            ) as unknown as string,
          };
      }
    },
    getSubcommands: () => ['dark', 'light', 'system', 'toggle'],
  },
];
