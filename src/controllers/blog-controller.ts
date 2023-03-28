import {blogService} from "../services/blog-service";
import {Request, Response} from "express";
import {DefaultValueListType} from "../types/types";
import {HTTP_STATUSES} from "../http_statuses";
import {getPageQuery} from "../utils/getPageQuery";

const DEFAULT_VALUE_LIST: DefaultValueListType = {
    FIELD_FOR_SORT: "createdAt",
    SORT_DIRECTION: "desc",
    PAGE_NUMBER: 1,
    PAGE_SIZE: 10
}

export const blogController = {

    async getAllBlogs(req: Request, res: Response) {
        const query = {
            ...getPageQuery(req.query, DEFAULT_VALUE_LIST),
            name: req.query.searchNameTerm as string || "",
        }
        const blogs = await blogService.getBlogs(query)
        res.status(HTTP_STATUSES.OK200).send(blogs)
    },

    async getBlogById(req: Request, res: Response) {
        const findBlog = await blogService.getBlogById(req.params.id)
        if (findBlog) {
            res.status(HTTP_STATUSES.OK200).send(findBlog)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    },

    async getAllBlogPosts(req: Request, res: Response) {
        const query = {
            pageNumber: Number(req.query.pageNumber || DEFAULT_VALUE_LIST.PAGE_NUMBER),
            pageSize: Number(req.query.pageSize || DEFAULT_VALUE_LIST.PAGE_SIZE),
            sortBy: req.query.sortBy as string || DEFAULT_VALUE_LIST.FIELD_FOR_SORT,
            name: req.query.searchNameTerm as string || "",
            sortDirection: req.query.sortDirection as string || DEFAULT_VALUE_LIST.SORT_DIRECTION
        }
        const posts = await blogService.getAllBlogPosts(req.params.id, query)
        res.status(HTTP_STATUSES.OK200).send(posts)
    },

    async createBlog(req: Request, res: Response) {
        const newBlog = await blogService.createBlog(req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
    },

    async createPostInBlog(req: Request, res: Response) {
        const newPost = await blogService.createPostInBlog(req.params.id, req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    },

    async changeBlog(req: Request, res: Response) {
        const isChangeBlog = await blogService.changeBlog(req.params.id, req.body)
        if (isChangeBlog) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    },

    async deleteBlog(req: Request, res: Response) {
        const isDeleted = await blogService.deleteBlog(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}