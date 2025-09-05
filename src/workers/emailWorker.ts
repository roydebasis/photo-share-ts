import { Worker } from "bullmq";
import { connection } from "../config/redisConnection";
import { MailOptions, transporter } from "../services/mailerService";

// Create a worker to process email jobs
const emailWorker = new Worker<MailOptions>(
  "emailQueue",
  async (job) => {
    const { data } = job;
    console.log(
      `Processing email job ${job.id}: ${data.subject} to ${
        Array.isArray(data.to) ? data.to.join(", ") : data.to
      }`
    );

    try {
      // Send the email using the transporter
      const result = await transporter.sendMail(data);
      console.log(`Email sent successfully: ${result.messageId}`);
      return result;
    } catch (error) {
      console.error(`❌Failed to send email job ${job.id}:`, error);
      throw error; // This will trigger a retry if attempts > 1
    }
  },
  {
    connection,
    concurrency: 5, // Process up to 5 emails concurrently
    limiter: {
      max: 50, // max jobs
      duration: 1000, // per 1 second
    },
  }
);

// Handle worker events
emailWorker.on("completed", (job) => {
  console.log(`✔️ Email job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err.message);
});

emailWorker.on("error", (err) => {
  console.error("Email worker error:", err);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🔒 Shutting down email worker...");
  await emailWorker.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🔒 Shutting down email worker...");
  await emailWorker.close();
  process.exit(0);
});

console.log("👂Email worker started and listening for jobs...");
