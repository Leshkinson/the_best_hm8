import {Router} from "express";
import {commentController} from "../controllers/comment-controller";
import {authMiddleware} from "../middleware/authMiddleware";
import {commentValidation, checkIsUserOwnerComment} from "../validators/comment-validation";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {checkCommentId} from "../validators/generalValidation";


export const commentRouter = Router({})

//-------------------GET---------------//
commentRouter.get('/:id',  commentController.getCommentById)
//-------------------PUT---------------//
commentRouter.put('/:id', authMiddleware, checkCommentId, checkIsUserOwnerComment, commentValidation, inputValidationMiddleware, commentController.changeComment)
//-------------------DELETE---------------//
commentRouter.delete('/:id', authMiddleware, checkCommentId, checkIsUserOwnerComment, commentController.deleteComment)

