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
exports.adminAuth = exports.basicAuth = exports.postsRouter = void 0;
const express_1 = require("express");
exports.postsRouter = (0, express_1.Router)();
const input_valudation_middleware_1 = require("../middlewares/input-valudation-middleware");
const posts_service_1 = require("../domain/posts-service");
const blogs_service_1 = require("../domain/blogs-service");
exports.basicAuth = require('express-basic-auth');
exports.adminAuth = (0, exports.basicAuth)({ users: { 'admin': 'qwerty' } });
//GET - return all
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageSize = +req.query.pageSize;
    let pageNumber = +req.query.pageNumber;
    let sortBy = "" + req.query.sortBy;
    if (!req.query.pageSize) {
        pageSize = 10;
    }
    if (!req.query.pageNumber) {
        pageNumber = 1;
    }
    if (!req.query.sortBy) {
        sortBy = "createdAt";
    }
    let allPosts = yield posts_service_1.postsService.returnAllPost(pageSize, pageNumber, sortBy, -1);
    res.status(200).send(allPosts);
}));
//GET - return by ID
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield posts_service_1.postsService.returnPostById(req.params.id);
    if (foundPost) {
        res.status(200).send(foundPost);
    }
    else {
        res.sendStatus(404);
    }
}));
//DELETE - delete by ID
exports.postsRouter.delete('/:id', exports.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let status = yield posts_service_1.postsService.deletePostById(req.params.id);
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
exports.postsRouter.post('/', exports.adminAuth, input_valudation_middleware_1.titleCheck, input_valudation_middleware_1.shortDescriptionCheck, input_valudation_middleware_1.contentCheck, input_valudation_middleware_1.blogIdCheck, input_valudation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_service_1.blogsService.returnBlogById(req.body.blogId);
    if (foundBlog === null) {
        res.sendStatus(404);
    }
    else {
        const blogId = foundBlog.id;
        const blogName = foundBlog.name;
        const newPost = yield posts_service_1.postsService.createNewPost(req.body, blogName, blogId);
        res.status(201).send(newPost);
    }
}));
//PUT - update
exports.postsRouter.put('/:id', exports.adminAuth, input_valudation_middleware_1.titleCheck, input_valudation_middleware_1.shortDescriptionCheck, input_valudation_middleware_1.contentCheck, input_valudation_middleware_1.blogIdCheck, input_valudation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield posts_service_1.postsService.updatePostById(req.body, req.params.id);
    if (status) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
