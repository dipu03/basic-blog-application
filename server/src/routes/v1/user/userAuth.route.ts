import express from 'express';
import { userAuthController } from '../../../controllers';
import { userAuthMiddleware } from '../../../middlewares';

const router = express.Router();

router.post('/register', [ userAuthMiddleware.validateRegisterUserBody], userAuthController.register);
router.post('/login', [userAuthMiddleware.validateSignInReqBody], userAuthController.login);
router.post('/refresh-auth', [userAuthMiddleware.verifyRefreshAuthJWTToken], userAuthController.refreshAuth);
router.post('/logout', [userAuthMiddleware.verifyRefreshAuthJWTToken], userAuthController.logout);

export default router;