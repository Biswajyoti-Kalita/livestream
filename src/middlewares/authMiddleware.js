const jwt = require("jsonwebtoken");
const db = require("./../models");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log({token});
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //   const user = db.data.users.find((user) => user.id === decoded.id);
      //   if (!user) throw new Error("User not found");

      console.log({decoded});
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ status:"error", authError: true, message: "Unauthorized access" });
    }
  } else {
    res.status(401).json({ message: "Token not provided" });
  }
};

const sessionMiddileware = async (req, res, next) => {
  try {
    //   const user = db.data.users.find((user) => user.id === decoded.id);
    //   if (!user) throw new Error("User not found");
    console.log("session middleware ");
    console.log(req.session);
    if (true || req.session && req.session.user && req.session.user.id) {
      console.log("inside seessions");
      req.user = req.session.user;
      next();
    } else {
      return res.redirect("/admin/login?message=session+expired");
    }
  } catch (error) {
    return res.redirect("/admin/login?message=session+expired");
  }
};

module.exports = { protect, sessionMiddileware };
