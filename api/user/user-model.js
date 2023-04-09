const db = require("../../data/db-config");

async function getAll() {
  return await db("users").select("user_id", "username");
}
async function getById(user_id) {
  return await db("users").where("user_id", user_id).first();
}

async function getByFilter(filter) {
  return await db("users as u")
    .leftJoin("roles as r", "r.role_id", "u.role_id")
    .select("u.user_id", "u.username", "r.rolename")
    .where(filter)
    .first();
}
async function create(user) {
  const { role_id } = await db("roles")
    .where("rolename", user.rolename)
    .first();
  const newUser = {
    username: user.username,
    email: user.email,
    password: user.password,
    role_id: role_id,
  };
  const insertedId = await db("users").insert(newUser);
  return getByFilter({ "u.user_id": insertedId[0] });
}

async function updateUser(user_id, user) {
  await db("users").where("user_id", user_id).update(user);
  return getById(user_id);
}

async function deleteUser(user_id) {
  await db("users").where("user_id", user_id).del();
}

module.exports = {
  getAll,
  getByFilter,
  create,
  updateUser,
  deleteUser,
};
