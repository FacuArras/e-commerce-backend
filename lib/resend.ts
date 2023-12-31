import { Resend } from 'resend';
import { User } from 'models/user';

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

export async function sendPaymentValidationToUser(userId, productName, accepted) {
    try {
        const userData = await User.getOneUser(userId);

        const data = await resend.emails.send({
            from: 'ecommercebackend@resend.dev',
            to: userData.data().email,
            subject: accepted ? "¡Tu pago se realizó correctamente!" : "Tu pago ha sido rechazado :(",
            html: accepted ? `<div><p>¡La compra de ${productName} se realizó de manera correcta!</p></div>`
                : `<div><p>La compra de ${productName} no pudo realizarse</p></div>`,
        });

        return data;
    } catch (error) {
        throw (error)
    };
};