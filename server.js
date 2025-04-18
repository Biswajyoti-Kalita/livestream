require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { server, app } = require("./src/services/websocketService");

const session = require("express-session");


require("./src/services/nsm");


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

//Express session
app.use(
  session({
    secret: process.env.SECRET, // Keep this secret!
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000 // 1 hour in milliseconds,
    }
  })
);

// Routes
const adminRoutes = require("./src/routes/adminRoutes");
const clientRoutes = require("./src/routes/clientRoutes");


app.use("/admin", adminRoutes);
app.use("/client", clientRoutes);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve HLS output (index.m3u8, .ts files)
app.use('/live', express.static(path.join(__dirname, 'media/live')));


// Set up ETA as the template engine
const viewsPath = path.join(__dirname, "src", "views");

app.set("views", viewsPath);
app.set("view cache", false);
app.set("view engine", "eta");

app.get("/", (req,res) => {
  res.redirect("/client/meeting");
})

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
