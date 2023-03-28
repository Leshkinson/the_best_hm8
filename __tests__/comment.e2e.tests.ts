import {userService} from "../src/services/user-service";
import request from "supertest";
import {app} from "../setting";
import {testingController} from "../src/controllers/testing-controller";
import {blogService} from "../src/services/blog-service";
import {postService} from "../src/services/post-service";
import {BlogResponseType, PostResponseType} from "../src/types/types";
import {HTTP_STATUSES} from "../src/http_statuses";

const first_user = {
    login: "EvilGrand",
    password: "12345678",
    email: "EvilGrand@mail.ru"
}

const second_user = {
    login: "SuperMan",
    password: "12345678",
    email: "SuperMan@mail.ru"
}
let blog: BlogResponseType
let post: PostResponseType
let token_first_user: string
let token_second_user: string
let comment: any

describe('comment_test', () => {

    beforeAll(async () => {
        //created blog, post,  users and get their token
        await userService.createUser(first_user).then(async () => {
            const result = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: first_user.login,
                    password: first_user.password
                })
            if (result) {
                token_first_user = result.body.accessToken
            }
        })
        await userService.createUser(second_user).then(async () => {
            const result2 = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: second_user.login,
                    password: second_user.password
                })
            if (result2) {
                token_second_user = result2.body.accessToken
            }
        })

        blog = await blogService.createBlog({
            "name": "superTest",
            "websiteUrl": "https://milanac.ru/",
            "description": "description"
        })

        post = await postService.createPost({
            "title": "new post",
            "shortDescription": "new post",
            "content": "new post",
            "blogId": blog.id
        })

    })


    it('POST, try created comment no authorization', async () => {
        await request(app)
            .post('/posts/' + post.id + '/comments')
            .send({"content": "ne12123213123123313231312w"})
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('POST, try created comment with short value', async () => {
        await request(app)
            .post('/posts/' + post.id + '/comments')
            .auth(token_first_user, {type: "bearer"})
            .send({"content": "short"})
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [{message: 'Not correct length', field: 'content'}]
            })
    })

    it('POST,created comment', async () => {
        const result = await request(app)
            .post('/posts/' + post.id + '/comments')
            .auth(token_first_user, {type: "bearer"})
            .send({"content": "here 20 symbols, no fact"})
            .expect(HTTP_STATUSES.CREATED_201)
        comment = result.body
    })

    it('PUT, try change comment other user', async () => {
        await request(app)
            .put('/comments/' + comment.id)
            .auth(token_second_user, {type: "bearer"})
            .send({"content": "new changes value"})
            .expect(HTTP_STATUSES.FORBIDDEN_403)
    })

    it('PUT,  change own comment', async () => {
        await request(app)
            .put('/comments/' + comment.id)
            .auth(token_first_user, {type: "bearer"})
            .send({"content": "!!!!!!!!!!!new changes value!!!!!!!!!!!!!"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('GET, get all post comments', async () => {
        await request(app)
            .get('/posts/' + post.id + '/comments')
            .expect(HTTP_STATUSES.OK200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [{...comment,  content: '!!!!!!!!!!!new changes value!!!!!!!!!!!!!'}]
                }
            )

    })


    it('DELETE, try delete comment other user', async ()=>{
        await request(app)
            .delete('/comments/' + comment.id)
            .auth(token_second_user, {type: "bearer"})
            .expect(HTTP_STATUSES.FORBIDDEN_403)
    })

    it('DELETE, delete own comment', async ()=>{
        await request(app)
            .delete('/comments/' + comment.id)
            .auth(token_first_user, {type: "bearer"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })


    afterAll(async () => {
        await testingController.clearDB()
    })


})