import {UserFromDBType, UserResponseType} from "../types/types";

export const userModels = (users: UserFromDBType[] | UserFromDBType): UserResponseType | UserResponseType[] => {
    const userConverter = (user: UserFromDBType) => {
        return {
            id: user.id,
            login: user.accountData.userName,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    }

    if (Array.isArray(users)) {
        return users.map((u: UserFromDBType) => userConverter(u))
    }

    return userConverter(users)
}