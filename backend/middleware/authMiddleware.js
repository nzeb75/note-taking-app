const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        const error = new Error('Access Denied: No token provided');
        error.statuscode = 401;
        return next(error);
    } 
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({message: 'Invalid Token'});
        return next(error);
    }
};

module.exports = auth;
