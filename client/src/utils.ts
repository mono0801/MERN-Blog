export interface IJoin {
    nickname: string;
    email: string;
    password: string;
}

export async function fetchJoin(formData: IJoin) {
    try {
        const response = await fetch("/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return { response, data };
    } catch (error) {}
}
