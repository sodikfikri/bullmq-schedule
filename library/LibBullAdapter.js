const QueueHandler = require('./LibQueueHandler');

const { ExpressAdapter, createBullBoard, BullAdapter, BullMQAdapter } = require('@bull-board/express');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [
        new BullAdapter(QueueHandler.theQueue)
    ],
    serverAdapter: serverAdapter,
});

QueueHandler.QueueWorker()

module.exports = serverAdapter