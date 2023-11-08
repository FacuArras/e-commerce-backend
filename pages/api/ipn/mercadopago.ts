import { NextApiRequest, NextApiResponse } from "next";
import { Order } from "models/order";
import { getMerchantOrder } from "lib/mercadopago";
import * as methods from "micro-method-router";

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        try {
            const { id, topic } = req.query;

            if (topic == "merchant_order") {
                const order = await getMerchantOrder(id);

                if (order.order_status == "paid") {
                    await Order.createNewOrder({
                        orderId: order.external_reference,
                        status: "paid",
                        info: order
                    });

                    /* const orderId = order.external_reference;
                    const myOrder = new Order(orderId);
                    await myOrder.getData();
                    myOrder.data.status = "paid";
                    await myOrder.pushData(); */
                };
            } else {
                res.send("ok");
            };
        } catch {
            res.status(200).send("not ok");
        };
    }
}); 