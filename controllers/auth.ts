import { User } from "models/user";
import { Auth } from "models/auth";
import addMinutes from "date-fns/addMinutes";
import { sendCodeToEmail } from "lib/resend";

export async function findOrCreateAuth(email: string): Promise<Auth> {
    const cleanEmail = email.trim().toLowerCase();
    const auth = await Auth.findByEmail(cleanEmail);

    if (auth) {
        return auth;
    } else {
        const newUser = await User.createUser({
            email: cleanEmail
        });

        const newAuth = await Auth.createAuth({
            email: cleanEmail,
            userId: newUser.id,
            code: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
            expires: new Date()
        });

        return newAuth;
    };
};

export async function sendCode(email: string, subject: string, message: string) {
    const auth = await findOrCreateAuth(email);

    auth.setData({
        code: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        expires: addMinutes(new Date(), 10)
    });

    await auth.pushData();

    const resend = await sendCodeToEmail(email, subject, message, auth.data.code);

    return (resend);
};
