import type { NextApiRequest, NextApiResponse } from "next";
import * as methods from "micro-method-router";
import { getProducts } from "lib/algolia";
import getOffsetLimit from "hooks/offsetLimit";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        try {
            /* Obtiene y hace los cálculos necesarios para el offset y el limit */
            const { offset, limit } = getOffsetLimit(req);
            const { q } = req.query;

            /* Realiza y obtiene la búsqueda de Algolia */
            const results = await getProducts(q as string, limit, offset);

            /* Devuelve los productos encontrados junto a la información del poginado */
            res.status(302).json({
                results: results.hits,
                pagination: { offset, limit, total: results.nbHits }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al recuperar los datos' });
        };
    }
}); 
