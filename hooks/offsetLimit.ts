import { NextApiRequest, NextApiResponse } from "next";

export default function getOffsetLimit(req: NextApiRequest, maxLimit = 40, maxOffset = 1000) {
    /* Obtiene el limit de la query y lo parsea par que sea un número, 
         si no recibe el limit de la query, setea la variable en 0 */
    const queryLimit = parseInt(req.query.limit as string || "0");

    /* Obtiene el offset de la query y lo parsea par que sea un número, 
         si no recibe el limit de la query, setea la variable en 0 */
    const queryOffset = parseInt(req.query.offset as string || "0");

    let limit = 10;

    /* Verifica que la variable "queryLimit" sea mayor a 0 y que sea menor a "maxLimit" */
    if (queryLimit > 0 && queryLimit < maxLimit) {
        /* Si cumple con los requisitos, modifica la variable limit con el valor de recibido en las querys */
        limit = queryLimit;
    } else if (queryLimit > maxLimit) {
        /* Si no cumple con los requisitos, modifica la variable limit con el valor de "maxLimit" */
        limit = maxLimit;
    };

    /* Verifica que la variable "queryOffset" sea menor a "maxOffset"
         Si cumple con los requisitos, devuelve el valor recibido en las querys
             Si no cumple con los requisitos, devuelve 0 */
    const offset = queryOffset < maxOffset ? queryOffset : 0;

    /* Retorna el valor de las variables "limit" y "offset" */
    return { limit, offset };
};