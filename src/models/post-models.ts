import {PostResponseType} from "../types/types";


export const postModels = (posts: PostResponseType| PostResponseType[]): PostResponseType| PostResponseType[] => {
    const postConverter = (post:PostResponseType) => {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }

    if (Array.isArray(posts)){
        return  posts.map((ps: PostResponseType) => postConverter(ps))
    }
    return postConverter(posts)
}