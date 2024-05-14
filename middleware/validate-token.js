export function validateToken(req, res, next) {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.tokenData = decoded;
        next();
    });
}