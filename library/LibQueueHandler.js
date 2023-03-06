const moment = require('moment')
const {Queue, QueueScheduler, Worker} = require('bullmq');
const DB = require('../config/dbConnection')
const mysql_helpers = require('./LibMySql')
const connection = require('./LibRedisConn')
const { ExpressAdapter, createBullBoard, BullAdapter, BullMQAdapter } = require('@bull-board/express');

const QueueName = process.env.QUEUENAME

const QUEUE = new Queue(QueueName,  {
    connection: connection
})

const QueueHandler = {
    /**
     * START QUEUE
     * @queue
     */
    theQueue: QUEUE,
    QueueInsData: async function(data) {
        let apiResult = {}
        try {
            if (data) {
                await QUEUE.add(QueueName, data, {
                    removeOnComplete: false,
                    // delay: 1000 // delay 1 second
                    // repeat: {
                    //     pattern: '20 17 01 02 *',
                    //     // every: 5000,
                    // }
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
    /**
     * PROCESS QUEUE
     * @queue
     */
    QueueProcess: async function(job) {
        try {
            const data = job.data
            
            for(let val of data) {
                const data = {
                    name: val.name,
                    phone: val.phone,
                    email: val.email,
                    address: val.email,
                    created_at: moment().unix()
                }
                console.log(data);
                await mysql_helpers.insert('employee', data)
            }
        } catch (error) {
            return error.message
        }
    },
    /**
     * EVENT QUEUE
     * @queue
     */
    QueueWorker: async function() {
        const worker = new Worker(QueueName, QueueHandler.QueueProcess, {
            connection: connection,
            concurrency: 1
        })
        worker.on('delayed', (job, result) => {
            console.log('Event DELAYED');
        })
        worker.on('progress', (job, result) => {
            // console.log(job.id);
            console.log('Event progress');
        })
        worker.on('completed', (job, result) => {
            // job.remove()
            job.updateProgress(100);
            console.log('Event complete');
        })
        worker.on('failed', (job, result) => {
            console.log('Event failed');
        })
        worker.on('waiting', (job, result) => {
            console.log('Event waiting');
        })
        worker.on('removed', (job, result) => {
            console.log('Event removed');
        })
        worker.on('stalled', (job, result) => {
            console.log('Event stalled');
        })
        worker.on('cleaned', (job, result) => {
            console.log('Event cleaned');
        })
    }
}

module.exports = QueueHandler