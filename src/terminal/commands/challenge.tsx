import React from 'react';
import { Command, CommandContext } from '../types';
import { validateChallengeId, validateChallengeOption } from '../argumentValidators';
import { InfoHeader } from '../components/TerminalUI';

export interface ChallengeData {
  id: number;
  category: string;
  title: string;
  scenario: string;
  codeSnippet?: string;
  question: string;
  options: Record<'A' | 'B' | 'C' | 'D', string>;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  distractorExplanations: Record<'A' | 'B' | 'C' | 'D', string>;
}

export const CHALLENGES: ChallengeData[] = [
  {
    id: 1,
    category: 'DATABASE & QUERY OPTIMIZATION',
    title: 'N+1 Query Bottleneck in Survey Aggregation',
    scenario: 'An admin dashboard fetches 50 enumerator records and their respective survey submission counts. Staging logs reveal 51 independent SQL queries executed, causing response latency to spike to 1,450ms.',
    codeSnippet: `// Problematic ORM snippet:
const enumerators = await db.enumerators.findAll(); // 1 query
for (const e of enumerators) {
  e.surveys = await db.surveys.find({ enumerator_id: e.id }); // N queries!
}`,
    question: 'Which strategy correctly resolves this bottleneck with minimal round-trips and optimal database performance?',
    options: {
      A: 'Wrap the loop inside a JavaScript Promise.all() to run the 50 queries concurrently.',
      B: 'Execute a single SQL query using an INNER JOIN / LEFT JOIN or GROUP BY with a composite index on (enumerator_id, created_at).',
      C: 'Increase the PostgreSQL connection pool limit from 10 to 100 to absorb the concurrent connections.',
      D: 'Cache each individual survey query in browser localStorage.',
    },
    correctOption: 'B',
    explanation: 'A relational database is designed for set-based operations. Using a single SQL query with JOIN and GROUP BY reduces round-trip network overhead from 51 trips to 1, while a composite index on (enumerator_id, created_at) allows PostgreSQL to satisfy the grouping via index-only or bitmap index scans.',
    distractorExplanations: {
      A: 'Running 50 queries in Promise.all still saturates the database connection pool with 50 independent network round-trips.',
      B: 'Correct! Single query with relational aggregation avoids N+1 trips completely.',
      C: 'Increasing connection pools masks the architectural defect and exhausts server RAM under high concurrency without fixing query complexity.',
      D: 'LocalStorage is client-side, capped at 5MB, and inappropriate for centralized multi-tenant administrative dashboard aggregation.',
    },
  },
  {
    id: 2,
    category: 'API DESIGN & RESILIENCE',
    title: 'Idempotent Payment Webhook Processing',
    scenario: 'Due to mobile network instability in rural field branches, a client retries a payment verification request multiple times after a 504 Gateway Timeout, even though the backend already processed the charge on the first attempt.',
    codeSnippet: `POST /api/v1/payments/verify
Headers: X-Retry-Count: 3
Body: { "reference": "tx_2024_0911", "amount": 250.00 }`,
    question: 'How should the backend architecture guarantee idempotency to prevent double-crediting balances?',
    options: {
      A: 'Switch the HTTP request method from POST to GET.',
      B: 'Implement an Idempotency-Key ledger where the unique reference is stored with an atomic conditional insert (e.g. INSERT ... ON CONFLICT DO NOTHING), returning the cached initial response upon duplicate receipt.',
      C: 'Disable client-side retries entirely.',
      D: 'Delay processing each request by 5 seconds to ensure duplicate packets arrive together.',
    },
    correctOption: 'B',
    explanation: 'An Idempotency-Key ledger backed by database unique constraints guarantees that duplicate requests with the same key do not trigger duplicate mutations. The first request acquires the lease and processes the mutation; retries detect the processed state and safely return the original receipt.',
    distractorExplanations: {
      A: 'GET requests must be safe and idempotent by HTTP specification, but financial mutations modify state and must not use GET.',
      B: 'Correct! Atomic database constraints on unique transaction references provide robust mathematical idempotency.',
      C: 'Disabling retries guarantees dropped payments and abandoned orders whenever transient mobile network timeouts occur.',
      D: 'Arbitrary delays increase tail latency without preventing race conditions or distributed duplicate deliveries.',
    },
  },
  {
    id: 3,
    category: 'TRANSACTION INTEGRITY & CONCURRENCY',
    title: 'Preventing Negative Balance Under Concurrent Withdrawals',
    scenario: 'Two concurrent API requests arrive simultaneously to deduct $70 from an account with an available balance of $100. Under default READ COMMITTED isolation without row locking, both transactions read $100, pass validation, and deduct $70, producing an illegal -$40 balance.',
    codeSnippet: `// Concurrent Execution:
Tx1: SELECT balance FROM accounts WHERE id = 1; -- reads 100
Tx2: SELECT balance FROM accounts WHERE id = 1; -- reads 100
Tx1: UPDATE accounts SET balance = balance - 70; -- commits 30
Tx2: UPDATE accounts SET balance = balance - 70; -- commits -40!`,
    question: 'What is the standard, high-performance database mechanism to prevent this race condition?',
    options: {
      A: 'Use pessimistic locking via SELECT ... FOR UPDATE or an atomic conditional update: UPDATE accounts SET balance = balance - 70 WHERE id = 1 AND balance >= 70.',
      B: 'Store the balance in a Redis in-memory cache and write to PostgreSQL asynchronously once a day.',
      C: 'Re-run the SELECT query immediately after the UPDATE in application memory.',
      D: 'Switch to a NoSQL document database with eventual consistency.',
    },
    correctOption: 'A',
    explanation: 'Atomic conditional updates (UPDATE ... WHERE balance >= 70) or pessimistic row locks (SELECT ... FOR UPDATE) leverage PostgreSQL\'s row-level locking. If the condition is not met, the update affects 0 rows, allowing the application to immediately return an Insufficient Funds error without race conditions.',
    distractorExplanations: {
      A: 'Correct! Row-level locking or atomic WHERE constraints ensure serialized evaluation at the storage engine level.',
      B: 'Redis async flush introduces potential data loss on crash and does not solve concurrent coordination without distributed locks.',
      C: 'Reading after the write detects the failure too late — the negative balance is already written to the database.',
      D: 'Eventual consistency increases concurrency anomalies; financial accounting requires strict serializability or ACID atomic updates.',
    },
  },
  {
    id: 4,
    category: 'SYSTEMS & OFFLINE-FIRST ARCHITECTURE',
    title: 'Offline Survey Synchronization Conflict Resolution',
    scenario: 'An offline enumerator in a rural village edits Section A of a survey at 10:00 AM without connectivity. Concurrently, a supervisor at the university annotates Section B of the same record at 10:15 AM. The enumerator re-establishes connectivity at 11:00 AM.',
    question: 'Which synchronization architecture preserves both edits without destructive data loss?',
    options: {
      A: 'Last-Write-Wins (LWW) based on device system clock timestamp.',
      B: 'Field-level three-way merge with revision vector tracking, merging non-overlapping field updates and flagging only true attribute collisions for review.',
      C: 'Reject all offline edits whenever the server revision has changed.',
      D: 'Always overwrite server state with client state because field data is collected in person.',
    },
    correctOption: 'B',
    explanation: 'Field-level 3-way reconciliation separates disjoint field updates (Section A vs Section B). Because the edits touched distinct fields, both are merged cleanly. Device clock timestamps are unreliable across field tablets and cause silent data loss under naive Last-Write-Wins.',
    distractorExplanations: {
      A: 'Device clocks drift and can be altered by users; naive LWW would silently discard the coordinator\'s annotations.',
      B: 'Correct! Granular field-level merging maximizes automated synchronization while isolating genuine conflict collisions.',
      C: 'Rejecting offline edits forces enumerators to re-interview community members, defeating the offline-first purpose.',
      D: 'Blind client-overwrite destroys coordinator annotations, verification flags, and audit notes.',
    },
  },
  {
    id: 5,
    category: 'CACHING & HIGH-CONCURRENCY SCALABILITY',
    title: 'Cache Stampede (Thundering Herd) Mitigation',
    scenario: 'A high-traffic public dashboard caches an expensive analytics aggregation query with a 5-minute TTL. Exactly when the cache key expires, 800 concurrent requests arrive simultaneously, all miss the cache, and all hammer PostgreSQL with identical complex queries.',
    codeSnippet: `// Vulnerable naive cache read:
let data = await redis.get("dashboard_stats");
if (!data) {
  data = await runHeavyDatabaseAggregation(); // 800 requests run this at once!
  await redis.set("dashboard_stats", data, "EX", 300);
}`,
    question: 'Which architecture pattern reliably prevents this cache stampede?',
    options: {
      A: 'Disable the cache entirely and run queries directly on the primary database.',
      B: 'Implement Stale-While-Revalidate with background single-flight mutex locking (only one worker refreshes the cache while others receive stale data).',
      C: 'Set the cache TTL to 500 milliseconds.',
      D: 'Catch the database error and return an empty JSON object to all users.',
    },
    correctOption: 'B',
    explanation: 'The Stale-While-Revalidate pattern paired with a single-flight mutex or probabilistic early expiration (XFetch algorithm) ensures that when a cache item expires, exactly ONE background worker recomputes the expensive query while all concurrent requests receive the previous valid data with near-zero latency.',
    distractorExplanations: {
      A: 'Disabling caching guarantees immediate database CPU exhaustion and service outage under sustained traffic.',
      B: 'Correct! Single-flight locking with background refresh eliminates database thundering herds entirely.',
      C: 'Shrinking the TTL to 500ms makes stampedes occur 10 times more frequently.',
      D: 'Returning empty data compromises application correctness and presents broken dashboards to users.',
    },
  },
  {
    id: 6,
    category: 'DISTRIBUTED SYSTEMS & CONSENSUS',
    title: 'Network Partition & Split-Brain Mitigation',
    scenario: 'A 5-node distributed database cluster is partitioned into two isolated subnets by a switch failure: Subnet Alpha (2 nodes) and Subnet Beta (3 nodes).',
    codeSnippet: `Cluster: [Node1, Node2]  <--- NETWORK PARTITION --->  [Node3, Node4, Node5]
Subnet Alpha: 2 nodes                              Subnet Beta: 3 nodes`,
    question: 'Under a consensus protocol like Raft or Paxos, how is split-brain prevented?',
    options: {
      A: 'Both subnets elect a leader and continue processing writes independently.',
      B: 'Subnet Beta (3 nodes) achieves strict majority quorum ((5/2)+1 = 3) and accepts writes; Subnet Alpha (2 nodes) lacks quorum, rejects writes, and remains read-only.',
      C: 'Subnet Alpha automatically shuts down its power.',
      D: 'The cluster switches to single-node mode on whichever node has the lowest IP address.',
    },
    correctOption: 'B',
    explanation: 'Consensus protocols require a strict majority quorum (N/2 + 1) for leader election and state machine commits. In a 5-node cluster, 3 votes are required. Only Subnet Beta has 3 nodes; Subnet Alpha has only 2 and cannot commit writes, mathematically preventing split-brain inconsistent state.',
    distractorExplanations: {
      A: 'Allowing both subnets to accept writes produces irreconcilable split-brain data divergence.',
      B: 'Correct! Strict majority quorum guarantees that at most one partition can commit writes.',
      C: 'Nodes do not power off during network partitions; they await partition healing while refusing uncommitted state transitions.',
      D: 'Selecting arbitrary IP addresses without quorum guarantees inconsistent writes across partitioned networks.',
    },
  },
];

export const challengeCommand: Command = {
  name: 'challenge',
  aliases: ['quiz', 'challenges'],
  category: 'Recruiter',
  description: 'Interactive systems engineering challenges on databases, APIs, and distributed systems.',
  usage: 'challenge [id] | challenge answer <id> <A|B|C|D>',
  examples: ['challenge', 'challenge 1', 'challenge answer 1 B', 'challenge 4'],
  execute: (args, ctx: CommandContext) => {
    // 1. Overview listing
    if (args.length === 0) {
      const answeredCount = Object.keys(ctx.challengeProgress).length;
      const correctCount = Object.values(ctx.challengeProgress).filter((p) => p.correct).length;

      return {
        output: (
          <div className="space-y-3 font-mono text-xs">
            <InfoHeader
              title="SYSTEMS ENGINEERING CHALLENGES"
              subtitle={`${correctCount}/${CHALLENGES.length} Correctly Solved`}
            />
            <div className="p-3 rounded bg-[#20211F] border border-[#45453F] space-y-2">
              <p className="text-[#A6A397] text-[11.5px] leading-relaxed">
                Test your systems architecture and engineering knowledge. Six realistic challenges covering database optimization, API idempotency, race conditions, offline sync, cache stampedes, and distributed consensus.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {CHALLENGES.map((ch) => {
                  const state = ctx.challengeProgress[ch.id];
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => ctx.runCommand(`challenge ${ch.id}`)}
                      className="p-2.5 rounded bg-[#292A27] border border-[#45453F] text-left hover:border-[#82AAFF] transition-colors cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-[10px] text-[#82AAFF] uppercase font-bold tracking-wider">
                          Challenge {ch.id} • {ch.category}
                        </div>
                        <div className="font-semibold text-[#F0EEE7] text-xs mt-0.5 line-clamp-1">
                          {ch.title}
                        </div>
                      </div>
                      <div>
                        {state ? (
                          state.correct ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#7EC28D]/20 text-[#7EC28D] border border-[#7EC28D]/40">
                              SOLVED
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E57373]/20 text-[#E57373] border border-[#E57373]/40">
                              RETRY
                            </span>
                          )
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#45453F] text-[#A6A397]">
                            OPEN
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="text-[11px] text-[#7A786E]">
              Usage: <code className="text-[#82AAFF] font-bold">challenge &lt;1-6&gt;</code> to view, or click a challenge above.
            </div>
          </div>
        ),
      };
    }

    // 2. Answering a challenge: 'challenge answer <id> <option>' or 'challenge <id> <option>'
    if (args[0].toLowerCase() === 'answer' || (args.length >= 2 && /^[a-dA-D]$/.test(args[1]))) {
      const idStr = args[0].toLowerCase() === 'answer' ? args[1] : args[0];
      const optStr = args[0].toLowerCase() === 'answer' ? args[2] : args[1];

      if (!idStr || !optStr) {
        return { error: 'Usage: challenge answer <id> <A|B|C|D>' };
      }

      const idVal = validateChallengeId(idStr);
      if (!idVal.valid || !idVal.value) return { error: idVal.error };

      const optVal = validateChallengeOption(optStr);
      if (!optVal.valid || !optVal.value) return { error: optVal.error };

      const challenge = CHALLENGES[idVal.value - 1];
      const isCorrect = optVal.value === challenge.correctOption;

      ctx.setChallengeAnswer(challenge.id, optVal.value, isCorrect);

      return {
        output: (
          <div className="p-3.5 sm:p-5 rounded-xl bg-[#292A27] border border-[#45453F] font-mono text-xs space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#45453F]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#82AAFF] tracking-wider">
                  Challenge {challenge.id} • Evaluation
                </span>
                <div className="text-sm font-bold text-[#F0EEE7]">{challenge.title}</div>
              </div>
              <div>
                {isCorrect ? (
                  <span className="px-2.5 py-1 rounded bg-[#7EC28D]/20 border border-[#7EC28D]/40 text-[#7EC28D] font-bold text-xs flex items-center gap-1.5">
                    <span className="font-bold text-[11px]">[PASSED]</span> <span>CORRECT</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-[#E57373]/20 border border-[#E57373]/40 text-[#E57373] font-bold text-xs flex items-center gap-1.5">
                    <span className="font-bold text-[11px]">[FAILED]</span> <span>INCORRECT</span>
                  </span>
                )}
              </div>
            </div>

            {/* Answer verdict */}
            <div className={`p-3 rounded border text-xs leading-relaxed ${isCorrect ? 'bg-[#7EC28D]/10 border-[#7EC28D]/30 text-[#F0EEE7]' : 'bg-[#E57373]/10 border-[#E57373]/30 text-[#F0EEE7]'}`}>
              <div className="font-bold mb-1">
                You selected: Option {optVal.value}
              </div>
              <p className="text-[11.5px] text-[#A6A397]">
                {challenge.distractorExplanations[optVal.value]}
              </p>
            </div>

            {/* Technical Explanation */}
            <div className="p-3 rounded bg-[#20211F] border border-[#45453F] space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[#82AAFF] tracking-wider">
                In-Depth Technical Explanation
              </div>
              <p className="text-[#F0EEE7] text-[11.5px] leading-relaxed">
                {challenge.explanation}
              </p>
            </div>

            {/* Next Challenge Action */}
            <div className="flex items-center justify-between pt-1 border-t border-[#45453F]">
              <button
                type="button"
                onClick={() => ctx.runCommand('challenge')}
                className="px-2.5 py-1 rounded bg-[#32332F] text-[#F0EEE7] hover:bg-[#3E403B] text-[11px] font-semibold cursor-pointer transition-colors"
              >
                ← Back to Challenge List
              </button>
              {challenge.id < CHALLENGES.length && (
                <button
                  type="button"
                  onClick={() => ctx.runCommand(`challenge ${challenge.id + 1}`)}
                  className="px-3 py-1 rounded bg-[#82AAFF] text-[#1E1E1E] hover:bg-[#99BBFF] text-[11px] font-semibold cursor-pointer transition-colors"
                >
                  Next Challenge ({challenge.id + 1}) →
                </button>
              )}
            </div>
          </div>
        ),
      };
    }

    // 3. Inspecting a challenge: 'challenge <id>'
    const idVal = validateChallengeId(args[0]);
    if (!idVal.valid || !idVal.value) {
      return { error: idVal.error };
    }

    const challenge = CHALLENGES[idVal.value - 1];
    const previousState = ctx.challengeProgress[challenge.id];

    return {
      output: (
        <div className="p-3.5 sm:p-5 rounded-xl bg-[#292A27] border border-[#45453F] font-mono text-xs space-y-3.5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#45453F] gap-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#82AAFF] tracking-wider">
                Challenge {challenge.id} of {CHALLENGES.length} • {challenge.category}
              </div>
              <div className="text-sm font-bold text-[#F0EEE7]">
                {challenge.title}
              </div>
            </div>
            {previousState && (
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${previousState.correct ? 'bg-[#7EC28D]/20 text-[#7EC28D] border-[#7EC28D]/40' : 'bg-[#E57373]/20 text-[#E57373] border-[#E57373]/40'}`}>
                {previousState.correct ? 'SOLVED' : `PREVIOUS: ${previousState.selected}`}
              </span>
            )}
          </div>

          {/* Scenario */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#A6A397] tracking-wider">
              Engineering Context & Scenario
            </div>
            <p className="text-[#F0EEE7] text-[11.5px] leading-relaxed">
              {challenge.scenario}
            </p>
          </div>

          {/* Optional Code Snippet */}
          {challenge.codeSnippet && (
            <pre className="p-3 rounded bg-[#181917] border border-[#3A3A35] text-[#7EC28D] text-xs overflow-x-auto whitespace-pre leading-relaxed">
              {challenge.codeSnippet}
            </pre>
          )}

          {/* Question */}
          <div className="p-2.5 rounded bg-[#20211F] border border-[#45453F] text-[#F0EEE7] font-semibold text-xs leading-relaxed">
            {challenge.question}
          </div>

          {/* Multiple-Choice Options */}
          <div className="space-y-2 pt-1">
            {(['A', 'B', 'C', 'D'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => ctx.runCommand(`challenge answer ${challenge.id} ${opt}`)}
                className={`w-full p-2.5 rounded text-left border transition-colors cursor-pointer flex items-start gap-2.5 text-xs ${
                  previousState && previousState.selected === opt
                    ? previousState.correct
                      ? 'bg-[#7EC28D]/15 border-[#7EC28D] text-[#F0EEE7]'
                      : 'bg-[#E57373]/15 border-[#E57373] text-[#F0EEE7]'
                    : 'bg-[#20211F] border-[#45453F] hover:border-[#82AAFF] text-[#A6A397] hover:text-[#F0EEE7]'
                }`}
              >
                <span className="font-bold text-[#82AAFF] shrink-0">[{opt}]</span>
                <span className="leading-relaxed">{challenge.options[opt]}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#45453F] text-[10.5px] text-[#7A786E]">
            <span>Click an option above or type: <code className="text-[#82AAFF]">challenge answer {challenge.id} B</code></span>
            <button
              type="button"
              onClick={() => ctx.runCommand('challenge')}
              className="hover:text-[#F0EEE7] hover:underline cursor-pointer"
            >
              Back to Overview
            </button>
          </div>
        </div>
      ),
    };
  },
  getSubcommands: () => ['1', '2', '3', '4', '5', '6', 'answer 1', 'answer 2', 'answer 3', 'answer 4', 'answer 5', 'answer 6'],
};
