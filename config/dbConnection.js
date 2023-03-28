const mysql = require('mysql2')
const config = require('./dbConfig')
// console.log('config: ', config.dbConfig);
const pool = mysql.createPool(config.dbConfig)
const util = require('util')

pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Koneksi database ditutup.")
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error("Basis data memiliki terlalu banyak koneksi.")
        }
        if (err.code === "ECONNREFUSED") {
            console.error("Koneksi database ditolak.")
        }
    }
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query)
module.exports = pool