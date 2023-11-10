import { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "lib/jwt";
import { Auth } from "models/auth";
import * as methods from "micro-method-router";
import * as yup from "yup";

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        try {
            /* Define un esquema de validación */
            const schema = yup.object({
                email: yup.string().required().email(),
                code: yup.number().required()
            }).noUnknown();

            /* Valida los datos de entrada */
            schema.validateSync(req.body, { stripUnknown: false });

            /* Valida que el email y el código coincidan en la base de datos */
            const auth = await Auth.findByEmailAndCode(req.body.email, req.body.code);

            if (!auth) {
                res.status(401).json({ message: "El email o el código son incorrectos." });
            } else {
                if (auth.isCodeExpired()) {
                    res.status(401).json({ message: "El código ya expiró" });
                } else {
                    /* Genera un token */
                    const token = generateToken({ userId: auth.data.userId });

                    /* Invalida el código */
                    await auth.invalidateCode();

                    res.status(202).json({ token });
                };
            };
        } catch (error) {
            res.status(400).json({ error: error.message });
        };
    }
});