const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, countryService } = require('../services');
const logger = require('../utils/logger');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  logger.sendResponse(req,res,httpStatus.CREATED,{stauts:1,user})
  //res.status(httpStatus.CREATED).send(user);
});

const getUsersList = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  logger.sendResponse(req,res,httpStatus.OK,{stauts:1,...result})
});

const getUsers = catchAsync(async (req, res) => {
 
  const result = await userService.get();
  logger.sendResponse(req,res,httpStatus.OK,{status:1,user:result})
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});





module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  getUsersList
};
