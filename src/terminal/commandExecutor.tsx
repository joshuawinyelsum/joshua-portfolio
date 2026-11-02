import React from 'react';
import { CommandContext, CommandResult } from './types';
import { parseCommandLine, ParseResult } from './commandParser';
import { findCommand, suggestCommand } from './registry';

export interface ExecutionOutput {
  id: string;
  type: 'input' | 'output';
  content: React.ReactNode;
}

/**
 * Safely executes a user-provided command line string through the closed allowlisted interpreter.
 * Guarantees zero code evaluation (no eval, no Function, no child_process).
 */
export async function executeCommandLine(
  rawInput: string,
  ctx: CommandContext
): Promise<CommandResult> {
  const parseResult: ParseResult = parseCommandLine(rawInput);

  // 1. Parsing and safety errors
  if (!parseResult.success) {
    if (parseResult.isProhibitedCommand) {
      return {
        output: (
          <div className="py-1 text-xs font-mono space-y-1">
            <div className="text-[#E57373] font-semibold flex items-center gap-1.5">
              <span className="font-bold">[!]</span>
              <span>Command unavailable: '{parseResult.prohibitedCommandName}'</span>
            </div>
            <div className="text-[#A6A397] pl-4 text-[11.5px] leading-relaxed">
              {parseResult.error}
            </div>
            <div className="text-[#7A786E] pl-4 text-[11px]">
              This portfolio environment is an isolated in-memory simulation. Host execution is intentionally disabled.
            </div>
          </div>
        ),
      };
    }

    if (parseResult.isSecurityRejection) {
      return {
        output: (
          <div className="py-1 text-xs font-mono space-y-1">
            <div className="text-[#E57373] font-semibold flex items-center gap-1.5">
              <span className="font-bold">[SECURITY]</span>
              <span>Policy Rejection</span>
            </div>
            <div className="text-[#A6A397] pl-4 text-[11.5px]">
              {parseResult.error}
            </div>
            <div className="text-[#7A786E] pl-4 text-[11px]">
              Run <button type="button" onClick={() => ctx.runCommand('security')} className="text-[#82AAFF] hover:underline cursor-pointer">security</button> to inspect the active boundary controls.
            </div>
          </div>
        ),
      };
    }

    return {
      output: (
        <div className="py-1 text-[#E57373] font-mono text-xs flex items-center gap-1.5">
          <span className="font-bold">[!]</span>
          <span>{parseResult.error}</span>
        </div>
      ),
    };
  }

  // 2. Empty input
  if (parseResult.isEmpty) {
    return {};
  }

  const { commandName, args } = parseResult;

  // 3. Exact allowlist lookup
  const command = findCommand(commandName);

  if (!command) {
    const suggestion = suggestCommand(commandName);
    return {
      output: (
        <div className="py-1 text-xs font-mono space-y-1">
          <div className="text-[#E57373]">
            Command not found: <span className="font-bold">{commandName}</span>
          </div>
          {suggestion && (
            <div className="text-[#A6A397] flex items-center gap-1.5">
              <span>Did you mean:</span>
              <button
                type="button"
                onClick={() => ctx.runCommand(suggestion)}
                className="text-[#82AAFF] font-bold hover:underline cursor-pointer"
              >
                {suggestion}
              </button>
              <span>?</span>
            </div>
          )}
          <div className="text-[11px] text-[#7A786E]">
            Type <button type="button" onClick={() => ctx.runCommand('help')} className="text-[#82AAFF] hover:underline cursor-pointer">help</button> or <button type="button" onClick={() => ctx.runCommand('tour')} className="text-[#82AAFF] hover:underline cursor-pointer">tour</button> to explore.
          </div>
        </div>
      ),
    };
  }

  // 4. Predefined command handler execution
  try {
    const result = await command.execute(args, ctx);

    if (result.isClear) {
      return result;
    }

    if (result.error) {
      return {
        output: (
          <div className="py-1 text-[#E57373] font-mono text-xs space-y-1">
            <div className="flex items-start gap-1.5 font-semibold">
              <span className="font-bold">[!]</span>
              <span>{result.error}</span>
            </div>
            {command.usage && (
              <div className="text-[#A6A397] text-[11px] pl-4">
                Usage: {command.usage}
              </div>
            )}
          </div>
        ),
      };
    }

    return result;
  } catch (err: unknown) {
    return {
      output: (
        <div className="py-1 text-[#E57373] font-mono text-xs">
          Simulation error: {err instanceof Error ? err.message : String(err)}
        </div>
      ),
    };
  }
}
