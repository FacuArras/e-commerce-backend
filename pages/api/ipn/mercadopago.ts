import { NextApiRequest, NextApiResponse } from "next";
import { receiveOrder } from "controllers/order";
import * as methods from "micro-method-router";

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        try {
            const { id, topic } = req.query;

            /* Verifica si la órden recibida tiene el topic de "merchant_order" */
            if (topic == "merchant_order") {
                /* Recibo la órden y realizo sus correspondientes acciones */
                await receiveOrder(id);

                /* Responde con un status de 201 sea correcto el pago o no para que MercadoPago no falle */
                res.status(201).json({ message: "Pago recibido correctamente." });
            } else {
                /* Si no es del tipo "merchant_order" responde con el error correspondiente */
                res.status(200).json({ message: "No es una órden de compra" });
            };
        } catch {
            res.status(200).json({ message: "Ha ocurrido un problema al obtener la compra." });
        };
    }
}); 