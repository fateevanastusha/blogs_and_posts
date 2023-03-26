import {
    Request,
    Response,
    Router
} from "express";
import {authService} from "../domain/auth-service";
import {Token, TokenList, User} from "../types/types";
import {
    codeConfirmationCheck,
    emailCheck,
    emailConfirmationCheck,
    inputValidationMiddleware,
    loginCheck,
    passwordCheck
} from "../middlewares/input-valudation-middleware";
import {checkForRefreshToken,
    checkForSameDevice
} from "../middlewares/auth-middlewares";
import {requestAttemptsMiddleware} from "../middlewares/attempts-middleware";


export const authRouter = Router()


//LOGIN REQUEST

authRouter.post('/login', requestAttemptsMiddleware, checkForSameDevice, async (req: Request, res: Response) => {
    const title = req.headers["user-agent"] || "unknown"
    const tokenList: TokenList | null = await authService.authRequest(req.body.password, req.ip, req.body.loginOrEmail, title)
    if (tokenList) {
        let token: Token = {
            accessToken: tokenList.accessToken
        }
        res.cookie('refreshToken', tokenList.refreshToken, {httpOnly: true, secure: true})
        res.status(200).send(token)
    } else {
        res.sendStatus(401)
    }
})

//GET INFORMATION ABOUT CURRENT AUTH

authRouter.get('/me',
    async (req: Request, res: Response) => {
        const auth = req.headers.authorization
        if (!auth) return res.sendStatus(401)
        const [authType, token] = auth.split(' ')
        if (authType !== 'Bearer') return res.sendStatus(401)
        const user: User | null = await authService.getInformationAboutCurrentUser(token)
        if (user) {
            const currentUser = {
                email: user.email,
                login : user.login,
                userId : user.id
            }
            res.status(200).send(currentUser)
        } else {
            res.sendStatus(401)
        }
    })

//REGISTRATION IN THE SYSTEM

authRouter.post('/registration',
    loginCheck,
    passwordCheck,
    emailCheck,
    inputValidationMiddleware,
    requestAttemptsMiddleware,
    async (req: Request, res: Response) => {

        const status: boolean = await authService.registrationUser(req.body);

        if (status) {
            res.send(204);
        } else {
            res.send(404);
        }
        ;

    })

//CODE CONFIRMATION

authRouter.post('/registration-confirmation',
    requestAttemptsMiddleware,
    codeConfirmationCheck,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const status = await authService.checkForConfirmationCode(req.body.code)
        if (!status) {
            res.sendStatus(400)
        } else {
            res.sendStatus(204)
        }

    })

//RESEND CODE CONFIRMATION

authRouter.post('/registration-email-resending',
    requestAttemptsMiddleware,
    emailConfirmationCheck,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const status: boolean = await authService.emailResending(req.body)
        if (status) {
            res.send(204)
        } else {
            res.send(400)
        }

    })

//LOGOUT. KILL REFRESH TOKEN + KILL SESSION

authRouter.post('/logout',
    checkForRefreshToken,
    async (req: Request, res: Response) => {
    const status : boolean = await authService.logoutRequest(req.cookies.refreshToken)
    if (status) {
        res.sendStatus(204)
    } else {
        res.sendStatus(401)
    }

})

//REFRESH TOKEN

authRouter.post('/refresh-token',
    requestAttemptsMiddleware,
    checkForRefreshToken,
    async (req: Request, res: Response) => {
    const title = req.headers["user-agent"] || "unknown"
    const tokenList: TokenList | null = await authService.createNewToken(req.cookies.refreshToken, req.ip, title)
    if (tokenList) {
        let token: Token = {
            accessToken: tokenList.accessToken
        }
        res.cookie('refreshToken', tokenList.refreshToken, {httpOnly: true, secure: true})
        res.status(200).send(token)
    } else {
        res.sendStatus(401)
    }
})


