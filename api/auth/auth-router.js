const router = require("express").Router();
const userModel = require("../user/user-model");
const bcryptjs = require("bcryptjs");
const utils = require("../../secrets/utils");

const {
  registerValidatePayload,
  loginValidatePayload,
  usernameCheck,
  passwordCheck,
} = require("./auth-middleware");

router.post("/register", registerValidatePayload, async (req, res, next) => {
  try {
    let inserted = await userModel.create({
      username: req.body.username,
      password: bcryptjs.hashSync(req.body.password, 8),
      email: req.body.email,
      rolename: req.body.rolename,
    });
    res.status(201).json(inserted);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/login",
  loginValidatePayload,
  usernameCheck,
  passwordCheck,
  async (req, res, next) => {
    try {
      const payload = {
        username: req.body.username,
        rolename: req.user.rolename,
        user_id: req.user.user_id,
      };
      const token = utils.createUserToken(payload, "1d");
      res.json({ message: `welcome ${payload.username}`, token: token });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/");

module.exports = router;
