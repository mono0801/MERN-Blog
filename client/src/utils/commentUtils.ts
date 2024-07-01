import { IComment } from "./interface";

export async function getCommentList(postId: string) {
    try {
        const response = await fetch(`/api/comment/${postId}`);
        const data: IComment[] = await response.json();
        return { response, data };
    } catch (err) {
        return { data: "Something is Worng" };
    }
}
