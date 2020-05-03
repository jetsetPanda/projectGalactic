const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.withAuth = false;
        return next(); //leave func to continue req w metadata
    }

    const token = authHeader.split(' ')[1]; // Authorization: BearerTokenVal // usually on public apis
    if(!token || token === '') {
        req.withAuth = false;
        return next();
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secrethashprivatekeyalsoreplaceinserver'); //to be decoded token
    } catch (err) {
        req.withAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.withAuth = false;
        return next();
    }

    req.withAuth = true;
    req.userId = decodedToken.userId;
    // req.email = decodedToken.email;
    next();
};