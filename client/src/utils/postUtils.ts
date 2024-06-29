import { IPostList, IUpload } from "./interface";

export async function getCategory() {
    try {
        const response = await fetch(`/api/post/category`, {
            method: "GET",
        });
        const data = await response.json();
        return { response, data };
    } catch (err) {}
}

export async function postCategory(category: string) {
    const jsonData = {
        category: category,
    };
    try {
        const response = await fetch(`/api/post/category`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        return { response, data };
    } catch (err) {}
}

export async function uploadPost(jsonData: IUpload) {
    try {
        const response = await fetch("/api/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        return { response, data };
    } catch (err) {
        return { data: "Something is Worng" };
    }
}

export async function getPostList(urlQuery?: string) {
    try {
        const response = await fetch(`/api/post${urlQuery}`);
        const data: IPostList = await response.json();
        return { response, data };
    } catch (err) {
        return { data: "Something is Worng" };
    }
}

export async function updatePost(urlQuery: string, jsonData: IUpload) {
    try {
        const response = await fetch(`/api/post/${urlQuery}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        return { response, data };
    } catch (err) {
        return { data: "Something is Worng" };
    }
}
