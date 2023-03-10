import { NextFunction } from "express";
import { Response, Request } from "express";
import {jwtService} from "../application/jwt-service";
import {commentsService} from "../domain/comments-service";


export const authMiddlewares = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.sendStatus(401)
    } else {
        //req.headers.authorization - "bearer fsfsdrgrgwerwgwg"
        const token : string = req.headers.authorization.split(" ")[1]
        const user = await jwtService.getUserByIdToken(token)
        if (user) {
            next()
        } else {
            res.sendStatus(401);
        }
    }
}
export const checkForUser = async (req: Request, res: Response, next: NextFunction) => {
    const token : string = req.headers.authorization!.split(" ")[1]
    const userId = await jwtService.getUserByIdToken(token)
    console.log(req.method, 'before get comment')
    const comment = await commentsService.getCommentById(req.params.id)
    console.log(comment, 'after get comment')
    if (!comment) {
        res.sendStatus(404)
    }
    else if (comment.commentatorInfo.userId === userId) {
        next()
    } else {
        res.sendStatus(403)
    }
}