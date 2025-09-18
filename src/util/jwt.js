require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require("../util/logger");

const secretKey = process.env.SECRET_KEY;

const generateToken = (payload) => {
    return jwt.sign(
            payload,
            secretKey,
            { expiresIn: "1h" }
        );
}

const authenticateToken = (req, res, next) => {
    // Authorization: "Bearer tokenstring"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        logger.warn({message: 'Missing Token: forbidden access', user: req.user});         
        return res.status(403).json({message: "forbidden access"});
    } else {
        const user = decodeJWT(token);
        if (user) {
            req.user = user; // payload stored in request object
            logger.info({messaeg: 'From authenticateToken in jwt file', user: req.user});  
            next();
        } else {
            logger.warn({message: 'Invalid JWT: forbidden access', user: req.user}); 
            return res.status(400).json({message: "Invalid JWT"});
        }
    }
}

const decodeJWT = (token) => {
    try {
        const user = jwt.verify(token, secretKey);
        logger.info({message: 'Returned data from decodeJWT', user: user});  
        return user;
    } catch (err) {
        logger.error(`Error in decodeJWT auxiliary function in utils: ${err}`);
    }
    return null;
} 

module.exports = {
    authenticateToken,
    generateToken
}