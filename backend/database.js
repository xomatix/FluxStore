const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "matswie",
  host: "lab.kis.agh.edu.pl",
  database: "matswie",
  password: "nnxtvp25eo7f",
  port: 1600,
});

async function DBquery(sql) {
  try {
    console.log(sql);
    const res = await pool.query(sql);
    return res.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  DBquery,
};
