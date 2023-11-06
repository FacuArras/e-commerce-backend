import { NextApiRequest, NextApiResponse } from "next";

export default function getOffsetLimit(req: NextApiRequest, maxLimit = 40, maxOffset = 1000) {
    const queryLimit = parseInt(req.query.limit as string || "0");
    const queryOffset = parseInt(req.query.offset as string || "0");

    let limit = 10;

    if (queryLimit > 0 && queryLimit < maxLimit) {
        limit = queryLimit;
    } else if (queryLimit > maxLimit) {
        limit = maxLimit;
    };

    const offset = queryOffset < maxOffset ? queryOffset : 0;

    return { limit, offset };
};