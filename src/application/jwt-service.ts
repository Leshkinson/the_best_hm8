import jwt from 'jsonwebtoken'

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '123'
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '333'

export const jwtService = {

    async createAccessToken(user: any){
        const accessToken  = jwt.sign({userId: user.id}, accessTokenSecret, {expiresIn: '10s'}) // Вернуть время обратно!!!
        return {accessToken}
    },

    async createRefreshToken(user: any){
        const refreshToken = jwt.sign({userId: user.id}, refreshTokenSecret, { expiresIn: '20s' });
        return {refreshToken}
    },

    async getUserIdByToken(token:string) {
        try {
            const result:any = jwt.verify(token, accessTokenSecret)
            return result.userId
        } catch (error) {
            return null
        }
    },

    async decodeReFreshToken(token:string) {
        try {
            const result:any = jwt.verify(token, refreshTokenSecret)
            return result.userId
        } catch (error) {
            return null
        }
    },

}