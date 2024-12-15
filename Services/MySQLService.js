const mysql = require("mysql2/promise");  // Sử dụng mysql2 với promise
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

async function createConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL");
    return connection;
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
  }
}

async function query(sql, params) {
  const connection = await createConnection();
  try {
    console.time("charlistQuery");
    const [results] = await connection.execute(sql, params);
    console.timeEnd("charlistQuery", results);
    return results;
  } catch (err) {
    console.error("MySQL Query Error:", err);
    throw err;
  } finally {
    await connection.end();  // Đảm bảo kết nối được đóng sau khi sử dụng
  }
}

module.exports = { query };
