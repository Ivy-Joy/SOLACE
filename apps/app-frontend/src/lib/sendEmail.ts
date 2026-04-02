import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
export default async function sendEmail({ to, subject, html }){
  return sgMail.send({ to, from: process.env.SENDER_EMAIL!, subject, html });
}