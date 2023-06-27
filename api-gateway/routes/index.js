const express = require('express')
const router = express.Router()
const registry = require("./registry.json")
const fs = require('fs')

const { deliver1 } = require('../middlewares/userMiddlerware')
const { deliver2 } = require('../middlewares/menuMiddleware')
const { deliver3 } = require('../middlewares/orderMiddleware')



router.post('/book', (req, res) => {
    const registrationInfo = req.body

    registrationInfo.url = registrationInfo.host + registrationInfo.port
    registry.services[registrationInfo.apiName] = { ...registrationInfo }
    fs.writeFile('./routes/registry.json', JSON.stringify(registry),
        (error) => {
            if (error) {
                res.send(`Could not register ${registrationInfo.apiName}
                 \n ${error}`)
            } else {
                res.send(JSON.stringify(registrationInfo.apiName
                    + ' succesfully registered'))
            }
        })
})




router.all('/:apiName/:path', (req, res) => {
    if (req.method != 'OPTIONS') {
        if (registry.services[req.params.apiName]
            .action[req.params.path]) {

            let requestOption
            console.table(req.headers)
            console.log(req.method)

            if (req.method == 'GET' || req.method == 'DELETE') {
                requestOption = {
                    method: req.method,
                    headers: req.headers
                }
            } else {
                requestOption = {
                    method: req.method,
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(req.body)
                }
            }


            if (req.params.apiName == 'user') {
                deliver1(req, res, requestOption)
            }

            if (req.params.apiName == 'menu') {
                deliver2(req, res, requestOption)
            }

            if (req.params.apiName == 'order') {
                deliver3(req, res, requestOption)
            }


        } else {
            res.send('API or service doesn\'t exists')
        }
    }
})


module.exports = router