import {Request, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {commentService} from "../services/comment-service";


export const commentController = {

    async getCommentById(req: Request, res: Response) {
        const findComment = await commentService.getCommentById(req.params.id)
        if (findComment) {
            res.status(HTTP_STATUSES.OK200).send(findComment)
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    },

    async changeComment(req: Request, res: Response) {
        const isChangeComment = await commentService.changeComment(req.params.id, req.body)

        if (isChangeComment) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    },

    async deleteComment(req: Request, res: Response) {
          const isDeleted = await commentService.deleteComment(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
}