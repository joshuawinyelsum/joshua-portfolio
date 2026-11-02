/**
 * Security Policy & Boundary Configuration
 * 
 * Defines the strict boundaries of the simulated portfolio terminal.
 * Follows OWASP Injection Prevention and XSS Prevention guidelines:
 * - Exact allowlisted command execution
 * - Rejection of all shell operators and command chaining
 * - Complete isolation from operating-system shells and host filesystem
 * - No dynamic code evaluation or script execution
 */

export const SECURITY_LIMITS = {
  MAX_INPUT_LENGTH: 300,
  MAX_ARG_COUNT: 16,
  MAX_ARG_LENGTH: 120,
} as const;

/**
 * Shell operators that are strictly prohibited and immediately rejected.
 * We do not parse or execute shell chaining, pipelines, redirection, or variable expansion.
 */
export const PROHIBITED_SHELL_OPERATORS = [
  '&&',
  '||',
  ';',
  '|',
  '>',
  '<',
  '>>',
  '<<',
  '`',
  '$(',
  '${',
  '\0',
] as const;

/**
 * Common operating system / shell commands that visitors might intuitively type.
 * Instead of generic "command not found", we provide an explicit, clear simulation boundary notice.
 */
export const PROHIBITED_SYSTEM_COMMANDS: Record<string, string> = {
  sudo: "Administrative escalation is disabled. This portfolio environment is a controlled in-memory simulation.",
  su: "User switching is disabled. You are operating in a dedicated visitor simulation session.",
  bash: "Shell interpreters cannot be spawned. The terminal is a safe, application-level command runner.",
  sh: "Shell interpreters cannot be spawned.",
  zsh: "Shell interpreters cannot be spawned.",
  fish: "Shell interpreters cannot be spawned.",
  python: "Arbitrary Python execution is disabled. For data pipeline architecture, run 'project agrichem'.",
  python3: "Arbitrary Python execution is disabled. For data pipeline architecture, run 'project agrichem'.",
  node: "Arbitrary JavaScript/Node execution is disabled. Code runs only through predefined React components.",
  deno: "Runtime process execution is disabled.",
  bun: "Runtime process execution is disabled.",
  npm: "Package management execution is disabled in this read-only simulation.",
  npx: "Package execution is disabled.",
  pnpm: "Package management execution is disabled.",
  yarn: "Package management execution is disabled.",
  curl: "Arbitrary outbound network requests are disabled to prevent SSRF and external traffic manipulation.",
  wget: "Arbitrary outbound network requests are disabled.",
  ssh: "Remote shell access is disabled. No external infrastructure connections exist.",
  scp: "Remote file copying is disabled.",
  sftp: "Remote file transfer is disabled.",
  ftp: "Remote file transfer is disabled.",
  telnet: "Insecure remote connection protocols are disabled.",
  nc: "Raw network socket operations are disabled.",
  netcat: "Raw network socket operations are disabled.",
  ping: "ICMP / network probing is disabled.",
  nmap: "Network scanning tools are disabled.",
  rm: "Filesystem mutation is disabled. The virtual filesystem is read-only.",
  rmdir: "Filesystem mutation is disabled. The virtual filesystem is read-only.",
  touch: "Filesystem mutation is disabled. The virtual filesystem is read-only.",
  mkdir: "Filesystem mutation is disabled. The virtual filesystem is read-only.",
  cp: "Filesystem mutation is disabled. The virtual filesystem is read-only.",
  mv: "Filesystem mutation is disabled. The virtual filesystem is read-only.",
  chmod: "Permission mutation is disabled.",
  chown: "Ownership mutation is disabled.",
  chgrp: "Group mutation is disabled.",
  docker: "Container runtime commands are disabled. For containerization details, see 'inspect cfss'.",
  podman: "Container runtime commands are disabled.",
  kubectl: "Kubernetes orchestration commands are disabled.",
  psql: "Direct database console execution is disabled. For schema & queries, run 'inspect mastery' or 'inspect cfss'.",
  mysql: "Direct database console execution is disabled.",
  sqlite3: "Direct database console execution is disabled.",
  'redis-cli': "Direct cache store access is disabled.",
  mongo: "Direct database console execution is disabled.",
  mongosh: "Direct database console execution is disabled.",
  git: "Git operations are simulated via portfolio metadata. Use 'github' to view the public profile.",
  apt: "Package manager operations are disabled.",
  'apt-get': "Package manager operations are disabled.",
  yum: "Package manager operations are disabled.",
  dnf: "Package manager operations are disabled.",
  pacman: "Package manager operations are disabled.",
  brew: "Package manager operations are disabled.",
  systemctl: "System service management is disabled.",
  service: "System service management is disabled.",
  kill: "Process termination is disabled. Active processes are simulated data.",
  killall: "Process termination is disabled.",
  top: "Interactive process monitor is disabled. Run 'ps' for a process snapshot.",
  htop: "Interactive process monitor is disabled. Run 'ps' for a process snapshot.",
  vi: "Text editors are disabled. Virtual files are read-only; view them with 'cat <file>'.",
  vim: "Text editors are disabled. Virtual files are read-only; view them with 'cat <file>'.",
  nano: "Text editors are disabled. Virtual files are read-only; view them with 'cat <file>'.",
  emacs: "Text editors are disabled. Virtual files are read-only; view them with 'cat <file>'.",
  env: "Environment variables are inaccessible. No host secrets or server configurations are exposed.",
  export: "Environment variable modification is disabled.",
  set: "Shell variable inspection is disabled.",
  alias: "Alias definitions are disabled.",
  unalias: "Alias removal is disabled.",
};

/**
 * Checks if raw input contains prohibited shell operators or chaining characters.
 */
export function checkProhibitedOperators(input: string): { prohibited: boolean; operator?: string } {
  for (const op of PROHIBITED_SHELL_OPERATORS) {
    if (input.includes(op)) {
      return { prohibited: true, operator: op };
    }
  }
  return { prohibited: false };
}

/**
 * Checks if input is an attempted inspection of runtime environment globals.
 */
export function isEnvironmentInspectionAttempt(trimmed: string): boolean {
  const lower = trimmed.toLowerCase();
  return (
    lower.startsWith('process.env') ||
    lower.startsWith('import.meta.env') ||
    lower.startsWith('window.') ||
    lower.startsWith('document.') ||
    lower.startsWith('eval(') ||
    lower === 'env' ||
    lower === 'printenv'
  );
}
