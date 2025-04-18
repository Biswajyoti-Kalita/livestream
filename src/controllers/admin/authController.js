const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../models");

// Generate JWT
// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user.id, name: user.name, email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//   );
// };

// Register User
const role = 0;
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  return res.status(400).json({ message: "Feature unavailable" });

  try {
    const existingUser = await db.user.findOne({
      where: {
        email,
        role
      }
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword
    };

    const user = await db.user.create(newUser);
    // const token = generateToken({
    //   ...newUser,
    //   id: user.id
    // });
    res.status(201).json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login View
exports.loginView = async (req, res) => {
  const { message = "" } = req.query;
  console.log({ message });
  if (req.session && req.session.user && req.session.user.id)
    return res.redirect("/admin/dashboard");

  return res.render("admin/index", { message });
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });

  try {
    const user = await db.user.findOne({
      where: {
        email,
        role
      }
    });

    console.log(user);

    if (!user)
      return res.render("admin/index", { message: "Invalid credentials" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.render("admin/index", { message: "Invalid credentials" });

    // const token = generateToken(user);
    req.session.user = {
      id: user.id,
      email: user.email,
      role
    };
    return res.redirect("/admin/dashboard");
  } catch (error) {
    // res.status(500).json({ message: "Server error", error: error.message });
    return res.render("admin/index", { error: error.message });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = db.user.findOne({
      where: {
        id: req.user.id,
        role
      }
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logout = async (req, res) => {
  req.session.user = null;
  return res.redirect("/admin/login");
};