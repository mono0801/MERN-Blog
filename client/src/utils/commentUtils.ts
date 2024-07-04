import { IComment, ICommentList } from "./interface";

export async function getCommentList(postId: string) {
    try {
        const response = await fetch(`/api/comment/${postId}`);
        const data: IComment[] = await response.json();
        return { response, data };
    } catch (err) {
        return { data: "Something is Worng" };
    }
}

export async function editComment(
    userId: number,
    commentId: string,
    content: string
) {
    try {
        const response = await fetch(`/api/comment/edit/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                content: content,
            }),
        });
        const data: IComment = await response.json();
        return { response, data };
    } catch (err) {
        return { data: "Something is Worng" };
    }
}

export async function deleteComment(userId: number, commentId: string) {
    try {
        const response = await fetch(`/api/comment/edit/${commentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
            }),
        });
        const data: string = await response.json();
        return { response, data };
    } catch (err) {
        return { data: "Something is Worng" };
    }
}

export async function getDashboardComment(param?: string) {
    param = param ? param : "";
    try {
        const response = await fetch(`/api/comment${param}`);
        const data: ICommentList = await response.json();
        return { response, data };
    } catch (err) {
        return { data: "Something is Worng" };
    }
}
