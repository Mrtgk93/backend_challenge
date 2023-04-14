const router = require("express").Router();
const userModel = require("./user-model");
const bcryptjs = require("bcryptjs");

const {
  userIdKontrol,
  userPayloadKontrol,
  passwordCheck,
  usernameCheck,
} = require("./user-middleware");
const { loginValidatePayload } = require("../auth/auth-middleware");

router.get("/", async (req, res, next) => {
  const allUsers = await userModel.getAll();
  res.json(allUsers);
});

router.put(
  "/:id",
  userIdKontrol,
  userPayloadKontrol,
  async (req, res, next) => {
    try {
      if (req.decodeToken.user_id == req.params.id) {
        let updatedUser = await userModel.updateUser(req.params.id, {
          username: req.body.username,
          email: req.body.email,
          password: bcryptjs.hashSync(req.body.password, 8),
          role_id: req.body.role_id,
        });
        res.json(updatedUser);
      } else {
        res.json({ message: "Bu yetkiye sahip değilsiniz" });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  userIdKontrol,
  loginValidatePayload,
  usernameCheck,
  passwordCheck,
  async (req, res, next) => {
    try {
      if (req.decodeToken.user_id == req.params.id) {
        await userModel.deleteUser(req.params.id);
        res.json({
          message: `${req.params.id} id'li kullanıcı başarılı birşekilde silindi`,
        });
      } else {
        res.json({ message: "bu yetkiye sahip değilsiniz" });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
