import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {userService} from "../services/user-service";
import {HTTP_STATUSES} from "../http_statuses";



export const authMiddleware  = async  (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    const user = await userService.getUserById(userId)
        if(user){
            req.content = {...req.content,
                user
            }
            return next()
        }

    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}