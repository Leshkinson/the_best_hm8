import {blogRepository} from "../repositories/blog-repository";
import {
    BlogResponseType,
    BlogType,
    PostResponseType,
    PostType,
    QueryForBlogsType,
    ResponseTypeWithPages
} from "../types/types";
import {Sort} from "mongodb";
import {getSortSkipLimit} from "../utils/getSortSkipLimit";
import {postRepository} from "../repositories/post-repository";
import {blogModels} from "../models/blog-models";
import {postModels} from "../models/post-models";
import {getFilter} from "../utils/getFilter";
import {createId} from "../utils/createId";

export const blogService = {

    async getBlogs(query: QueryForBlogsType):Promise<ResponseTypeWithPages<BlogResponseType>> {
        const {pageNumber, pageSize, name} = query
        const filter: any =  getFilter({name}, true)
        const totalCount = await blogRepository.getTotalCount(filter)
        const [sort, skip, limit] = await getSortSkipLimit(query)
        const blogs = await blogRepository.getAllBlogs(filter, sort as Sort, +skip, +limit)
        return {
            pagesCount: Math.ceil(totalCount / +pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: blogModels(blogs) as BlogResponseType[]
        }
    },

    async getBlogById(id: string) {
        const filter = {id}
        const blog = await blogRepository.getBlogByFilter(filter)
        if (blog) {
            return blogModels(blog)
        }
        return null
    },

    async getAllBlogPosts(id: string, query: QueryForBlogsType):Promise<ResponseTypeWithPages<PostResponseType>> {
        const {pageNumber, pageSize} = query
        const [sort, skip, limit] = await getSortSkipLimit(query)
        const filter: any = {blogId: id}
        const totalCount = await postRepository.getTotalCount(filter)
        const posts = await postRepository.getAllBlogPosts(filter, sort as Sort, +skip, +limit)
        return {
            pagesCount: Math.ceil(totalCount / +pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: postModels(posts) as PostResponseType[]
        }
    },

    async createBlog(blog: BlogType): Promise<BlogResponseType> {
        const newBlog: BlogResponseType = {
            id: createId(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        await blogRepository.createBlog(newBlog)
        return blogModels(newBlog) as BlogResponseType
    },

    async createPostInBlog(id: string, post: PostType): Promise<PostType> {
        const findBlog = await blogService.getBlogById(id)
        const newPost: PostResponseType = {
            id: createId(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: id,
            //@ts-ignore
            blogName: findBlog.name,
            createdAt: new Date().toISOString()
        }
        await postRepository.createPost(newPost)
        return postModels(newPost) as PostType
    },

    async changeBlog(id: string, blog: BlogResponseType): Promise<boolean> {
        const {name, description, websiteUrl} = blog
        const updateBLog = {$set: {name, description, websiteUrl}} as { $set: BlogResponseType }
        const filter = {id}
        return await blogRepository.changeBlog(filter, updateBLog)
    },

    async deleteBlog(id: string): Promise<boolean> {
        const filter = {id}
        return await blogRepository.deleteBlog(filter)
    }
}

