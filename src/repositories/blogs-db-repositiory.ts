export type Blog = {
    id: string,
    name: string,
    description: string, 
    websiteUrl: string
    createdAt : string
    isMembership : boolean
}

export const blogs = [  
    {
    "id": "string",
    "name": "string",
    "description": "string",
    "websiteUrl": "string",
    "createdAt" : "string",
    "isMembership" : false
  }
];

import {blogsCollection} from "../db/db";


export const blogsRepository = {
    //GET - return all
    async returnAllBlogs() : Promise<Blog []>{
        return blogsCollection.find({}).toArray()
    },
    //GET - return by ID
    async returnBlogById(id: string) : Promise<Blog | null>{
        let blog : Blog | null = await blogsCollection.findOne({id : id})
        return blog
    },
    //DELETE - delete by ID
    async deleteBlogById(id: string) : Promise<boolean>{
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    //delete all data
    async deleteAllData(){
        blogs.splice(0,blogs.length)
        return blogs;
    },
    //POST - create new 
    async createNewBlog(blog: Blog) : Promise<Blog>{
        const newBlog = {
            id: '' + (+(new Date())),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: "" + new Date(),
            isMembership: false
        }
        const result = await blogsCollection.insertOne(newBlog)
        return newBlog
    },
    //PUT - update
    async updateBlogById(blog : Blog, id: string) : Promise <boolean>{
        const result = await blogsCollection.updateOne({id: id}, { $set:
                {
                name : blog.name,
                description : blog.description,
                websiteUrl : blog.websiteUrl,
                }
        })
        return result.matchedCount === 1
    }, 
};

