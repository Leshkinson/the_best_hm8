import {BlogResponseType} from "../types/types";


export const blogModels = (blogs: BlogResponseType | BlogResponseType[]): BlogResponseType | BlogResponseType[] => {
    const blogConverter = (blog: BlogResponseType) => {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }

    if (Array.isArray(blogs)) {
        return blogs.map((bl: BlogResponseType) => blogConverter(bl))
    }
    return blogConverter(blogs)
}