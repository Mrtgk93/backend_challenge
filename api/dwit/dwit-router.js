const router = require("express").Router();
const dwitModel = require("./dwit-model");
const {
  dwitIdKontrol,
  dwitPayloadKontrol,
  commentIdKontrol,
  commentPayloadKontrol,
} = require("./dwit-middleware");

router.get("/", async (req, res, next) => {
  const allDwit = await dwitModel.getAllDwits();
  res.json(allDwit);
});

router.get("/:id/comments", dwitIdKontrol, async (req, res, next) => {
  try {
    const dwit = await dwitModel.getDwitId(req.params.id);
    const comment = await dwitModel.getDwitComments(req.params.id);
    res.json({ dwit, comment });
  } catch (error) {
    next(error);
  }
});

router.post("/", dwitPayloadKontrol, async (req, res, next) => {
  try {
    const inserted = await dwitModel.createDwit({
      dwit: req.body.dwit,
      user_id: req.decodeToken.user_id,
    });
    res.status(201).json(inserted);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id",
  dwitIdKontrol,
  commentPayloadKontrol,
  async (req, res, next) => {
    try {
      const inserted = await dwitModel.createComent({
        dwit_comment: req.body.dwit_comment,
        user_id: req.decodeToken.user_id,
        dwit_id: req.body.dwit_id,
      });
      res.status(201).json(inserted);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", dwitIdKontrol, async (req, res, next) => {
  try {
    let dwitIdCheck = await dwitModel.dwitUserCheck(req.params.id);
    if (dwitIdCheck.user_id == req.decodeToken.user_id) {
      await dwitModel.deleteDwit(req.params.id);
      res.json({ message: `${req.params.id} id'li dwit silindi` });
    } else {
      res.json({ message: "bu twiti silmeye yetkiniz yok" });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/comments/:id", commentIdKontrol, async (req, res, next) => {
  try {
    let commentIdCheck = await dwitModel.commentUserCheck(req.params.id);
    if (commentIdCheck.user_id == req.decodeToken.user_id) {
      await dwitModel.deleteComment(req.params.id);
      res.json({ message: `${req.params.id} id'li comment silindi` });
    } else {
      res.json({
        message: ` bu commenti silmeye yetkiniz yok`,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
