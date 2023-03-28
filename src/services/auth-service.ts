import {CommentResponseType, UserFromDBType, UserRequestType} from "../types/types";
import {createId} from "../utils/createId";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../application/emailManager";
import {userRepository} from "../repositories/user-repositpry";
import {getTextForRegistration} from "../utils/getTextForRegistration";

export const authService = {

    async registration(userData: UserRequestType) {
        const id = createId()
        console.log('test for render', userData)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(userData.password, salt)
        console.log('test for render',salt, hash)
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
}