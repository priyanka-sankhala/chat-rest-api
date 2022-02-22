const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const chatSchema = mongoose.Schema(
  {
    from: {
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    to: {
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    }

    
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    versionKey: false,
    collection: 'chats',
  }
);

// add plugin that converts mongoose to json
chatSchema.plugin(toJSON);
chatSchema.plugin(paginate);

/**
 * @typedef Chat
 */
const Chat = mongoose.model('chats', chatSchema);

module.exports = Chat;
