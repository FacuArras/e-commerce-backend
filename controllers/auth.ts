import { User } from "models/user";
import { Auth } from "models/auth";
import addMinutes from "date-fns/addMinutes";
import { sendCodeToEmail } from "lib/resend";

export async function findOrCreateAuth(email: string): Promise<Auth> {
    /* Modifica el email recibido para poder usarlo correctamente */
    const cleanEmail = email.trim().toLowerCase();

    /* Encuentra en la base de datos un documento que coincida con el email recibido  */
    const auth = await Auth.findByEmail(cleanEmail);

    /* Verifica que el documento exista */
    if (auth) {
        /* Si existe lo retorna */
        return auth;
    } else {
        /* Si no existe crea un nuevo usuario con el email recibido */
        const newUser = await User.createUser({
            email: cleanEmail
        });

        /* Además creo un nuevo documento en la colección auth */
        const newAuth = await Auth.createAuth({
            email: cleanEmail,
            userId: newUser.id,
            code: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
            expires: new Date()
        });

        /* Retorna el auth creado */
        return newAuth;
    };
};

export async function sendCode(email: string, subject: string, message: string) {
    /* Encuentra o crea un usuario en la base de datos con el email recibido */
    const auth = await findOrCreateAuth(email);

    /* Modifica los datos del código y cuándo expira el mismo en la base de datos */
    auth.setData({
        code: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        expires: addMinutes(new Date(), 10)
    });

    /* Envía la data modificada a la base de datos */
    await auth.pushData();

    /* Envía el código creado hace instantes al usuario por email */
    const resend = await sendCodeToEmail(email, subject, message, auth.data.code);

    /* Retorna la respuesta correspondiente  */
    return (resend);
};
