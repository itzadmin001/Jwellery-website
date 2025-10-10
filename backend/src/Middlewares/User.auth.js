const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../Models/User.model");

const userAuth = async (req, res, next) => {
    try {
        let token = null;
        // Try to get token from cookie
        if (req.headers.cookie) {
            const parsedCookie = cookie.parse(req.headers.cookie);
            token = parsedCookie.token;
        }

        // If no token from cookie, try Authorization header
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}


const adminAuth = async (req, res, next) => {
    try {
        let token = null;
        // Try to get token from cookie
        if (req.headers.cookie) {
            const parsedCookie = cookie.parse(req.headers.cookie);
            token = parsedCookie.token;
        }

        // If no token from cookie, try Authorization header
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if user is admin
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin role required." });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = { userAuth, adminAuth };
