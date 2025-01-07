'use server';

import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_SERVER_HOST,
    port: 587,
    secure: true,
    auth: {
        user: process.env.SMTP_SERVER_USERNAME,
        pass: process.env.SMTP_SERVER_PASSWORD,
    },
});

export async function sendMail({
      sendTo,
    subject,
    text,
    html,
}: {
   
    sendTo: string;
    subject: string;
    text?: string;
    html: string;
}) {
    try {
        const isVerified = await transporter.verify();
        if (!isVerified) {
            return {
                status: 500,
                message: 'SMTP server verification failed',
            };
        }

        const info = await transporter.sendMail({
            from: process.env.SMTP_SERVER_USERNAME,
            to: sendTo,
            subject,
            text:text||"",
            html: html || '',
        });

        return {
            status: 200,
            message: 'Email sent successfully',
            info,
        };
    } catch (error: any) {
        return {
            status: 500,
            message: 'Failed to send email',
            error: error.message || 'An unknown error occurred',
        };
    }
}
