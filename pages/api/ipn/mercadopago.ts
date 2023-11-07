import { NextApiRequest, NextApiResponse } from "next";
import { Order } from "models/order";
import { getMerchantOrder } from "lib/mercadopago";
import * as methods from "micro-method-router";

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        const { id, topic } = req.query;

        const order = await getMerchantOrder(id);

        if (topic === "merchant_order") {
            if (order.order_status === "paid") {
                const orderId = order.external_reference;
                const myOrder = new Order(orderId);
                await myOrder.getData();
                myOrder.data.status = "paid";
                await myOrder.pushData();
            };
        } else {
            res.send("ok");
        };
    }
}); 