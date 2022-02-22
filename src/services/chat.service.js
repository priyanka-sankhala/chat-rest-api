const httpStatus = require('http-status');
const {Chat} = require('./../models')

const storeMessage = (messageBody)=>{
   return  Chat.create(messageBody)
}

const getMessage = (userId,otherUserId)=>{
   return Chat.find({$or:[{from:userId,to:otherUserId},{from:otherUserId,to:userId}]}).populate("to","first_name last_name").populate("from","first_name last_name").lean()
}

module.exports = {
    storeMessage,
    getMessage
}