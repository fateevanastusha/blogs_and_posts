"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = exports.basicAuth = exports.blogsRouter = void 0;
const express_1 = require("express");
exports.blogsRouter = (0, express_1.Router)();
const input_valudation_middleware_1 = require("../middlewares/input-valudation-middleware");
const blogs_service_1 = require("../domain/blogs-service");
const posts_service_1 = require("../domain/posts-service");
const pagination_helpers_1 = require("../helpers/pagination-helpers");
exports.basicAuth = require('express-basic-auth');
exports.adminAuth = (0, exports.basicAuth)({ users: { 'admin': 'qwerty' } });
//GET - return all
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageSize = pagination_helpers_1.paginationHelpers.pageSize(req.query.pageSize);
    let pageNumber = pagination_helpers_1.paginationHelpers.pageNumber(req.query.pageNumber);
    let sortBy = pagination_helpers_1.paginationHelpers.sortBy(req.query.sortBy);
    let sortDirection = pagination_helpers_1.paginationHelpers.sortDirection(req.query.sortDirection);
    let searchNameTerm = pagination_helpers_1.paginationHelpers.searchNameTerm(req.query.searchNameTerm);
    let allBlogs = yield blogs_service_1.blogsService.returnAllBlogs(pageSize, pageNumber, sortBy, sortDirection, searchNameTerm);
    res.status(200).send(allBlogs);
}));
//GET - return by ID
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_service_1.blogsService.returnBlogById(req.params.id);
    if (foundBlog) {
        res.status(200).send(foundBlog);
    }
    else {
        res.sendStatus(404);
    }
}));
//DELETE - delete by ID
exports.blogsRouter.delete('/:id', exports.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let status = yield blogs_service_1.blogsService.deleteBlogById(req.params.id);
    if (status) {
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
}));
//POST - create new
exports.blogsRouter.post('/', exports.adminAuth, input_valudation_middleware_1.nameCheck, input_valudation_middleware_1.descriptionCheck, input_valudation_middleware_1.websiteUrlCheck, input_valudation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = yield blogs_service_1.blogsService.createNewBlog(req.body);
    res.status(201).send(newBlog);
}));
//PUT - update
exports.blogsRouter.put('/:id', exports.adminAuth, input_valudation_middleware_1.nameCheck, input_valudation_middleware_1.descriptionCheck, input_valudation_middleware_1.websiteUrlCheck, input_valudation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield blogs_service_1.blogsService.updateBlogById(req.body, req.params.id);
    if (status) {
        res.sendStatus(204);
    }
    else {
        res.send(404);
    }
}));
//NEW - POST - create post for blog
exports.blogsRouter.post('/:id/posts', exports.adminAuth, input_valudation_middleware_1.titleCheck, input_valudation_middleware_1.shortDescriptionCheck, input_valudation_middleware_1.contentCheck, input_valudation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_service_1.blogsService.returnBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404);
    }
    else {
        const blogId = foundBlog.id;
        const blogName = foundBlog.name;
        const newPost = yield posts_service_1.postsService.createNewPost(req.body, blogName, blogId);
        res.status(201).send(newPost);
    }
}));
//NEW - GET - get all posts in blog
exports.blogsRouter.get('/:id/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const foundBlog = yield blogs_service_1.blogsService.returnBlogById(blogId);
    if (!foundBlog) {
        res.sendStatus(404);
        return;
    }
    let pageSize = pagination_helpers_1.paginationHelpers.pageSize(req.query.pageSize);
    let pageNumber = pagination_helpers_1.paginationHelpers.pageNumber(req.query.pageNumber);
    let sortBy = pagination_helpers_1.paginationHelpers.sortBy(req.query.sortBy);
    let sortDirection = pagination_helpers_1.paginationHelpers.sortDirection(req.query.sortDirection);
    let allPosts = yield posts_service_1.postsService.returnAllPostByBlogId(pageSize, pageNumber, sortBy, sortDirection, blogId);
    if (allPosts.items) {
        res.status(200).send(allPosts);
    }
}));
