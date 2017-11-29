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
const startHour = parseInt(process.env.START_UTC_TIME_HOUR)
let endHour = parseInt(process.env.END_UTC_TIME_HOUR)
if (startHour > endHour) {
    endHour += 24
}

app.get('/', (req, res) => {
    if (requestLoop) {
        clearInterval(requestLoop)
    }
    if (data.Applications && data.Applications.length > 0) {
        requestLoop = setInterval(() => {
            const currentHour = new Date().getHours()
            if (currentHour >= startHour && currentHour < endHour) {
                data.Applications.forEach(url => {
                    const protocol = url.indexOf('https') >= 0 ? https : http
                    const req = protocol.get(url, function(res) {
                        console.log(`STATUS: ${res.statusCode} - ${url}`)
                    })
                })
            }
        }, 60000)
    }
    res.send('Requests in loop')
})

http.createServer(app).listen(process.env.PORT)