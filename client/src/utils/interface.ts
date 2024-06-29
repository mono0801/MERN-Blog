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
    userId?: number;
    title: string;
    category: string[];
    content: string;
    image?: string;
}

export interface IPost {
    _id: string;
    userId: string;
    title: string;
    category: string[];
    content: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPostList {
    postList: IPost[];
    total: number;
    lastMonthPostCount: number;
}

export interface IUser {
    _id: string;
    nickname: string;
    email: string;
    password: string;
    profileUrl: string;
    socialLogin: boolean;
    admin: boolean;
    createdAt: Date;
    updatedAt: Date;
    _doc?: any;
}

export interface IUserList {
    users: IUser[];
    total: number;
    lastMonthUserCount: number;
}
