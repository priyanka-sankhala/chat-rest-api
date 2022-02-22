const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const chatController = require('../../controllers/chat.controller')

const router = express.Router();

router
  .route('/')
  .get(auth(),userController.getUsers)
  .post(auth(), validate(userValidation.createUser), userController.createUser)
 

router.route('/list').post(userController.getUsersList)  

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .patch(auth(), validate(userValidation.updateUser), userController.updateUser)
  

  router
  .route('/chat')
  .post(auth(),validate(userValidation.sendMessage),chatController.sendMessage)

  router
  .route('/chat/:otherUser')
  .get(auth(),chatController.getMessage)

module.exports = router;
