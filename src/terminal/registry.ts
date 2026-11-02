import { Command, CommandCategory, CommandContext } from './types';
import { generalCommands } from './commands/general';
import { navigationCommands } from './commands/navigation';
import { projectCommands } from './commands/projects';
import { technicalCommands } from './commands/technical';
import { themeCommands } from './commands/theme';
import { utilityCommands } from './commands/utility';

export const allCommands: Command[] = [
  ...generalCommands,
  ...navigationCommands,
  ...projectCommands,
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
    General: [],
    Navigation: [],
    Projects: [],
    Technical: [],
    Theme: [],
    Utility: [],
  };

  for (const cmd of allCommands) {
    result[cmd.category].push(cmd);
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
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

export function suggestCommand(input: string): string | undefined {
  const clean = input.toLowerCase().trim();
  if (!clean) return undefined;

  // First check prefix match across primary command names
  for (const cmd of allCommands) {
    if (cmd.name.startsWith(clean)) return cmd.name;
  }

  // Levenshtein closest match
  let closest: string | undefined;
  let minDistance = Infinity;

  for (const cmd of allCommands) {
    const dist = levenshteinDistance(clean, cmd.name);
    if (dist < minDistance && dist <= Math.max(2, Math.floor(cmd.name.length / 2))) {
      minDistance = dist;
      closest = cmd.name;
    }
    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        const aDist = levenshteinDistance(clean, alias);
        if (aDist < minDistance && aDist <= Math.max(2, Math.floor(alias.length / 2))) {
          minDistance = aDist;
          closest = cmd.name;
        }
      }
    }
  }

  return closest;
}

// Tab autocomplete provider
export function getCompletions(input: string, ctx: CommandContext): string[] {
  const trimmed = input.trimStart();
  if (!trimmed) return [];

  const parts = trimmed.split(/\s+/);

  // Auto-completing command name
  if (parts.length === 1 && !input.endsWith(' ')) {
    const prefix = parts[0].toLowerCase();
    const matches: string[] = [];
    for (const cmd of allCommands) {
      if (cmd.name.toLowerCase().startsWith(prefix)) {
        matches.push(cmd.name);
      }
    }
    return matches;
  }

  // Auto-completing subcommands
  const commandName = parts[0].toLowerCase();
  const cmd = findCommand(commandName);
  if (!cmd || !cmd.getSubcommands) return [];

  const subcommands = cmd.getSubcommands(parts.slice(1), ctx);
  const partialSub = (input.endsWith(' ') ? '' : parts[parts.length - 1]).toLowerCase();

  const matchedSubs = subcommands.filter((sub) => sub.toLowerCase().startsWith(partialSub));
  return matchedSubs.map((sub) => `${commandName} ${sub}`);
}
