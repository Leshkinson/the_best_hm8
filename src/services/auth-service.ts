import {UserFromDBType, UserRequestType} from "../types/types";
import {createId} from "../utils/createId";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../application/emailManager";
import {userRepository} from "../repositories/user-repositpry";
import {getTextForRegistration} from "../utils/getTextForRegistration";
import {usedRefreshRepository} from "../repositories/usedRefresh-repository";
import {jwtService} from "../application/jwt-service";

export const authService = {

    async getMe(user:any){
        return {
            "email": user.accountData.email,
            "login": user.accountData.userName,
            "userId": user.id,
        }
    },

    async createdAccessAndRefreshTokens(user: any){
        const accessToken = await jwtService.createAccessToken(user)
        const refreshToken = await jwtService.createRefreshToken(user)
        return [accessToken, refreshToken]
    },

    async registration(userData: UserRequestType) {
        const id = createId()
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(userData.password, salt)
        const generatedCode = uuidv4()
        const newUser: UserFromDBType = {
            id,
            accountData: {
                userName: userData.login,
                email: userData.email,
                hash,
                salt,
                createdAt: new Date().toISOString(),
            },
            emailConformation: {
                confirmationCode: generatedCode,
                expirationDate: add(new Date(), {
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const text = getTextForRegistration(generatedCode)


        await emailManager.sendEmailConfirmationMessage(userData.email, "DmitriСorporate", text)
        await userRepository.createUser(newUser)
    },


    async registrationConfirmation(code: string) {
        const filter: any = {
            "emailConformation.confirmationCode": code
        }
        const user = await userRepository.getUserByFilter(filter)

        if (user && !user.emailConformation.isConfirmed) {
            const update = {
                $set: {"emailConformation.isConfirmed": true}
            }
            await userRepository.changeUser({id: user.id}, update)
            return user

        }
        return null
    },

    async regEmailResend(email: string) {
        const filter: any = {'accountData.email': email}
        const user = await userRepository.getUserByFilter(filter)

        if (user && !user.emailConformation.isConfirmed) {
            const generatedCode = uuidv4()
            const text = getTextForRegistration(generatedCode)
            const update = {
                $set: {'emailConformation.confirmationCode': generatedCode}
            }
            await userRepository.changeUser({id: user.id}, update)
            await emailManager.sendEmailConfirmationMessage(email, "DmitriСorporate", text)
            return true
        }
        return false
    },

    async refreshToken(userId: any, oldRefreshToken: string){
        const user = {id: userId}
        await authService.saveUsedToken(oldRefreshToken)
        return await authService.createdAccessAndRefreshTokens(user)
    },

    async saveUsedToken(token: any): Promise<void> {
        const tokenObj = {refreshToken: token}
        await usedRefreshRepository.saveUsedToken(tokenObj)
    },

    async findUsedToken(refreshToken: any): Promise<boolean> {
        const filter = {refreshToken}
        const isTokenUsed = await usedRefreshRepository.findUsedToken(filter)
        return !!isTokenUsed
    }
}