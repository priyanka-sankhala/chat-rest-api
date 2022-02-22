const logModel = require('../models/app.log');
const mongoose = require('mongoose');
function getRequest(req, res, next) {
  var ip =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  var startTime = Math.round(new Date().getTime());
  var endTime = '';
  var objLog = new logModel({
    headers: req.headers,
    params: req.body ? req.body : req.query,
    url: req.originalUrl,
    start_time: startTime,
    end_time: endTime,
    ip: ip,
    rtime: 0,
    status_code: '0',
    response: '',
  }).save();

  objLog.then(function (doc) {
    req.log_id = doc._id;
    req.start_time = startTime;
    req.ip = ip;
    next();
  });
}

const sendResponse = (req, res, statusCode, data) => {
  if(statusCode>=400 && statusCode<600){
    if(!data.hasOwnProperty('status')){
         data.status=0
    }
   
  }else{
    if(!data.hasOwnProperty('status')){
         data.status=1
    }
  }
  if (data.status == 0) {
    if (!data.hasOwnProperty('message')) {
     // data.message = message_obj.server_error;
    }
  }
  if (typeof req.start_time === 'undefined') {
    req.body.start_time = getTime();
  }
  var rtime = (new Date().getTime() - req.start_time) / 1000;
  if (rtime == NaN || rtime == 'NaN') {
    rtime = 0;
  }
  var updateObj = {
    response: data,
    end_time: new Date().getTime(),
    rtime: rtime,
    status_code: statusCode,
  };
  logModel
    .findOne({ _id: mongoose.Types.ObjectId(req.log_id) })
    .updateOne(updateObj)
    .then((result) => {
      return res.status(statusCode).json(data);
      res.end();
    })
    .catch((e) => {
      console.log(e);
      return res.status(200).json({
        status: 0,
        message_dev: e.message,
        //message: message_obj.server_error,
        //error_code: api_error_code.server_error,
      });
    });
};

module.exports = {
  getRequest,
  sendResponse,
};
