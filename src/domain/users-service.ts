import {Paginator, User} from "../types/types";
import {usersRepository} from "../repositories/users-db-repository";
import {postsRepository} from "../repositories/posts-db-repositiory";
import {SortDirection} from "mongodb";
import {QueryRepository} from "../queryRepo";
import bcrypt from "bcrypt"

export const usersService = {
    //GET ALL USERS
    async getAllUsers(PageSize: number, Page: number, sortBy : string, sortDirection: SortDirection, searchLoginTerm : string, searchEmailTerm: string) : Promise<Paginator>{
        //add pagination
        const total = await usersRepository.returnUsersCount(searchLoginTerm, searchEmailTerm);
        const PageCount = Math.ceil( total / PageSize);
        const Items : User[] = await QueryRepository.PaginatorForUsers(PageCount, PageSize, Page, sortBy, sortDirection, searchLoginTerm, searchEmailTerm);
        return QueryRepository.PaginationForm(PageCount, PageSize, Page, total, Items)
    },
    //GET USER BY ID
    async getUserById(id : string) : Promise <User | null> {
        return await usersRepository.returnUserById(id)
    },
    //CREATE NEW USER
    async createNewUser(user : User) : Promise<User | null>{
        const hash = bcrypt.hashSync(user.password, 10)
        const newUser =  {
            id: (+new Date()).toString(),
            login: user.login,
            email: user.email,
            password : hash,
            createdAt: new Date().toISOString()
        }
        const createdUser = await usersRepository.createNewUser(newUser)
        return createdUser
    },
    //DELETE BY ID
    async deleteUserById(id: string) : Promise<boolean>{
        return await usersRepository.deleteUserById(id)
    },
    //DELETE ALL DATA
    async deleteAllData(){
        await postsRepository.deleteAllData()
    }
}