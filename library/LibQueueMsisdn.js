const moment = require('moment')
const {Queue, QueueScheduler, Worker} = require('bullmq');
const DB = require('../config/dbConnection')
const mysql_helpers = require('./LibMySql')
const connection = require('./LibRedisConn')

const QueueName = process.env.QUEUEMSISDN

const QUEUE = new Queue(QueueName,  {
    connection: connection
})

const LibQueueMsisdn = {
    theQueue: QUEUE,
    QueueHandler: async function(data) {
        let apiResult = {}
        try {
            if (data) {
                await QUEUE.add(QueueName, data, {
                    removeOnComplete: true
                })
            }
            apiResult.meta = {
                code: 200,
                message: 'Success Add Jobs'
            }
            return apiResult
        } catch (error) {
            apiResult.meta = {
                code: 400,
                msg: 'Error Add To Queue : ' + error
            }
            return apiResult
        }
    },
    QueuePeoccess: async function(job) {
        try {
            const data = job.data
            for(let val of data) {
                await mysql_helpers.insert('tbl_msisdn_spesifik', val)
            }
        } catch (error) {
            return error.message
        }
    },
    QueueWorker: async function() {
        const worker = new Worker(QueueName, LibQueueMsisdn.QueuePeoccess, {
            connection: connection,
            concurrency: 1
        })

        worker.on('progress', (job, result) => {
            console.log('Event progress: ', moment().format('YYYY-MM-DD HH:mm:ss'));
        })
        worker.on('completed', (job, result) => {
            // job.updateProgress(100);
            console.log('Event complete: ', moment().format('YYYY-MM-DD HH:mm:ss'));
        })
        worker.on('failed', (job, result) => {
            console.log('Event failed: ', moment().format('YYYY-MM-DD HH:mm:ss'));
        })
        worker.on('error', async (job, result) => {
            console.log('result: ',result);
            console.log('Event Error');
        })
    }
}

module.exports = LibQueueMsisdn