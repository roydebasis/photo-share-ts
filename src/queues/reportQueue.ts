import { Queue } from "bullmq";
import { connection } from "../config/redisConnection";

export const reportQueue = new Queue("reportQueue", { connection });
