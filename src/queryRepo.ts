import {Blog, Paginator, Post, User, Comment} from "./types/types";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "./db/db";
import {SortDirection} from "mongodb";

export const QueryRepository = {
    async PaginatorForBlogs(PageCount: number, PageSize: number, Page: number, sortBy: string, sortDirection: SortDirection, searchNameTerm: string): Promise<Blog[]> {
        const skipSize: number = PageSize * (Page - 1)
        return blogsCollection
            .find({name: {$regex: searchNameTerm, $options: 'i'}}, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipSize)
            .limit(PageSize)
            .toArray()
    },
    async PaginatorForPosts(PageCount: number, PageSize: number, Page: number, sortBy: string, sortDirection: SortDirection): Promise<Post[]> {
        const skipSize: number = PageSize * (Page - 1)
        return postsCollection
            .find({}, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipSize)
            .limit(PageSize)
            .toArray()
    },
    async PaginatorForCommentsByBlogId(PageCount: number, PageSize: number, Page: number, sortBy: string, sortDirection: SortDirection, postId : string): Promise<Comment[]> {
        const skipSize: number = PageSize * (Page - 1)
        return commentsCollection
            .find({postId : postId}, {projection: {_id: 0, postId : 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipSize)
            .limit(PageSize)
            .toArray()
    },
    async PaginatorForPostsByBlogId(PageCount: number, PageSize: number, Page: number, sortBy: string, sortDirection: SortDirection, blogId: string): Promise<Post[]> {
        const skipSize: number = PageSize * (Page - 1)
        return postsCollection
            .find({blogId: blogId}, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipSize)
            .limit(PageSize)
            .toArray()
    },
    async PaginatorForUsers(PageCount: number, PageSize: number, Page: number, sortBy: string, sortDirection: SortDirection, searchLoginTerm: string, searchEmailTerm: string): Promise<User[]> {
        const skipSize: number = PageSize * (Page - 1)
        return usersCollection
            .find({
                    $or: [
                        {login: {$regex: searchLoginTerm, $options: 'i'}},
                        {email: {$regex: searchEmailTerm, $options: 'i'}}
                    ]
            }, {projection: {_id: 0, password: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipSize)
            .limit(PageSize)
            .toArray()
    },
    async PaginationForm(PageCount: number, PageSize: number, Page: number, total: number, Items: Post[] | Blog [] | User[] | Comment[]): Promise<Paginator> {
        const paginator: Paginator = {
            pagesCount: PageCount,
            page: Page,
            pageSize: PageSize,
            totalCount: total,
            items: Items
        }
        return paginator;
    },

};