const path = require('path')
require("dotenv").config({ path: path.join(__dirname, ".env") })
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const multer = require('multer')
// const formidableMiddleware = require('express-formidable')
const fileUpload = require('express-fileupload');
app.use(fileUpload());

const LibBullAdapter = require('./library/LibBullAdapter')

app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "50mb",
    })
)

app.use(
    bodyParser.json({
        inflate: true,
        limit: "50mb",
        // type: () => true,
    })
)

// app.use(formidableMiddleware())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
    res.header("Access-Control-Expose-Headers", "Content-Length")
    res.header("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, Content-Length, X-Requested-With, Range, x-api-key, x-forwarded-for")
    if (req.method === "OPTIONS") {
        return res.json(200)
    } else {
        return next()
    }
})


const routes = require('./routes')

routes.routesConfig(app)

app.use('/admin/queues', LibBullAdapter.getRouter());

const server = require("http").createServer(app)

server.listen(process.env.PORT, () => {
    // const host = app.address().address
    // const port = app.address().port
    console.log("Service Sellers on Port: " + process.env.PORT)
})