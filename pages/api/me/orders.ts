import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { Order } from "models/order";
import * as methods from "micro-method-router";

const handler = methods({
    async get(req: NextApiRequest, res: NextApiResponse, token) {
        /* Obtiene las órdenes realizadas por el usuario */
        const ordersFirebase = await Order.getOrdersFromUser(token.userId);

        /* Verifica que el usuario tenga órdenes realizadas */
        if (ordersFirebase.empty) {
            /* Si no tiene órdenes en la base de datos, tira un error con el mensaje correspondiente */
            res.status(204).json({ "message": "El usuario no tiene órdenes realizadas." });
        } else {
            const orders = [];

            /* Si tiene órdenes en la base de datos, guarda su data en la variable "orders" */
            for (let order of ordersFirebase.docs) {
                orders.push(order.data());
            };

            /* Responde con el array de órdenes */
            res.status(200).send(orders);
        };
    }
});

/* Aplica un middleware de autenticación para asegurarse de que solo 
     los usuarios autenticados puedan acceder a estas rutas */
export default authMiddleware(handler);