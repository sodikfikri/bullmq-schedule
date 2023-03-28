const QueueHandler = require('./LibQueueHandler');
const LibQueueMsisdn = require('./LibQueueMsisdn');

const { ExpressAdapter, createBullBoard, BullAdapter, BullMQAdapter } = require('@bull-board/express');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [
        new BullAdapter(QueueHandler.theQueue),
        new BullAdapter(LibQueueMsisdn.theQueue)
    ],
    serverAdapter: serverAdapter,
});
// LibQueueMsisdn.theQueue.drain()
QueueHandler.QueueWorker()
LibQueueMsisdn.QueueWorker()

module.exports = serverAdapter