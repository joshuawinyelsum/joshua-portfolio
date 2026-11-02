/**
 * Safe Command Tokenizer & Input Parser
 * 
 * Implements an application-level, closed tokenizer.
 * Adheres to OWASP Injection Prevention principles:
 * - Fixed maximum input length
 * - Rejection of command chaining (&&, ||, ;, |)
 * - Rejection of redirection and command substitutions (>, <, `, $())
 * - Deterministic, non-evaluating quote-aware tokenizer
 * - Explicit rejection of prohibited system commands
 */

import {
  SECURITY_LIMITS,
  PROHIBITED_SYSTEM_COMMANDS,
  checkProhibitedOperators,
  isEnvironmentInspectionAttempt,
} from './securityPolicy';

export interface ParseSuccess {
  success: true;
  commandName: string;
  args: string[];
  rawInput: string;
  isEmpty: boolean;
}

export interface ParseError {
  success: false;
  error: string;
  isSecurityRejection?: boolean;
  isProhibitedCommand?: boolean;
  prohibitedCommandName?: string;
}

export type ParseResult = ParseSuccess | ParseError;

/**
 * Tokenizes a command string safely into an array of strings.
 * Respects single and double quotes without evaluating code or expanding variables.
 */
function tokenizeSafely(input: string): { tokens: string[]; error?: string } {
  const tokens: string[] = [];
  let currentToken = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (/\s/.test(char) && !inSingleQuote && !inDoubleQuote) {
      if (currentToken.length > 0) {
        tokens.push(currentToken);
        currentToken = '';
      }
    } else {
      currentToken += char;
    }
  }

  if (inSingleQuote || inDoubleQuote) {
    return { tokens: [], error: 'Syntax error: unmatched quote in command.' };
  }

  if (currentToken.length > 0) {
    tokens.push(currentToken);
  }

  return { tokens };
}

/**
 * Main parser entry point.
 */
export function parseCommandLine(rawInput: string): ParseResult {
  // 1. Length validation
  if (rawInput.length > SECURITY_LIMITS.MAX_INPUT_LENGTH) {
    return {
      success: false,
      error: `Input length (${rawInput.length}) exceeds safety limit of ${SECURITY_LIMITS.MAX_INPUT_LENGTH} characters.`,
      isSecurityRejection: true,
    };
  }

  const trimmed = rawInput.trim();

  // 2. Empty input
  if (!trimmed) {
    return {
      success: true,
      commandName: '',
      args: [],
      rawInput,
      isEmpty: true,
    };
  }

  // 3. Environment variable or runtime inspection attempt
  if (isEnvironmentInspectionAttempt(trimmed)) {
    return {
      success: false,
      error: "Access denied: Environment variables and runtime internals are inaccessible in this simulation.",
      isSecurityRejection: true,
    };
  }

  // 4. Shell operators and chaining rejection
  const operatorCheck = checkProhibitedOperators(trimmed);
  if (operatorCheck.prohibited) {
    return {
      success: false,
      error: `Shell operator '${operatorCheck.operator}' is not supported. This environment is an isolated, single-command portfolio simulation.`,
      isSecurityRejection: true,
    };
  }

  // 5. Safe tokenization
  const { tokens, error: tokenError } = tokenizeSafely(trimmed);
  if (tokenError) {
    return {
      success: false,
      error: tokenError,
      isSecurityRejection: false,
    };
  }

  if (tokens.length === 0) {
    return {
      success: true,
      commandName: '',
      args: [],
      rawInput,
      isEmpty: true,
    };
  }

  // 6. Argument count validation
  if (tokens.length > SECURITY_LIMITS.MAX_ARG_COUNT) {
    return {
      success: false,
      error: `Too many arguments (${tokens.length - 1}). Maximum allowed is ${SECURITY_LIMITS.MAX_ARG_COUNT - 1}.`,
      isSecurityRejection: true,
    };
  }

  // 7. Individual argument length validation
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].length > SECURITY_LIMITS.MAX_ARG_LENGTH) {
      return {
        success: false,
        error: `Argument ${i} exceeds maximum length of ${SECURITY_LIMITS.MAX_ARG_LENGTH} characters.`,
        isSecurityRejection: true,
      };
    }
  }

  const commandName = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  // 8. Check prohibited system commands with polite explanation
  if (PROHIBITED_SYSTEM_COMMANDS[commandName]) {
    return {
      success: false,
      error: PROHIBITED_SYSTEM_COMMANDS[commandName],
      isProhibitedCommand: true,
      prohibitedCommandName: commandName,
    };
  }

  return {
    success: true,
    commandName,
    args,
    rawInput,
    isEmpty: false,
  };
}
