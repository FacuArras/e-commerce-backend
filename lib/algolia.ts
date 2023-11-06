import algoliasearch from "algoliasearch";

const client = algoliasearch('EUFTR0NBPG', process.env.ALGOLIA_KEY);

export const productsIndex = client.initIndex('products');

/* Realiza y retorna los resultados de la búsqueda de Algolia */
export async function getProducts(q: string, limit, offset) {
    const results = await productsIndex.search(q as string, {
        hitsPerPage: limit,
        page: offset > 1 ? Math.floor(offset / limit) : 0
    });

    return results;
};

/* Obtiene un solo producto por el id */
export async function getOneProduct(id) {
    try {
        const result = await productsIndex.getObject(id);

        return result;
    } catch {
        return null
    };
};
