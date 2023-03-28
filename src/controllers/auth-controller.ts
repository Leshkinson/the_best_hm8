import {Request, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {jwtService} from "../application/jwt-service";
import {authService} from "../services/auth-service";
import {userModels} from "../models/user-models";
import {UserResponseFromDBType} from "../types/types";


export const authController = {

    async getMe(req: Request, res: Response) {
        let user = {}
        if (req.content.user) {
            user = {
                "email": req.content.user.accountData.email,
                "login": req.content.user.accountData.userName,
                "userId": req.content.user.id,
            }
            res.status(HTTP_STATUSES.OK200).send(user)
        }
    },

    async authorization(req: Request, res: Response) {
        const token = await jwtService.createJWT(req.content.user)
        res.status(HTTP_STATUSES.OK200).send(token)
    },

    async registration(req: Request, res: Response) {
        await authService.registration(req.body)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    },

    async registrationConfirmation(req: Request, res: Response) {
        const isRegistration = await authService.registrationConfirmation(req.body.code)
        isRegistration ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    },

    async regEmailResend(req: Request, res: Response) {
        const isEmailSend = await authService.regEmailResend(req.body.email)
        isEmailSend ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    },


}