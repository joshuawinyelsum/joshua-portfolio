/**
 * Argument Validators
 * 
 * Provides independent validation for command arguments.
 * Enforces strict typing, range boundaries, and canonical formats.
 */

export interface ValidationResult<T = unknown> {
  valid: boolean;
  error?: string;
  value?: T;
}

export function validateNumericFlag(args: string[], flag: string, defaultValue = 10, min = 1, max = 100): ValidationResult<number> {
  const flagIndex = args.indexOf(flag);
  if (flagIndex === -1) {
    return { valid: true, value: defaultValue };
  }

  const valStr = args[flagIndex + 1];
  if (!valStr) {
    return { valid: false, error: `Flag '${flag}' requires a numeric value.` };
  }

  const num = parseInt(valStr, 10);
  if (isNaN(num) || num < min || num > max) {
    return { valid: false, error: `Value for '${flag}' must be an integer between ${min} and ${max}.` };
  }

  return { valid: true, value: num };
}

export function validateProjectKey(arg: string): ValidationResult<string> {
  const normalized = arg.toLowerCase().trim();
  const map: Record<string, string> = {
    cfss: 'cfss',
    'field-survey': 'cfss',
    mastery: 'mastery-os',
    masteryos: 'mastery-os',
    'mastery-os': 'mastery-os',
    cpw: 'coach-prospers-world',
    coach: 'coach-prospers-world',
    'coach-prospers-world': 'coach-prospers-world',
    agrichem: 'agrichem',
    cocoa: 'agrichem',
  };

  const resolved = map[normalized];
  if (!resolved) {
    return {
      valid: false,
      error: `Unknown project: '${arg}'. Available projects: cfss, mastery, cpw, agrichem.`,
    };
  }

  return { valid: true, value: resolved };
}

export function validateChallengeId(arg: string): ValidationResult<number> {
  const num = parseInt(arg, 10);
  if (isNaN(num) || num < 1 || num > 6) {
    return {
      valid: false,
      error: `Invalid challenge ID: '${arg}'. Must be an integer between 1 and 6.`,
    };
  }
  return { valid: true, value: num };
}

export function validateChallengeOption(arg: string): ValidationResult<'A' | 'B' | 'C' | 'D'> {
  const upper = arg.toUpperCase().trim();
  if (!['A', 'B', 'C', 'D'].includes(upper)) {
    return {
      valid: false,
      error: `Invalid option: '${arg}'. Must be one of A, B, C, or D.`,
    };
  }
  return { valid: true, value: upper as 'A' | 'B' | 'C' | 'D' };
}
