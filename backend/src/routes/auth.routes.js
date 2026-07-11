const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authmiddleware = require('../middleware/auth.middleware');

const authRouter = Router();
/** 
* @route POST /api/auth/register
* @desc Register a new user
* @access Public 
*/


authRouter.post('/register', authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
authRouter.get('/logout', authController.logoutUserController);  

/**
 * @route GET /api/auth/get-me
 * @desc Get the logged-in user's information
 * @access Private
 */

authRouter.get('/get-me', authmiddleware.middleware, authController.getMeController);
 

module.exports = authRouter;