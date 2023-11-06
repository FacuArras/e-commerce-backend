import jwt from "jsonwebtoken";

export function generateToken(obj) {
    const token = jwt.sign(obj, process.env.JWT_SECRET);
    return token;
};

export function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error("Token incorrecto.");
        return null;
    };
};