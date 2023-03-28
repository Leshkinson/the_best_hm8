import {Request, Response} from "express";
import {DefaultValueListType} from "../types/types";
import {HTTP_STATUSES} from "../http_statuses";
import {userService} from "../services/user-service";
import {getPageQuery} from "../utils/getPageQuery";

const DEFAULT_VALUE_LIST: DefaultValueListType = {
    FIELD_FOR_SORT: "createdAt",
    SORT_DIRECTION: "desc",
    PAGE_NUMBER: 1,
    PAGE_SIZE: 10
}

export const userController = {

    async getAllUsers(req: Request, res: Response) {
        const query = {
            ...getPageQuery(req.query, DEFAULT_VALUE_LIST),
            userName: req.query.searchLoginTerm as string || "",
            email: req.query.searchEmailTerm as string || ""
        }
        const users = await userService.getAllUsers(query)
        res.status(HTTP_STATUSES.OK200).send(users)
    },

    async createUser(req: Request, res: Response) {
        const newUser = await userService.createUser(req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(newUser)
    },

    async deleteUser(req: Request, res: Response){
      const isDeleted = await userService.deleteUser(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

}