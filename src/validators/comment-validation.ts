import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses";


const contentValidation = body('content')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 20, max: 300}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')


export const checkIsUserOwnerComment = async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore // лень писать ебнутые проверки, я и так уже до вызова этой функции всё проверил
    if(req.content.user.id !== req.content.comment.commentatorInfo.userId){
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
        return
    }
    next()
}


export const commentValidation = [contentValidation]

