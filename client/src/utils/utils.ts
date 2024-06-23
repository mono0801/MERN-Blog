import { IJoin, IJoinSocial, ILogIn } from "./interface";

export async function fetchJoin(formData: IJoin) {
    try {
        const response = await fetch("/auth/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return { response, data };
    } catch (error) {}
}

export async function fetchLogIn(formData: ILogIn) {
    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return { response, data };
    } catch (error) {}
}

export async function fetchGoogle(formData: IJoinSocial) {
    try {
        const response = await fetch("/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return { response, data };
    } catch (error) {}
}

export async function fetchGithub(code: string) {
    const jsonCode = { code: code };
    try {
        const response = await fetch("/auth/github/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonCode),
        });
        const data = await response.json();
        return data;
    } catch (err) {}
}

export async function fetchKakao(code: string) {
    const abortController = new AbortController();
    const jsonCode = { code: code };
    try {
        const response = await fetch("/auth/kakao/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonCode),
            signal: abortController.signal,
        });
        const data = await response.json();
        return data;
    } catch (err) {}
}

export async function fetchNaver(code: string, state: string) {
    const jsonCode = { code: code, state: state };
    try {
        const response = await fetch("/auth/naver/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonCode),
        });
        const data = await response.json();
        return data;
    } catch (err) {}
}

export async function updateProfile(id: number, img: string) {
    const jsonData = { profileUrl: img };
    try {
        const response = await fetch(`/users/profile/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        return { response, data };
    } catch (err) {}
}

export async function updateAccount(
    id: number,
    nickname: string,
    email: string
) {
    const jsonData = { nickname: nickname, email: email };
    try {
        const response = await fetch(`/users/account/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        return { response, data };
    } catch (err) {}
}

export async function updatePassword(
    id: number,
    currentPassword: string,
    newPassword: string
) {
    const jsonData = {
        currentPassword: currentPassword,
        newPassword: newPassword,
    };
    try {
        const response = await fetch(`/users/password/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        return { response, data };
    } catch (err) {}
}
