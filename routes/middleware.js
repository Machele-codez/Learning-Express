const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");
const { getAuthToken } = require("../utils"); 

async function requireAuth (req, res, next) {
    token = getAuthToken(req);

    // validate token
    if (token == null) 
        return res.status(401).json({
            data: null,
            message: "No token provided",
            success: false
        });
    
    // check if token is in blacklist
    try {
        const blacklistedToken = await BlacklistedToken.findOne({
            token
        });

        if (blacklistedToken) {
            return res.status(401).json({
                data: null,
                message: "Invalid Token",
                success: false
            });
        }
        
    } catch (error) {
        return res.status(401).json({
            data: null,
            message: error,
            success: false
        })
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        console.log(err);

        if (err) return res.status(403).json({
            data: null,
            message: err,
            success: false
        });;

        req.user = user;

        next();
    });
}

module.exports = requireAuth;
