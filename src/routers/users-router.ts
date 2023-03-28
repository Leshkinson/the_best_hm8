import {Router} from "express";
import {userController} from "../controllers/user-controller";
import {userValidation} from "../validators/user-validation";
import {authorizationGuard} from "../middleware/authorization-guard";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";


export const userRouter = Router({})

//-------------------GET---------------//
userRouter.get('/', userController.getAllUsers)
//-------------------POST---------------//
userRouter.post('/', authorizationGuard, userValidation, inputValidationMiddleware, userController.createUser)
//-------------------DELETE---------------//
userRouter.delete('/:id',authorizationGuard, userController.deleteUser)