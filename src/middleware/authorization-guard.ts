import {NextFunction, Request, Response} from "express";

export const authorizationGuard = (req: Request, res: Response, next: NextFunction) => {
 const isAuth = "YWRtaW46cXdlcnR5" ===   req.headers.authorization?.replace('Basic', '').trim()
    if(!isAuth){
        res.sendStatus(401)
        return
    }
    next()
}