const router = require('express').Router()
const appController = require('../controllers/app.controllers')


router.post('/drivers', appController.getDrivertoken)
router.post('/send-token', appController.sendToken)
router.get('/driver-records', appController.getDriverRecords)
router.get('/token-records', appController.getTokenRecords)



module.exports = router