import { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";
import { decodeToken } from "lib/jwt";

export function authMiddleware(callback) {
    return function (req: NextApiRequest, res: NextApiResponse) {
        const token = parseBearerToken(req);

        if (!token) {
            res.status(401).json({ message: "No se recibió ningún token." });
        };

        const decodedToken = decodeToken(token);

        if (decodedToken) {
            callback(req, res, decodedToken);
        } else {
            res.status(401).json({ message: "Token de acceso inválido." });
        };
    };
};