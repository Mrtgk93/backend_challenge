const bcryptjs = require("bcryptjs");
const userModel = require("../user/user-model");

const registerValidatePayload = (req, res, next) => {
  try {
    const { username, password, email, rolename } = req.body;
    if (!username || !password || !email || !rolename) {
      res
        .status(400)
        .json({ message: "username,password,email veya rolename alanı eksik" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const loginValidatePayload = (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "username veya password alanı eksik" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const usernameCheck = async (req, res, next) => {
  try {
    let { username } = req.body;
    const existUser = await userModel.getByFilter({ username: username });
    if (!existUser) {
      res.status(404).json({ message: "Böyle bir user yok" });
    } else {
      req.user = existUser;
      next();
    }
  } catch (error) {
    next();
  }
};

const passwordCheck = async (req, res, next) => {
  try {
    const { password } = req.body;
    let validPassword = bcryptjs.compareSync(password, req.user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Geçersiz kriter" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerValidatePayload,
  loginValidatePayload,
  usernameCheck,
  passwordCheck,
};
