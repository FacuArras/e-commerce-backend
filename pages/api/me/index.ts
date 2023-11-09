import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { User } from "models/user";
import { sendPaymentValidationToUser } from "lib/resend";
import * as methods from "micro-method-router";

async function getMe(req: NextApiRequest, res: NextApiResponse, token) {
    try {
        /* Crea una instancia de la clase User utilizando el ID del token */
        const user = new User(token.userId);

        /* Obtiene la data de la base de datos */
        await user.getData();

        /* Responde con los datos del usuario */
        res.status(200).send(user.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};

async function updateMe(req: NextApiRequest, res: NextApiResponse, token) {
    try {
        /* Crea una instancia de la clase User utilizando el ID del token */
        const user = new User(token.userId);

        /* Establece la data del usuario a partir del req.body */
        user.setData(req.body);

        /* Actualiza los datos del usuario en la base de datos */
        await user.pushData();

        /* Responde con un mensaje de éxito y los detalles de las modificaciones */
        res.status(200).json({
            "message": "Usuario modificado correctamente.",
            "modificaciones": user.data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};

/* Crea un controlador de rutas que manejará solamente las solicitudes GET y PATCH */
const handler = methods({
    get: getMe,
    patch: updateMe
});

/* Aplica un middleware de autenticación para asegurarse de que solo 
     los usuarios autenticados puedan acceder a estas rutas */
export default authMiddleware(handler);