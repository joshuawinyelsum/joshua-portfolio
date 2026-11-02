import React from 'react';
import { Command, CommandContext } from '../types';
import { validateProjectKey } from '../argumentValidators';
import { InfoHeader } from '../components/TerminalUI';

interface TraceStep {
  layer: 'CLIENT' | 'OFFLINE_STORAGE' | 'TRANSPORT' | 'GATEWAY' | 'BACKEND' | 'DATABASE' | 'ASYNC_WORKER' | 'UI_RENDER';
  label: string;
  action: string;
  payload: string;
  metrics: string;
  invariants: string;
}

interface ProjectTraceSequence {
  id: string;
  name: string;
  scenario: string;
  steps: TraceStep[];
}

const TRACES: Record<string, ProjectTraceSequence> = {
  cfss: {
    id: 'cfss',
    name: 'CFSS Offline Survey Synchronization',
    scenario: 'Field enumerator captures a rural household survey with intermittent 2G connectivity.',
    steps: [
      {
        layer: 'CLIENT',
        label: 'Step 1: User Survey Submission & GPS Capture',
        action: 'Enumerator taps Submit in the Next.js PWA. Browser Geolocation API captures latitude, longitude, and accuracy radius.',
        payload: '{ survey_id: "srv_9012", community: "Nyankpala", lat: 9.4012, lng: -0.9854, accuracy_m: 8.2 }',
        metrics: 'Client latency: 12ms | Memory: 42KB',
        invariants: 'Zod client schema validation must pass; GPS accuracy must be <= 15m radius.',
      },
      {
        layer: 'OFFLINE_STORAGE',
        label: 'Step 2: Transactional Dexie / IndexedDB Write',
        action: 'Survey payload written to local IndexedDB table `pending_surveys` with status = "PendingSync".',
        payload: 'db.pending_surveys.put({ ...survey, sync_attempts: 0, status: "PendingSync", recorded_at: "2026-11-02T01:00:00Z" })',
        metrics: 'IndexedDB write time: 4ms | Storage: persistent',
        invariants: 'Data remains safely on physical tablet storage regardless of sudden device power loss or browser refresh.',
      },
      {
        layer: 'TRANSPORT',
        label: 'Step 3: Network Detection & Transmission',
        action: 'Background sync worker detects online event. Constructs HTTPS POST request with Bearer JWT token and request idempotency key.',
        payload: 'POST /api/v1/surveys/sync\nHeaders: Authorization: Bearer <jwt>, X-Idempotency-Key: idemp_9012\nBody: GZIP-compressed survey batch',
        metrics: 'Cellular round-trip: 480ms (high latency 2G link)',
        invariants: 'TLS 1.3 encryption in transit; exponential backoff if HTTP 503 or network socket timeout occurs.',
      },
      {
        layer: 'GATEWAY',
        label: 'Step 4: FastAPI Gateway Ingress & Auth Guard',
        action: 'FastAPI dependency injection executes token verification, role validation, and connection rate budgeting.',
        payload: 'verify_enumerator_role(user_id="usr_882", active_cohort="2026_field_ops")',
        metrics: 'FastAPI middleware latency: 6ms',
        invariants: 'Enumerators can only submit surveys to assigned community zones; coordinator boundaries strictly enforced.',
      },
      {
        layer: 'BACKEND',
        label: 'Step 5: Pydantic v2 Schema & Geospatial Validation',
        action: 'Pydantic parses JSON body. Boundary polygon service verifies GPS coordinates fall inside community geographic boundary.',
        payload: 'SurveyCreateSchema.model_validate(json_payload)\npoint_in_polygon(lat=9.4012, lng=-0.9854, boundary=community.geom) == True',
        metrics: 'Validation time: 3ms',
        invariants: 'Surveys with points outside valid sector boundaries are rejected with HTTP 422 Unprocessable Entity.',
      },
      {
        layer: 'DATABASE',
        label: 'Step 6: PostgreSQL ACID Transaction',
        action: 'Database transaction begins: insert survey record, write immutable audit log, increment community counter, commit.',
        payload: 'BEGIN;\nINSERT INTO surveys (...) VALUES (...);\nINSERT INTO survey_audit_log (action, user_id, srv_id) VALUES (...);\nUPDATE community_metrics SET total_surveys = total_surveys + 1 WHERE id = ...;\nCOMMIT;',
        metrics: 'DB transaction latency: 8ms | WAL flushed',
        invariants: 'Atomicity guaranteed; duplicate X-Idempotency-Key returns existing survey record without creating duplicate row.',
      },
      {
        layer: 'UI_RENDER',
        label: 'Step 7: Ingress ACK & Client Reconciliation',
        action: 'Server returns HTTP 201 Created with server assigned timestamp and ETag. Client Dexie updates record status to "Synced".',
        payload: 'HTTP/1.1 201 Created\n{ status: "synced", server_id: "srv_9012", revision: 1 }\nDexie: db.pending_surveys.delete("srv_9012") -> db.synced_surveys.put(...)',
        metrics: 'End-to-end trace complete: 513ms',
        invariants: 'UI displays green synced indicator; draft queue decremented; survey ready for coordinator review.',
      },
    ],
  },
  cpw: {
    id: 'cpw',
    name: 'Coach Prosper’s World Webhook Verification',
    scenario: 'Paystack payment gateway notifies production API of verified member donation.',
    steps: [
      {
        layer: 'TRANSPORT',
        label: 'Step 1: Inbound Webhook Event from Paystack',
        action: 'Paystack webhook dispatcher emits HTTP POST to production webhook route with HMAC-SHA512 signature in header.',
        payload: 'POST /api/webhooks/paystack\nHeaders: x-paystack-signature: d7a8...c9e1\nBody: { event: "charge.success", data: { reference: "cpw_don_7721", amount: 50000, currency: "GHS" } }',
        metrics: 'Network transit: 45ms',
        invariants: 'Request originates from Paystack IP range; signature header must be present.',
      },
      {
        layer: 'GATEWAY',
        label: 'Step 2: Cryptographic Signature Verification',
        action: 'Next.js API route computes HMAC-SHA512 of raw request body using PAYSTACK_SECRET_KEY in timing-safe manner.',
        payload: 'crypto.timingSafeEqual(\n  Buffer.from(signature),\n  Buffer.from(crypto.createHmac("sha512", secret).update(rawBody).digest("hex"))\n) == true',
        metrics: 'Crypto verification latency: 1.2ms',
        invariants: 'Any request with mismatched HMAC signature immediately receives HTTP 401 Unauthorized and terminates.',
      },
      {
        layer: 'BACKEND',
        label: 'Step 3: Webhook Idempotency Check',
        action: 'System queries transaction ledger for reference `cpw_don_7721` to guard against duplicate webhook retries.',
        payload: 'const existing = await prisma.donation.findUnique({ where: { reference: "cpw_don_7721" } })',
        metrics: 'Query latency: 3.5ms',
        invariants: 'If reference already processed, server returns HTTP 200 OK immediately without double-crediting campaign balance.',
      },
      {
        layer: 'DATABASE',
        label: 'Step 4: Prisma Database Transaction',
        action: 'Atomic Prisma transaction writes donation record and updates total campaign balance.',
        payload: 'await prisma.$transaction([\n  prisma.donation.create({ data: { reference, amount: 500.0, donorEmail: "..." } }),\n  prisma.campaign.update({ where: { id }, data: { raised: { increment: 500.0 } } })\n])',
        metrics: 'PostgreSQL transaction latency: 7ms',
        invariants: 'Campaign ledger update and donation record insertion must succeed together or roll back completely.',
      },
      {
        layer: 'ASYNC_WORKER',
        label: 'Step 5: Multi-Channel SMS & Email Notification',
        action: 'Dispatch background SMS notification to donor phone via Arkesel SMS Gateway API and queue donor confirmation email.',
        payload: 'arkeselClient.sms.send({\n  sender: "CPW-Ghana",\n  recipient: "+23354xxxxxxx",\n  message: "Thank you for supporting Coach Prosper\'s World! Reference: cpw_don_7721"\n})',
        metrics: 'External SMS API call: 180ms',
        invariants: 'SMS failure does not roll back the database transaction; queued with retry worker.',
      },
      {
        layer: 'UI_RENDER',
        label: 'Step 6: Immediate Webhook Acknowledgement',
        action: 'API returns HTTP 200 OK to Paystack within 250ms, fulfilling webhook SLA.',
        payload: 'HTTP/1.1 200 OK\n{ received: true }',
        metrics: 'Total webhook processing duration: 242ms',
        invariants: 'Webhook endpoint responds under 5 seconds to prevent gateway retry storms.',
      },
    ],
  },
  mastery: {
    id: 'mastery',
    name: 'MasteryOS Spaced Repetition Computation',
    scenario: 'Student completes active recall prompt and submits recall score.',
    steps: [
      {
        layer: 'CLIENT',
        label: 'Step 1: Active Recall Challenge & Self-Rating',
        action: 'Student reads problem prompt (reference notes hidden), attempts recall, reveals answer, and inputs rating q=4 (good recall).',
        payload: '{ concept_id: "c_graph_dfs", recall_score: 4, recall_time_ms: 3200 }',
        metrics: 'Client interaction: 3.2s study duration',
        invariants: 'Reference solution cannot be inspected prior to user flipping the recall card.',
      },
      {
        layer: 'GATEWAY',
        label: 'Step 2: API Ingress & Payload Validation',
        action: 'Zod schema validates concept ID, active study session token, and bounded rating 0 <= q <= 5.',
        payload: 'ReviewSubmissionSchema.parse({ concept_id, recall_score: 4, recall_time_ms: 3200 })',
        metrics: 'Zod parse latency: 0.8ms',
        invariants: 'Recall scores outside 0-5 rejected; missing session token rejected.',
      },
      {
        layer: 'BACKEND',
        label: 'Step 3: SuperMemo SM-2 Interval Calculation',
        action: 'Engine computes updated Easiness Factor (EF) and new interval based on SuperMemo SM-2 formula.',
        payload: 'q = 4, prev_EF = 2.50\nnew_EF = 2.50 + (0.1 - (5 - 4) * (0.08 + (5 - 4) * 0.02)) = 2.50\nrepetition_count = 3 -> interval = 6 * 2.50 = 15 days',
        metrics: 'Calculation duration: 0.02ms',
        invariants: 'Easiness Factor (EF) cannot drop below minimum threshold of 1.30.',
      },
      {
        layer: 'BACKEND',
        label: 'Step 4: Prerequisite Failure Diagnostic',
        action: 'If q < 3 (failure), engine traverses DAG prerequisites to flag conceptual root causes. Since q=4, prerequisite tree marked healthy.',
        payload: 'traversePrerequisiteRoots(concept_id="c_graph_dfs") -> status: "STABLE"',
        metrics: 'DFS traversal latency: 1.1ms',
        invariants: 'DAG invariant: No circular dependencies allowed in prerequisite graph.',
      },
      {
        layer: 'DATABASE',
        label: 'Step 5: Append-Only Review Log & Schedule Update',
        action: 'Prisma transaction appends immutable review record to ReviewLog table and updates Concept next_review_due date.',
        payload: 'BEGIN;\nINSERT INTO review_logs (concept_id, score, latency_ms, computed_ef, created_at) VALUES (...);\nUPDATE concepts SET next_review = NOW() + INTERVAL \'15 days\', repetitions = 3, easiness_factor = 2.50 WHERE id = ...;\nCOMMIT;',
        metrics: 'Prisma PostgreSQL transaction: 5.2ms',
        invariants: 'Historical review logs are append-only; historical performance never overwritten.',
      },
      {
        layer: 'UI_RENDER',
        label: 'Step 6: Next Recall Item Preload',
        action: 'Server returns updated scheduling metrics and the next due concept item in the queue.',
        payload: 'HTTP/1.1 200 OK\n{ next_concept: { id: "c_db_b_tree", prompt: "Explain B-tree fanout vs height" } }',
        metrics: 'End-to-end round trip: 68ms',
        invariants: 'Client study session advances seamlessly without full-page reloads.',
      },
    ],
  },
};

export const traceCommand: Command = {
  name: 'trace',
  category: 'Recruiter',
  description: 'Simulate a step-by-step request lifecycle trace across architectural layers.',
  usage: 'trace <cfss | cpw | mastery> [next | prev | all | reset]',
  examples: ['trace cfss', 'trace cfss next', 'trace cpw', 'trace mastery all'],
  execute: (args, ctx: CommandContext) => {
    if (args.length === 0) {
      return {
        output: (
          <div className="space-y-3 font-mono text-xs">
            <InfoHeader title="REQUEST LIFECYCLE SIMULATOR" subtitle="Trace multi-layered system execution" />
            <div className="p-3 rounded bg-[#20211F] border border-[#45453F] space-y-2">
              <div className="text-[11px] text-[#A6A397]">
                Select a simulated request trace to step through client validation, offline storage, transport, gateway ingress, and database transactions:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => ctx.runCommand('trace cfss')}
                  className="p-2.5 rounded bg-[#292A27] border border-[#45453F] text-left hover:border-[#82AAFF] transition-colors cursor-pointer space-y-1"
                >
                  <div className="text-[#82AAFF] font-bold text-xs">1. CFSS Sync</div>
                  <div className="text-[10px] text-[#A6A397]">Offline survey submission & IndexedDB reconciliation</div>
                </button>
                <button
                  type="button"
                  onClick={() => ctx.runCommand('trace cpw')}
                  className="p-2.5 rounded bg-[#292A27] border border-[#45453F] text-left hover:border-[#7EC28D] transition-colors cursor-pointer space-y-1"
                >
                  <div className="text-[#7EC28D] font-bold text-xs">2. CPW Webhook</div>
                  <div className="text-[10px] text-[#A6A397]">HMAC-SHA512 verification & SMS alerts</div>
                </button>
                <button
                  type="button"
                  onClick={() => ctx.runCommand('trace mastery')}
                  className="p-2.5 rounded bg-[#292A27] border border-[#45453F] text-left hover:border-[#E5C07B] transition-colors cursor-pointer space-y-1"
                >
                  <div className="text-[#E5C07B] font-bold text-xs">3. MasteryOS</div>
                  <div className="text-[10px] text-[#A6A397]">SuperMemo SM-2 & DAG diagnostic traversal</div>
                </button>
              </div>
            </div>
            <div className="text-[11px] text-[#7A786E]">
              Usage: <code className="text-[#82AAFF] font-bold">trace &lt;project&gt; [next | prev | all | reset]</code>
            </div>
          </div>
        ),
      };
    }

    const val = validateProjectKey(args[0]);
    if (!val.valid || !val.value) {
      return { error: val.error };
    }

    const targetKey = val.value === 'coach-prospers-world' ? 'cpw' : val.value === 'mastery-os' ? 'mastery' : val.value;
    const trace = TRACES[targetKey];
    if (!trace) {
      return { error: `Trace for '${args[0]}' is not available. Options: cfss, cpw, mastery.` };
    }

    const subArg = (args[1] || '').toLowerCase();
    const isSameProject = ctx.traceState.active && ctx.traceState.project === targetKey;
    let step = isSameProject ? ctx.traceState.step : 1;

    if (subArg === 'all') {
      // Display all steps in sequence
      return {
        output: (
          <div className="p-3.5 sm:p-5 rounded-xl bg-[#292A27] border border-[#45453F] font-mono text-xs space-y-3">
            <div className="flex justify-between items-start border-b border-[#45453F] pb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#82AAFF] tracking-wider">
                  FULL LIFECYCLE TRACE
                </span>
                <div className="text-sm font-bold text-[#F0EEE7]">{trace.name}</div>
                <div className="text-[11px] text-[#A6A397]">{trace.scenario}</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#45453F] text-[#F0EEE7]">
                {trace.steps.length} Steps
              </span>
            </div>
            <div className="space-y-3 pt-1">
              {trace.steps.map((s, idx) => (
                <div key={idx} className="p-3 rounded bg-[#20211F] border border-[#45453F] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#F0EEE7]">{s.label}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-[#82AAFF]/15 text-[#82AAFF]">
                      {s.layer}
                    </span>
                  </div>
                  <p className="text-[#A6A397] text-[11.5px]">{s.action}</p>
                  <pre className="p-2 rounded bg-[#181917] border border-[#3A3A35] text-[#7EC28D] text-[11px] overflow-x-auto">
                    {s.payload}
                  </pre>
                  <div className="flex flex-wrap gap-x-4 text-[10px] text-[#7A786E] pt-0.5">
                    <span>Performance: {s.metrics}</span>
                    <span>Invariant: {s.invariants}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 text-[10.5px] text-[#7A786E] border-t border-[#45453F]">
              [SIMULATED EXECUTION TRACE — ILLUSTRATIVE ARCHITECTURAL WORKFLOW]
            </div>
          </div>
        ),
      };
    }

    if (subArg === 'next' || subArg === 'n') {
      step = Math.min(trace.steps.length, step + 1);
    } else if (subArg === 'prev' || subArg === 'p' || subArg === 'back') {
      step = Math.max(1, step - 1);
    } else if (subArg === 'reset') {
      step = 1;
    } else if (/^\d+$/.test(subArg)) {
      const parsed = parseInt(subArg, 10);
      if (parsed >= 1 && parsed <= trace.steps.length) step = parsed;
    }

    ctx.setTraceState({ project: targetKey, step, active: true });
    const currentStepData = trace.steps[step - 1];

    const layerBadgeStyles: Record<string, string> = {
      CLIENT: 'bg-[#82AAFF]/15 text-[#82AAFF] border-[#82AAFF]/30',
      OFFLINE_STORAGE: 'bg-[#C678DD]/15 text-[#C678DD] border-[#C678DD]/30',
      TRANSPORT: 'bg-[#A6A397]/15 text-[#A6A397] border-[#A6A397]/30',
      GATEWAY: 'bg-[#E5C07B]/15 text-[#E5C07B] border-[#E5C07B]/30',
      BACKEND: 'bg-[#7EC28D]/15 text-[#7EC28D] border-[#7EC28D]/30',
      DATABASE: 'bg-[#E06C75]/15 text-[#E06C75] border-[#E06C75]/30',
      ASYNC_WORKER: 'bg-[#56B6C2]/15 text-[#56B6C2] border-[#56B6C2]/30',
      UI_RENDER: 'bg-[#82AAFF]/15 text-[#82AAFF] border-[#82AAFF]/30',
    };

    return {
      output: (
        <div className="p-3.5 sm:p-5 rounded-xl bg-[#292A27] border border-[#45453F] font-mono text-xs space-y-3.5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#45453F] gap-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#82AAFF] tracking-wider">
                REQUEST LIFECYCLE SIMULATION
              </div>
              <div className="text-sm font-bold text-[#F0EEE7]">
                {trace.name}
              </div>
              <div className="text-[11px] text-[#A6A397]">
                {trace.scenario}
              </div>
            </div>
            {/* Step indicator pills */}
            <div className="flex items-center gap-0.5">
              {trace.steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => ctx.runCommand(`trace ${targetKey} ${i + 1}`)}
                  className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center cursor-pointer transition-colors"
                  title={`Step ${i + 1}`}
                >
                  <span
                    className={`w-4 h-1.5 rounded-full block ${
                      i + 1 === step
                        ? 'bg-[#82AAFF]'
                        : i + 1 < step
                        ? 'bg-[#7EC28D]'
                        : 'bg-[#45453F] hover:bg-[#7A786E]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Step Card */}
          <div className="p-3.5 rounded bg-[#20211F] border border-[#45453F] space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3A3A35] pb-2">
              <span className="font-bold text-sm text-[#F0EEE7]">
                {currentStepData.label}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${layerBadgeStyles[currentStepData.layer] || 'text-[#F0EEE7]'}`}>
                Layer: {currentStepData.layer}
              </span>
            </div>

            {/* Action Explanation */}
            <div>
              <div className="text-[10px] uppercase font-bold text-[#A6A397] tracking-wider mb-0.5">
                Execution Detail
              </div>
              <p className="text-[#F0EEE7] leading-relaxed text-[11.5px]">
                {currentStepData.action}
              </p>
            </div>

            {/* Code / Payload Snippet */}
            <div>
              <div className="text-[10px] uppercase font-bold text-[#A6A397] tracking-wider mb-1">
                Wire Payload / Operation Invariant
              </div>
              <pre className="p-2.5 rounded bg-[#181917] border border-[#3A3A35] text-[#7EC28D] text-xs overflow-x-auto whitespace-pre leading-relaxed">
                {currentStepData.payload}
              </pre>
            </div>

            {/* Performance and Invariants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded bg-[#262724] border border-[#3A3A35]">
                <span className="text-[#82AAFF] font-bold">Performance:</span>{' '}
                <span className="text-[#A6A397]">{currentStepData.metrics}</span>
              </div>
              <div className="p-2 rounded bg-[#262724] border border-[#3A3A35]">
                <span className="text-[#E5C07B] font-bold">Invariant:</span>{' '}
                <span className="text-[#A6A397]">{currentStepData.invariants}</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between pt-1 border-t border-[#45453F] gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={step === 1}
                onClick={() => ctx.runCommand(`trace ${targetKey} prev`)}
                className={`px-3 py-1.5 min-h-[34px] flex items-center rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  step === 1
                    ? 'opacity-40 cursor-not-allowed text-[#7A786E]'
                    : 'bg-[#32332F] text-[#F0EEE7] hover:bg-[#3E403B] border border-[#45453F]'
                }`}
              >
                Prev Step
              </button>
              <button
                type="button"
                disabled={step === trace.steps.length}
                onClick={() => ctx.runCommand(`trace ${targetKey} next`)}
                className={`px-3 py-1.5 min-h-[34px] flex items-center rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  step === trace.steps.length
                    ? 'opacity-40 cursor-not-allowed text-[#7A786E]'
                    : 'bg-[#82AAFF] text-[#1E1E1E] hover:bg-[#99BBFF]'
                }`}
              >
                Next Step
              </button>
              <button
                type="button"
                onClick={() => ctx.runCommand(`trace ${targetKey} all`)}
                className="px-2.5 py-1.5 min-h-[34px] flex items-center rounded bg-[#32332F] text-[#A6A397] hover:text-[#F0EEE7] hover:bg-[#3E403B] text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Show All
              </button>
            </div>
            <div className="text-[10px] text-[#7A786E]">
              Step {step} of {trace.steps.length} • [SIMULATED WORKFLOW]
            </div>
          </div>
        </div>
      ),
    };
  },
  getSubcommands: () => ['cfss', 'cpw', 'mastery', 'cfss next', 'cpw next', 'mastery next', 'cfss all', 'reset'],
};
