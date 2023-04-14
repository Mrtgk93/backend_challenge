const dwitModel = require("./dwit-model");
const db = require("../../data/db-config");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});

describe("[UNIT TEST AUTH]", () => {
  test("[1] getAlldwits çalışıyor mu ? /", async () => {
    const dwits = await dwitModel.getAllDwits();
    expect(dwits).toHaveLength(4);
  }, 1000);
  test("[2] getDwitsComments çalışıyor mu ? /", async () => {
    const dwitComments = await dwitModel.getDwitComments(1);
    expect(dwitComments).toHaveLength(1);
  }, 1000);
  test("[3] getDwitId çalışıyor mu ? /", async () => {
    const dwitComments = await dwitModel.getDwitId(2);
    expect(dwitComments).toMatchObject({
      dwit: "twitter'ı aldım, tesla desen zaten benim, uzaydan millete internette satıyorum şimdi ne yapsam acaba ??",
      username: "Elon Musk",
    });
  }, 1000);
  test("[4] getCommentId çalışıyor mu ? /", async () => {
    const dwitComments = await dwitModel.getCommentId(1);
    expect(dwitComments).toMatchObject({
      username: "Lionel Messi",
      dwit_comment:
        "aynen bro sensin, sen önce git dünya kupasını kaldır sonra beni çalımlarsın 😎",
    });
  }, 1000);
  test("[5] createDwit çalışıyor mu ? /", async () => {
    let dwit = await dwitModel.createDwit({ user_id: 2, dwit: "merhabaaaaa" });
    expect(dwit).toMatchObject({ dwit: "merhabaaaaa" });
  }, 1000);
  test("[6] createComment çalışıyor mu ? /", async () => {
    let comment = await dwitModel.createComent({
      user_id: 2,
      dwit_id: 1,
      dwit_comment: "hello",
    });
    expect(comment).toMatchObject({ dwit_comment: "hello" });
  }, 1000);
});
