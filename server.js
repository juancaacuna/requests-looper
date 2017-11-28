const express = require('express')
const cors = require('cors')
const http = require('http')
const https = require('https')
const { clearInterval } = require('timers')
const data = require('./applications')
require('dotenv').config()

const app = express()
app.use(cors())

let requestLoop = null

app.get('/', (req, res) => {
    if (requestLoop) {
        clearInterval(requestLoop)
    }
    requestLoop = setInterval(() => {
        data.Applications.forEach(url => {
            const protocol = url.indexOf('https') >= 0 ? https : http
            const req = protocol.get(url, function(res) {
                console.log(`STATUS: ${res.statusCode} - ${url}`)
            })
        })
    }, 60000)
    res.send('Requests in loop')
})

http.createServer(app).listen(process.env.PORT)