import {userCollections} from "../../mongoDB";
import {UserFromDBType, UserResponseFromDBType} from "../types/types";


export const userRepository = {

    async getAllUsers(filter: any, sort: any, skip: any, limit: any): Promise<UserFromDBType[]> {
        return await userCollections.find(filter).sort(sort).skip(skip).limit(limit).toArray()
    },

    async getUserByFilter(filter: any): Promise<UserFromDBType | null> {
        return await userCollections.findOne(filter)
    },

    async getTotalCount(filter: any): Promise<number> {
        return await userCollections.countDocuments(filter)
    },

    async createUser(newUser: any): Promise<void> {
        await userCollections.insertOne(newUser)
    },

    async changeUser(id: { id: string }, update: { $set: any }){
        const result = await userCollections.updateOne(id, update)
        return (result.matchedCount === 1);
    },

    async deleteUser(filter: any): Promise<boolean> {
        const result = await userCollections.deleteOne(filter)
        return result.deletedCount === 1
    },

    async deleteAllUser(): Promise<void> {
        await userCollections.deleteMany({})
    }
}