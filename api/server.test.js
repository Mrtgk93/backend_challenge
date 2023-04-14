const supertest = require("supertest");
const db = require("../data/db-config");
const server = require("./server");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

test("[0] testler çalışır durumda", () => {
  expect(true).toBe(true);
});

describe("API END POINT TEST", () => {
  it("[1] Register Payload dolu olduğunda işlem gerçekleşiyor mu ? /", async () => {
    let user = {
      username: "Mert1234",
      password: "12345",
      email: "mrt@gk.com",
      rolename: "user",
    };
    const res = await supertest(server).post("/api/auth/register").send(user);
    expect(res.status).toBe(201);
    expect(res.body.user_id).toBeGreaterThan(4);
  }, 1000);
  it("[2] Register Payload eksik gönderilince doğru hata kodu ve mesajı ? /", async () => {
    let user = {
      username: "Mert123",
      password: "12345",
      email: "mrt@gkk.com",
    };
    const res = await supertest(server).post("/api/auth/register").send(user);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "username,password,email veya rolename alanı eksik"
    );
  }, 1000);
  it("[3] Register doğru bilgiler girildikten sonra user_id username email ve rolename gözüküyor mu ? /", async () => {
    let user = {
      username: "Mert123",
      password: "12345",
      email: "mrt@gkk.com",
      rolename: "user",
    };
    const res = await supertest(server).post("/api/auth/register").send(user);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      user_id: 5,
      username: "Mert123",
      email: "mrt@gkk.com",
      rolename: "user",
    });
  }, 1000);
  it("[4] Login için yanlış şifre girilince doğru hata kodu ve mesajı dönüyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "123" };
    const res = await supertest(server).post("/api/auth/login").send(user);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Geçersiz kriter");
  }, 1000);
  it("[5] Login için farklı username girilince doğru hata kodu ve mesajı dönüyor mu ? /", async () => {
    let user = { username: "mahmut", password: "123" };
    const res = await supertest(server).post("/api/auth/login").send(user);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Böyle bir user yok");
  }, 1000);

  it("[6] Login için  username ve şifre doğru girilince message gözüküyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "1234" };
    const res = await supertest(server).post("/api/auth/login").send(user);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      message: "welcome nusr_et",
    });
  }, 1000);
  it("[7] Usera token yokken get isteği atılınca doğru hata kodu ve message gözüküyor mu ? /", async () => {
    const res = await supertest(server).get("/api/user");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("token gereklidir");
  }, 1000);
  it("[8] Usera token yüklenip get isteği atılınca userlar gözüküyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "1234" };
    const login = await supertest(server).post("/api/auth/login").send(user);
    const res = await supertest(server)
      .get("/api/user")
      .set("authorization", login.body.token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  }, 1000);
  it("[9] Usera payload eklemeden Put isteği atınca doğru hata mesajı ve kodu gözüküyor mu ? /", async () => {
    const res = await supertest(server).put("/api/user");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("token gereklidir");
  }, 1000);
  it("[10] Usera token ekleyip payload girip Put isteği atınca user_id ,username,email,role_id gözüküyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "1234" };
    const login = await supertest(server).post("/api/auth/login").send(user);
    let userPayload = {
      username: "nusret",
      password: "12345",
      email: "nusret@gokce.com",
      role_id: "2",
    };
    const res = await supertest(server)
      .put("/api/user/4")
      .set("authorization", login.body.token)
      .send(userPayload);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      user_id: 4,
      username: "nusret",
      email: "nusret@gokce.com",
      role_id: 2,
    });
  }, 1000);
  it("[11] Usera token ekleyip eksik payload girip Put isteği atınca doğru hata kodu ve mesaj gözüküyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "1234" };
    const login = await supertest(server).post("/api/auth/login").send(user);
    let userPayload = {
      username: "nusret",
      password: "12345",
      email: "nusret@gokce.com",
    };
    const res = await supertest(server)
      .put("/api/user/4")
      .set("authorization", login.body.token)
      .send(userPayload);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("eksik alanları kontrol ediniz!..");
  }, 1000);
  it("[12] user'da token yokken delete isteği yapınca doğru hata kodu ve message geliyor mu ? /", async () => {
    let res = await supertest(server).delete("/api/user/4");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("token gereklidir");
  }, 1000);
  it("[13] user'da token varken yalnızca id'ile delete isteği yapınca doğru hata kodu ve message geliyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "1234" };
    const login = await supertest(server).post("/api/auth/login").send(user);
    let res = await supertest(server)
      .delete("/api/user/4")
      .set("authorization", login.body.token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username veya password alanı eksik");
  }, 1000);
  it("[14] user'da token varken yalnızca id'ile delete isteği yapınca doğru hata kodu ve message geliyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "1234" };
    const login = await supertest(server).post("/api/auth/login").send(user);
    let res = await supertest(server)
      .delete("/api/user/4")
      .set("authorization", login.body.token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username veya password alanı eksik");
  }, 1000);
  it("[15] user'da token varken id ve başka bir userın payload bilgilerini girip delete isteği yapınca doğru hata kodu ve message geliyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "1234" };
    let user2 = { username: "Elon Musk", password: "1234" };
    const login = await supertest(server).post("/api/auth/login").send(user);
    let res = await supertest(server)
      .delete("/api/user/4")
      .set("authorization", login.body.token)
      .send(user2);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("yanlış username girdiniz");
  }, 1000);
  it("[16] user'da token varken doğru payloadı girince  geliyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "1234" };
    let user2 = { username: "nusr_et", password: "1234" };
    const login = await supertest(server).post("/api/auth/login").send(user);
    let res = await supertest(server)
      .delete("/api/user/4")
      .set("authorization", login.body.token)
      .send(user2);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(
      "4 id'li kullanıcı başarılı birşekilde silindi"
    );
  }, 1000);
  it("[17] dwitler'de token yokken get isteği yapılınca doğru hata kodu ve mesaj geliyor mu ? /", async () => {
    let res = await supertest(server).get("/api/dwitler");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("token gereklidir");
  }, 1000);
  it("[18] dwitler'de token varken get isteği yapılınca doğru hata kodu ve mesaj geliyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "1234" };
    const login = await supertest(server).post("/api/auth/login").send(user);
    let res = await supertest(server)
      .get("/api/dwitler")
      .set("authorization", login.body.token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  }, 1000);
  it("[19] dwitler'de token varken get isteği yapılınca doğru hata kodu ve mesaj geliyor mu ? /", async () => {
    let user = { username: "nusr_et", password: "1234" };
    const login = await supertest(server).post("/api/auth/login").send(user);
    let res = await supertest(server)
      .get("/api/dwitler")
      .set("authorization", login.body.token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  }, 1000);
});
