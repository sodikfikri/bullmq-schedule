const moment = require("moment");

const response = require("../config/responses");
const EmployeeModel = require("../models/EmployeeModel");
const LibQueueHandler = require('../library/LibQueueHandler');
const LibExcelHandle = require('../library/LibExcelHanlde');
const LibQueueMsisdn = require("../library/LibQueueMsisdn");

const EmployeeController = {

    List: async function(req, res) {
        let apiResult = {}
        try {
            const data = await EmployeeModel.ListData()
            // return res.json(data.result.length)
            if (data.result.length == 0) {
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
                apiResult = {...response[400]}
                apiResult.meta.message = 'No files were uploaded.'
                return res.status(200).send(apiResult);
            }
            
            const uploadedFile = req.files.file;
            const filepath = await LibExcelHandle.UploadFile(uploadedFile)
            const data = LibExcelHandle.ExcelToJson(filepath)

            const add = await LibQueueHandler.QueueInsData(data)

            if (add.meta.code != 200) {
                apiResult = {...response[400]}
                apiResult.meta.message = 'Failed to add Jobs'
                return res.status(200).send(apiResult)
            }

            apiResult = {...response[200]}
            apiResult.meta.message = 'Success: add data has success full'

            return res.status(200).send(apiResult)
        } catch (error) {
            apiResult = {...response[500]}
            apiResult.meta.message = error.message
            return res.status(500).send(apiResult)
        }
    },

    InsMsisdn: async function(req, res) {
        let apiResult = {}
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                apiResult = {...response[400]}
                apiResult.meta.message = 'No files were uploaded.'
                return res.status(200).send(apiResult);
            }
            console.log('upload file: ', moment().format('YYYY-MM-DD HH:mm:ss'));
            const uploadedFile = req.files.file;
            const filepath = await LibExcelHandle.UploadFile(uploadedFile)
            let data = LibExcelHandle.ExcelToJson(filepath)
            
            console.log('set params insert tbl_spesifik: ', moment().format('YYYY-MM-DD HH:mm:ss'));
            let params = {
                code_spesifik: req.body.code,
                description: req.body.description,
                created_date: moment().format('YYYY-MM-DD HH:mm')
            }
            console.log('insert to tbl_spesifik: ', moment().format('YYYY-MM-DD HH:mm:ss'));
            const store = await EmployeeModel.InsSpesifik(params)
            // return res.json(store)
            if (store.type != 'success') {
                apiResult = {...response[400]}
                apiResult.meta.message = 'Fail to insert data to tbl_spesifik'

                return res.status(200).json(apiResult)
            } 
            
            console.log('start loop: ', moment().format('YYYY-MM-DD HH:mm:ss'));
            let msisdn = []
            for(val of data) {
                let Obj = {
                    code_spesifik: req.body.code,
                    msisdn: val.MSISDN
                }
                msisdn.push(Obj)
            }
            console.log('end loop: ', moment().format('YYYY-MM-DD HH:mm:ss'));
            // return res.json(msisdn)
            console.log('start queue: ', moment().format('YYYY-MM-DD HH:mm:ss'));
            const AddJob = await LibQueueMsisdn.QueueHandler(msisdn)
            return res.json(AddJob)
        } catch (error) {
            apiResult = {...response[500]}
            apiResult.meta.message = error.message
            return res.status(500).send(apiResult)
        }
    },

    Drain: async function(req, res) {
        let apiResult = {}
        try {
            LibQueueHandler.QueueDrain()

            apiResult = {...response[200]}
            apiResult.meta.message = 'Success Drain'

            return res.json(apiResult)
        } catch (error) {
            apiResult = {...response[500]}
            apiResult.meta.message = error.message
            return res.status(500).send(apiResult)
        }
    }

}

module.exports = EmployeeController