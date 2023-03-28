export type UserType = {
    login: string,
    email: string
}

export type UserRequestType = UserType & {
    password: string
}

export type UserResponseType = UserType & {
    id: string,
    createdAt: string
}

type AccountDataType = {
    userName: string,
    email: string,
    createdAt: string
    hash: string
    salt: string
}

type EmailConformationType = {
    confirmationCode: string
    expirationDate: Date,
    isConfirmed: boolean
}

export type UserResponseFromDBType = UserResponseType & {
    hash: string
    salt: string
}

export type UserFromDBType = {
    id: string,
    accountData : AccountDataType,
    emailConformation : EmailConformationType
}

export type PostType = {
    title: string,
    shortDescription: string
    content: string
}

export type PostRequestType = PostType & {
    blogId: string
}

export type PostResponseType = PostType & {
    id: string
    blogId: string
    blogName: string
    createdAt: string
}

export  type BlogType = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogResponseType = BlogType & {
    id: string
    isMembership: boolean
    createdAt: string
}

export type AuthType = {
    loginOrEmail: string
    password: string
}

export type CommentType = {
    content: string
}
export type CommentResponseType = CommentType & {
    id: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
}

export type CommentResponseFromDBType = CommentResponseType &{
    postId: string
}


export type QueryForBlogsType = QueryPageType & {
    name: string
}
export type QueryForUsersType = QueryPageType & {
    userName: string
    email: string
}

export type DefaultValueListType = {
    FIELD_FOR_SORT: string
    SORT_DIRECTION: string
    PAGE_NUMBER: number
    PAGE_SIZE: number
}

export type ResponseTypeWithPages<I> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: I[]
}

export type QueryPageType = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}