import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCodeToEmail(email: string, subject: string, message: string, messageItem: string) {
    try {
        const data = await resend.emails.send({
            from: 'ecommercebackend@resend.dev',
            to: email,
            subject,
            html: `<div><h2>${message}</h2><h1>${messageItem}</h1></div>`,
        });

        return data;
    } catch (error) {
        throw (error);
    };
};