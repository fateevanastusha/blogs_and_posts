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
exports.commentsRepository = void 0;
const db_1 = require("../db/db");
exports.commentsRepository = {
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.commentsCollection.findOne({ id: id }, { projection: { _id: 0, postId: 0 } });
        });
    },
    deleteCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    updateCommentById(content, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("db repository " + content);
            const result = yield db_1.commentsCollection.updateOne({ id: id }, { $set: {
                    content: content
                }
            });
            return result.matchedCount === 1;
        });
    },
    createNewComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.commentsCollection.insertOne(comment);
            const createdComment = yield this.getCommentById(comment.id);
            if (createdComment) {
                console.log('hello there');
                return createdComment;
            }
            else {
                return null;
            }
        });
    },
    getAllCommentsByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.commentsCollection
                .find({ postId: postId }, { projection: { _id: 0, postId: 0 } })
                .toArray();
        });
    },
    commentsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.commentsCollection
                .find()
                .count();
        });
    }
};
