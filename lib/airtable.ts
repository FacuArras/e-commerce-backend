import Airtable from 'airtable';
import { nextMonday } from 'date-fns'

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

export async function createOrderRecord(userId, orderNumber, productId) {
    try {
        /* Crea un nuevo record en "Client Orders" con la data pasada */
        await base('Client orders').create([
            {
                "fields": {
                    "Client": [
                        "recdoYfqwDbSVZnuu"
                    ],
                    "Order no.": orderNumber,
                    "Fulfill by": nextMonday(new Date()).toDateString(),
                    "Status": "Invoiced",
                    "Order line items": [
                        "rec9kT9pzwh3ZUrlu",
                        "rec3bYcwuo6V2YxtD"
                    ],
                    "Client id": userId
                }
            }
        ]);
    } catch (error) {
        throw (error);
    };
};