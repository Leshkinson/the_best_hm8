import {
    QueryForUsersType,
    ResponseTypeWithPages, UserFromDBType,
    UserResponseType
} from "../types/types";
import {getSortSkipLimit} from "../utils/getSortSkipLimit";
import {userRepository} from "../repositories/user-repositpry";
import {createId} from "../utils/createId";
import bcrypt from "bcrypt";
import {userModels} from "../models/user-models";
import {Sort} from "mongodb";
import {getFilter} from "../utils/getFilter";
import add from "date-fns/add";
import {v4 as uuidv4} from "uuid";


export const userService = {

    async getAllUsers(query: QueryForUsersType): Promise<ResponseTypeWithPages<UserResponseType>> {
        const {pageNumber, pageSize, userName, email} = query
        const [sort, skip, limit] = await getSortSkipLimit(query)
        const filter: any = getFilter({
            "accountData.email": email,
            "accountData.userName": userName
        }, true)

        const totalCount = await userRepository.getTotalCount(filter)
        const users = await userRepository.getAllUsers(filter, sort as Sort, +skip, +limit)
        return {
            pagesCount: Math.ceil(totalCount / +pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: userModels(users) as UserResponseType[]
        }
    },

    async getUserById(id: string): Promise<UserFromDBType | null> {
        const filter = {id}
        return await userRepository.getUserByFilter(filter)
    },

    async getUserByLoginOrEmail(loginOrEmail: string, email?: string): Promise<UserFromDBType | null> {
        const filter: any = getFilter({
            "accountData.userName": loginOrEmail,
            "accountData.email": email || loginOrEmail
        })

        return await userRepository.getUserByFilter(filter)
    },

    async createUser(user: any): Promise<UserResponseType> {
        const id = createId()
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        const generatedCode = uuidv4()
        const createDate = new Date().toISOString()
        const newUser: UserFromDBType = {
            id,
            accountData: {
                userName: user.login,
                email: user.email,
                hash,
                salt,
                createdAt: createDate,
            },
            emailConformation: {
                confirmationCode: generatedCode,
                expirationDate: add(new Date(), {
                    minutes: 3
                }),
                isConfirmed: true
            }
        }
        await userRepository.createUser(newUser)
        return {
            id,
            login: user.login,
            email: user.email,
            createdAt: createDate
        }
    },

    async deleteUser(id: string): Promise<boolean> {
        const filter = {id}
        return await userRepository.deleteUser(filter)
    }
}