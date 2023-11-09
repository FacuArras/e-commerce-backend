import { NextApiRequest, NextApiResponse } from "next";
import { Order } from "models/order";
import { getMerchantOrder } from "lib/mercadopago";
import { sendPaymentValidationToUser } from "lib/resend";
import * as methods from "micro-method-router";

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        try {
            const { id, topic } = req.query;

            if (topic == "merchant_order") {
                const order = await getMerchantOrder(id);

                if (order.order_status == "paid") {
                    const orderId = order.external_reference;
                    const myOrder = new Order(orderId);
                    await myOrder.getData();
                    myOrder.data.status = "paid";
                    await myOrder.pushData();

                    await sendPaymentValidationToUser(myOrder.id, order.items[0].title);

                    res.status(201).json({ message: "Pago realizado correctamente." });
                };
            } else {
                res.status(200).json({ message: "No es una órden de compra" });
            };
        } catch {
            res.status(200).json({ message: "Ha ocurrido un problema al obtener la compra." });
        };
    }
}); 