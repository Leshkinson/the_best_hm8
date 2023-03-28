import request from 'supertest'
import {app} from "../setting";
import {HTTP_STATUSES} from "../src/http_statuses";
import {blogRepository} from "../src/repositories/blog-repository";
import {DefaultValueListType} from "../src/types/types";
import {blogService} from "../src/services/blog-service";
import {blogModels} from "../src/models/blog-models";

const DEFAULT_VALUE_LIST: DefaultValueListType = {
    FIELD_FOR_SORT: "createdAt",
    SORT_DIRECTION: "desc",
    PAGE_NUMBER: 1,
    PAGE_SIZE: 10
}
const query =  {
    pageNumber :  DEFAULT_VALUE_LIST.PAGE_NUMBER,
    pageSize :   DEFAULT_VALUE_LIST.PAGE_SIZE,
    sortBy : DEFAULT_VALUE_LIST.FIELD_FOR_SORT,
    name :  "",
    sortDirection :DEFAULT_VALUE_LIST.SORT_DIRECTION
}

const testBlogData = {
    "name": "CorrectedName",
    "description": "CorrectedName",
    "websiteUrl": "https://corrected-url"
}
let firstElement: any


describe('/test_blogs_path_1', () => {
    it('GET, should return blogs[]', async () => {
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK200)
    })

    it('Post, created blog', async () => {
     const result = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testBlogData)
            .expect(HTTP_STATUSES.CREATED_201)

        firstElement = result.body
    })

    it('Post, created blog no auth user', async () => {
        await request(app)
            .post('/blogs')
            .send(testBlogData)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('Post, try created blog with invalid value', async () => {
        await request(app)
            .post('/blogs')
            .send({...testBlogData, name: ''})
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })


    it('PUT, trying to change blog with invalid body', async () => {

        const arrBlog = await blogService.getBlogs(query)
        const firstElement = await arrBlog.items[0]
        await request(app)
            .put('/blogs/' + firstElement?.id)
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                "name": 123,
                "description": 123,
                "websiteUrl": "asddsLGzrfwn6vjvT5sasdasd"
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

    it('DELETE, trying remove blogs with wrong id', async () => {
        await request(app)
            .delete('/blogs/' + 111)
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })


})
describe('/test_blogs_path_2', () => {

    it('GET, try should return blog by id', async () => {
        await request(app)
            .get('/blogs/' + firstElement.id)
            .expect(HTTP_STATUSES.OK200, blogModels({...firstElement}))
    })

    it('PUT, success trying to change blog', async () => {
        await request(app)
            .put('/blogs/' + firstElement.id)
            .auth('admin', 'qwerty', {type: "basic"})
            .send({...testBlogData, name: "ChangeName"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })


    it('DELETE, successful remove blog', async () => {
        await request(app)
            .delete('/blogs/' + firstElement.id)
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })
})