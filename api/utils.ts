export interface IGitHub {
    client_id: string;
    client_secret: string;
    code: string;
}

export class HttpException extends Error {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

export const randomPassword = () => {
    return (
        Math.random().toString(36).slice(-6) +
        Math.random().toString(36).slice(-6)
    );
};

export const randomNicknameTag = (nickname: string) => {
    return (
        nickname.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4)
    );
};
