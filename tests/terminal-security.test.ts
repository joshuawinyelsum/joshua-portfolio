/**
 * Automated Security & Boundary Test Suite
 * 
 * Verifies that the portfolio terminal interpreter enforces all isolation,
 * allowlist, input parsing, virtual filesystem traversal, and code-safety boundaries.
 * Run directly with Node: node --experimental-strip-types tests/terminal-security.test.ts
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Core security modules under test
import { parseCommandLine } from '../src/terminal/commandParser.ts';
import {
  VIRTUAL_FS,
  normalizeVirtualPath,
  readVirtualFile,
  getVirtualEntry,
  listVirtualDirectory,
  generateAsciiTree,
} from '../src/terminal/virtualFilesystem.ts';
import {
  isApprovedInternalRoute,
  isApprovedExternalUrl,
} from '../src/terminal/navigationAllowlist.ts';
import { findCommand, getAllCommandNames } from '../src/terminal/registry.ts';
import { SECURITY_LIMITS, PROHIBITED_SYSTEM_COMMANDS } from '../src/terminal/securityPolicy.ts';

let passedTests = 0;
let totalTests = 0;

function test(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err: unknown) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log('\n=== RUNNING TERMINAL SECURITY & BOUNDARY TEST SUITE ===\n');

// ==========================================
// 1. INPUT PARSER & TOKENIZER TESTS
// ==========================================
console.log('--- 1. Input Parser & Operator Rejection Tests ---');

test('Rejects shell chaining operator "&&"', () => {
  const res = parseCommandLine('ls && rm -rf /');
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.isSecurityRejection, true);
    assert.match(res.error, /Shell operator '&&' is not supported/);
  }
});

test('Rejects shell chaining operator ";"', () => {
  const res = parseCommandLine('projects ; cat /etc/passwd');
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.isSecurityRejection, true);
    assert.match(res.error, /Shell operator ';' is not supported/);
  }
});

test('Rejects pipeline operator "|"', () => {
  const res = parseCommandLine('cat README.md | grep Joshua');
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.isSecurityRejection, true);
    assert.match(res.error, /Shell operator '\|' is not supported/);
  }
});

test('Rejects redirection operator ">"', () => {
  const res = parseCommandLine('echo "malicious" > file.txt');
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.isSecurityRejection, true);
    assert.match(res.error, /Shell operator '>' is not supported/);
  }
});

test('Rejects command substitution "$()"', () => {
  const res = parseCommandLine('echo $(whoami)');
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.isSecurityRejection, true);
    assert.match(res.error, /Shell operator '\$\(' is not supported/);
  }
});

test('Rejects backtick command substitution', () => {
  const res = parseCommandLine('echo `id`');
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.isSecurityRejection, true);
    assert.match(res.error, /Shell operator '`' is not supported/);
  }
});

test('Rejects environment inspection attempts', () => {
  const res1 = parseCommandLine('process.env');
  assert.equal(res1.success, false);
  if (!res1.success) assert.equal(res1.isSecurityRejection, true);

  const res2 = parseCommandLine('import.meta.env');
  assert.equal(res2.success, false);
  if (!res2.success) assert.equal(res2.isSecurityRejection, true);

  const res3 = parseCommandLine('env');
  assert.equal(res3.success, false);
});

test('Rejects input exceeding maximum length limit', () => {
  const excessiveInput = 'a'.repeat(SECURITY_LIMITS.MAX_INPUT_LENGTH + 1);
  const res = parseCommandLine(excessiveInput);
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.isSecurityRejection, true);
    assert.match(res.error, /exceeds safety limit/);
  }
});

test('Rejects input exceeding maximum argument count', () => {
  const tooManyArgs = 'echo ' + Array.from({ length: SECURITY_LIMITS.MAX_ARG_COUNT + 1 }, (_, i) => `arg${i}`).join(' ');
  const res = parseCommandLine(tooManyArgs);
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.isSecurityRejection, true);
    assert.match(res.error, /Too many arguments/);
  }
});

test('Safely parses double and single quotes without evaluating', () => {
  const res = parseCommandLine('echo "hello world" \'second arg\'');
  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.commandName, 'echo');
    assert.deepEqual(res.args, ['hello world', 'second arg']);
  }
});

test('Reports syntax error on unmatched quotes', () => {
  const res = parseCommandLine('cat "unterminated quote');
  assert.equal(res.success, false);
  if (!res.success) {
    assert.match(res.error, /unmatched quote/);
  }
});

// ==========================================
// 2. PROHIBITED COMMAND INTERCEPTION TESTS
// ==========================================
console.log('\n--- 2. Prohibited Command Interception Tests ---');

test('Safely intercepts sudo with clear simulation message', () => {
  const res = parseCommandLine('sudo rm -rf /');
  assert.equal(res.success, false);
  if (!res.success) {
    assert.equal(res.isProhibitedCommand, true);
    assert.equal(res.prohibitedCommandName, 'sudo');
    assert.match(res.error, /Administrative escalation is disabled/);
  }
});

test('Safely intercepts bash, python, node, and curl', () => {
  const targets = ['bash', 'python', 'node', 'curl', 'docker', 'psql', 'ssh', 'rm', 'chmod'];
  for (const cmd of targets) {
    const res = parseCommandLine(cmd);
    assert.equal(res.success, false, `Expected ${cmd} to be prohibited`);
    if (!res.success) {
      assert.equal(res.isProhibitedCommand, true);
      assert.ok(PROHIBITED_SYSTEM_COMMANDS[cmd]);
    }
  }
});

// ==========================================
// 3. VIRTUAL FILESYSTEM TESTS
// ==========================================
console.log('\n--- 3. Virtual Filesystem Isolation Tests ---');

test('Virtual filesystem root is immutable and frozen', () => {
  assert.equal(Object.isFrozen(VIRTUAL_FS), true);
});

test('Reads valid virtual files successfully', () => {
  const readme = readVirtualFile('/home/joshua/README.md');
  assert.equal(readme.success, true);
  assert.match(readme.content || '', /Joshua Winyelsum/);

  const osRelease = readVirtualFile('/etc/os-release');
  assert.equal(osRelease.success, true);
  assert.match(osRelease.content || '', /Simulated Portfolio Linux/);
});

test('Path normalization strictly confines traversal to virtual root', () => {
  // Attempting to traverse above root stays at '/'
  const norm1 = normalizeVirtualPath('/home/joshua', '../../../../../../etc/os-release');
  assert.equal(norm1.success, true);
  assert.equal(norm1.path, '/etc/os-release');

  const norm2 = normalizeVirtualPath('/', '..');
  assert.equal(norm2.success, true);
  assert.equal(norm2.path, '/');
});

test('Rejects Windows-style drive letters and backslashes', () => {
  const norm1 = normalizeVirtualPath('/home/joshua', 'C:\\Windows\\System32');
  assert.equal(norm1.success, false);
  assert.match(norm1.error || '', /Windows drive paths and backslashes are not supported/);

  const norm2 = normalizeVirtualPath('/home/joshua', '..\\..\\etc');
  assert.equal(norm2.success, false);
});

test('Non-existent virtual files return standard error without touching disk', () => {
  const res = readVirtualFile('/etc/shadow');
  assert.equal(res.success, false);
  assert.match(res.error || '', /No such file or directory/);
});

test('Tree generator returns expected directory layout', () => {
  const tree = generateAsciiTree('/home/joshua/projects');
  assert.match(tree, /cfss/);
  assert.match(tree, /mastery-os/);
  assert.match(tree, /coach-prospers-world/);
  assert.match(tree, /agrichem/);
});

// ==========================================
// 4. NAVIGATION ALLOWLIST TESTS
// ==========================================
console.log('\n--- 4. Navigation Allowlist Tests ---');

test('Permits explicitly approved internal routes', () => {
  assert.equal(isApprovedInternalRoute('/'), true);
  assert.equal(isApprovedInternalRoute('/cv'), true);
  assert.equal(isApprovedInternalRoute('/case-study/cfss'), true);
  assert.equal(isApprovedInternalRoute('/case-study/coach-prospers-world'), true);
  assert.equal(isApprovedInternalRoute('/#work'), true);
});

test('Rejects unapproved routes and protocol injection', () => {
  assert.equal(isApprovedInternalRoute('/admin'), false);
  assert.equal(isApprovedInternalRoute('/etc/passwd'), false);
  assert.equal(isApprovedInternalRoute('javascript:alert(1)'), false);
  assert.equal(isApprovedInternalRoute('data:text/html,<script>alert(1)</script>'), false);
});

test('Permits verified external links and rejects arbitrary URLs', () => {
  assert.equal(isApprovedExternalUrl('https://github.com/joshuawinyelsum'), true);
  assert.equal(isApprovedExternalUrl('https://linkedin.com/in/joshuawinyelsum'), true);
  assert.equal(isApprovedExternalUrl('https://malicious-site.com'), false);
  assert.equal(isApprovedExternalUrl('http://phishing.org'), false);
});

// ==========================================
// 5. COMMAND REGISTRY & ALLOWLIST TESTS
// ==========================================
console.log('\n--- 5. Command Registry & Flagship Features ---');

test('All flagship recruiter commands are registered', () => {
  assert.ok(findCommand('tour'), 'tour command missing');
  assert.ok(findCommand('inspect'), 'inspect command missing');
  assert.ok(findCommand('trace'), 'trace command missing');
  assert.ok(findCommand('challenge'), 'challenge command missing');
  assert.ok(findCommand('security'), 'security command missing');
});

test('Standard Linux utilities are registered', () => {
  assert.ok(findCommand('pwd'), 'pwd missing');
  assert.ok(findCommand('ls'), 'ls missing');
  assert.ok(findCommand('cd'), 'cd missing');
  assert.ok(findCommand('cat'), 'cat missing');
  assert.ok(findCommand('whoami'), 'whoami missing');
  assert.ok(findCommand('uname'), 'uname missing');
  assert.ok(findCommand('df'), 'df missing');
  assert.ok(findCommand('free'), 'free missing');
  assert.ok(findCommand('ps'), 'ps missing');
});

// ==========================================
// 6. STATIC CODEBASE SECURITY AUDIT
// ==========================================
console.log('\n--- 6. Static Codebase Security Audit (Zero Prohibited APIs) ---');

function scanSourceFiles(dir: string, fileList: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        scanSourceFiles(full, fileList);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      fileList.push(full);
    }
  }
  return fileList;
}

function stripCommentsAndStrings(code: string): string {
  // Replace single-line comments
  let cleaned = code.replace(/\/\/.*$/gm, '');
  // Replace multi-line comments
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  // Replace double-quoted and single-quoted string literals
  cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"/g, '""');
  cleaned = cleaned.replace(/'(?:[^'\\]|\\.)*'/g, "''");
  // Replace backtick template string literals
  cleaned = cleaned.replace(/`(?:[^`\\]|\\.)*`/g, '``');
  return cleaned;
}

test('Static Scan: Zero eval() or new Function() in codebase', () => {
  const srcFiles = scanSourceFiles(path.resolve('src'));
  for (const file of srcFiles) {
    const rawContent = fs.readFileSync(file, 'utf8');
    const executableCode = stripCommentsAndStrings(rawContent);
    assert.equal(/\beval\s*\(/.test(executableCode), false, `Prohibited eval() call found in ${file}`);
    assert.equal(/new\s+Function\s*\(/.test(executableCode), false, `Prohibited new Function() call found in ${file}`);
  }
});

test('Static Scan: Zero child_process or spawn/exec in src/', () => {
  const srcFiles = scanSourceFiles(path.resolve('src'));
  for (const file of srcFiles) {
    const rawContent = fs.readFileSync(file, 'utf8');
    const executableCode = stripCommentsAndStrings(rawContent);
    assert.equal(/child_process/.test(executableCode), false, `Prohibited child_process import found in ${file}`);
    assert.equal(/\bexecSync\s*\(/.test(executableCode), false, `Prohibited execSync call found in ${file}`);
    assert.equal(/\bspawnSync\s*\(/.test(executableCode), false, `Prohibited spawnSync call found in ${file}`);
  }
});

test('Static Scan: Zero dangerouslySetInnerHTML in terminal components', () => {
  const terminalFiles = scanSourceFiles(path.resolve('src/terminal'));
  for (const file of terminalFiles) {
    const rawContent = fs.readFileSync(file, 'utf8');
    const executableCode = stripCommentsAndStrings(rawContent);
    assert.equal(/dangerouslySetInnerHTML/.test(executableCode), false, `dangerouslySetInnerHTML found in ${file}`);
  }
});

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);
if (passedTests === totalTests) {
  console.log('✓ All security, isolation, and simulation boundaries verified successfully.\n');
}
