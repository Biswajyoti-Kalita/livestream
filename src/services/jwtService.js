const jwt = require("jsonwebtoken");

module.exports = {    
    // Generate JWT
    generateToken: (obj , expiresIn = "7d") => {
        return jwt.sign(obj, process.env.JWT_SECRET, { expiresIn });
    }
}