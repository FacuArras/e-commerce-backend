import type { NextApiRequest, NextApiResponse } from "next";
import * as methods from "micro-method-router";
import { getOneProduct } from "lib/algolia";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        try {
            const { productId } = req.query;

            /* Realiza y obtiene la búsqueda de Algolia */
            const results = await getOneProduct(productId);

            /* Devuelve el producto encontrado */
            res.status(302).json({
                result: results,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al recuperar los datos' });
        };
    }
}); 
