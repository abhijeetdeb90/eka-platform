/**
 * EKA Asynchronous Queue & Background Worker Architecture
 *
 * Handles asynchronous background workloads:
 * - Media optimization and WebP conversion
 * - Knowledge graph vector embedding generation
 * - LangGraph agentic provenance verification
 * - Daily panchangam & muhurta calculation
 * - Notification fanout and email digests
 * - Creator payout escrow release
 */

export type JobType =
  | "media.optimize"
  | "vector.index"
  | "provenance.verify"
  | "panchangam.compute"
  | "notification.fanout"
  | "payout.escrow_release";

export interface QueueJob<T = Record<string, unknown>> {
  id: string;
  type: JobType;
  payload: T;
  attempts: number;
  maxAttempts: number;
  scheduledFor: number;
  createdAt: number;
}

export interface EnqueueOptions {
  delaySeconds?: number;
  maxAttempts?: number;
}

// In-memory worker queue fallback (or can connect to BullMQ / Cloudflare Queues / Inngest)
const jobQueue: QueueJob[] = [];
const deadLetterQueue: QueueJob[] = [];

/**
 * Enqueue a background job for asynchronous execution
 */
export async function enqueueJob<T extends Record<string, unknown>>(
  type: JobType,
  payload: T,
  options: EnqueueOptions = {},
): Promise<string> {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = Date.now();
  const scheduledFor = options.delaySeconds ? now + options.delaySeconds * 1000 : now;

  const job: QueueJob<T> = {
    id: jobId,
    type,
    payload,
    attempts: 0,
    maxAttempts: options.maxAttempts ?? 3,
    scheduledFor,
    createdAt: now,
  };

  // If a remote worker or webhook endpoint is configured, post to queue worker
  const QUEUE_WORKER_URL = process.env["QUEUE_WORKER_URL"];
  if (QUEUE_WORKER_URL) {
    try {
      await fetch(`${QUEUE_WORKER_URL}/enqueue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env["QUEUE_WORKER_SECRET"] || ""}`,
        },
        body: JSON.stringify(job),
      });
      return jobId;
    } catch {
      // Fallback to local queue if worker endpoint is unreachable
    }
  }

  jobQueue.push(job as QueueJob);
  return jobId;
}

/**
 * Worker handler dispatcher
 */
export async function processNextJob(
  handlers: Partial<Record<JobType, (payload: unknown) => Promise<void>>>,
): Promise<{ processed: boolean; jobId?: string; error?: string }> {
  const now = Date.now();
  const readyIndex = jobQueue.findIndex((j) => j.scheduledFor <= now);
  if (readyIndex === -1) return { processed: false };

  const job = jobQueue.splice(readyIndex, 1)[0];
  if (!job) return { processed: false };
  const handler = handlers[job.type];

  if (!handler) {
    deadLetterQueue.push(job);
    return { processed: false, jobId: job.id, error: `No handler registered for ${job.type}` };
  }

  job.attempts += 1;
  try {
    await handler(job.payload);
    return { processed: true, jobId: job.id };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (job.attempts < job.maxAttempts) {
      // Exponential backoff: 2s, 8s, 32s...
      const backoffMs = Math.pow(4, job.attempts) * 1000;
      job.scheduledFor = Date.now() + backoffMs;
      jobQueue.push(job);
    } else {
      // Exhausted retries -> Dead Letter Queue
      deadLetterQueue.push(job);
    }
    return { processed: false, jobId: job.id, error: errorMsg };
  }
}

/**
 * Inspection utility for monitoring queues
 */
export function getQueueMetrics(): { pending: number; deadLetter: number } {
  return {
    pending: jobQueue.length,
    deadLetter: deadLetterQueue.length,
  };
}
