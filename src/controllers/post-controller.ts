import {Request, Response} from "express";
import {postService} from "../services/post-service";
import {HTTP_STATUSES} from "../http_statuses";
import {DefaultValueListType} from "../types/types";
import {getPageQuery} from "../utils/getPageQuery";

const DEFAULT_VALUE_LIST: DefaultValueListType = {
    FIELD_FOR_SORT: "createdAt",
    SORT_DIRECTION: "desc",
    PAGE_NUMBER: 1,
    PAGE_SIZE: 10
}

export const postController = {

   async getAllPost(req: Request, res: Response){
       const query =  {
           ...getPageQuery(req.query, DEFAULT_VALUE_LIST),
           name : req.query.searchNameTerm  as string  ||  "",
       }

       const posts = await postService.getAllPosts(query)
       res.status(HTTP_STATUSES.OK200).send(posts)
    },

    async getPostById(req: Request, res: Response){
        const findPost = await postService.getPostById(req.params.id)
        if (findPost) {
            res.status(HTTP_STATUSES.OK200).send(findPost)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    },

    async getPostComments(req: Request, res: Response){
       const query = {
           ...getPageQuery(req.query, DEFAULT_VALUE_LIST),
       }
       const postComments = await postService.getPostComments(req.params.id, query)
        res.status(HTTP_STATUSES.OK200).send(postComments)
    },

    async createPost(req: Request, res: Response){
        const newPost = await postService.createPost(req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    },

    async createdComment(req: Request, res: Response){
       const newComment = await postService.createdComment(req.params.id ,req.body, req.content.user)
        res.status(HTTP_STATUSES.CREATED_201).send(newComment)
    },

    async  changePost(req: Request, res: Response){
        const isChangePost = await postService.changePost(req.params.id, req.body)
        if (isChangePost) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    },

    async deletePost(req: Request, res: Response){
        const isDeleted = await postService.deletePost(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}