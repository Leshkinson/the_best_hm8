import {usedRefreshCollections} from "../../mongoDB";


export const usedRefreshRepository = {

    async saveUsedToken(token:any){
        await usedRefreshCollections.insertOne(token)
    },

    async findUsedToken(filter: any){
      return  await usedRefreshCollections.findOne(filter)
    },

    async deleteAllUsedToken():Promise<void>{
        await usedRefreshCollections.deleteMany({})
    }

}