const dwitModel = require("./dwit-model");

async function dwitIdKontrol(req, res, next) {
  try {
    const existDwit = await dwitModel.getDwitId(req.params.id);
    if (!existDwit) {
      res.status(404).json({ message: "Dwit bulunamadı" });
    } else {
      req.dwit = existDwit;
      next();
    }
  } catch (error) {
    next(error);
  }
}

async function dwitPayloadKontrol(req, res, next) {
  try {
    let { dwit } = req.body;
    if (!dwit) {
      res.status(400).json({ message: "dwit eksik" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

async function commentIdKontrol(req, res, next) {
  try {
    const existComment = await dwitModel.getCommentId(req.params.id);
    if (!existComment) {
      res.status(404).json({ message: "comment bulunamadı" });
    } else {
      req.comment = existComment;
      next();
    }
  } catch (error) {
    next(error);
  }
}

async function commentPayloadKontrol(req, res, next) {
  try {
    let { dwit_comment, dwit_id } = req.body;
    if (!dwit_comment || !dwit_id) {
      res.status(400).json({ message: "eksik alanları kontrol ediniz" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}
module.exports = {
  dwitIdKontrol,
  dwitPayloadKontrol,
  commentIdKontrol,
  commentPayloadKontrol,
};
