import type { NextApiRequest, NextApiResponse } from "next";
import * as methods from "micro-method-router";
import { getAllProducts } from "lib/airtable";
import { productsIndex } from "lib/algolia";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        try {
            /* Recibe los productos formateados de Airtable */
            const products = await getAllProducts();

            /* Los guarda en Algolia */
            await productsIndex.saveObjects(products);

            res.status(200).json({ message: "Productos sincronizados correctamente." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al recuperar los datos.' });
        };
    }
});
