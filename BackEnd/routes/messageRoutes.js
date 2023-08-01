const express = require('express');
const { protect } = require('../middleware/authToken');
const { sendMessage,allMessage } = require('../controllers/messageControllers')

const router = express.Router();

router.post('/', protect, sendMessage);   //for sending messages
router.get('/:chatId',protect,allMessage);

module.exports = router