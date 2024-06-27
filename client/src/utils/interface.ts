export interface ILogIn {
    email: string;
    password: string;
}

export interface IJoin extends ILogIn {
    nickname: string;
}

export interface IJoinSocial {
    nickname: string;
    email: string;
    profileUrl: string;
}

export interface IErrMsg {
    message: string;
}

export interface IUpload {
    title: string;
    category: string[];
    content: string;
    imgUrl?: string;
}
