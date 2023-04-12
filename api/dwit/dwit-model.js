const db = require("../../data/db-config");

async function getAllDwits() {
  return await db("dwitler as d")
    .leftJoin("users as u", "u.user_id", "d.user_id")
    .select("d.*", "u.username")
    .orderBy("d.dwit_id", "DESC");
}

async function getDwitComments(dwit_id) {
  let comments = await db("dwit_comments as dc")
    .leftJoin("users as u", "u.user_id", "dc.user_id")
    .leftJoin("dwitler as d", "d.dwit_id", "dc.dwit_id")
    .select("u.username", "dc.dwit_comment", "dc.comment_date")
    .where("dc.dwit_id", dwit_id);
  return comments;
}

async function getDwitId(dwit_id) {
  return await db("dwitler as d")
    .leftJoin("users as u", "d.user_id", "u.user_id")
    .select("u.username", "d.dwit", "d.dwit_date")
    .where("dwit_id", dwit_id)
    .first();
}
async function getCommentId(comment_id) {
  return await db("dwit_comments as dc")
    .leftJoin("users as u", "u.user_id", "dc.user_id")
    .select("u.username", "dc.dwit_comment", "dc.comment_date")
    .where("comment_id", comment_id)
    .first();
}

async function createDwit(dwit) {
  let dwit_id = await db("dwitler").insert(dwit);
  return getDwitId(dwit_id[0]);
}

async function createComent(comment) {
  let coment = await db("dwit_comments").insert(comment);
  return getCommentId(coment[0]);
}

async function deleteDwit(dwit_id) {
  return await db("dwitler").where("dwit_id", dwit_id).del();
}

async function deleteComment(comment_id) {
  return await db("dwit_comments").where("comment_id", comment_id).del();
}

async function commentUserCheck(comment_id) {
  return await db("dwit_comments")
    .select("user_id")
    .where("comment_id", comment_id)
    .first();
}
async function dwitUserCheck(dwit_id) {
  return await db("dwitler ")
    .select("user_id")
    .where("dwit_id", dwit_id)
    .first();
}

module.exports = {
  getAllDwits,
  getDwitComments,
  getDwitId,
  createDwit,
  createComent,
  getCommentId,
  deleteDwit,
  deleteComment,
  dwitUserCheck,
  commentUserCheck,
};
