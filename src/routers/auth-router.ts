import {Router} from "express";
import {authController} from "../controllers/auth-controller";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {
    authValidation,
    checkCodeValidation,
    checkIsValidUser,
    regEmailResendValidation, registrationValidate
} from "../validators/auth-validation";
import {authMiddleware} from "../middleware/authMiddleware";
import {checkIsRefreshTokenValid} from "../middleware/checkIsRefreshTokenValid";

export const authRouter = Router({})

//-------------------GET---------------//
authRouter.get('/me', authMiddleware, authController.getMe)
//-------------------POST---------------//
authRouter.post('/refresh-token', authController.refreshToken)
authRouter.post('/login', authValidation, checkIsValidUser, inputValidationMiddleware, authController.authorization)
authRouter.post('/registration', registrationValidate,  inputValidationMiddleware, authController.registration)
authRouter.post('/registration-confirmation', checkCodeValidation, inputValidationMiddleware, authController.registrationConfirmation)
authRouter.post('/registration-email-resending', regEmailResendValidation, inputValidationMiddleware, authController.regEmailResend)
authRouter.post('/logout', checkIsRefreshTokenValid, authController.logout)

