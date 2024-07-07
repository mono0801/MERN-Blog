import dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";
import { IOverview } from "./interface";
import emailjs from "emailjs-com";

dayjs.extend(duration);

export function getTimeDiff(timeToCompare: Date): string {
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
}

export async function getOverview() {
    try {
        const response = await fetch(`/api/utils/overview`);
        const data: IOverview = await response.json();
        return { response, data };
    } catch (err) {
        return { data: "Something is Worng" };
    }
}

function generateRandomString(length: number) {
    const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    let randomString = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        randomString += characters[randomIndex];
    }

    return randomString;
}

export function sendVerifyEmail(email: string) {
    const code = generateRandomString(5);

    emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { message: code, email: email },
        import.meta.env.VITE_EMAILJS_KEY
    );
    return code;
}
