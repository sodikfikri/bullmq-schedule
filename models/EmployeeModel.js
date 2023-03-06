const moment = require('moment')
const DB = require('../config/dbConnection')
const mysql_helpers = require('../library/LibMySql')

const EmployeeModel = {

    ListData: function() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await mysql_helpers.get('employee', '*')
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
    }

}

module.exports = EmployeeModel 