import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {blogService} from "../services/blog-service";
import {postService} from "../services/post-service";
import {commentService} from "../services/comment-service";

export const checkBlogId = async (req: Request, res: Response, next: NextFunction) => {
    const blog = await blogService.getBlogById(req.params.id)
    if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    next()
}

export const checkPostId = async (req: Request, res: Response, next: NextFunction) => {
    const post = await postService.getPostById(req.params.id)
    post ? next() : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
}

export const checkCommentId = async (req: Request, res: Response, next: NextFunction) => {
    const comment = await commentService.getCommentById(req.params.id)
    if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    req.content = {...req.content, comment}
    next()
}

