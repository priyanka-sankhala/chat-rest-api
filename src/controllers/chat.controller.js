const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, chatService } = require('../services');
const logger = require('../utils/logger');

const sendMessage = catchAsync(async (req, res) => {
  console.log(req.user);
  const from = req.user._id;
  const {to,message} = req.body
  const messageBody = {from:from,to:to,message:message}
  const chat = await chatService.storeMessage(messageBody);
  logger.sendResponse(req,res,httpStatus.CREATED,{status:1,message:"send",id:chat._id})
  //res.status(httpStatus.CREATED).send(user);
});

const getMessage = catchAsync(async(req,res)=>{
  const userId = req.user._id;
  const otherUser = req.params.otherUser
  const messages = await chatService.getMessage(userId,otherUser)
  logger.sendResponse(req,res,httpStatus.OK,{status:1,message:messages})
})



module.exports = {
 sendMessage,
 getMessage
};
