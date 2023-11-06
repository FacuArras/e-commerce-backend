import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { createPreference } from "lib/mercadopago";
import { Order } from "models/order";
import { getOneProduct } from "lib/algolia";
import * as methods from "micro-method-router";
import * as yup from "yup";


const handler = methods({
    async post(req: NextApiRequest, res: NextApiResponse, token) {
        try {
            /* Define un esquema de validación */
            const schema = yup.object({
                productId: yup.string().required(),
                q: yup.string().required()
            }).noUnknown();

            /* Valida los datos de entrada */
            schema.validateSync(req.query, { stripUnknown: false });

            /* Obtiene los valores de la query */
            const { productId, q } = req.query as any;

            /* Busca en Algolia el producto con el id determinado */
            const product = await getOneProduct(productId);

            /* Chequea si el producto existe en la base de datos */
            if (!product) {
                /* Si el producto no existe salta un error */
                res.status(404).json({ message: "El producto con el id " + productId + " no ha sido encontrado" })
            } else {
                /* Si el producto existe crea una nueva orden en Firebase con la información de la misma */
                const order = await Order.createNewOrder({
                    additionalInfo: req.body,
                    productId,
                    userId: token.userId,
                    status: "pending"
                });

                /* Crea una preferencia en MercadoPago con la información del producto */
                const preference = await createPreference({
                    items: [
                        {
                            id: productId,
                            title: product["Name"],
                            description: product["Description"],
                            picture_url: product["Images"].url,
                            quantity: parseInt(q),
                            currency_id: "ARS",
                            unit_price: product["Unit cost"]
                        }
                    ],
                    external_reference: order.id,
                    notification_url: "https://e-commerce-backend-mocha-gamma.vercel.app/api/ipn/mercadopago"
                });

                /* Responde con la URL de la preferencia creada */
                res.status(200).json({
                    url: preference.init_point
                });
            };
        } catch (error) {
            res.status(400).json({ error: error.message });
        };
    }
});

/* Aplica un middleware de autenticación para asegurarse de que solo 
     los usuarios autenticados puedan acceder a estas rutas */
export default authMiddleware(handler);