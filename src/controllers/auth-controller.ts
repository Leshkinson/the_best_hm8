import {Request, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {jwtService} from "../application/jwt-service";
import {authService} from "../services/auth-service";

export const authController = {

    async getMe(req: Request, res: Response) {
        if (req.content.user) {
          const user =  await  authService.getMe(req.content.user)
            res.status(HTTP_STATUSES.OK200).send(user)
        }
    },

    async authorization(req: Request, res: Response) {
        const [accessToken, refreshToken] =  await authService.createdAccessAndRefreshTokens(req.content.user)
        res.status(HTTP_STATUSES.OK200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        }).send(accessToken)
    },


    async refreshToken(req: Request, res: Response) {
        const {refreshToken} = req.cookies.refreshToken;
        const userId = await jwtService.decodeReFreshToken(refreshToken)
        if (userId) {
            const [accessToken, refreshNewToken] = await authService.refreshToken(userId, refreshToken)
            return res.status(HTTP_STATUSES.OK200).cookie('refreshToken', refreshNewToken, {
                httpOnly: true,
                secure: true
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

        const userId = await jwtService.decodeReFreshToken(refreshToken)
        if (!userId) {
            return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }

        await authService.saveUsedToken(refreshToken)
        return res.clearCookie('refreshToken').sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    },
}