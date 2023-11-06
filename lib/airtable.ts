import Airtable from 'airtable';

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_KEY
});

export const base = Airtable.base('appfzRM0wJveCrdBS');

export async function getAllProducts() {
    try {
        let products = [];

        /* Obtiene todos los productos de "Furniture" de Airtable */
        const productsBase = await base('Furniture').select({
            view: "All furniture"
        }).all();

        /* Los guarda en "products" con un id */
        productsBase.forEach(product => {
            products.push({ objectID: product.id, ...product.fields });
        });

        return products;
    } catch (error) {
        throw ({ message: "Error al obtener los productos de Airtable.", error });
    };
};