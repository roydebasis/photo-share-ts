import { Worker } from "bullmq";
import { connection } from "../config/redisConnection";

// Create a worker to process email jobs
const reportWorker = new Worker(
  "reportQueue",
  async (job) => {
    const { data } = job;
    console.log(`📊 Processing Report job ${job.id}`, data);
    // Imagine generating a PDF report here...
    return { status: "Report generated" };
  },
  {
    connection,
    concurrency: 2, // Process up to 2 emails concurrently
    limiter: {
      max: 50, // max jobs
      duration: 1000, // per 1 second
    },
  }
);

// Handle worker events
reportWorker.on("completed", (job) => {
  console.log(`✔️ Report job #${job.id} completed successfully`);
});

reportWorker.on("failed", (job, err) => {
  console.error(`Report job ${job?.id} failed:`, err.message);
});

reportWorker.on("error", (err) => {
  console.error("Report worker error:", err);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🔒 Shutting down report worker...");
  await reportWorker.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🔒 Shutting down report worker...");
  await reportWorker.close();
  process.exit(0);
});

console.log("👂Report worker started and listening for jobs...");
