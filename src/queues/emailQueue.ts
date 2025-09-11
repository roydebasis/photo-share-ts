import { Queue } from "bullmq";
import { connection } from "../config/redisConnection";
import { MailOptions } from "../services/MailerService";

export const emailQueue = new Queue<MailOptions>("emailQueue", { connection });

// Helper function to enqueue jobs
export async function addEmailJob(
  data: MailOptions,
  options?: {
    delay?: number; // ms
    attempts?: number; // retries
    backoff?: number; // ms between retries
  }
) {
  await emailQueue.add("sendEmail", data, {
    delay: options?.delay || 0, // default: run immediately
    attempts: options?.attempts || 3, // retry up to 3 times
    backoff: options?.backoff || 5000, // wait 5s between retries
    removeOnComplete: true, // clean up successful jobs
    removeOnFail: false, // keep failed jobs for debugging
  });
}
