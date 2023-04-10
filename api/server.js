const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const server = express();

const authRouter = require("./auth/auth-router");
const userRouter = require("./user/user-router");
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use("/api/auth", authRouter);
server.use("/api/user", userRouter);

module.exports = server;
