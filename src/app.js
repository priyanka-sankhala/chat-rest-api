const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const logger = require('./utils/logger');



const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

//for DB loggin 
app.use(logger.getRequest);
console.log("here after middleware")
// const setResponseTime = (req, res, next) => {
//     req.start_time = Utility.getTime();

//     next();
// }


//app.use(setResponseTime);


// var fs = require('fs');
// var util = require('util');
// var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
//   // Or 'w' to truncate the file every time the process starts.
// var logStdout = process.stdout;

// console.log = function () {
//   logFile.write(util.format.apply(null, arguments) + '\n');
//   logStdout.write(util.format.apply(null, arguments) + '\n');
// }
// console.error = console.log;

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

const setResponseTime = (req, res, next) => {
   console.log("after response");

    next();
}
app.use(setResponseTime);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDBIv1RricrM3A2sb1b6hyRp38hmaF-LPA",
//   authDomain: "chat-e8b83.firebaseapp.com",
//   projectId: "chat-e8b83",
//   storageBucket: "chat-e8b83.appspot.com",
//   messagingSenderId: "306446665642",
//   appId: "1:306446665642:web:710646654f440b37a30dd3",
//   measurementId: "G-Z9T8T1YC52"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);



module.exports = app;
