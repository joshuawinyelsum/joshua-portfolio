import { Command, CommandCategory, CommandContext } from './types';
import { filesystemCommands } from './commands/filesystem';
import { linuxCommands } from './commands/linux';
import { tourCommand } from './commands/tour';
import { inspectCommand } from './commands/inspect';
import { traceCommand } from './commands/trace';
import { challengeCommand } from './commands/challenge';
import { securityCommand } from './commands/security';
import { projectCommands } from './commands/projects';
import { navigationCommands } from './commands/navigation';
import { generalCommands } from './commands/general';
import { technicalCommands } from './commands/technical';
import { themeCommands } from './commands/theme';
import { utilityCommands } from './commands/utility';

export const allCommands: Command[] = [
  ...filesystemCommands,
  ...linuxCommands,
  tourCommand,
  inspectCommand,
  traceCommand,
  challengeCommand,
  securityCommand,
  ...projectCommands,
  ...navigationCommands,
  ...generalCommands,
  ...technicalCommands,
  ...themeCommands,
  ...utilityCommands,
];

// Lookup map by lowercased name and alias
const commandMap = new Map<string, Command>();

for (const cmd of allCommands) {
  commandMap.set(cmd.name.toLowerCase(), cmd);
  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      commandMap.set(alias.toLowerCase(), cmd);
    }
  }
}

export function findCommand(nameOrAlias: string): Command | undefined {
  return commandMap.get(nameOrAlias.toLowerCase().trim());
}

export function getAllCommandNames(): string[] {
  const names = new Set<string>();
  for (const cmd of allCommands) {
    names.add(cmd.name);
    if (cmd.aliases) {
      for (const a of cmd.aliases) names.add(a);
    }
  }
  return Array.from(names);
}

export function getCommandsByCategory(): Record<CommandCategory, Command[]> {
  const result: Record<CommandCategory, Command[]> = {
    Filesystem: [],
    Linux: [],
    Recruiter: [],
    Projects: [],
    Navigation: [],
    General: [],
    Technical: [],
    Theme: [],
    Utility: [],
  };

  for (const cmd of allCommands) {
    if (result[cmd.category]) {
      result[cmd.category].push(cmd);
    }
  }

  return result;
}

// Levenshtein distance for "Did you mean: X?" suggestions
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[m][n];
}

export function suggestCommand(typo: string): string | null {
  const lower = typo.toLowerCase().trim();
  let closest: string | null = null;
  let minDistance = Infinity;

  for (const cmd of allCommands) {
    const candidates = [cmd.name, ...(cmd.aliases || [])];
    for (const cand of candidates) {
      const dist = levenshteinDistance(lower, cand.toLowerCase());
      if (dist < minDistance && dist <= 3) {
        minDistance = dist;
        closest = cand;
      }
    }
  }

  return closest;
}

export function getCompletions(input: string, ctx: CommandContext): string[] {
  const trimmed = input.trimStart();
  const parts = trimmed.split(/\s+/);

  if (parts.length === 0 || (parts.length === 1 && !input.endsWith(' '))) {
    const prefix = parts[0]?.toLowerCase() || '';
    if (!prefix) return [];

    const matches: string[] = [];
    for (const name of getAllCommandNames()) {
      if (name.toLowerCase().startsWith(prefix)) {
        matches.push(name);
      }
    }
    return matches.sort();
  }

  const commandName = parts[0].toLowerCase();
  const cmd = findCommand(commandName);
  if (!cmd || !cmd.getSubcommands) return [];

  const subcommands = cmd.getSubcommands(parts.slice(1), ctx);
  const partialSub = (input.endsWith(' ') ? '' : parts[parts.length - 1]).toLowerCase();

  const matchedSubs = subcommands.filter((sub) => sub.toLowerCase().startsWith(partialSub));
  return matchedSubs.map((sub) => `${commandName} ${sub}`);
}
