const userModel = require("./user-model");
const bcryptjs = require("bcryptjs");

async function userIdKontrol(req, res, next) {
  try {
    const existUser = await userModel.getByFilter({ user_id: req.params.id });
    if (!existUser) {
      res.status(404).json({ message: "User bulunamadı" });
    } else {
      req.user = existUser;
      next();
    }
  } catch (error) {
    next(error);
  }
}
async function userPayloadKontrol(req, res, next) {
  try {
    let { username, email, password, role_id } = req.body;
    if (!username || !password || !email || !role_id) {
      res.status(400).json({ message: "eksik alanları kontrol ediniz!.." });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}
const passwordCheck = async (req, res, next) => {
  try {
    const { password } = req.body;
    let validPassword = bcryptjs.compareSync(password, req.user.password);
    if (!validPassword) {
      res
        .status(401)
        .json({ message: "lütfen şifrenizi doğru girdiğinizden emin olunuz" });
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
    if (username == req.user.username) {
      const existUser = await userModel.getByFilter({ username: username });
      if (!existUser) {
        res
          .status(404)
          .json({ message: "Sileceğiniz username'i doğru giriniz" });
      } else {
        req.user = existUser;
        next();
      }
    } else {
      res.status(400).json({ message: "yanlış username girdiniz" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userIdKontrol,
  userPayloadKontrol,
  passwordCheck,
  usernameCheck,
};
