// workers/emailWorker.ts (BullMQ)
/*import { Worker } from "bullmq";
import sendEmail from "../lib/sendgridClient";

new Worker("notifications", async job => {
  const { notifId } = job.data;
  // load Notification doc
  // call sendEmail({to, subject, html})
  // mark Notification as sent/failed
}, { connection: redisConnection });*/

import { Worker } from 'bullmq';
import sendEmail from '@/lib/sendEmail';
const worker = new Worker('notifications', async job => {
  const { type, to, payload } = job.data;
  if (type === 'email') {
    await sendEmail({ to: to.email, subject: payload.subject, html: payload.html });
  }
}, { connection: { host: process.env.REDIS_URL } } as any);

worker.on('failed', (job, err) => console.error('job failed', job.id, err));