import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { User } from "models/user";
import * as methods from "micro-method-router";
import * as yup from "yup";

const handler = methods({
    async patch(req: NextApiRequest, res: NextApiResponse, token) {
        try {
            /* Define un esquema de validación */
            const schema = yup.object({
                address: yup.string().required()
            }).noUnknown();

            /* Valida los datos de entrada */
            schema.validateSync(req.body, { stripUnknown: false });

            /* Crea una instancia de la clase User utilizando el ID del token */
            const user = new User(token.userId);

            /* Establece la dirección del usuario a partir del req.body */
            user.setData({ "address": req.body.address });

            /* Actualiza los datos del usuario en la base de datos */
            await user.pushData();

            /* Responde con un mensaje de éxito y los detalles de la modificación */
            res.status(200).json({
                "message": "Dirección modificada correctamente.",
                "modificacion": user.data
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        };
    }
});

/* Aplica un middleware de autenticación para asegurarse de que solo 
     los usuarios autenticados puedan acceder a estas rutas */
export default authMiddleware(handler);