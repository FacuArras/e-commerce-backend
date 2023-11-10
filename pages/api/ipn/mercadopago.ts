import { NextApiRequest, NextApiResponse } from "next";
import { Order } from "models/order";
import { getMerchantOrder } from "lib/mercadopago";
import { sendPaymentValidationToUser } from "lib/resend";
import { createOrderRecord } from "lib/airtable";
import * as methods from "micro-method-router";

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        try {
            const { id, topic } = req.query;

            /* Verifica si la órden recibida tiene el topic de "merchant_order" */
            if (topic == "merchant_order") {
                /* Si el topic es correcto, busca la información de la órden en MercadoPago */
                const order = await getMerchantOrder(id);

                /* Verifica si la órden fue pagada o rechazada */
                if (order.order_status == "paid") {
                    /* Si se recibió el pago correctamente se obtiene el id de la órden */
                    const orderId = order.external_reference;

                    /* Crea una nueva instancia de order con el id recibido */
                    const myOrder = new Order(orderId);

                    /* Obtiene la data de la órden en la base de datos */
                    await myOrder.getData();

                    /* Modifica el estado de pago para cerrarlo en "paid" */
                    myOrder.data.status = "paid";

                    /* Envía los datos modificados de vuelta a la base de datos */
                    await myOrder.pushData();

                    /* Envía un email al usuario con la confirmación de su pago */
                    await sendPaymentValidationToUser(myOrder.data.userId, order.items[0].title, true);

                    /* Crea un nuevo record en Airtable para notificar la órden realizada por el usuario */
                    const airtableRes = await createOrderRecord(myOrder.data.userId, myOrder.data.productId);

                    res.status(201).json({ message: "Pago realizado correctamente." });
                } else if (order.status == "closed") {
                    /* Si no se recibió un pago correctamente obtiene el id de la órden */
                    const orderId = order.external_reference;

                    /* Crea una nueva instancia de order con el id recibido */
                    const myOrder = new Order(orderId);

                    /* Obtiene la data de la órden en la base de datos */
                    await myOrder.getData();

                    /* Modifica el estado de pago para cerrarlo en "cancelled" */
                    myOrder.data.status = "cancelled";

                    /* Envía los datos modificados de vuelta a la base de datos */
                    await myOrder.pushData();

                    /* Envía un email al usuario para informarle del rechazo de su pago */
                    await sendPaymentValidationToUser(myOrder.data.userId, order.items[0].title, false);

                    res.status(201).json({ message: "Pago rechazado." });
                };
            } else {
                res.status(200).json({ message: "No es una órden de compra" });
            };
        } catch {
            res.status(200).json({ message: "Ha ocurrido un problema al obtener la compra." });
        };
    }
}); 