const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const restrict = require("./middleware/restricted");
const authRouter = require("./auth/auth-router");
const userRouter = require("./user/user-router");
const dwitRouter = require("./dwit/dwit-router");

const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use("/api/auth", authRouter);
server.use("/api/user", restrict, userRouter);
server.use("/api/dwitler", restrict, dwitRouter);

/* server.use("/", async (req, res, next) => {
  res.status(200).json({ message: "Server is working" });
});
server.use((err, req, res) => {
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: "Bu hata Server.js tarafından handle edildi",
  });
}); */

module.exports = server;
