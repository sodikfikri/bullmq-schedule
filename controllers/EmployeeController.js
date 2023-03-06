const moment = require("moment");

const response = require("../config/responses");
const EmployeeModel = require("../models/EmployeeModel");
const LibQueueHandler = require('../library/LibQueueHandler');
const LibExcelHandle = require('../library/LibExcelHanlde')

const EmployeeController = {

    List: async function(req, res) {
        let apiResult = {}
        try {
            const data = await EmployeeModel.ListData()
            
            if (data.type != 'success') {
                apiResult = response[404]
                return res.status(200).json(apiResult)
            }

            apiResult = response[200]
            apiResult.data = data.result

            return res.status(200).json(apiResult)
        } catch (error) {
            apiResult = response[500]
            apiResult.meta.message = error.message
            return res.status(500).send(apiResult)
        }
    },
    InsData: async function(req, res) {
        let apiResult = {}
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                apiResult = response[400]
                apiResult.meta.message = 'No files were uploaded.'
                return res.status(200).send(apiResult);
            }
            
            const uploadedFile = req.files.file;
            const filepath = await LibExcelHandle.UploadFile(uploadedFile)
            const data = LibExcelHandle.ExcelToJson(filepath)

            const add = await LibQueueHandler.QueueInsData(data)

            if (add.meta.code != 200) {
                apiResult = response[400]
                apiResult.meta.message = 'Failed to add Jobs'
                return res.status(200).send(apiResult)
            }

            apiResult = response[200]
            apiResult.message = 'Success: add data has success full'

            return res.status(200).send(apiResult)
        } catch (error) {
            apiResult = response[500]
            apiResult.meta.message = error.message
            return res.status(500).send(apiResult)
        }
    }

}

module.exports = EmployeeController