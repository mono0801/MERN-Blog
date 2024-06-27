export const randomPassword = () => {
    return (
        Math.random().toString(36).slice(-6) +
        Math.random().toString(36).slice(-6)
    );
};

export const randomNicknameTag = (nickname: string) => {
    return (
        nickname.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4)
    );
};

export const oneMonthAgo = () => {
    const now = new Date();
    const oneMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    );

    return oneMonth;
};
