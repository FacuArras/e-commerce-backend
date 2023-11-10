import { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";
import { decodeToken } from "lib/jwt";

export function authMiddleware(callback) {
    return function (req: NextApiRequest, res: NextApiResponse) {
        /* Recibe el token del usuario */
        const token = parseBearerToken(req);

        /* Verifica que se haya recibido un token */
        if (!token) {
            /* Si no se recibió ningún token, responde con el error correspondiente */
            res.status(401).json({ message: "No se recibió ningún token." });
        };

        /* Si recibió el token lo decodea */
        const decodedToken = decodeToken(token);

        /* Verifica si el decodeo fue existoso */
        if (decodedToken) {
            /* Si fue exisotso, llama al callback para que se ejecute */
            callback(req, res, decodedToken);
        } else {
            /* Si no fue exitoso responde con el error correspondiente */
            res.status(401).json({ message: "Token de acceso inválido." });
        };
    };
};