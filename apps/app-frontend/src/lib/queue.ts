import { Queue } from 'bullmq';
const connection = { connection: { url: process.env.REDIS_URL } };
export const notificationQueue = new Queue('notifications', { connection: { host: process.env.REDIS_URL } } as any);

export async function enqueueNotification(payload){
  await notificationQueue.add('notify', payload, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } });
}