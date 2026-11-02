# Security Architecture & Threat Model: Simulated Portfolio Terminal

**Author:** Joshua Winyelsum  
**System:** Interactive Developer Workstation Simulation (`CommandCenter`)  
**Target Repository:** `joshua-portfolio`  
**Classification:** Public Portfolio Simulation Specification  

---

## 1. Executive Summary & Purpose

The portfolio Command Center is an interactive, simulated developer environment designed for technical recruiters, engineering leaders, and peers. It provides an authentic Linux-inspired workstation experience—enabling visitors to browse project documentation, inspect system architecture specifications, trace simulated request lifecycles, and solve systems engineering challenges.

**Primary Security Invariant:**
> **Security takes absolute priority over realism.** Under no circumstances does this terminal execute operating-system commands, interact with host shells, access the physical server filesystem, inspect runtime environment variables, or establish arbitrary outbound network connections. It is a closed, 100% in-memory application-level simulation.

---

## 2. Threat Model & Security Boundaries

### 2.1 What the Terminal Simulates
- **In-Memory Virtual Filesystem:** A predefined, immutable tree (`/home/joshua/...`, `/etc/os-release`, `/var/log/portfolio.log`) representing a developer workstation.
- **Linux Environment Utilities:** Harmless, deterministic simulation data for utilities such as `whoami`, `hostname`, `uname`, `date`, `uptime`, `ps`, `df`, and `free`.
- **Architectural Explorers & Traces:** Illustrative end-to-end execution flows (`trace cfss`, `trace cpw`, `trace mastery`) modeling client, gateway, backend, and database transactions without executing live network requests.
- **Controlled Systems Challenges:** Multiple-choice technical assessments with verified explanations.

### 2.2 What the Terminal CAN Access
- Predefined in-memory data structures (exported project specs, timelines, verified skills).
- Local React component session state (`cwd`, `tourStep`, `traceState`, `challengeProgress`, `commandHistory`).
- Global UI appearance state via React Context (`ThemeContext`).

### 2.3 What the Terminal CANNOT Access (Explicitly Prohibited)
- **Zero Operating System Access:** The terminal has no bridge to host operating system shells (`bash`, `sh`, `cmd.exe`, `powershell`).
- **No Native Execution APIs:** None of `eval()`, `Function()`, `exec()`, `execSync()`, `spawn()`, `spawnSync()`, `child_process`, or `subprocess` exist anywhere in the application.
- **No Physical Filesystem Access:** The terminal cannot read, write, stat, or traverse any file on the hosting machine, container, or server.
- **No Environment Variables or Secrets:** `process.env`, `import.meta.env`, API tokens, database connection strings, and private configuration are completely isolated and inaccessible from the command interpreter.
- **No Arbitrary Network / Socket Capabilities:** The terminal cannot make arbitrary outbound HTTP requests (`fetch`, `curl`, `XMLHttpRequest`) or open raw sockets (`netcat`, `ssh`).
- **No Arbitrary Navigation / Open Redirects:** The `open` and navigation commands only accept strictly allowlisted internal portfolio routes.

---

## 3. Interpreter Pipeline & OWASP Alignment

The terminal architecture implements a safe, linear evaluation pipeline adhering to [OWASP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html) and [OWASP Cross-Site Scripting (XSS) Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html):

```
Visitor Input
    │
    ▼
1. Input Normalization & Length Validation (<= 300 chars)
    │
    ▼
2. Prohibited Operator Check (Rejects &&, ||, ;, |, >, <, `, $(), ${, \0)
    │
    ▼
3. Safe Tokenizer (Quote-aware lexer without eval or regex recursion)
    │
    ▼
4. Prohibited System Command Interception (sudo, bash, rm, curl, psql, etc.)
    │
    ▼
5. Exact Command Allowlist Lookup (findCommand)
    │
    ▼
6. Independent Argument Validation (Type, range, and enum bounds)
    │
    ▼
7. Predefined Command Handler Execution (Pure in-memory execution)
    │
    ▼
8. Safe React Element Rendering (Zero dangerouslySetInnerHTML)
```

### 3.1 Rejection of Command Chaining and Redirection
In real Unix shells, characters like `&&`, `;`, `|`, and `>` enable command chaining, pipeline execution, and file redirection. In this simulation, such characters are prohibited at the tokenizer stage. Any input containing these characters is immediately rejected with an informative security notice:
```text
Shell operator '&&' is not supported. This environment is an isolated, single-command portfolio simulation.
```

### 3.2 Prohibited System Command Rejection
When visitors test the environment by typing standard administrative or shell commands (`sudo`, `bash`, `python`, `node`, `curl`, `ssh`, `rm`, `chmod`, `docker`, `psql`), the terminal does not fail silently or trigger an error. Instead, it provides a polite, explicit notification clarifying the boundary:
```text
Command unavailable: 'sudo'
Administrative escalation is disabled. This portfolio environment is a controlled in-memory simulation.
```

---

## 4. Virtual Filesystem Isolation & Path Traversal Prevention

The virtual filesystem (`src/terminal/virtualFilesystem.ts`) is an immutable in-memory JavaScript object frozen via `Object.freeze()`.

### 4.1 Path Normalization Invariants
- **Root Enclosure:** Every virtual path is normalized relative to virtual root `/`. If a visitor inputs `cd ../../../`, the path traversal terminates at `/` and cannot escape.
- **Disallowed Path Characters:** Windows drive letters (`C:`, `D:`), backslashes (`\`), and null bytes (`\0`) are rejected at path parsing time.
- **Virtual File Lookup:** Files outside the predefined tree (e.g., `cat ../../.env` or `cat /etc/shadow`) resolve to `null`, returning standard Unix error messages:
  ```text
  cat: ../../.env: No such file or directory
  ```
- **Read-Only Invariant:** Mutation commands (`touch`, `mkdir`, `rm`, `mv`, `cp`, `chmod`) are permanently disabled.

---

## 5. Output Rendering & XSS Prevention

All terminal input and output is rendered as native React elements:
- Text is rendered inside React DOM nodes (`<span>`, `<div>`, `<pre>`) which automatically escape HTML entities.
- **Zero `dangerouslySetInnerHTML`:** The terminal codebase contains 0 instances of `dangerouslySetInnerHTML`.
- Code snippets and command traces are rendered as text content inside pre-formatted blocks, preventing script injection or DOM clobbering.

---

## 6. Navigation Allowlist & Redirect Prevention

The terminal allows navigation to project case studies and portfolio sections. To prevent open redirect vulnerabilities and protocol-handler injection (`javascript:` or `data:`), navigation is strictly bounded:

- **Internal Routes:** Must exist in `APPROVED_INTERNAL_ROUTES` (`/`, `/cv`, `/case-study/coach-prospers-world`, `/case-study/cfss`, `/case-study/mastery-os`, `/case-study/agrichem`, and approved anchor fragments).
- **External Links:** Restricted to Joshua's verified profiles in `APPROVED_EXTERNAL_URLS` (GitHub, LinkedIn).
- Arbitrary URLs provided as arguments to `open` are rejected.

---

## 7. Known Limitations

- **Single-Turn Commands:** The terminal executes single commands per turn; multi-statement shell scripts and background jobs (`&`) are deliberately unsupported.
- **In-Memory Lifetime:** Visitor session state (working directory, tour progress, challenge score) is stored in local React component state and resets upon browser tab closure.
- **Simulated Performance Metrics:** Timings displayed in `trace` (e.g. `Client latency: 12ms`) and metrics in `ps` / `df` are realistic architectural illustrations, not live hardware telemetry from the visitor's device.

---

## 8. Verification & Audit Procedures

This architecture is continuously validated via:
1. **Automated Unit Tests (`tests/terminal-security.test.ts`):** Proves tokenizer safety, operator rejection, traversal protection, and allowlist enforcement.
2. **Static Codebase Audit:** Automated repository scans verifying the total absence of `eval`, `child_process`, `exec`, and `dangerouslySetInnerHTML`.
3. **TypeScript Strict Mode:** Enforces type safety across command contexts and execution outputs.
