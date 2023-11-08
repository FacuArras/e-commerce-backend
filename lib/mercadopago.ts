import { MercadoPagoConfig, MerchantOrder } from "mercadopago";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_TOKEN, options: { timeout: 5000 } });

export async function getMerchantOrder(id) {
    /* const merchantOrder = new MerchantOrder(client);
    const response = await merchantOrder.get(id);
    return response; */
    const preference = await fetch('https://api.mercadopago.com/merchant_orders/' + id, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + process.env.MP_TOKEN
        }
    });

    const dataRes = await preference.json();

    return dataRes;
};

export async function createPreference(data) {
    try {
        const preference = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + process.env.MP_TOKEN
            },
            body: JSON.stringify(data)
        });

        const dataRes = await preference.json();

        return dataRes;
    } catch (error) {
        throw ('Error al crear la preferencia en MercadoPago: ' + error.message);
    };
};