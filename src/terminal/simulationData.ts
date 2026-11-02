/**
 * Simulation Data
 * 
 * Predefined, harmless simulation data for standard Linux developer environment commands.
 * Distinguishes simulated system metrics from actual browser/host runtime details.
 */

export const SIMULATION_HOST = {
  hostname: 'winyelsum-workstation',
  username: 'joshua',
  sessionType: 'visitor-simulation (read-only)',
  kernel: 'Linux winyelsum-workstation 6.6.14-portfolio #1 SMP PREEMPT_DYNAMIC Mon Nov 2 00:00:00 UTC 2026 x86_64 GNU/Linux (Simulated)',
  architecture: 'x86_64',
  osName: 'Simulated Portfolio Linux 2026.11 LTS',
  uptimeFormatted: 'up 42 days, 3:14, 1 user, load average: 0.12, 0.08, 0.05',
} as const;

export interface ProcessItem {
  pid: number;
  user: string;
  cpu: string;
  mem: string;
  time: string;
  command: string;
}

export const SIMULATED_PROCESSES: ProcessItem[] = [
  { pid: 1, user: 'root', cpu: '0.0', mem: '0.1', time: '0:02', command: '/sbin/init splash' },
  { pid: 124, user: 'root', cpu: '0.0', mem: '0.2', time: '0:01', command: '/usr/lib/systemd/systemd-journald' },
  { pid: 310, user: 'postgres', cpu: '0.1', mem: '2.4', time: '0:14', command: 'postgres: checkpointer' },
  { pid: 312, user: 'postgres', cpu: '0.2', mem: '3.1', time: '0:22', command: 'postgres: background writer' },
  { pid: 315, user: 'postgres', cpu: '0.0', mem: '1.8', time: '0:08', command: 'postgres: walwriter' },
  { pid: 420, user: 'redis', cpu: '0.1', mem: '0.9', time: '0:05', command: '/usr/bin/redis-server 127.0.0.1:6379' },
  { pid: 740, user: 'joshua', cpu: '0.3', mem: '4.2', time: '0:35', command: 'node /opt/coach-prospers-world/server.js' },
  { pid: 850, user: 'joshua', cpu: '0.2', mem: '3.8', time: '0:18', command: 'python3 -m uvicorn app.main:app --port 8000 (cfss)' },
  { pid: 910, user: 'joshua', cpu: '0.1', mem: '1.2', time: '0:09', command: '/usr/local/bin/masteryos-sync-daemon' },
  { pid: 1042, user: 'visitor', cpu: '0.0', mem: '0.3', time: '0:00', command: '-bash (simulated-visitor-session)' },
  { pid: 1108, user: 'visitor', cpu: '0.0', mem: '0.1', time: '0:00', command: 'ps aux' },
];

export const SIMULATED_DISK_USAGE = `Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p2  460G  112G  325G  26% /
devtmpfs         16G     0   16G   0% /dev
tmpfs            16G   48M   16G   1% /run
/dev/nvme0n1p1  512M   18M  494M   4% /boot/efi
vfs:portfolio   1.0M   32K  992K   4% /home/joshua`;

export const SIMULATED_MEMORY_USAGE = `               total        used        free      shared  buff/cache   available
Mem:            31Gi       8.4Gi        18Gi       412Mi       4.8Gi        22Gi
Swap:          8.0Gi          0B       8.0Gi`;

/**
 * Returns current timestamp formatted similarly to GNU `date`.
 */
export function getSimulatedDateString(): string {
  const now = new Date();
  return now.toUTCString();
}
