import jwt from 'jsonwebtoken';

// Middleware to verify the JWT token for protected routes
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(" ")[1];
        const isCustomAuth = token.length < 500; // true if it's our token, false if Google token
       
        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test'); // 'test' should be the same as when we created the token
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

export default auth;