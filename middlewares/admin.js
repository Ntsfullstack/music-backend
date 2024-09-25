const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) 
        return res
    .status(401)
    .send('Access denied. No token provided.');
    jwt.verify(token, process.env.JWTPRIVATEKEY, (error, decoded) => {
        if (error) 
            return res
        .status(400)
        .send('Invalid token.');
        if (!decoded.isAdmin) 
            return res
        .status(403)
        .send('Access denied. Admin only.');
        req.user = decoded;
        next();
    });
    
    
};