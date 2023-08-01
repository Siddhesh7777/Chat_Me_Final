const express=require('express');
const {protect}=require('../middleware/authToken');
const router = express.Router();
const {accessChat}=require('../controllers/chatController')
const {fetchChat}=require('../controllers/chatController')
const {createGroupChat}=require('../controllers/chatController')
const {renameGroup}=require('../controllers/chatController')
const {addToGroup}=require('../controllers/chatController')
const {removeFormGroup}=require('../controllers/chatController')
 
router.post('/',protect,accessChat);
router.get('/',protect,fetchChat)
router.post('/group',protect,createGroupChat);
router.put('/rename',protect,renameGroup);
router.put('/groupadd',protect,addToGroup);
router.put('/groupremove',protect,removeFormGroup);






module.exports = router;