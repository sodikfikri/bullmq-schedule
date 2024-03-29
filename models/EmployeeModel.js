const moment = require('moment')
const DB = require('../config/dbConnection')
const mysql_helpers = require('../library/LibMySql')

const EmployeeModel = {

    ListData: function() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await mysql_helpers.get('tbl_code_ex', '*')
                resolve(data) 
            } catch (error) {
                reject(error)
            }
        })
    },
    InsData: function(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const add = await mysql_helpers.insert('employee', data)
                resolve(add)
            } catch (error) {
                reject(error)
            }
        })
    },

    InsSpesifik: function(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let resp = {}
                console.log('model data: ', data);
                console.log( `SELECT * FROM tbl_spesifik where code_spesifik = "${data.code_spesifik}"`);
                let validate = await mysql_helpers.query(DB, `SELECT * FROM tbl_spesifik where code_spesifik = "${data.code_spesifik}"`)
                // return resolve(validate)
                if (validate.length != 0) {
                    resp.type = 'redundance'
                    return resolve(resp)
                }
                console.log('query 2');
                const result = await mysql_helpers.insert('tbl_spesifik', data)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },

    InsLogMsisdn: function(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await mysql_helpers.insert('tbl_msisdn_job', data)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },

    JobCek: function() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await mysql_helpers.query(DB, "SELECT * FROM tbl_msisdn_job where status = 1")
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },

    testdelete: function(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await mysql_helpers.query(DB, `update tbl_msisdn_job set status = 2 where job_name = "${data}"`)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

}

module.exports = EmployeeModel 