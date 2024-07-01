import { IJoin, IJoinSocial, ILogIn, IUserList } from "./interface";
import dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";

dayjs.extend(duration);

export async function fetchJoin(formData: IJoin) {
    try {
        const response = await fetch("/api/auth/join", {
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
        const response = await fetch("/api/auth/login", {
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
        const response = await fetch("/api/auth/google", {
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
        const response = await fetch("/api/auth/github/callback", {
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
        const response = await fetch("/api/auth/kakao/callback", {
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
        const response = await fetch("/api/auth/naver/callback", {
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
        const response = await fetch(`/api/users/profile/${id}`, {
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
        const response = await fetch(`/api/users/account/${id}`, {
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
        const response = await fetch(`/api/users/password/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        return { response, data };
    } catch (err) {}
}

export async function getUserList(urlQuery?: string) {
    urlQuery = urlQuery ? urlQuery : "";
    try {
        const response = await fetch(`/api/users${urlQuery}`);
        const data: IUserList = await response.json();
        return { response, data };
    } catch (err) {
        return { data: "Something is Worng" };
    }
}

export const getTimeDiff = (timeToCompare: Date): string => {
    const timeDiffDuration: Duration = dayjs.duration(
        dayjs().diff(timeToCompare)
    );

    const yearDiff: number = parseInt(timeDiffDuration.format("Y"));
    const monthDiff: number = parseInt(timeDiffDuration.format("M"));
    const dateDiff: number = parseInt(timeDiffDuration.format("D"));
    const hourDiff: number = parseInt(timeDiffDuration.format("H"));
    const minuteDiff: number = parseInt(timeDiffDuration.format("m"));
    const secondDiff: number = parseInt(timeDiffDuration.format("s"));

    if (yearDiff > 1) {
        return `${yearDiff} years ago`;
    } else if (yearDiff == 1) {
        return `${yearDiff} year ago`;
    } else if (monthDiff > 1) {
        return `${monthDiff} months ago`;
    } else if (monthDiff == 1) {
        return `${monthDiff} month ago`;
    } else if (dateDiff > 1) {
        return `${dateDiff} days ago`;
    } else if (dateDiff == 1) {
        return `${dateDiff} day ago`;
    } else if (hourDiff > 1) {
        return `${hourDiff} hours ago`;
    } else if (hourDiff == 1) {
        return `${hourDiff} hour ago`;
    } else if (minuteDiff > 1) {
        return `${minuteDiff} minutes ago`;
    } else if (minuteDiff == 1) {
        return `${minuteDiff} minute ago`;
    } else if (secondDiff > 0) {
        return "a few seconds ago";
    } else {
        return "Just now";
    }
};
