import {postRepository} from "../repositories/post-repository";
import {
    CommentType,
    PostRequestType,
    PostResponseType,
    QueryForBlogsType,
    QueryPageType,
    ResponseTypeWithPages
} from "../types/types";
import {blogService} from "./blog-service";
import {getSortSkipLimit} from "../utils/getSortSkipLimit";
import {postModels} from "../models/post-models";
import {Sort} from "mongodb";
import {createId} from "../utils/createId";
import {commentRepository} from "../repositories/comment-repository";
import {commentModels} from "../models/comment-models";

export const postService = {

    async getAllPosts(query: QueryForBlogsType): Promise<ResponseTypeWithPages<PostResponseType>> {
        const {pageNumber, pageSize} = query
        const filter: any = {}
        const totalCount = await postRepository.getTotalCount(filter)
        const [sort, skip, limit] = await getSortSkipLimit(query)
        const posts = await postRepository.getAllPosts(filter, sort as Sort, +skip, +limit)
        return {
            pagesCount: Math.ceil(totalCount / +pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: postModels(posts) as PostResponseType[]
        }
    },

    async getPostById(id: string): Promise<PostResponseType | null> {
        const filter = {id}
        const post = await postRepository.getPostByFilter(filter)
        if (post) {
            return postModels(post) as PostResponseType
        }
        return null
    },

    async getPostComments(postId: string, query: QueryPageType) {
        const {pageNumber, pageSize} = query
        const filter: any = {postId}
        const [sort, skip, limit] = await getSortSkipLimit(query)
        const totalCount = await commentRepository.getTotalCount(filter)
        const comments = await  commentRepository.getPostComments(filter, sort as Sort, +skip, +limit)
        return {
            pagesCount: Math.ceil(totalCount / +pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: commentModels(comments)
        }
    },

    async createPost(post: PostRequestType): Promise<PostResponseType> {
        const findBlog = await blogService.getBlogById(post.blogId)
        const newPost: PostResponseType = {
            id: createId(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            //@ts-ignore
            blogName: findBlog.name,
            createdAt: new Date().toISOString()
        }
        await postRepository.createPost(newPost)
        return postModels(newPost) as PostResponseType
    },

    async createdComment(id: string, comment: CommentType, user: any) {
        const newComment = {
            id: createId(),
            content: comment.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.accountData.userName
            },
            createdAt: new Date().toISOString()
        }
        await commentRepository.createdComment({...newComment, postId: id})
        return newComment
    },

    async changePost(id: string, post: PostResponseType): Promise<boolean> {
        const {title, blogId, content, shortDescription} = post
        const findBlog = await blogService.getBlogById(post.blogId)
        const filter = {id}
        const update = {
            $set: {
                title,
                blogId,
                //@ts-ignore
                blogName: findBlog.name,
                content,
                shortDescription
            }
        } as { $set: PostResponseType }
        return await postRepository.changePost(filter, update)
    },

    async deletePost(id: string): Promise<boolean> {
        const filter = {id}
        return await postRepository.deletePost(filter)
    }
}