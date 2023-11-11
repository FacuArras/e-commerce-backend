import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "models/order";
import { sendPaymentValidationToUser } from "lib/resend";
import { createOrderRecord } from "lib/airtable";

export async function receiveOrder(id) {
    /* Busca la información de la órden en MercadoPago */
    const order = await getMerchantOrder(id);

    /* Verifica si la órden fue pagada o rechazada */
    if (order.order_status == "paid") {
        /* Si se recibió el pago correctamente se obtiene el id de la órden */
        const orderId = order.external_reference;

        /* Crea una nueva instancia de order con el id recibido */
        const myOrder = new Order(orderId);

        /* Obtiene la data de la órden en la base de datos */
        await myOrder.getData();

        if (myOrder.data.status !== "paid") {
            /* Modifica el estado de pago para cerrarlo en "paid" */
            myOrder.data.status = "paid";

            /* Envía los datos modificados de vuelta a la base de datos */
            await myOrder.pushData();

            /* Envía un email al usuario con la confirmación de su pago */
            await sendPaymentValidationToUser(myOrder.data.userId, order.items[0].title, true);

            /* Crea un nuevo record en Airtable para notificar la órden realizada por el usuario */
            const airtableRes = await createOrderRecord(myOrder.data.userId, myOrder.data.productId);
        }

    } else {
        /* Si no se recibió un pago correctamente obtiene el id de la órden */
        const orderId = order.external_reference;

        /* Crea una nueva instancia de order con el id recibido */
        const myOrder = new Order(orderId);

        /* Obtiene la data de la órden en la base de datos */
        await myOrder.getData();

        if (myOrder.data.status !== "cancelled") {
            /* Modifica el estado de pago para cerrarlo en "cancelled" */
            myOrder.data.status = "cancelled";

            /* Envía los datos modificados de vuelta a la base de datos */
            await myOrder.pushData();

            /* Envía un email al usuario para informarle del rechazo de su pago */
            await sendPaymentValidationToUser(myOrder.data.userId, order.items[0].title, false);
        }
    };
}