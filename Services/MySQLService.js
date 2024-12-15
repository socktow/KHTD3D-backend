const mysql = require("serverless-mysql");
require("dotenv").config();
const dbConfig = (() => {
  const url = new URL(process.env.MYSQLURL);
  return {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.replace("/", ""),
    port: url.port || 3306,
  };
})();


const db = mysql({
  config: {
    ...dbConfig,
    connectTimeout: 10000, 
    multipleStatements: true,
  },
});
async function query(sql, params) {
  try {
    console.time("charlistQuery");
    const results = await db.query(sql, params);
    console.timeEnd("charlistQuery", results);
    return results;
  } catch (err) {
    console.error("MySQL Query Error:", err);
    throw err;
  }
}

module.exports = { query };
