import {Request, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {jwtService} from "../application/jwt-service";
import {authService} from "../services/auth-service";

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
        const accessToken = await jwtService.createAccessToken(req.content.user)
        const refreshToken = await jwtService.createRefreshToken(req.content.user)
        res.status(HTTP_STATUSES.OK200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false
        }).send(accessToken)
    },


    async refreshToken(req: Request, res: Response) {
        const {refreshToken} = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }

        const userId = await jwtService.decodeReFreshToken(refreshToken)
        const isTokenUsed = await authService.findUsedToken(refreshToken)
        if (userId && isTokenUsed) {
            const user = {id: userId}
            const accessToken = await jwtService.createAccessToken(user)
            const refreshNewToken = await jwtService.createRefreshToken(user)
            console.log('refreshNewToken', refreshNewToken)
            await authService.saveUsedToken(req.cookies.refreshToken)
            return res.status(HTTP_STATUSES.OK200).cookie('refreshToken', refreshNewToken, {
                httpOnly: true,
                secure: false
            }).send(accessToken)
        }
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
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

    async logout(req: Request, res: Response) {
        const {refreshToken} = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
        return res.clearCookie('refreshToken').sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    },
}