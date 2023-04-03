import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {authService} from "../services/auth-service";


export const checkIsRefreshTokenValid = async (req: Request, res: Response, next: NextFunction) => {
    const {refreshToken} = req.cookies;
    if (!refreshToken) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
    const isTokenUsed = await authService.findUsedToken(refreshToken.refreshToken);
    return isTokenUsed ? res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401) : next();
};