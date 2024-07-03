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
    userId: {
        _id: string;
        nickname: string;
        profileUrl: string;
    };
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
}

export interface IUserList {
    users: IUser[];
    total: number;
    lastMonthUserCount: number;
}

export interface IComment {
    _id: string;
    userId: {
        _id: string;
        nickname: string;
        email: string;
        profileUrl: string;
    };
    postId: string;
    content: string;
    likes: string[];
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICard {
    cardWidth: string;
    cardHeight: string;
}

export interface IImg {
    imgHeight: string;
    hoverImgHeight: string;
}
