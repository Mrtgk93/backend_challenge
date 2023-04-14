/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const defRoles = [{ rolename: "admin" }, { rolename: "user" }];
const defUsers = [
  {
    username: "Elon Musk",
    email: "elon@twitter.com",
    password: "$2a$08$g2w139CcnT46xKKzNiAu2.Atep8AcgsHGDxfNoG2ClfeaBDIPh9em", //1234
    role_id: 1,
  },
  {
    username: "Cristiano Ronaldo",
    email: "cr7@ronaldo.com",
    password: "$2a$08$g2w139CcnT46xKKzNiAu2.Atep8AcgsHGDxfNoG2ClfeaBDIPh9em", //1234
    role_id: 1,
  },
  {
    username: "Lionel Messi",
    email: "messi@lionel.com",
    password: "$2a$08$g2w139CcnT46xKKzNiAu2.Atep8AcgsHGDxfNoG2ClfeaBDIPh9em", //1234
    role_id: 1,
  },
  {
    username: "nusr_et",
    email: "etci@nusret.com",
    password: "$2a$08$g2w139CcnT46xKKzNiAu2.Atep8AcgsHGDxfNoG2ClfeaBDIPh9em", //1234
    role_id: 1,
  },
];
defDwitler = [
  {
    dwit: "messi gelde seni bi çalımlayayım bro",
    user_id: 2,
  },
  {
    dwit: "twitter'ı aldım, tesla desen zaten benim, uzaydan millete internette satıyorum şimdi ne yapsam acaba ??",
    user_id: 1,
  },
  {
    dwit: "Dünya kupasınıda kaldırdım tek rakibim THY ",
    user_id: 3,
  },
  {
    dwit: "Cappucinooooooooo",
    user_id: 4,
  },
];
const defDwitComments = [
  {
    dwit_comment:
      "aynen bro sensin, sen önce git dünya kupasını kaldır sonra beni çalımlarsın 😎",
    dwit_id: 1,
    user_id: 3,
  },
  {
    dwit_comment:
      "Saltbae sende bi sal be kardeşim kupa kaldırıcaz kolumuzdan tutup çekiştiriyosun",
    dwit_id: 4,
    user_id: 3,
  },
];
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("dwit_comments").truncate();
  await knex("dwitler").truncate();
  await knex("users").truncate();
  await knex("roles").truncate();

  await knex("roles").insert(defRoles);
  await knex("users").insert(defUsers);
  await knex("dwitler").insert(defDwitler);
  await knex("dwit_comments").insert(defDwitComments);
};
