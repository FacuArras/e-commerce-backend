import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { Order } from "models/order";
import * as methods from "micro-method-router";
import * as yup from "yup";

const handler = methods({
    async get(req: NextApiRequest, res: NextApiResponse, token) {
        try {
            /* Define un esquema de validación */
            const schema = yup.object({
                orderId: yup.string().required()
            }).noUnknown();

            /* Valida los datos de entrada */
            schema.validateSync(req.query, { stripUnknown: false });

            /* Obtiene el valor de la query */
            const { orderId } = req.query;

            /* Obtiene la orden de la base de datos */
            const order = await Order.getOneOrder(orderId);

            /* Verifica que la orden exista */
            if (order) {
                /* Si existe retorna la data de la misma */
                res.status(200).send(order.data());
            } else {
                /* Si no existe retorna un error con su respectivo mensaje */
                res.status(400).json({ "message": "La orden con el id " + orderId + " no existe." });
            };
        } catch (error) {
            res.status(400).json({ error: error.message });
        };
    }
});

/* Aplica un middleware de autenticación para asegurarse de que solo 
     los usuarios autenticados puedan acceder a estas rutas */
export default authMiddleware(handler);