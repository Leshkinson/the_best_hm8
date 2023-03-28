import {Request, Response, Router} from "express";
import {postRepository} from "../repositories/post-repository";
import {HTTP_STATUSES} from "../http_statuses";
import {blogRepository} from "../repositories/blog-repository";
import {userRepository} from "../repositories/user-repositpry";
import {commentRepository} from "../repositories/comment-repository";
import {testingController} from "../controllers/testing-controller";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await testingController.clearDB()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})