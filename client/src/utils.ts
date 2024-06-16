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

export async function fetchJoinSocial(formData: IJoinSocial) {
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
