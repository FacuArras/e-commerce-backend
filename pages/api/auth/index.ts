import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controllers/auth";
import * as methods from "micro-method-router";
import * as yup from "yup";

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        try {
            /* Define un esquema de validación */
            const schema = yup.object({
                email: yup.string().required().email(),
            }).noUnknown();

            /* Valida los datos de entrada */
            schema.validateSync(req.body, { stripUnknown: false });

            /* Encuentra o crea un usuario y envía un código por email */
            await sendCode(req.body.email, "Código de verificación", "Tu código para ingresar es:");

            res.status(200).json({ "message": "Código enviado correctamente." });
        } catch (error) {
            res.status(400).json({ error: error.message });
        };
    }
});