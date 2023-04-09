// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const sharedConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  migrations: { directory: "./data/migrations" },
  pool: {
    afterCreate: (conn, done) => conn.run("PRAGMA foreign_keys=ON", done),
  },
};

module.exports = {
  development: {
    ...sharedConfig,
    client: "sqlite3",
    connection: {
      filename: "./data/dvitterApp.db3",
    },
    seeds: { directory: "./data/seeds" },
  },
  testing: {
    ...sharedConfig,
    connection: { filename: "./data/test.db3" },
    seeds: { directory: "./data/seeds" },
  },
};
