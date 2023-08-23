export default {
  development: {
    username: "root",
    password: "root",
    database: "adopet",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: 0,
    define: {
      freezeTableName: true,
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    define: {
      freezeTableName: true,
    },
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    define: {
      freezeTableName: true,
    },
  },
};