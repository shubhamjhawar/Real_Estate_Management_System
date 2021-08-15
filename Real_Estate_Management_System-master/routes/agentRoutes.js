const express = require('express');
const router = express.Router();
const agentContoller = require('../controllers/agentController')

router.get('/login',agentContoller.getLogin)

router.post('/login',agentContoller.postLogin);

router.get('/', agentContoller.getAgenthome);

router.get('/add_property/:agentId', agentContoller.getAddProperty);

router.post('/add_property',agentContoller.postAddProperty);

router.post('/update/:propertyId', agentContoller.postUpdateProperty);


module.exports = router;