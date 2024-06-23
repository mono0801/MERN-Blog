export class HttpException extends Error {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

export interface IUserToken {
    id: string;
    nickname: string;
    email: string;
    socialLogin: boolean;
    createdAt: Date;
    updatedAt: Date;
    profileUrl: string;
}
